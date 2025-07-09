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
  ShieldCheckIcon,
  CircleStackIcon,
  CommandLineIcon,
  ServerIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
  DocumentCheckIcon,
  FolderArrowDownIcon,
  EyeIcon,
  TrashIcon,
  RocketLaunchIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const dispatch = useDispatch();
  const { theme, language, notifications, preferences } = useSelector(
    (state) => state.settings
  );
  const { t } = useTranslation(language);

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

  const handleSaveSystemSettings = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("systemSettingsSaved"), {
        icon: <ShieldCheckIcon className="h-5 w-5" />,
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)",
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
    <div
      className={`space-y-8 p-6 min-h-screen  ${directionClass} animate-fade-in`}
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
                <CogIcon className="h-12 w-12 text-white" />
              </div>
              <SparklesIcon className="h-6 w-6 text-accent-400 absolute -top-2 -right-2 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-500 to-info-500 bg-clip-text text-transparent">
                {t("settings")}
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-300 mt-2">
                {t("systemConfiguration")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  System Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-sm font-medium">
              v2.1.0
            </div>
            <div className="px-4 py-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Core Configuration */}
        <Card className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg">
              <CommandLineIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("coreConfiguration")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                System appearance and localization
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

        {/* Notification Hub */}
        <Card
          className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 shadow-lg">
              <BellIcon className="h-6 w-6 text-white animate-wiggle" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("notificationHub")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Configure alert preferences
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

        {/* Workspace Configuration */}
        <Card
          className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-success-500 to-success-600 shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("workspaceConfiguration")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Define operational parameters
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Work Days Grid */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-3">
                {t("operationalDays")}
              </label>
              <div className="grid grid-cols-2 gap-2">
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
              <Input
                label={t("dailyReportTime")}
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
              {t("saveConfiguration")}
            </Button>
          </div>
        </Card>

        {/* Security & System */}
        <Card
          className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
          style={{ animationDelay: "300ms" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-info-500 to-info-600 shadow-lg">
              <ShieldCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {t("securityProtocols")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                System security and access control
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "autoBackup",
                label: t("automatedBackup"),
                icon: ArrowPathIcon,
              },
              {
                key: "maintenanceMode",
                label: t("maintenanceMode"),
                icon: WrenchScrewdriverIcon,
              },
              {
                key: "allowRegistration",
                label: t("userRegistration"),
                icon: UsersIcon,
              },
              {
                key: "requireEmailVerification",
                label: t("emailVerification"),
                icon: DocumentCheckIcon,
              },
            ].map((setting, index) => (
              <div
                key={setting.key}
                className="animate-bounce-in p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {setting.label}
                    </span>
                  </div>
                  <Toggle
                    enabled={systemSettings[setting.key]}
                    onChange={(value) =>
                      handleSystemSettingChange(setting.key, value)
                    }
                    isRTL={isRTL}
                  />
                </div>
              </div>
            ))}

            {/* System Parameters */}
            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
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
                />
              </div>

              <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600">
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
                />
              </div>
            </div>

            <Button
              onClick={handleSaveSystemSettings}
              loading={loading}
              className="w-full bg-gradient-to-r from-info-500 to-info-600 hover:from-info-600 hover:to-info-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              {t("updateSecuritySettings")}
            </Button>
          </div>
        </Card>
      </div>

      {/* Enhanced Infrastructure Management */}
      <Card
        className="animate-slide-in bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xl"
        style={{ animationDelay: "400ms" }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-r from-warning-500 to-warning-600 shadow-lg">
            <ServerIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {t("infrastructureManagement")}
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Advanced system maintenance and data operations
            </p>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700/50 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-600">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <CpuChipIcon className="h-6 w-6 text-primary-500" />
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <div className="h-3 w-3 rounded-full bg-success-500 animate-pulse"></div>
              <span className="text-sm font-medium text-success-700 dark:text-success-300">
                Database Online
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800">
              <div className="h-3 w-3 rounded-full bg-info-500 animate-pulse"></div>
              <span className="text-sm font-medium text-info-700 dark:text-info-300">
                Cache Active
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
              <div className="h-3 w-3 rounded-full bg-warning-500 animate-pulse"></div>
              <span className="text-sm font-medium text-warning-700 dark:text-warning-300">
                Backup Scheduled
              </span>
            </div>
          </div>
        </div>

        {/* Infrastructure Operations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: t("databaseOperations"),
              subtitle: `${t("lastBackup")}: ${new Date().toLocaleDateString(
                language === "ar" ? "ar-SA" : "en-US"
              )}`,
              description:
                "Manage database backups, migrations, and health checks",
              button: t("initiateBackup"),
              icon: CircleStackIcon,
              gradient: "from-primary-500 to-primary-600",
              bgGradient:
                "from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20",
              actions: [
                { label: "Full Backup", icon: CircleStackIcon },
                { label: "Incremental", icon: ArrowPathIcon },
                { label: "Health Check", icon: ShieldCheckIcon },
              ],
            },
            {
              title: t("systemDiagnostics"),
              subtitle: "Real-time system monitoring and analysis",
              description:
                "Monitor performance, logs, and system health metrics",
              button: t("accessLogs"),
              icon: CommandLineIcon,
              gradient: "from-accent-500 to-accent-600",
              bgGradient:
                "from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20",
              actions: [
                { label: "View Logs", icon: EyeIcon },
                { label: "Performance", icon: ChartBarIcon },
                { label: "Alerts", icon: BellIcon },
              ],
            },
            {
              title: t("cacheManagement"),
              subtitle: "Optimize system performance and storage",
              description:
                "Manage cache layers, temporary files, and memory usage",
              button: t("clearCache"),
              icon: RocketLaunchIcon,
              gradient: "from-warning-500 to-warning-600",
              bgGradient:
                "from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20",
              actions: [
                { label: "Clear Cache", icon: TrashIcon },
                { label: "Optimize", icon: CpuChipIcon },
                { label: "Analytics", icon: ChartBarIcon },
              ],
            },
          ].map((item, index) => (
            <div
              key={item.title}
              className={`
                animate-bounce-in rounded-xl border border-neutral-200 dark:border-neutral-600
                bg-gradient-to-br ${item.bgGradient}
                hover:shadow-xl transition-all duration-300 hover:scale-105 group
                overflow-hidden
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} shadow-lg`}
                  >
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-white/50 dark:bg-neutral-800/50">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {item.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors text-xs"
                    >
                      <action.icon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  size="small"
                  className={`bg-gradient-to-r ${item.gradient} text-white border-0 hover:scale-110 transition-all duration-300 shadow-lg w-full`}
                >
                  {item.button}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Options */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-700/50 dark:to-neutral-800/50 border border-neutral-200 dark:border-neutral-600">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <CogIcon className="h-6 w-6 text-accent-500" />
            Advanced Operations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 justify-center hover:bg-danger-50 hover:border-danger-300 hover:text-danger-600 transition-colors"
            >
              <WrenchScrewdriverIcon className="h-5 w-5" />
              Maintenance Mode
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 justify-center hover:bg-info-50 hover:border-info-300 hover:text-info-600 transition-colors"
            >
              <ServerIcon className="h-5 w-5" />
              System Restart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
