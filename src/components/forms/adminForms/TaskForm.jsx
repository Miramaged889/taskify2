import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Textarea from "../../Common/Textarea";
import Toggle from "../../Common/Toggle";
import { useTranslation } from "../../../utils/translations";
import {
  FileText,
  AlignLeft,
  Users,
  Settings,
  CheckCircle,
  Bell,
} from "lucide-react";

const TaskForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onAssigneeChange,
  mode = "create",
  notificationEnabled = false,
  onNotificationToggle = () => {},
}) => {
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const priorityOptions = [
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
    { value: "urgent", label: t("urgent") },
  ];

  const statusOptions = [
    { value: "todo", label: t("todo") },
    { value: "in_progress", label: t("inProgress") },
    { value: "review", label: t("review") },
    { value: "done", label: t("done") },
  ];

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <form onSubmit={onSubmit} className="space-y-4 dark:text-white">
        {/* Task Title Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-blue-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-md shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("taskDetails")}
            </h3>
          </div>
          <Input
            label={t("taskTitle")}
            value={formData.title}
            onChange={(e) => onChange("title", e.target.value)}
            error={errors.title}
            required
            className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-neutral-100"
            placeholder={t("enterTaskTitle")}
          />
        </div>

        {/* Description Section */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-100 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-gray-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-500 dark:bg-slate-600 rounded-md shadow-sm">
              <AlignLeft className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("description")}
            </h3>
          </div>
          <Textarea
            label={t("description")}
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            error={errors.description}
            rows={3}
            className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:border-slate-500 dark:focus:border-slate-400 resize-none text-gray-900 dark:text-neutral-100"
            placeholder={t("enterTaskDescription")}
          />
        </div>

        {/* Assignment Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-emerald-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-500 dark:bg-emerald-600 rounded-md shadow-sm">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("assignment")}
            </h3>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("project")}
                value={formData.project}
                onChange={(e) => onChange("project", e.target.value)}
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                error={errors.project}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("selectProject")}
              />
            </div>

            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("assignee")}
                value={formData.assignee}
                onChange={(e) => onAssigneeChange(e.target.value)}
                options={members.map((member) => ({
                  value: member.id,
                  label: member.name,
                }))}
                error={errors.assignee}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholder={t("selectAssignee")}
              />
            </div>
          </div>
        </div>

        {/* Task Settings Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-amber-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-500 dark:bg-amber-600 rounded-md shadow-sm">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("taskSettings")}
            </h3>
          </div>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${
              isRTL ? "flex-row" : ""
            }`}
          >
            <div dir={isRTL ? "rtl" : "ltr"}>
              <DatePicker
                label={t("dueDate")}
                selected={formData.dueDate}
                onChange={(date) => onChange("dueDate", date)}
                error={errors.dueDate}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                placeholderText={t("selectDueDate")}
                labelClassName={isRTL ? "text-right" : "text-left"}
              />
            </div>

            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("priority")}
                value={formData.priority}
                onChange={(e) => onChange("priority", e.target.value)}
                options={priorityOptions}
                error={errors.priority}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                labelClassName={isRTL ? "text-right" : "text-left"}
              />
            </div>
          </div>
        </div>

        {/* Status Section (only for edit mode) */}
        {mode === "edit" && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-green-200/50 dark:border-neutral-600/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-500 dark:bg-green-600 rounded-md shadow-sm">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
                {t("taskStatus")}
              </h3>
            </div>
            <Select
              label={t("status")}
              value={formData.status}
              onChange={(e) => onChange("status", e.target.value)}
              options={statusOptions}
              error={errors.status}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />
          </div>
        )}

        {/* Notification Toggle Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-purple-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-purple-500 dark:bg-purple-600 rounded-md shadow-sm">
              <Bell className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("notificationSettings")}
            </h3>
          </div>
          <div
            className={`flex items-center ${
              isRTL ? "justify-start" : "justify-between"
            } pt-2 pb-2`}
          >
            <Toggle
              label={t("enableNotification")}
              enabled={notificationEnabled}
              onChange={() => onNotificationToggle(!notificationEnabled)}
              isRTL={isRTL}
              color="primary"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div
          className={`flex ${
            isRTL ? "justify-start" : "justify-end"
          } pt-4 border-t border-gray-200 dark:border-neutral-700`}
        >
          <Button
            type="submit"
            loading={loading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {mode === "create" ? t("createTask") : t("updateTask")}
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    project: PropTypes.string.isRequired,
    assignee: PropTypes.string.isRequired,
    dueDate: PropTypes.instanceOf(Date),
    priority: PropTypes.string.isRequired,
    status: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    project: PropTypes.string,
    assignee: PropTypes.string,
    dueDate: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAssigneeChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(["create", "edit"]),
  notificationEnabled: PropTypes.bool,
  onNotificationToggle: PropTypes.func,
};

export default TaskForm;
