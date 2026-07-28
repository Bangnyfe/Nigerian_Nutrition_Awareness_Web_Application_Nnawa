import * as productService from '../services/productService.js';
import {
  validateSearchKeyword,
  validateProductId,
  validateProductPayload
} from '../utils/validation.js';
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

export function getProductById(request, response, next) {
  try {
    const validation = validateProductId(request.params.id);

    if (!validation.isValid) {
      return response
        .status(400)
        .json(errorResponse('The product request is invalid.', validation.errors));
    }

    const product = productService.getProductById(validation.value);

    if (!product) {
      return response.status(404).json(errorResponse('Product not found.'));
    }

    response
      .status(200)
      .json(successResponse('Product retrieved successfully.', product));
  } catch (error) {
    next(error);
  }
}

export function createProduct(request, response, next) {
  try {
    const validation = validateProductPayload(request.body);

    if (!validation.isValid) {
      return response
        .status(400)
        .json(errorResponse('The product data is invalid.', validation.errors));
    }

    const product = productService.createProduct(validation.value);

    response
      .status(201)
      .json(successResponse('Product created successfully.', product));
  } catch (error) {
    next(error);
  }
}

export function updateProduct(request, response, next) {
  try {
    const idValidation = validateProductId(request.params.id);

    if (!idValidation.isValid) {
      return response
        .status(400)
        .json(errorResponse('The product request is invalid.', idValidation.errors));
    }

    const payloadValidation = validateProductPayload(request.body);

    if (!payloadValidation.isValid) {
      return response
        .status(400)
        .json(
          errorResponse('The product data is invalid.', payloadValidation.errors)
        );
    }

    const product = productService.updateProduct(
      idValidation.value,
      payloadValidation.value
    );

    if (!product) {
      return response.status(404).json(errorResponse('Product not found.'));
    }

    response
      .status(200)
      .json(successResponse('Product updated successfully.', product));
  } catch (error) {
    next(error);
  }
}

export function deleteProduct(request, response, next) {
  try {
    const validation = validateProductId(request.params.id);

    if (!validation.isValid) {
      return response
        .status(400)
        .json(errorResponse('The product request is invalid.', validation.errors));
    }

    const wasDeleted = productService.deleteProduct(validation.value);

    if (!wasDeleted) {
      return response.status(404).json(errorResponse('Product not found.'));
    }

    response
      .status(200)
      .json(successResponse('Product deleted successfully.', null));
  } catch (error) {
    next(error);
  }
}
