import axios from "axios";

const login = () => {
  return axios.post("http://localhost:8000/chat/api/login");
};

const logout = () => {
  return axios.post("http://localhost:8000/chat/api/logout");
};

export { login, logout };
