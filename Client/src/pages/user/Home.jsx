import React, { useContext } from "react";
import Carsection from "../../components/Carsection";
import Searchbydate from "../../components/Searchbydate";
import Bannercar from "../../components/Bannercar";
import Testimonials from "../../components/Testimonials";
import Calltoaction from "../../components/Calltoaction";
import { AppContext } from "../../Context/Appcontext";

const Home = () => {
  const { theme } = useContext(AppContext);

  return (
    <div
      className={`${
        theme === "dark" ? "bg-linear-to-tl from-slate-950 to-black" : ""
      } dark:bg-slate-900 dark:text-white`}
    >
      <Searchbydate />
      <Carsection />
      <Bannercar />
      <Testimonials />
      <Calltoaction />
    </div>
  );
};

export default Home;
