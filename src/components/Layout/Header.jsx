import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { setTheme, setLanguage } from "../../store/slices/settingsSlice";
import { useTranslation } from "../../utils/translations";
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  LanguageIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../Common/Avatar";

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setIsDropdownOpen(false);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    dispatch(setLanguage(newLanguage));

    document.documentElement.setAttribute("lang", newLanguage);
    document.documentElement.setAttribute(
      "dir",
      newLanguage === "ar" ? "rtl" : "ltr"
    );
    document.body.className =
      newLanguage === "ar" ? "rtl font-arabic" : "ltr font-english";
    setIsDropdownOpen(false);
  };

  // Accessibility and outside click handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-neutral-800/50 shadow-sm border-b border-gray-200 dark:border-neutral-700/80 backdrop-blur-lg top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
            aria-label={t("toggle_menu")}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
          </button>
          <h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-neutral-100 md:ml-0">
            {t("dashboard")}
          </h2>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700/50 transition-colors"
            aria-label={t("notifications")}
          >
            <BellIcon className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              ref={triggerRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center ${isRTL ? "flex-row" : ""}
                space-x-1 sm:space-x-2 p-1 rounded-lg 
                hover:bg-gray-100 dark:hover:bg-neutral-700/50 
                transition-colors group
                ${isDropdownOpen ? "bg-gray-100 dark:bg-neutral-700/50" : ""}
              `}
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
            >
              <Avatar
                name={user?.name}
                src={user?.avatar}
                size="small"
                className={`
                  ring-2 ring-primary-500/20 ring-offset-2 
                  ring-offset-white dark:ring-offset-neutral-800
                  ${isRTL ? "ml-1 sm:ml-2" : "mr-1 sm:mr-2"}
                `}
              />
              <div className="hidden sm:block">
                <p
                  className={`
                  text-sm font-medium text-gray-900 dark:text-neutral-100
                  ${isRTL ? "text-right mr-2" : "text-left ml-2"}
                `}
                >
                  {user?.name}
                </p>
              </div>
              <ChevronDownIcon
                className={`
                  h-4 w-4 text-gray-500 dark:text-neutral-400 
                  transition-transform 
                  ${isRTL ? "mr-1" : "ml-1"}
                  ${isDropdownOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`
                  absolute ${isRTL ? "left-0" : "right-0"} 
                  mt-2 w-56 bg-white dark:bg-neutral-800/90
                  rounded-xl shadow-lg ring-1 ring-black/5 dark:ring-white/10
                  animate-dropdown-enter backdrop-blur-lg
                `}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-neutral-700/80">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      name={user?.name}
                      src={user?.avatar}
                      size="medium"
                      className="ring-2 ring-primary-500/20"
                    />
                    <div>
                      <p
                        className={`
                        text-sm font-medium text-gray-900 dark:text-neutral-100
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                      >
                        {user?.name}
                      </p>
                      <p
                        className={`
                        text-xs text-gray-500 dark:text-neutral-400 truncate
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                      >
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center px-4 py-2 text-sm 
                    text-gray-700 dark:text-neutral-200 
                    hover:bg-gray-100 dark:hover:bg-neutral-700/50 
                    transition-colors group"
                    role="menuitem"
                  >
                    {theme === "light" ? (
                      <MoonIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-neutral-400 group-hover:text-primary-500" />
                    ) : (
                      <SunIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-neutral-400 group-hover:text-primary-500" />
                    )}
                    {theme === "light"
                      ? t("switch_to_dark")
                      : t("switch_to_light")}
                  </button>

                  {/* Language Toggle */}
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center px-4 py-2 text-sm 
                    text-gray-700 dark:text-neutral-200 
                    hover:bg-gray-100 dark:hover:bg-neutral-700/50 
                    transition-colors group"
                    role="menuitem"
                  >
                    <LanguageIcon className="h-5 w-5 mr-3 text-gray-500 dark:text-neutral-400 group-hover:text-primary-500" />
                    {t("toggle_language")}
                  </button>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm 
                    text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                    transition-colors group"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500 group-hover:text-red-600" />
                    {t("logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Header;
