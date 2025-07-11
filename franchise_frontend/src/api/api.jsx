const url = "https://franchise-backend-wgp6.onrender.com/api/v1";

export const api = {
    viewApi: {
        post : `${url}/view/postViewBrands`
    }
};


// Try localhost first, then fallback to Render
const LOCAL_API = "http://localhost:5000/api/v1";
const RENDER_API = "https://franchise-backend-wgp6.onrender.com/api/v1";

// Option 1: Ping localhost, fallback to render (async, best for production)
export const getApiBaseUrl = async () => {
  try {
    // Try to ping localhost
    const res = await fetch(`${LOCAL_API}/health`, { method: "GET" });
    if (res.ok) return LOCAL_API;
    throw new Error("Localhost not available");
  } catch {
    return RENDER_API;
  }
};

// Option 2: Use localhost in development, render in production (simple)
export const API_BASE_URL =
  import.meta.env.MODE === "development" ? LOCAL_API : RENDER_API;
