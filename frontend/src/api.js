import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

export const submitProblem = (description) =>
  api.post("/problems", { description }).then((r) => r.data);

export const getProblemById = (id) =>
  api.get(`/problems/${id}`).then((r) => r.data);

export const getAllProblems = (status, department) =>
  api.get("/problems", { params: { status, department } }).then((r) => r.data);

export const updateProblemStatus = (id, status, resolution) =>
  api.patch(`/problems/${id}`, { status, resolution }).then((r) => r.data);

export const getStats = () =>
  api.get("/stats").then((r) => r.data);