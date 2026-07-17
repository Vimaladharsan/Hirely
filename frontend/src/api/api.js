import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

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
