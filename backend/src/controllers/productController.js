import * as productService from '../services/productService.js';
import { successResponse } from '../utils/apiResponse.js';

export function getProducts(request, response, next) {
  try {
    const products = productService.getAllProducts();

    response
      .status(200)
      .json(successResponse('Products retrieved successfully.', products));
  } catch (error) {
    next(error);
  }
}
