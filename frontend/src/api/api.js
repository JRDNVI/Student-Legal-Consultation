const API_URL = process.env.REACT_APP_API_URL;

export const login = async (username, password) => {
  const response = await fetch(`https://0c0ksfjot5.execute-api.eu-west-1.amazonaws.com/prod/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json(); 
};

export const getStudentDashboard = async (token) => {
  const response = await fetch(`${API_URL}/student/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to load dashboard");
  }

  return response.json();
};