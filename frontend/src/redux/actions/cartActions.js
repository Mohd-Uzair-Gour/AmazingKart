import * as actionTypes from "../constants/cartConstants";
import axios from "axios";

export const addToCart = ({ productId, quantity }) => async (dispatch, getState) => {
  // Check if productId is valid
  if (!productId) {
    console.error("Error: Product ID is undefined or invalid.");
    return;
  }

  try {
    const { data } = await axios.get(`/api/products/get-one/${productId}`);
    dispatch({
      type: actionTypes.ADD_TO_CART,
      payload: {
        productID: data._id,
        name: data.name,
        price: data.price,
        image: data.images[0] ?? null,
        count: data.count,
        quantity,
      },
    });

    // Store updated cart in localStorage
    localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

export const removeFromCart = (productID, quantity, price) => (dispatch, getState) => {
  dispatch({
    type: actionTypes.REMOVE_FROM_CART,
    payload: { productID, quantity, price },
  });
  
  // Store updated cart in localStorage
  localStorage.setItem("cart", JSON.stringify(getState().cart.cartItems));
};
