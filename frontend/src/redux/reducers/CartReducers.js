import * as actionTypes from "../constants/cartConstants";

const CART_INITIAL_STATE = {
    cartItems: [],
    itemsCount: 0,
    cartSubtotal: 0,
};

export const cartReducer = (state = CART_INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_CART: {
            const productBeingAddedToCart = action.payload;
            const productAlreadyExistsInState = state.cartItems.find(
                (x) => x.productID === productBeingAddedToCart.productID
            );

            let updatedCartItems;
            if (productAlreadyExistsInState) {
                // Update quantity and price for an existing product
                updatedCartItems = state.cartItems.map((item) =>
                    item.productID === productBeingAddedToCart.productID
                        ? { ...item, quantity: productBeingAddedToCart.quantity }
                        : item
                );
            } else {
                // Add new product to cart
                updatedCartItems = [...state.cartItems, productBeingAddedToCart];
            }

            // Calculate updated items count and subtotal
            const updatedItemsCount = updatedCartItems.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );
            const updatedCartSubtotal = updatedCartItems.reduce(
                (total, item) => total + Number(item.quantity) * Number(item.price),
                0
            );

            return {
                ...state,
                cartItems: updatedCartItems,
                itemsCount: updatedItemsCount,
                cartSubtotal: updatedCartSubtotal,
            };
        }
        case actionTypes.REMOVE_FROM_CART: {
            // Filter out the item to be removed
            const updatedCartItems = state.cartItems.filter(
                (x) => x.productID !== action.payload.productID
            );

            // Update items count and subtotal after removal
            const updatedItemsCount = updatedCartItems.reduce(
                (total, item) => total + Number(item.quantity),
                0
            );
            const updatedCartSubtotal = updatedCartItems.reduce(
                (total, item) => total + Number(item.quantity) * Number(item.price),
                0
            );

            return {
                ...state,
                cartItems: updatedCartItems,
                itemsCount: updatedItemsCount,
                cartSubtotal: updatedCartSubtotal,
            };
        }
        default:
            return state;
    }
};
