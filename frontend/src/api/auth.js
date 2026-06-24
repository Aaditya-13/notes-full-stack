import { api } from "./axios";

const loginUser = async (data) => {
  const response = await api.post(
    "users/login",
    data
  );

  return response.data
}

const guestLogin = async () => {
  const response = await api.post("users/guest-login");

  return response.data
}


const registerUser = async (formData) => {
  const response = await api.post(
    "users/register",
    formData
  );

  return response.data
}


const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};

const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

const changePassword = async (data) => {
  const response = await api.patch("/users/change-password", data)
  return response.data
}

const updateDetails = async (data) => {
  const response = await api.patch("/users/update-details", data)
  return response.data
}

const updateAvatar = async (formData) => {
  const response = await api.patch("/users/update-avatar", formData)
  return response.data
}


export {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  changePassword,
  updateAvatar,
  updateDetails,
  guestLogin
}