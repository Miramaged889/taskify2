import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "../../utils/translations";
import { formatDate } from "../../utils/helpers";
import { Clock, Edit, Trash2 } from "lucide-react";
import Card from "../Common/Card";
import Badge from "../Common/Badge";
import Avatar from "../Common/Avatar";

const TaskCard = ({ task, onEdit, onDelete, onView, isDragging = false }) => {
  const { language } = useSelector((state) => state.settings);
  const { members } = useSelector((state) => state.team);
  const { t } = useTranslation(language);

  const assignee = members.find((m) => m.id === task.assignee);

  const getStatusConfig = (status) => {
    const configs = {
      todo: { variant: "default", icon: "📋" },
      progress: { variant: "primary", icon: "🔄" },
      review: { variant: "warning", icon: "👀" },
      completed: { variant: "success", icon: "✅" },
    };
    return configs[status] || configs.todo;
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <Card
      className={`task-card cursor-pointer ${
        isDragging ? "dragging shadow-lg scale-105" : ""
      } transition-all duration-200 hover:shadow-md`}
      onClick={() => onView(task)}
      padding="normal"
      hover
    >
      <div className="space-y-3">
        {/* Header with Title and Actions */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 flex-1 pr-2">
            {task.title}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors rounded"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1 text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition-colors rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Status and Priority Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={statusConfig.variant}
            size="small"
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
            size="small"
          >
            {t(task.priority)}
          </Badge>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between text-sm">
          {/* Assignee */}
          {assignee && (
            <div className="flex items-center">
              <Avatar
                name={assignee.name}
                src={assignee.avatar}
                size="small"
                className="mr-2"
              />
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {assignee.name}
              </span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {formatDate(task.dueDate, "MMM dd")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    project: PropTypes.string,
    dueDate: PropTypes.string,
    notificationEnabled: PropTypes.bool,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
};

export default TaskCard;
