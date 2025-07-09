import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, updateTask } from "../../store/slices/taskSlice";
import { useTranslation } from "../../utils/translations";
import TaskBoard from "../../components/Tasks/TaskBoard";
import Modal from "../../components/Common/Modal";
import Button from "../../components/Common/Button";
import TaskForm from "../../components/forms/employeeForms/TaskForm";
import { generateId } from "../../utils/helpers";
import {
  ClipboardDocumentListIcon,
  SparklesIcon,
  RocketLaunchIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const EmployeeTasks = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("create");
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? formData.dueDate.toISOString() : null,
        updatedAt: new Date().toISOString(),
      };

      if (modalMode === "create") {
        taskData.id = generateId();
        taskData.createdAt = new Date().toISOString();
        taskData.createdBy = "1"; // Current user ID

        dispatch(addTask(taskData));
        toast.success(t("taskCreated"), {
          icon: "🎉",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f0760a 0%, #10b981 100%)",
            color: "#fff",
          },
        });
      } else {
        taskData.id = selectedTask.id;
        taskData.createdAt = selectedTask.createdAt;
        taskData.createdBy = selectedTask.createdBy;

        dispatch(updateTask(taskData));
        toast.success(t("taskUpdated"), {
          icon: "✨",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)",
            color: "#fff",
          },
        });
      }

      setIsModalOpen(false);
    } catch {
      toast.error(t("serverError"), {
        icon: "💥",
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
                  {t("manageYourTasks")}
                </p>
              </div>
            </div>
            <Button
              onClick={handleCreateTask}
              icon={<PlusIcon className="h-5 w-5" />}
            >
              {t("createTask")}
            </Button>
          </div>
        </div>

        {/* Fun Stats Bar */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 via-accent-50 to-info-50 dark:from-primary-900/20 dark:via-accent-900/20 dark:to-info-900/20 border border-primary-200/30 animate-slide-in">
          <RocketLaunchIcon className="h-6 w-6 text-primary-500 animate-wiggle" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {t("readyToBoostProductivity")}
          </span>
          <div className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-warm rounded-full animate-pulse"
              style={{ width: "75%" }}
            />
          </div>
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            75%
          </span>
        </div>
      </div>

      {/* Enhanced Task Board with Animation */}
      <div className="animate-bounce-in" style={{ animationDelay: "200ms" }}>
        <TaskBoard onEditTask={handleEditTask} />
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={modalMode === "create" ? t("createTask") : t("editTask")}
      >
        <TaskForm
          formData={formData}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onAssigneeChange={(value) => handleChange("assignee", value)}
          mode={modalMode}
        />
      </Modal>
    </div>
  );
};

export default EmployeeTasks;
