import axios from "axios";
import UserProfilePageComponent from "./components/UserProfilePageComponent";
import { useSelector, useDispatch } from "react-redux";
import { setReduxUserState } from "../../redux/actions/userActions";

// Updated `updateUserApiRequest` to include the Authorization header
const updateUserApiRequest = async (
  name,
  lastName,
  phoneNumber,
  address,
  country,
  zipCode,
  city,
  state,
  password,
  token
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,  // Ensure token is passed in the header
    },
  };

  const { data } = await axios.put(
    "/api/users/profile",
    {
      name,
      lastName,
      phoneNumber,
      address,
      country,
      zipCode,
      city,
      state,
      password,
    },
    config
  );
  return data;
};

// Updated `fetchUser` to include Authorization header
const fetchUser = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get("/api/users/profile/" + id, config);
  return data;
};

const UserProfilePage = () => {
  const reduxDispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userRegisterLogin);

  return (
    <UserProfilePageComponent
      updateUserApiRequest={(...args) => updateUserApiRequest(...args, userInfo.token)}
      fetchUser={(id) => fetchUser(id, userInfo.token)}
      userInfoFromRedux={userInfo}
      setReduxUserState={setReduxUserState}
      reduxDispatch={reduxDispatch}
      localStorage={window.localStorage}
      sessionStorage={window.sessionStorage}
    />
  );
};

export default UserProfilePage;
