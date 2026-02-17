export const setServerDown = () => {
  localStorage.setItem("SERVER_DOWN", "true");
};

export const clearServerDown = () => {
  localStorage.removeItem("SERVER_DOWN");
};

export const isServerDown = () => {
  return localStorage.getItem("SERVER_DOWN") === "true";
};
