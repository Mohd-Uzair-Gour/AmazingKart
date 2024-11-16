import { LOGIN_USER, LOGOUT_USER } from "../constants/userConstants";
import axios from "axios";

export const setReduxUserState = (userCreated) => (dispatch) => {
  dispatch({
    type: LOGIN_USER,
    payload: userCreated,
  });
};

export const logout = () => async (dispatch) => {
  try {
    // Make an API call to log the user out on the server
    await axios.get('/api/logout');

    // Clear user data from storage
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    localStorage.removeItem("cart");

    // Dispatch the logout action
    dispatch({ type: LOGOUT_USER });

    // Redirect to login page
    document.location.href = "/login";
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

   
