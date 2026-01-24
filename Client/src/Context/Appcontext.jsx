import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = (prop) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [search, setSearch] = useState("");

  const [userData, setUserData] = useState(null);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.baseURL = backendUrl;
  axios.defaults.withCredentials = true;

  const getAllCars = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/cars/getdata");
      if (data.success) {
        setCars(data.cars);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/data");
      if (data.success) {
        setUserData(data.user);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
      }
    } catch (error) {
      console.error(error);
      setUserData(null);
      setIsLoggedin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        return true;
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
    return false;
  };

  useEffect(() => {
    getAllCars();
    getUserData();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    search,
    setSearch,
    backendUrl,
    userData,
    setUserData,
    isLoggedin,
    setIsLoggedin,
    getUserData,
    cars,
    getAllCars,
    logout,
    loading,
  };

  return (
    <AppContext.Provider value={value}>{prop.children}</AppContext.Provider>
  );
};
