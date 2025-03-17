import axios, { AxiosError } from "axios"
import { Environment } from "../environment";

let isRefreshing: boolean = false;
let requestQueue: any[] = [];

const api = axios.create({
  baseURL: Environment.URL_API_BASE
})

api.interceptors.response.use(
  (Response) => Response,
  (error: AxiosError) => {
    if (error?.response?.status == 401) {
      console.log("renovar token")
      const refreshToken = localStorage.getItem("refreshToken");
      const originalConfig = error.config!;
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("renovando")
        axios.post(`${Environment.URL_API_BASE}/auth/token`,{ token: refreshToken }).then(Response => {
          console.log("new AccessToken: ", Response.data)
          const newAccessToken = Response.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          requestQueue.forEach(request => request.onSuccess(newAccessToken));
          requestQueue = [];

        }).catch(error => {
          requestQueue.forEach(request => request.onFailure(error));
          requestQueue = [];
        }).finally(() => {
          isRefreshing = false;
        })
      }
      return new Promise((resolve, reject) => {
        requestQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers.Authorization = `Bearer ${token}`
            resolve(api(originalConfig))
          },
          onFailure: (err: any) => {
            reject(err)
          }
        })
      })
    }
    return Promise.reject(error)
  })


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  config.headers["Authorization"] = `Bearer ${token}`
  return config
})

interface CrudService {
  getList: () => Promise<any>;
  get: (id: number) => Promise<any>;
  update: <T>(data: T) => Promise<any>;
  create: <T>(data: T) => Promise<any>;
  delete: (id: number) => Promise<void>;
}

const CrudService = (path: string): CrudService => ({
  getList: async () => await api.get(`/${path}`),

  get: async (id: number) => await api.get(`/${path}/${id}`),

  update: async <T>(data: T) => await api.put<T>(`/${path}/${(data as any).id}`, data),

  create: async <T>(data: T) => await api.post(`/${path}`, data),

  delete: async (id: number) => await api.delete(`/${path}/${id}`),
});
