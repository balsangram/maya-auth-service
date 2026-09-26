import Auth from "../models/auth.models.js";
import Plan from "../models/plan.model.js";

export const createPlan = async (data) => {
  return await Plan.create(data);
};

export const getAllPlans = async ({ page, limit, search }) => {
  console.log("getAllPlans called with:", { page, limit, search });
  const query = search
    ? {
        name: {
          $regex: search,
          $options: "i",
        },
      }
    : {};

  const plans = await Plan.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Plan.countDocuments(query);

  return { plans, total };
};


export const getUserPlans = async ({
  userId,
  page,
  limit,
  search,
}) => {
  // Get user's subscription
  const user = await Auth.findById(userId)
    .select("subscription")
    .lean();

  const subscription = user?.subscription;

  // Check whether subscription is currently active
  const isSubscriptionActive =
    subscription?.status === "active" &&
    subscription?.planName &&
    subscription?.endDate &&
    new Date(subscription.endDate) > new Date();

  const subscribedPlanName = isSubscriptionActive
    ? subscription.planName
    : null;

  // Only get active plans
  const query = {
    isActive: true,
    ...(search && {
      name: {
        $regex: search,
        $options: "i",
      },
    }),
  };

  // Get plans
  const allPlans = await Plan.find(query)
    .select("-isActive -createdAt -updatedAt -__v")
    .sort({ createdAt: -1 })
    .lean();

  // Separate subscribed plan and available plans
  const isSubscribed = [];
  const availablePlans = [];

  for (const plan of allPlans) {
    const subscribed =
      subscribedPlanName &&
      plan.name?.toLowerCase() ===
        subscribedPlanName.toLowerCase();

    if (subscribed) {
      isSubscribed.push({
        ...plan,
        subscription: {
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          status: subscription.status,
          paymentId: subscription.paymentId,
          orderId: subscription.orderId,
        },
      });
    } else {
      availablePlans.push(plan);
    }
  }

  // Pagination for available plans only
  const total = availablePlans.length;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const plans = availablePlans.slice(
    startIndex,
    endIndex
  );

  return {
    isSubscribed,
    plans,
    total,
  };
};

export const getPlanById = async (planId) => {
  console.log("getPlanById called with:", planId);
  const planData = await Plan.findById(planId);
  console.log("getPlanById result:", planData);
  return planData;
};

export const updatePlan = async (planId, data) => {
  return await Plan.findByIdAndUpdate(
    planId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deletePlan = async (planId) => {
  return await Plan.findByIdAndDelete(planId);
};
