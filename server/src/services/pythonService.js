import axios from "axios";

const PYTHON_BASE_URL = "http://127.0.0.1:8000";

/**
 * Call Python AI search service
 */
export const searchFromPython = async (query) => {
  const response = await axios.get(`${PYTHON_BASE_URL}/search`, {
    params: { q: query },
  });

  return response.data;
};
