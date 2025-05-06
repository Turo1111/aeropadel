import axios from "axios";
import { getSession } from "next-auth/react";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DB_HOST || 'http://localhost:5000/',
});

// Interceptor para incluir automáticamente el token
apiClient.interceptors.request.use(async (config) => {
  const session: any = await getSession();
  const token = session?.user?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;