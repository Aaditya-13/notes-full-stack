import { api } from "./axios";

const loginUser = async (data) => {
  const response = await api.post(
    "users/login",
    data
  );

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


export {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser
}