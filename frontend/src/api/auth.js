import { api } from "./axios";

const loginUser = async (data) => {
  const response = await api.post(
    "users/login",
    data
  );

  return response.data
}


const registerUser = async (data) => {
  const response = await api.post(
    "users/register",
    data
  );

  return response.data
}

export {
  loginUser,
  registerUser
}