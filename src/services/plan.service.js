import * as planRepository from "../repositories/plan.repository.js";

export const createPlan = async (data) => {
  const plan = await planRepository.createPlan(data);

  return plan;
};

export const displayPlans = async ({page, limit, search}) => {
  const plans = await planRepository.getAllPlans({page, limit, search});

  return plans;
};

export const getUserPlans = async ({
  userId,
  page,
  limit,
  search,
}) => {
  return await planRepository.getUserPlans({
    userId,
    page,
    limit,
    search,
  });
};

export const editPlan = async (planId, data) => {
  const plan = await planRepository.getPlanById(planId);

  if (!plan) {
    throw new Error("Plan not found");
  }

  const updatedPlan = await planRepository.updatePlan(
    planId,
    data
  );

  return updatedPlan;
};

export const deletePlan = async (planId) => {
  const plan = await planRepository.getPlanById(planId);

  if (!plan) {
    throw new Error("Plan not found");
  }

  await planRepository.deletePlan(planId);

  return {
    message: "Plan deleted successfully",
  };
};