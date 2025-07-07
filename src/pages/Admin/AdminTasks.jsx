import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, updateTask } from "../../store/slices/taskSlice";
import { useTranslation } from "../../utils/translations";
import TaskBoard from "../../components/Tasks/TaskBoard";
import Modal from "../../components/Common/Modal";
import TaskForm from "../../components/forms/adminForms/TaskForm";
import { generateId } from "../../utils/helpers";
import toast from "react-hot-toast";

const AdminTasks = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

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
        toast.success(t("taskCreated"));
      } else {
        taskData.id = selectedTask.id;
        taskData.createdAt = selectedTask.createdAt;
        taskData.createdBy = selectedTask.createdBy;

        dispatch(updateTask(taskData));
        toast.success(t("taskUpdated"));
      }

      setIsModalOpen(false);
    } catch {
      toast.error(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <TaskBoard onEditTask={handleEditTask} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

export default AdminTasks;
