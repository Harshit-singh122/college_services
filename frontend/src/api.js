import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

export const submitProblem = (description, image) => {
  const formData = new FormData();
  formData.append("description", description);
  if (image) formData.append("image", image);
  return api.post("/problems", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

export const getProblemById = (id) =>
  api.get(`/problems/${id}`).then((r) => r.data);

export const getAllProblems = (status, department) =>
  api.get("/problems", { params: { status, department } }).then((r) => r.data);

export const updateProblemStatus = (id, status, resolution) =>
  api.patch(`/problems/${id}`, { status, resolution }).then((r) => r.data);

export const deleteProblem = (id) =>
  api.delete(`/problems/${id}`).then((r) => r.data);

export const getStats = () =>
  api.get("/stats").then((r) => r.data);

export const getImageUrl = (path) =>
  path ? `${BASE_URL}${path}` : null;