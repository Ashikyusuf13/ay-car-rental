import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (prop) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [search, setSearch] = useState("");

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
  };

  return (
    <AppContext.Provider value={value}>{prop.children}</AppContext.Provider>
  );
};
