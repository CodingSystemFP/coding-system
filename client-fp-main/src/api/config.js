const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://hopeful-tenderness-production-f862.up.railway.app"
    : "http://localhost:5000");

export { API_BASE_URL };
