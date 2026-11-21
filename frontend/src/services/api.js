
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


export const getToken = () => {
  return localStorage.getItem("nitisathi_token");
};


export const saveAuth = (token, user) => {
  localStorage.setItem("nitisathi_token", token);
  localStorage.setItem("nitisathi_user", JSON.stringify(user));
};


export const getCurrentUser = () => {
  const user = localStorage.getItem("nitisathi_user");
  return user ? JSON.parse(user) : null;
};


export const logoutUser = () => {
  localStorage.removeItem("nitisathi_token");
  localStorage.removeItem("nitisathi_user");
};


const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});


export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  saveAuth(data.token, data.user);
  return data;
};


export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  saveAuth(data.token, data.user);
  return data;
};

// GUEST LOGIN
export const guestLogin = async () => {
  const response = await fetch(`${API_URL}/auth/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Guest login failed");
  }

  saveAuth(data.token, data.user);

  return data;
};


export const createChat = async (category = "General") => {
  const response = await fetch(`${API_URL}/chats`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      title: "New Chat",
      category,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to create chat");
  }

  return data.chat;
};


export const askAI = async (chatId, question, language) => {
  const response = await fetch(`${API_URL}/chats/${chatId}/ask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ question, language }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to generate answer");
  }

  return data;
};


export const getChats = async () => {
  const response = await fetch(`${API_URL}/chats`, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load chats");
  }

  return data.chats;
};


export const getChatById = async (chatId) => {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load conversation");
  }

  return data.chat;
};


export const renameChat = async (chatId, title) => {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to rename chat");
  }

  return data.chat;
};


export const deleteChat = async (chatId) => {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete chat");
  }

  return data;
};
