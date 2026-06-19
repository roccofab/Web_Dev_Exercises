import { ACCESS_TOKEN_STORAGE_KEY } from "../api/axios_client";

type JwtPayload = {
  userId?: number;
  role?: string;
};

export const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const payload = JSON.parse(atob(payloadPart)) as JwtPayload;
    return typeof payload.userId === "number" ? payload.userId : null;
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};