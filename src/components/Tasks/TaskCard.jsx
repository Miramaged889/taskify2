import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "../../utils/helpers";
import { ClockIcon, UserIcon, FolderIcon } from "@heroicons/react/24/outline";
import Card from "../Common/Card";
import Badge from "../Common/Badge";
import Avatar from "../Common/Avatar";

const TaskCard = ({ task, onEdit, onDelete, isDragging = false }) => {
  const { language } = useSelector((state) => state.settings);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { t } = useTranslation(language);

  const assignee = members.find((m) => m.id === task.assignee);
  const project = projects.find((p) => p.id === task.project);

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
      className={`task-card cursor-grab ${
        isDragging ? "dragging shadow-lg scale-105" : ""
      } transition-all duration-200`}
      padding="normal"
      hover
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h3>
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition-colors"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
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
          <Badge
            variant={statusConfig.variant}
            size="small"
            className="flex items-center gap-1"
          >
            <span>{statusConfig.icon}</span>
            <span>{t(task.status)}</span>
          </Badge>
        </div>

        {/* Meta information */}
        <div className="space-y-2">
          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <ClockIcon className="h-4 w-4 mr-2" />
              {formatDate(task.dueDate)}
            </div>
          )}

          {/* Assignee */}
          {assignee && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Avatar
                name={assignee.name}
                src={assignee.avatar}
                size="small"
                className="mr-2"
              />
              {assignee.name}
            </div>
          )}

          {/* Project */}
          {project && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <FolderIcon className="h-4 w-4 mr-2" />
              {project.name}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
