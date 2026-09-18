import axios from "axios";

const API = axios.create({
  baseURL: "https://acan-6oi0.onrender.com/api",
});

export const getDashboard = () =>
  API.get("/dashboard");

export const getCamera = () =>
  API.get("/camera");

export const getAlerts = () =>
  API.get("/alerts");

export const getTrains = () =>
  API.get("/trains");

export const getAnimals = () =>
  API.get("/animals");

export const getReports = () =>
  API.get("/reports");
