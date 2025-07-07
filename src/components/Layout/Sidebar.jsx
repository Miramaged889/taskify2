import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, onClose }) => {
  const { role } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const employeeNavItems = [
    { name: t("dashboard"), href: "/employee", icon: HomeIcon, end: true },
    {
      name: t("tasks"),
      href: "/employee/tasks",
      icon: ClipboardDocumentListIcon,
    },
    { name: t("calendar"), href: "/employee/calendar", icon: CalendarDaysIcon },
    { name: t("reports"), href: "/employee/reports", icon: ChartBarIcon },
    { name: t("chat"), href: "/employee/chat", icon: ChatBubbleLeftRightIcon },
    { name: t("settings"), href: "/employee/settings", icon: Cog6ToothIcon },
  ];

  const adminNavItems = [
    { name: t("dashboard"), href: "/admin", icon: HomeIcon, end: true },
    { name: t("projects"), href: "/admin/projects", icon: FolderIcon },
    { name: t("tasks"), href: "/admin/tasks", icon: ClipboardDocumentListIcon },
    { name: t("calendar"), href: "/admin/calendar", icon: CalendarDaysIcon },
    { name: t("reports"), href: "/admin/reports", icon: ChartBarIcon },
    { name: t("team"), href: "/admin/team", icon: UsersIcon },
    { name: t("chat"), href: "/admin/chat", icon: ChatBubbleLeftRightIcon },
    { name: t("settings"), href: "/admin/settings", icon: Cog6ToothIcon },
  ];

  const navItems = role === "admin" ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed ${isRTL ? "right-0" : "left-0"} inset-y-0 z-50 w-72
          bg-white dark:bg-gray-800/95 shadow-lg backdrop-blur-sm
          transform transition-all duration-300 ease-in-out
          ${
            isOpen
              ? isRTL
                ? "-translate-x-0"
                : "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }
          md:translate-x-0 md:static md:inset-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-gray-200 dark:border-gray-700/50">
            <div
              className={`flex items-center ${isRTL ? "flex-row" : ""} gap-3`}
            >
              <img
                src={"public/TaskifyIcon.png"}
                alt="Taskify Logo"
                className="w-10 h-10 object-contain filter dark:brightness-110"
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                {t("appName")}
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }
                    ${isRTL ? "flex-row" : ""}
                    transform hover:scale-[1.02] active:scale-[0.98]`
                  }
                  onClick={onClose}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-200
                      ${isRTL ? "ml-3" : "mr-3"}
                      group-hover:text-primary-500
                    `}
                  />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
            <div
              className={`flex items-center ${
                isRTL ? "flex-row-reverse" : ""
              } space-x-3 
              p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 transition-transform hover:scale-[1.02]`}
            >
              <div className="flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 
                  flex items-center justify-center shadow-inner"
                >
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {role === "admin" ? "A" : "E"}
                  </span>
                </div>
              </div>
              <div
                className={`flex-1 min-w-0 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {role === "admin" ? t("adminRole") : t("employeeRole")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {t("loggedInAs")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
