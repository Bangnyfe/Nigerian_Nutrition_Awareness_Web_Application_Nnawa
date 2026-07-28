import * as categoryService from '../services/categoryService.js';
import { successResponse } from '../utils/apiResponse.js';

export function getCategories(request, response, next) {
  try {
    const categories = categoryService.getAllCategories();

    response
      .status(200)
      .json(successResponse('Categories retrieved successfully.', categories));
  } catch (error) {
    next(error);
  }
}
