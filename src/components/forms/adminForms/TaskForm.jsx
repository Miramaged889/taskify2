import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import Select from "../../Common/Select";
import DatePicker from "../../Common/DatePicker";
import Textarea from "../../Common/Textarea";
import { useTranslation } from "../../../utils/translations";

const TaskForm = ({
  formData,
  errors,
  loading,
  onSubmit,
  onChange,
  onAssigneeChange,
  mode = "create",
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
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
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
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
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
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("assignment")}
            </h3>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("project")}
                value={formData.project}
                onChange={(value) => onChange("project", value)}
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                error={errors.project}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t("selectProject")}
              />
            </div>

            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("assignee")}
                value={formData.assignee}
                onChange={(value) => onAssigneeChange(value)}
                options={members.map((member) => ({
                  value: member.id,
                  label: member.name,
                }))}
                error={errors.assignee}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholder={t("selectAssignee")}
              />
            </div>
          </div>
        </div>

        {/* Task Settings Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-amber-200/50 dark:border-neutral-600/50 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-amber-500 dark:bg-amber-600 rounded-md shadow-sm">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
              {t("taskSettings")}
            </h3>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${isRTL ? "flex-row" : ""}`}>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <DatePicker
                label={t("dueDate")}
                selected={formData.dueDate}
                onChange={(date) => onChange("dueDate", date)}
                error={errors.dueDate}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${isRTL ? 'text-right' : 'text-left'}`}
                placeholderText={t("selectDueDate")}
                labelClassName={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div dir={isRTL ? "rtl" : "ltr"}>
              <Select
                label={t("priority")}
                value={formData.priority}
                onChange={(value) => onChange("priority", value)}
                options={priorityOptions}
                error={errors.priority}
                className={`bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100 ${isRTL ? 'text-right' : 'text-left'}`}
                labelClassName={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </div>

        {/* Status Section (only for edit mode) */}
        {mode === "edit" && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-lg p-4 border border-green-200/50 dark:border-neutral-600/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-500 dark:bg-green-600 rounded-md shadow-sm">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-800 dark:text-neutral-100">
                {t("taskStatus")}
              </h3>
            </div>
            <Select
              label={t("status")}
              value={formData.status}
              onChange={(value) => onChange("status", value)}
              options={statusOptions}
              error={errors.status}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />
          </div>
        )}

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
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
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
};

export default TaskForm;
