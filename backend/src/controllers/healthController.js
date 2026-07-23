import * as productService from '../services/productService.js';
import { successResponse } from '../utils/apiResponse.js';

export function getHealthStatus(request, response, next) {
  try {

    const productCount = productService.getProductCount();

    response.status(200).json(
      successResponse('Nnawa API is running.', {
        status: 'ok',
        database: 'connected',
        productCount
      })
    );
  } catch (error) {
    next(error);
  }
}
