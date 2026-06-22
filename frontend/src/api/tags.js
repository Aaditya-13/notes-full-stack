import { api } from "./axios";


const createTag = async(data) => {
  const response = await api.post("/tags", data)

  return response.data
}

const getTags = async() => {
  const response = await api.get("/tags")

  return response.data
}

const updateTag = async(id, data) => {
  const response = await api.patch(`/tags/${id}`, data)

  return response.data
}

const deleteTag = async(id) => {
  const response = await api.patch(`/tags/${id}`)

  return response.data
}



export{
  createTag,
  getTags,
  updateTag,
  deleteTag
}