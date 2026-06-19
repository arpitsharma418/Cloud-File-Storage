import api from "./api";

export const fetchFiles = () => api.get("/files");

export const uploadFile = (formData) =>
  api.post("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const downloadFile = (id) => api.get(`/files/download/${id}`);

export const replaceFile = (id, formData) =>
  api.put(`/files/replace/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteFile = (id) => api.delete(`/files/${id}`);

export const getSharedFile = (shareId) => api.get(`/files/share/${shareId}`);
