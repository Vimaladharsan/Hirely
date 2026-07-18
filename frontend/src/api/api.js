import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000";

const TOKEN_KEY = "hirely_auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Broadcast auth failures so AuthContext can log the user out and
// redirect, without this file needing to know about React Router.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("hirely:unauthorized"));
    }

    return Promise.reject(error);
  }
);

export const resumeFileUrl = (candidateId) =>
  `${API_BASE_URL}/screening/resume/${candidateId}`;

// Resume preview/download requires the Authorization header, which a
// plain <iframe src> or <a href> can't send — so fetch it as an
// authenticated blob and hand back an object URL instead.
export const fetchResumeBlobUrl = async (candidateId) => {
  const response = await api.get(`/screening/resume/${candidateId}`, {
    responseType: "blob",
  });

  return URL.createObjectURL(response.data);
};

export const register = ({ email, password, name }) =>
  api.post("/auth/register", { email, password, name });

export const login = ({ email, password }) =>
  api.post("/auth/login", { email, password });

export const analyzeResumes = ({ jobTitle, company, jobDescription, files }) => {
  const formData = new FormData();

  formData.append("job_title", jobTitle);
  formData.append("company", company || "");
  formData.append("job_description", jobDescription);

  files.forEach((file) => {
    formData.append("resumes", file);
  });

  return api.post("/screening/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;
