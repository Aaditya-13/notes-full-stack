import { api } from "./axios.js";

const getNotes = async(search = "") => {

  const response = await api.get("/notes", {
    params: {
      search
    }
  });

  return response.data;
};

const getNoteById = async(id) => {

  const response = await api.get(`/notes/${id}`);

  return response.data;
};

const createNote = async(data)=> {
  const response = await api.post("/notes", data)

  return response.data;
}

const updateNote = async(id, data)=> {
  const response = await api.patch(`/notes/${id}`, data)

  return response.data;
}

const pinNote = async(id) => {
  const response = await api.patch(`/notes/${id}/pin`)

  return response.data
}


const trashNote = async(id) => {
  const response = await api.patch(`/notes/${id}/trash`)

  return response.data
}


const archiveNote = async(id) => {
  const response = await api.patch(`/notes/${id}/archive`)

  return response.data
}

const deleteNote = async(id) => {

  const response = await api.delete(`/notes/${id}`);

  return response.data;
};

const addTagToNote = async(noteId) => {
  
  const response = await api.patch(`/notes/${noteId}/add-tag`)

  return response.data
}

const removeTagFromNote = async(noteId) => {
  
  const response = await api.patch(`/notes/${noteId}/remove-tag`)

  return response.data
}

export{
  getNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
  pinNote,
  trashNote,
  archiveNote,
  addTagToNote,
  removeTagFromNote
}