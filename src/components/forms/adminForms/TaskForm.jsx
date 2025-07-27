import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useState } from "react";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Textarea from "../../Common/Textarea";
import Toggle from "../../Common/Toggle";
import Avatar from "../../Common/Avatar";
import { useTranslation } from "../../../utils/translations";
import {
  FileText,
  AlignLeft,
  Users,
  Settings,
  CheckCircle,
  Bell,
  X,
  UserPlus,
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

  // Convert single assignee to array format for backward compatibility
  const [selectedAssignees, setSelectedAssignees] = useState(
    formData.assignee ? [formData.assignee] : []
  );

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

  // Filter out already selected members
  const availableMembers = members.filter(
    (member) => !selectedAssignees.includes(member.id)
  );

  const handleAddAssignee = (memberId) => {
    if (!selectedAssignees.includes(memberId)) {
      const newAssignees = [...selectedAssignees, memberId];
      setSelectedAssignees(newAssignees);
      // Update parent component with comma-separated string for backward compatibility
      onAssigneeChange(newAssignees.join(","));
    }
  };

  const handleRemoveAssignee = (memberId) => {
    const newAssignees = selectedAssignees.filter((id) => id !== memberId);
    setSelectedAssignees(newAssignees);
    // Update parent component with comma-separated string for backward compatibility
    onAssigneeChange(newAssignees.join(","));
  };

  const getSelectedMemberDetails = (memberId) => {
    return members.find((member) => member.id === memberId);
  };

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

          {/* Project Selection */}
          <div className="mb-4">
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

          {/* Multiple Assignees Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("assignees")}{" "}
                {selectedAssignees.length > 0 &&
                  `(${selectedAssignees.length})`}
              </label>
              {selectedAssignees.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setSelectedAssignees([]);
                    onAssigneeChange("");
                  }}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  {t("clearAll")}
                </Button>
              )}
            </div>

            {/* Selected Assignees Display */}
            {selectedAssignees.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-600 p-3">
                <div className="flex flex-wrap gap-2">
                  {selectedAssignees.map((memberId) => {
                    const member = getSelectedMemberDetails(memberId);
                    return (
                      <div
                        key={memberId}
                        className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg px-3 py-2 border border-blue-200 dark:border-blue-700"
                      >
                        <Avatar
                          name={member?.name || ""}
                          src={member?.avatar}
                          size="small"
                          className="w-6 h-6"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {member?.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAssignee(memberId)}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Assignee Dropdown */}
            {availableMembers.length > 0 && (
              <div className="relative">
                <Select
                  label={t("addAssignee")}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddAssignee(e.target.value);
                      e.target.value = ""; // Reset selection
                    }
                  }}
                  options={availableMembers.map((member) => ({
                    value: member.id,
                    label: member.name,
                  }))}
                  className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  placeholder={t("selectMemberToAdd")}
                />
              </div>
            )}

            {/* No Available Members Message */}
            {availableMembers.length === 0 && selectedAssignees.length > 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                <UserPlus className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>{t("allMembersAssigned")}</p>
              </div>
            )}

            {/* Error Display */}
            {errors.assignee && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {errors.assignee}
              </p>
            )}

            {/* Assignment Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">{t("assignmentInfo")}</p>
                  <p className="text-xs opacity-80">
                    {selectedAssignees.length === 0
                      ? t("selectAtLeastOneAssignee")
                      : selectedAssignees.length === 1
                      ? t("singleAssigneeSelected")
                      : t("multipleAssigneesSelected").replace(
                          "{count}",
                          selectedAssignees.length
                        )}
                  </p>
                </div>
              </div>
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
            disabled={selectedAssignees.length === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
