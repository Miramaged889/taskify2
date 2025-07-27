import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, updateTask } from "../../store/slices/taskSlice";
import { useTranslation } from "../../utils/translations";
import TaskBoard from "../../components/Tasks/TaskBoard";
import Modal from "../../components/Common/Modal";
import Button from "../../components/Common/Button";
import TaskForm from "../../components/forms/adminForms/TaskForm";
import Select from "../../components/Common/Select";
import { generateId } from "../../utils/helpers";
import { teams } from "../../utils/mockData";
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  FunnelIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const AdminTasks = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.settings);
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [teamFilter, setTeamFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignee: "",
    dueDate: null,
    priority: "medium",
    status: "todo",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Get available teams for filtering
  const availableTeams = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  // Filter tasks based on team selection
  const getFilteredTasks = () => {
    if (teamFilter === "all" || !teamFilter) {
      return tasks;
    }

    const team = teams.find((t) => t.id === teamFilter);
    if (team) {
      return tasks.filter((task) => team.members.includes(task.assignee));
    }

    return tasks;
  };

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalMode("create");
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      dueDate: null,
      priority: "medium",
      status: "todo",
    });
    setNotificationEnabled(false);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setFormData({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      priority: task.priority,
      status: task.status,
    });
    setNotificationEnabled(task.notificationEnabled || false);
    setIsModalOpen(true);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("requiredField");
    }

    if (!formData.project) {
      newErrors.project = t("requiredField");
    }

    if (!formData.assignee) {
      newErrors.assignee = t("requiredField");
    }

    if (!formData.priority) {
      newErrors.priority = t("requiredField");
    }

    if (modalMode === "edit" && !formData.status) {
      newErrors.status = t("requiredField");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        id: modalMode === "create" ? generateId() : selectedTask.id,
        title: formData.title,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee,
        dueDate: formData.dueDate,
        priority: formData.priority,
        status: formData.status || "todo",
        notificationEnabled,
        createdAt:
          modalMode === "create"
            ? new Date().toISOString()
            : selectedTask.createdAt,
        updatedAt: new Date().toISOString(),
      };

      if (modalMode === "create") {
        dispatch(addTask(taskData));
        toast.success(t("taskCreated"));
      } else {
        dispatch(updateTask(taskData));
        toast.success(t("taskUpdated"));
      }

      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        project: "",
        assignee: "",
        dueDate: null,
        priority: "medium",
        status: "todo",
      });
      setErrors({});
      setNotificationEnabled(false);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(t("errorSavingTask"));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      project: "",
      assignee: "",
      dueDate: null,
      priority: "medium",
      status: "todo",
    });
    setErrors({});
    setNotificationEnabled(false);
  };

  const handleAssigneeChange = (value) => {
    handleChange("assignee", value);
  };

  const handleNotificationToggle = (enabled) => {
    setNotificationEnabled(enabled);
  };

  return (
    <div
      className={`space-y-8 p-6 min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated Header */}
      <div className={`${isRTL ? "text-right" : "text-left"} animate-fade-in`}>
        <div
          className={`flex items-center ${
            isRTL ? "flex-row-reverse" : ""
          } justify-between mb-4`}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ClipboardDocumentListIcon className="h-10 w-10 text-primary-500 animate-bounce-in" />
                <SparklesIcon className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-happy bg-clip-text text-transparent">
                  {t("tasks")}
                </h1>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-1">
                  {user?.email?.toLowerCase() === "sarah.wilson@example.com"
                    ? t("manageTeamTasks")
                    : t("manageAllTasks")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Team Filter - Only for sarah.wilson@example.com */}
              {user?.email?.toLowerCase() === "sarah.wilson@example.com" && (
                <div className="flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                  <Select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    options={[
                      { value: "all", label: t("allTeams") },
                      ...availableTeams,
                    ]}
                    className="w-48 bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                  />
                </div>
              )}

              <Button
                onClick={handleCreateTask}
                icon={<PlusIcon className="h-5 w-5" />}
              >
                {t("createTask")}
              </Button>
            </div>
          </div>
        </div>

        {/* Fun Stats Bar */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 via-accent-50 to-info-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-info-900/20 border border-primary-200/30 animate-slide-in">
          <RocketLaunchIcon className="h-6 w-6 text-primary-500 animate-wiggle" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {user?.email?.toLowerCase() === "sarah.wilson@example.com"
              ? t("readyToBoostTeamProductivity")
              : t("readyToBoostProductivity")}
          </span>
          <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-warm rounded-full animate-pulse"
              style={{ width: "85%" }}
            />
          </div>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            85%
          </span>
        </div>
      </div>

      {/* Enhanced Task Board with Animation */}
      <div className="animate-bounce-in" style={{ animationDelay: "200ms" }}>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border-2 border-primary-200/30 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("taskBoard")}
              </h2>
              {user?.email?.toLowerCase() === "sarah.wilson@example.com" &&
                teamFilter !== "all" && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
                    {teams.find((t) => t.id === teamFilter)?.name}
                  </span>
                )}
            </div>
          </div>
          <div className="p-6">
            <TaskBoard
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              showCreateButton={false}
            />
          </div>
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalMode === "create" ? t("createTask") : t("editTask")}
        size="large"
      >
        <TaskForm
          formData={formData}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onAssigneeChange={handleAssigneeChange}
          mode={modalMode}
          notificationEnabled={notificationEnabled}
          onNotificationToggle={handleNotificationToggle}
        />
      </Modal>
    </div>
  );
};

export default AdminTasks;
