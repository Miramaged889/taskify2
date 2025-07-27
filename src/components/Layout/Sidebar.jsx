import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import PropTypes from "prop-types";
import {
  HomeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const navigation = [
    {
      name: t("dashboard"),
      icon: HomeIcon,
      href: "/admin",
      roles: ["admin"],
    },
    {
      name: t("tasks"),
      icon: ClipboardDocumentListIcon,
      href: "/admin/tasks",
      roles: ["admin"],
    },
    {
      name: t("calendar"),
      icon: CalendarIcon,
      href: "/admin/calendar",
      roles: ["admin"],
    },
    {
      name: t("chat"),
      icon: ChatBubbleLeftRightIcon,
      href: "/admin/chat",
      roles: ["admin"],
    },
    {
      name: t("projects"),
      icon: FolderIcon,
      href: "/admin/projects",
      roles: ["admin"],
    },
    {
      name: t("team"),
      icon: UsersIcon,
      href: "/admin/team",
      roles: ["admin"],
    },
    {
      name: t("reports"),
      icon: ChartBarIcon,
      href: "/admin/reports",
      roles: ["admin"],
    },
    {
      name: t("settings"),
      icon: Cog6ToothIcon,
      href: "/admin/settings",
      roles: ["admin"],
    },
    {
      name: t("dashboard"),
      icon: HomeIcon,
      href: "/employee",
      roles: ["employee"],
    },
    {
      name: t("tasks"),
      icon: ClipboardDocumentListIcon,
      href: "/employee/tasks",
      roles: ["employee"],
    },
    {
      name: t("calendar"),
      icon: CalendarIcon,
      href: "/employee/calendar",
      roles: ["employee"],
    },
    {
      name: t("chat"),
      icon: ChatBubbleLeftRightIcon,
      href: "/employee/chat",
      roles: ["employee"],
    },
    {
      name: t("reports"),
      icon: ChartBarIcon,
      href: "/employee/reports",
      roles: ["employee"],
    },
    {
      name: t("settings"),
      icon: Cog6ToothIcon,
      href: "/employee/settings",
      roles: ["employee"],
    },
  ];

  const filteredNavigation = navigation.filter((item) => {
    // Special case: sarah.wilson@example.com gets both admin and employee navigation
    if (user?.email?.toLowerCase() === "sarah.wilson@example.com") {
      return item.roles.includes("admin");
    }
    return item.roles.includes(user?.role);
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm dark:bg-neutral-900/80 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 h-screen flex flex-col ${isRTL ? "right-0" : "left-0"}
          z-20 w-64 bg-white dark:bg-neutral-800/50 backdrop-blur-xl
          border-r border-neutral-200/80 dark:border-neutral-700/80
          transform transition-all duration-500 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-64"
              : "-translate-x-64"
          }
          lg:translate-x-0 lg:static
        `}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-between h-16 px-6 border-b border-neutral-200/80 dark:border-neutral-700/80">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            onClick={() => setIsOpen(false)}
          >
            <img src="/TaskifyIcon.png" alt="Taskify" className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Taskify
            </span>
          </Link>
          <button
            className="lg:hidden text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-between">
          <div className="p-4 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    relative flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-300 ease-out transform
                    overflow-hidden group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/20"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:translate-x-1"
                    }
                  `}
                >
                  <item.icon
                    className={`h-5 w-5 transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-neutral-500 dark:text-neutral-400"
                    } group-hover:scale-110 group-hover:rotate-3`}
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="flex-shrink-0 p-4 border-t border-neutral-200/80 dark:border-neutral-700/80">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 transition-transform duration-300 hover:scale-[1.02]">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold transform transition-transform duration-300 hover:rotate-12">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default Sidebar;
