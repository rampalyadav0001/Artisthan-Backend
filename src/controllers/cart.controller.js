import { Cart } from '../models/cart.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createOrUpdateCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized: User is not authenticated');
  }
  
  const customerId = req.user._id;
  const { productId, quantity } = req.body;
  
  if (!productId || !quantity || quantity <= 0) {
    throw new ApiError(400, 'Please provide valid productId and quantity');
  }

  // Validate customer and product existence
  const customer = await User.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Check if the customer already has a cart
  let cart = await Cart.findOne({ Customer_ID: customerId });

  if (!cart) {
    // Create a new cart if none exists
    cart = new Cart({
      Customer_ID: customerId,
      Order_Item: [
        {
          order: productId,
          name: product.name,
          quantity: quantity,
          image: product.image,
          Price: product.price,
        },
      ],
      Bill: product.price * quantity,
    });
  } else {
    // Update the existing cart
    const existingProductIndex = cart.Order_Item.findIndex(
      (item) => item.order.toString() === productId
    );

    if (existingProductIndex > -1) {
      // Product already in cart, update quantity and price
      cart.Order_Item[existingProductIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.Order_Item.push({
        order: productId,
        name: product.name,
        quantity: quantity,
        image: product.image,
        Price: product.price,
      });
    }

    // Recalculate the total bill
    cart.Bill = cart.Order_Item.reduce(
      (total, item) => total + item.quantity * item.Price,
      0
    );
  }

  // Save the cart to the database
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Cart updated successfully'));
});

const getCartById = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized: User is not authenticated');
  }

  const customerId = req.user._id;
  const cart = await Cart.findOne({ Customer_ID: customerId });
  
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }
  
  return res.status(200).json(new ApiResponse(200, cart, 'Cart found'));
});

const deleteCartItem = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized: User is not authenticated');
  }
  
  const customerId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, 'Please provide a valid productId');
  }

  // Find existing cart
  const cart = await Cart.findOne({ Customer_ID: customerId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  // Find the order item to be deleted
  const orderItemIndex = cart.Order_Item.findIndex((item) =>
    item.order.equals(productId)
  );
  if (orderItemIndex === -1) {
    throw new ApiError(404, 'Order item not found in the cart');
  }

  // Remove the order item from the cart
  cart.Order_Item.splice(orderItemIndex, 1);

  // Recalculate the overall bill
  cart.Bill = cart.Order_Item.reduce(
    (total, item) => total + item.quantity * item.Price,
    0
  );

  // Save the updated cart
  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, 'Item removed from cart'));
});

const deleteCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Unauthorized: User information is missing');
  }

  const customerId = req.user._id;

  // Find existing cart
  const cart = await Cart.findOne({ Customer_ID: customerId });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  // Delete the cart
  await Cart.deleteOne({ Customer_ID: customerId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Cart deleted successfully'));
});

export { createOrUpdateCart, deleteCart, deleteCartItem, getCartById };
