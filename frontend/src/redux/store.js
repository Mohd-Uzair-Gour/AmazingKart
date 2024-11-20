import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { cartReducer } from "./reducers/CartReducers";
import { userRegisterLoginReducer } from "./reducers/userReducers";
import { getCategoriesReducer } from "./reducers/categoryReducers";
import { adminChatReducer } from "./reducers/adminChatReducers";

 
const reducer = combineReducers({
  cart: cartReducer,
  userRegisterLogin: userRegisterLoginReducer,
  getCategories: getCategoriesReducer,
  adminChat: adminChatReducer,
});

const cartItemsInLocalStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

const userInfoInLocalStorage = JSON.parse(localStorage.getItem("userInfo")) || JSON.parse(sessionStorage.getItem("userInfo")) || {};

const INITIAL_STATE = {
  cart: {
    cartItems: cartItemsInLocalStorage,
    itemsCount: cartItemsInLocalStorage.reduce((quantity, item) => quantity + Number(item.quantity), 0),
    cartSubtotal: cartItemsInLocalStorage.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0),
  },
  userRegisterLogin: { userInfo: userInfoInLocalStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  INITIAL_STATE,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
