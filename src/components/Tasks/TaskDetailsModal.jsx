import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "../../utils/translations";
import { formatDate } from "../../utils/helpers";
import {
  Clock,
  User,
  Folder,
  Calendar,
  Flag,
  Bell,
  BellOff,
  Edit,
} from "lucide-react";
import Modal from "../Common/Modal";
import Badge from "../Common/Badge";
import Avatar from "../Common/Avatar";
import Toggle from "../Common/Toggle";
import Button from "../Common/Button";

const TaskDetailsModal = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onToggleNotification,
}) => {
  const { language } = useSelector((state) => state.settings);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const [notificationEnabled, setNotificationEnabled] = useState(
    task?.notificationEnabled || false
  );

  if (!task) return null;

  const assignee = members.find((m) => m.id === task.assignee);
  const project = projects.find((p) => p.id === task.project);

  const getStatusConfig = (status) => {
    const configs = {
      todo: { variant: "default", icon: "📋", color: "text-gray-600" },
      progress: { variant: "primary", icon: "🔄", color: "text-blue-600" },
      review: { variant: "warning", icon: "👀", color: "text-yellow-600" },
      completed: { variant: "success", icon: "✅", color: "text-green-600" },
    };
    return configs[status] || configs.todo;
  };

  const statusConfig = getStatusConfig(task.status);

  const handleNotificationToggle = () => {
    const newState = !notificationEnabled;
    setNotificationEnabled(newState);
    onToggleNotification(task.id, newState);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("taskDetails")}
      size="large"
    >
      <div
        className={`${isRTL ? "rtl" : "ltr"} space-y-6`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={statusConfig.variant}
                className="flex items-center gap-1"
              >
                <span>{statusConfig.icon}</span>
                <span>{t(task.status)}</span>
              </Badge>
              <Badge
                variant={
                  task.priority === "urgent"
                    ? "error"
                    : task.priority === "high"
                    ? "warning"
                    : task.priority === "medium"
                    ? "primary"
                    : "default"
                }
              >
                <Flag className="h-3 w-3 mr-1" />
                {t(task.priority)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="small"
              onClick={() => onEdit(task)}
              icon={<Edit className="h-4 w-4" />}
            >
              {t("edit")}
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {task.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t("description")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* Progress Indicator */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t("progress")}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      task.status === "completed"
                        ? "bg-green-500 w-full"
                        : task.status === "review"
                        ? "bg-yellow-500 w-3/4"
                        : task.status === "progress"
                        ? "bg-blue-500 w-1/2"
                        : "bg-gray-400 w-1/4"
                    }`}
                  />
                </div>
                <span className={`text-sm font-medium ${statusConfig.color}`}>
                  {task.status === "completed"
                    ? "100%"
                    : task.status === "review"
                    ? "75%"
                    : task.status === "progress"
                    ? "50%"
                    : "25%"}
                </span>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    {notificationEnabled ? (
                      <Bell className="h-5 w-5 text-white" />
                    ) : (
                      <BellOff className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {t("enableNotification")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {notificationEnabled
                        ? t("notificationsEnabled")
                        : t("notificationsDisabled")}
                    </p>
                  </div>
                </div>
                <Toggle
                  enabled={notificationEnabled}
                  onChange={handleNotificationToggle}
                  color="primary"
                  isRTL={isRTL}
                />
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            {/* Assignee */}
            {assignee && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t("assignee")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={assignee.name}
                    src={assignee.avatar}
                    size="medium"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {assignee.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignee.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Project */}
            {project && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Folder className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t("project")}
                  </span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {project.name}
                </p>
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.description}
                  </p>
                )}
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t("dueDate")}
                  </span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(task.dueDate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {new Date(task.dueDate) < new Date()
                    ? t("overdue")
                    : t("upcoming")}
                </p>
              </div>
            )}

            {/* Timestamps */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {t("timestamps")}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {task.createdAt && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("created")}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {formatDate(task.createdAt)}
                    </span>
                  </div>
                )}
                {task.updatedAt && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("updated")}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      {formatDate(task.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

TaskDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    project: PropTypes.string,
    dueDate: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    notificationEnabled: PropTypes.bool,
  }),
  onEdit: PropTypes.func.isRequired,
  onToggleNotification: PropTypes.func.isRequired,
};

export default TaskDetailsModal;
