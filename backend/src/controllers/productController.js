import * as productService from '../services/productService.js';
import { validateSearchKeyword } from '../utils/validation.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export function getProducts(request, response, next) {
  try {
    const { search } = request.query;


    if (search === undefined) {
      const products = productService.getAllProducts();

      return response
        .status(200)
        .json(successResponse('Products retrieved successfully.', products));
    }

    const validation = validateSearchKeyword(search);

    if (!validation.isValid) {
      return response
        .status(400)
        .json(
          errorResponse('The search request is invalid.', validation.errors)
        );
    }

    const products = productService.searchProductsByName(validation.value);

    const message =
      products.length > 0
        ? 'Products retrieved successfully.'
        : 'No products matched the search keyword.';

    response.status(200).json(successResponse(message, products));
  } catch (error) {
    next(error);
  }
}
