import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { moveTask, updateTask } from "../../store/slices/taskSlice";
import { deleteTask, addTask } from "../../store/slices/taskSlice";
import { useTranslation } from "../../utils/translations";
import TaskCard from "./TaskCard";
import TaskForm from "../forms/adminForms/TaskForm";
import Modal from "../Common/Modal";
import Badge from "../Common/Badge";
import toast from "react-hot-toast";
import { generateId } from "../../utils/helpers";

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { stages } = useSelector((state) => state.tasks);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    project: "",
    dueDate: null,
  });
  const [errors, setErrors] = useState({});

  const stageConfig = [
    {
      id: "todo",
      title: t("todo"),
      color: "bg-gray-100 dark:bg-gray-700",
      badgeColor: "default",
    },
    {
      id: "progress",
      title: t("progress"),
      color: "bg-blue-50 dark:bg-blue-900/20",
      badgeColor: "primary",
    },
    {
      id: "review",
      title: t("review"),
      color: "bg-yellow-50 dark:bg-yellow-900/20",
      badgeColor: "warning",
    },
    {
      id: "completed",
      title: t("completed"),
      color: "bg-green-50 dark:bg-green-900/20",
      badgeColor: "success",
    },
  ];

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId;
    const newIndex = destination.index;

    // Update task status and position
    dispatch(moveTask({ taskId, newStatus, newIndex }));
    dispatch(updateTask({ id: taskId, changes: { status: newStatus } }));

    // Show status change notification
    toast.success(t("taskMovedTo") + " " + t(newStatus));
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalMode("edit");
    setFormData({
      title: task.title || "",
      description: task.description || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      assignee: task.assignee || "",
      project: task.project || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (confirm(t("confirmDelete"))) {
      dispatch(deleteTask(taskId));
      toast.success(t("taskDeleted"));
    }
  };

  const handleFormChange = (field, value) => {
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
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

      handleModalClose();
    } catch {
      toast.error(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setErrors({});
  };

  return (
    <div className="h-full">
     
      {/* Task Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stageConfig.map((stage) => (
            <div key={stage.id} className="flex flex-col h-full">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {stage.title}
                  </h2>
                  <Badge variant={stage.badgeColor} size="small">
                    {stages[stage.id]?.length || 0} {t("tasks")}
                  </Badge>
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 min-h-[200px] p-4 rounded-lg border-2 border-dashed
                      ${stage.color}
                      ${
                        snapshot.isDraggingOver
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-gray-200 dark:border-gray-700"
                      }
                      transition-all duration-200
                    `}
                  >
                    <div className="space-y-3">
                      {stages[stage.id]?.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`
                                transform transition-transform duration-200
                                ${
                                  snapshot.isDragging
                                    ? "scale-105 rotate-1"
                                    : ""
                                }
                              `}
                            >
                              <TaskCard
                                task={{ ...task, status: stage.id }}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

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
          onSubmit={handleFormSubmit}
          onChange={handleFormChange}
          onAssigneeChange={(value) => handleFormChange("assignee", value)}
          mode={modalMode}
        />
      </Modal>
    </div>
  );
};

export default TaskBoard;
