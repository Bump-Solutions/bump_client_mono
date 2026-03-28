import axios from "axios";
import { API } from "../utils/api";

export default axios.create({
  baseURL: API.BASE_URL,
});

export const axiosPublic = axios.create({
  baseURL: API.BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: API.BASE_URL,
  headers: { "Content-Type": "application/json" },
});
