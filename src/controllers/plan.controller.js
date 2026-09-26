import * as planService from "../services/plan.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { paginationResponse, successResponse } from "../utils/response.js";

export const createPlan = asyncHandler(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  successResponse(res, "Plan created successfully", plan, 201);
})

export const getUserPlans = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
  } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 10, 1);

  const result = await planService.getUserPlans({
    userId: req.user.id,
    page: currentPage,
    limit: pageLimit,
    search: String(search).trim(),
  });

  const totalPages = Math.ceil(
    result.total / pageLimit
  );

  return res.status(200).json({
    success: true,
    message: "User plans retrieved successfully",

    data: {
      isSubscribed: result.isSubscribed,
      plans: result.plans,
    },

    pagination: {
      currentPage,
      limit: pageLimit,
      totalItems: result.total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  });
});

export const getAllPlans = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.max(Number(limit) || 10, 1);

  const result = await planService.displayPlans({
    page: currentPage,
    limit: pageLimit,
    search,
  });

  paginationResponse(
    res,
    "Plans retrieved successfully",
    result.plans,
    currentPage,
    pageLimit,
    result.total,
    200
  );
});

export const editPlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const plan = await planService.editPlan(
    planId,
    req.body
  );
  successResponse(res, "Plan updated successfully", plan, 200);
});

export const deletePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;
  const result = await planService.deletePlan(planId);
  successResponse(res, "Plan deleted successfully", result, 200);
})
