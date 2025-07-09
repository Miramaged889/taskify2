import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTheme,
  setLanguage,
  updateNotifications,
  updatePreferences,
} from "../../store/slices/settingsSlice";
import { useTranslation } from "../../utils/translations";
import { WORK_DAYS } from "../../utils/constants";
import Card from "../../components/Common/Card";
import Toggle from "../../components/Common/Toggle";
import Select from "../../components/Common/Select";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import {
  CogIcon,
  SparklesIcon,
  BellIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  FolderArrowDownIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const EmployeeSettings = () => {
  const dispatch = useDispatch();
  const { theme, language, notifications, preferences } = useSelector(
    (state) => state.settings
  );
  const { t } = useTranslation(language);

  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [loading, setLoading] = useState(false);

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));

    document.documentElement.setAttribute("lang", newLanguage);
    document.documentElement.setAttribute(
      "dir",
      newLanguage === "ar" ? "rtl" : "ltr"
    );
    document.body.className =
      newLanguage === "ar" ? "rtl font-arabic" : "ltr font-english";
  };

  const handleNotificationChange = (key, value) => {
    dispatch(updateNotifications({ [key]: value }));
  };

  const handleWorkDayChange = (day) => {
    const newWorkDays = localPreferences.workDays.includes(day)
      ? localPreferences.workDays.filter((d) => d !== day)
      : [...localPreferences.workDays, day];

    setLocalPreferences((prev) => ({
      ...prev,
      workDays: newWorkDays,
    }));
  };

  const handleTimeChange = (e) => {
    setLocalPreferences((prev) => ({
      ...prev,
      reportTime: e.target.value,
    }));
  };

  const handleSavePreferences = async () => {
    if (localPreferences.workDays.length === 0) {
      toast.error(t("selectWorkDay"));
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(updatePreferences(localPreferences));
      toast.success(t("settingsSaved"), {
        icon: <CogIcon className="h-5 w-5" />,
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #f0760a 0%, #10b981 100%)",
          color: "#fff",
        },
      });
    } catch {
      toast.error(t("serverError"), {
        icon: <ExclamationTriangleIcon className="h-5 w-5" />,
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const themeOptions = [
    { value: "light", label: t("light") },
    { value: "dark", label: t("dark") },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  return (
    <div
      className={`space-y-8 p-6 min-h-screen ${directionClass} animate-fade-in`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Enhanced Header */}
      <div className={`${isRTL ? "text-right" : "text-left"} animate-fade-in`}>
        <div
          className={`flex items-center ${
            isRTL ? "flex-row" : ""
          } justify-between mb-6`}
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg animate-bounce-in">
                <UserCircleIcon className="h-12 w-12 text-white" />
              </div>
              <SparklesIcon className="h-6 w-6 text-accent-400 absolute -top-2 -right-2 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-info-500 bg-clip-text text-transparent">
                {t("settings")}
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mt-2">
                {t("personalPreferences")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {t("employeePortal")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Preferences */}
        <Card className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("personalPreferences")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("appearanceAndLocalization")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
                <Select
                  label={t("theme")}
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  options={themeOptions}
                  className="w-full"
                />
              </div>

              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
                <Select
                  label={t("language")}
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  options={languageOptions}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 shadow-lg">
              <BellIcon className="h-6 w-6 text-white animate-wiggle" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("notificationPreferences")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("manageAlerts")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "email",
                label: t("emailNotifications"),
                icon: EnvelopeIcon,
              },
              {
                key: "desktop",
                label: t("desktopNotifications"),
                icon: ComputerDesktopIcon,
              },
              {
                key: "taskUpdates",
                label: t("taskUpdateNotifications"),
                icon: ClipboardDocumentListIcon,
              },
              {
                key: "dailyReports",
                label: t("dailyReportNotifications"),
                icon: ChartBarIcon,
              },
            ].map((notification, index) => (
              <div
                key={notification.key}
                className="animate-bounce-in p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <notification.icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {notification.label}
                    </span>
                  </div>
                  <Toggle
                    enabled={notifications[notification.key]}
                    onChange={(value) =>
                      handleNotificationChange(notification.key, value)
                    }
                    isRTL={isRTL}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Work Schedule */}
        <Card className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl lg:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-success-500 to-success-600 shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("workSchedule")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("schedulePreferences")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Work Days Grid */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                {t("workDays")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {WORK_DAYS.map((day, index) => (
                  <label
                    key={day.value}
                    className={`
                      flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer 
                      transition-all duration-300 hover:scale-105 animate-bounce-in text-sm font-medium
                      ${
                        localPreferences.workDays.includes(day.value)
                          ? "border-primary-500 bg-primary-500 text-white shadow-lg"
                          : "border-neutral-200 dark:border-neutral-600 hover:border-primary-300 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                      }
                    `}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <input
                      type="checkbox"
                      checked={localPreferences.workDays.includes(day.value)}
                      onChange={() => handleWorkDayChange(day.value)}
                      className="sr-only"
                    />
                    {day.label[language]}
                  </label>
                ))}
              </div>
            </div>

            {/* Report Time */}
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  {t("dailyReportTime")}
                </h3>
              </div>
              <Input
                type="time"
                value={localPreferences.reportTime}
                onChange={handleTimeChange}
                required
              />
            </div>

            <Button
              onClick={handleSavePreferences}
              loading={loading}
              className="w-full bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FolderArrowDownIcon className="h-5 w-5 mr-2" />
              {t("savePreferences")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeSettings;
