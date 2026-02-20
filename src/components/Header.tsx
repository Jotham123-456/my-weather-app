import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/themeprovider";
import { Moon, Sun } from "lucide-react";
import CitySearch from "./CitySearch";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-50 w-full border-b  supports-[backdrop-filter]:bg-background/60 bg-background/95 backdrop-blur py-2">
      <div className=" container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={"/"} className="flex gap-5 justify-between items-center">
          <img
            className="bg-white rounded-lg"
            src={isDark ? "/light-logo.png" : "/dark-logo.png"}
            alt=""
          />

          <h1 className="font-bold text-4xl">Klimate</h1>
        </Link>

        <div className="flex gap-4">
          {/* {serach} */}
          <CitySearch />
          {/* {theme toglgle} */}
          <div
            className={`flex items-center cursor-pointer 
          transition-transform duration-500
          ${isDark ? "rotate-180" : "rotate-0"}`}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" />
            ) : (
              <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
