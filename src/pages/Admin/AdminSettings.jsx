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
import Toggle from "../../components/Common/Toggle";
import Select from "../../components/Common/Select";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { theme, language, notifications, preferences } = useSelector(
    (state) => state.settings
  );
  const { t } = useTranslation(language);

  // Add RTL detection
  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxFileSize: 10,
  });
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

  const handleSystemSettingChange = (key, value) => {
    setSystemSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
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
      toast.error("Please select at least one work day");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(updatePreferences(localPreferences));
      toast.success(t("settingsSaved"));
    } catch {
      toast.error(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Save system settings logic here
      toast.success(t("systemSettingsSaved"));
    } catch {
      toast.error(t("serverError"));
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

  const sessionTimeoutOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 480, label: "8 hours" },
  ];

  const fileSizeOptions = [
    { value: 5, label: "5 MB" },
    { value: 10, label: "10 MB" },
    { value: 25, label: "25 MB" },
    { value: 50, label: "50 MB" },
    { value: 100, label: "100 MB" },
  ];

  return (
    <div className={`space-y-6 ${directionClass}`} dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex items-center ${
          isRTL ? "flex-row justify-between" : "justify-between"
        } justify-between`}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("settings")}
        </h1>
      </div>

      {/* General Settings */}
      <div className={`settings-section ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="settings-title">{t("generalSettings")}</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t("theme")}
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              options={themeOptions}
              className={isRTL ? "text-right" : "text-left"}
            />

            <Select
              label={t("language")}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={languageOptions}
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`settings-section ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="settings-title">{t("notificationSettings")}</h2>

        <div className="space-y-4">
          <Toggle
            label={t("emailNotifications")}
            enabled={notifications.email}
            onChange={(value) => handleNotificationChange("email", value)}
            isRTL={isRTL}
          />

          <Toggle
            label={t("desktopNotifications")}
            enabled={notifications.desktop}
            onChange={(value) => handleNotificationChange("desktop", value)}
            isRTL={isRTL}
          />

          <Toggle
            label={t("taskUpdateNotifications")}
            enabled={notifications.taskUpdates}
            onChange={(value) => handleNotificationChange("taskUpdates", value)}
            isRTL={isRTL}
          />

          <Toggle
            label={t("dailyReportNotifications")}
            enabled={notifications.dailyReports}
            onChange={(value) =>
              handleNotificationChange("dailyReports", value)
            }
            isRTL={isRTL}
          />
        </div>
      </div>

      {/* Work Preferences */}
      <div className={`settings-section ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="settings-title">{t("workPreferences")}</h2>

        <div className="space-y-6">
          {/* Work Days */}
          <div>
            <label className="form-label">{t("workDays")}</label>
            <div
              className={`mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 ${
                isRTL ? "dir-rtl" : ""
              }`}
            >
              {WORK_DAYS.map((day) => (
                <label
                  key={day.value}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${
                      localPreferences.workDays.includes(day.value)
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={localPreferences.workDays.includes(day.value)}
                    onChange={() => handleWorkDayChange(day.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">
                    {day.label[language]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Time */}
          <div className="max-w-xs">
            <Input
              label={t("reportTime")}
              type="time"
              value={localPreferences.reportTime}
              onChange={handleTimeChange}
              required
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>

          <Button
            onClick={handleSavePreferences}
            loading={loading}
            className={isRTL ? "mr-auto" : "ml-auto"}
          >
            {t("savePreferences")}
          </Button>
        </div>
      </div>

      {/* System Settings */}
      <div className={`settings-section ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="settings-title">{t("systemSettings")}</h2>

        <div className="space-y-6">
          {/* System Toggles */}
          <div className="space-y-4">
            <Toggle
              label={t("autoBackup")}
              enabled={systemSettings.autoBackup}
              onChange={(value) =>
                handleSystemSettingChange("autoBackup", value)
              }
              isRTL={isRTL}
            />

            <Toggle
              label={t("maintenanceMode")}
              enabled={systemSettings.maintenanceMode}
              onChange={(value) =>
                handleSystemSettingChange("maintenanceMode", value)
              }
              isRTL={isRTL}
            />

            <Toggle
              label={t("allowRegistration")}
              enabled={systemSettings.allowRegistration}
              onChange={(value) =>
                handleSystemSettingChange("allowRegistration", value)
              }
              isRTL={isRTL}
            />

            <Toggle
              label={t("requireEmailVerification")}
              enabled={systemSettings.requireEmailVerification}
              onChange={(value) =>
                handleSystemSettingChange("requireEmailVerification", value)
              }
              isRTL={isRTL}
            />
          </div>

          {/* System Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t("sessionTimeout")}
              value={systemSettings.sessionTimeout}
              onChange={(e) =>
                handleSystemSettingChange(
                  "sessionTimeout",
                  parseInt(e.target.value)
                )
              }
              options={sessionTimeoutOptions}
              className={isRTL ? "text-right" : "text-left"}
            />

            <Select
              label={t("maxFileSize")}
              value={systemSettings.maxFileSize}
              onChange={(e) =>
                handleSystemSettingChange(
                  "maxFileSize",
                  parseInt(e.target.value)
                )
              }
              options={fileSizeOptions}
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>

          <Button
            onClick={handleSaveSystemSettings}
            loading={loading}
            variant="secondary"
            className={isRTL ? "mr-auto" : "ml-auto"}
          >
            {t("saveSystemSettings")}
          </Button>
        </div>
      </div>

      {/* Backup & Maintenance */}
      <div className={`settings-section ${isRTL ? "text-right" : "text-left"}`}>
        <h2 className="settings-title">{t("backupMaintenance")}</h2>

        <div className="space-y-4">
          <div
            className={`flex items-center ${
              isRTL ? "flex-row" : ""
            } justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg`}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t("databaseBackup")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("lastBackup")}:{" "}
                {new Date().toLocaleDateString(
                  language === "ar" ? "ar-SA" : "en-US"
                )}
              </p>
            </div>
            <Button variant="outline" size="small">
              {t("createBackup")}
            </Button>
          </div>

          <div
            className={`flex items-center ${
              isRTL ? "flex-row" : ""
            } justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg`}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t("systemLogs")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("viewSystemLogs")}
              </p>
            </div>
            <Button variant="outline" size="small">
              {t("viewLogs")}
            </Button>
          </div>

          <div
            className={`flex items-center ${
              isRTL ? "flex-row" : ""
            } justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg`}
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {t("clearCache")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("clearSystemCache")}
              </p>
            </div>
            <Button variant="outline" size="small">
              {t("clearCache")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
