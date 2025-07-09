import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Select from "../../components/Common/Select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const EmployeeCalendar = () => {
  // Internal mock data - no external dependencies
  const internalMockTasks = [
    {
      id: "task1",
      title: "Project Meeting",
      dueDate: "2025-07-01",
      priority: "high",
      status: "pending",
      project: "proj1",
      assignee: "currentUser",
    },
    {
      id: "task2",
      title: "Code Review",
      dueDate: "2025-07-03",
      priority: "medium",
      status: "progress",
      project: "proj2",
      assignee: "currentUser",
    },
    {
      id: "task3",
      title: "Documentation",
      dueDate: "2025-07-05",
      priority: "low",
      status: "completed",
      project: "proj1",
      assignee: "currentUser",
    },
    {
      id: "task4",
      title: "Bug Fixes",
      dueDate: "2025-07-08",
      priority: "urgent",
      status: "progress",
      project: "proj3",
      assignee: "currentUser",
    },
    {
      id: "task5",
      title: "Team Sync",
      dueDate: "2025-07-15",
      priority: "medium",
      status: "pending",
      project: "proj2",
      assignee: "currentUser",
    },
    {
      id: "task6",
      title: "Release Planning",
          dueDate: "2025-07-20",
      priority: "high",
      status: "progress",
      project: "proj1",
      assignee: "currentUser",
    },
  ];

  const internalMockProjects = [
    { id: "proj1", name: "Frontend Development" },
    { id: "proj2", name: "Backend API" },
    { id: "proj3", name: "Mobile App" },
  ];

  // Use internal mock data as fallback
  const tasks = internalMockTasks;
  const projects = internalMockProjects;
  const currentUser = { id: "currentUser" };

  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";

  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2024
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      const dateMatch =
        format(taskDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd");
      const assigneeMatch = task.assignee === currentUser.id;
      const projectMatch =
        selectedProject === "all" || task.project === selectedProject;
      const priorityMatch =
        selectedPriority === "all" || task.priority === selectedPriority;
      const statusMatch =
        selectedStatus === "all" || task.status === selectedStatus;

      return (
        dateMatch &&
        assigneeMatch &&
        projectMatch &&
        priorityMatch &&
        statusMatch
      );
    });
  };

  const getMonthlyTasks = () => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.assignee !== currentUser.id) return false;
      const taskDate = parseISO(task.dueDate);
      return (
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const getCompletedTasks = () => {
    return getMonthlyTasks().filter((task) => task.status === "completed");
  };

  const getInProgressTasks = () => {
    return getMonthlyTasks().filter((task) => task.status === "progress");
  };

  const getOverdueTasks = () => {
    return tasks.filter((task) => {
      if (!task.dueDate || task.assignee !== currentUser.id) return false;
      const taskDate = parseISO(task.dueDate);
      const now = new Date();
      return taskDate < now && task.status !== "completed";
    });
  };

  const projectOptions = [
    { value: "all", label: t("allProjects") },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  const priorityOptions = [
    { value: "all", label: t("allPriorities") },
    { value: "urgent", label: t("urgent") },
    { value: "high", label: t("high") },
    { value: "medium", label: t("medium") },
    { value: "low", label: t("low") },
  ];

  const statusOptions = [
    { value: "all", label: t("allStatuses") },
    { value: "pending", label: t("pending") },
    { value: "progress", label: t("inProgress") },
    { value: "completed", label: t("completed") },
  ];

  return (
    <div
      className={`space-y-8 p-6 min-h-screen ${directionClass} animate-fade-in`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center ${
          isRTL ? "flex-row" : ""
        } justify-between animate-fade-in`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <CalendarIcon className="h-10 w-10 text-primary-500 animate-bounce-in" />
            <SparklesIcon className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-happy bg-clip-text text-transparent">
              {t("calendar")}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {t("calendarDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:text-white">
          <Select
            label={t("filterByProject")}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
          />
          <Select
            label={t("filterByPriority")}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            options={priorityOptions}
          />
          <Select
            label={t("filterByStatus")}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={statusOptions}
          />
        </div>
      </Card>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigateMonth(-1)}
              icon={
                language === "ar" ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )
              }
            />
            <Button
              variant="ghost"
              size="small"
              onClick={() => setCurrentDate(new Date())}
            >
              {t("today")}
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigateMonth(1)}
              icon={
                language === "ar" ? (
                  <ChevronLeftIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )
              }
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day) => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[100px] p-2 border border-gray-200 dark:border-neutral-700 
                  ${
                    isCurrentMonth
                      ? "bg-white dark:bg-neutral-800"
                      : "bg-gray-50 dark:bg-neutral-900"
                  }
                  ${isCurrentDay ? "ring-2 ring-primary-500" : ""}
                `}
              >
                <div
                  className={`
                  text-sm font-medium mb-1
                  ${
                    isCurrentMonth
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-600"
                  }
                  ${
                    isCurrentDay ? "text-primary-600 dark:text-primary-400" : ""
                  }
                `}
                >
                  {format(day, "d")}
                </div>

                {dayTasks.length > 0 && (
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`
                          text-xs px-2 py-1 rounded text-white truncate
                          ${
                            task.priority === "urgent"
                              ? "bg-error-500"
                              : task.priority === "high"
                              ? "bg-warning-500"
                              : task.priority === "medium"
                              ? "bg-primary-500"
                              : "bg-gray-500"
                          }
                        `}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Task Summary */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-3" />
            {t("taskSummary")}
          </h2>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {format(currentDate, "MMMM yyyy")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Tasks */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {getMonthlyTasks().length}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("totalTasks")}
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-1">
                  {getCompletedTasks().length}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("completedTasks")}
                </div>
              </div>
              <div className="bg-success-50 dark:bg-success-900/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-success-600 dark:text-success-400"
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
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {getInProgressTasks().length}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("inProgress")}
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-primary-600 dark:text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-error-600 dark:text-error-400 mb-1">
                  {getOverdueTasks().length}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("overdueTasks")}
                </div>
              </div>
              <div className="bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                <svg
                  className="h-6 w-6 text-error-600 dark:text-error-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("monthlyProgress")}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(() => {
                const monthlyTasks = getMonthlyTasks();
                const completedTasks = getCompletedTasks();
                const percentage =
                  monthlyTasks.length > 0
                    ? Math.round(
                        (completedTasks.length / monthlyTasks.length) * 100
                      )
                    : 0;
                return `${percentage}%`;
              })()}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-primary-500 dark:bg-primary-400 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(() => {
                  const monthlyTasks = getMonthlyTasks();
                  const completedTasks = getCompletedTasks();
                  return monthlyTasks.length > 0
                    ? Math.round(
                        (completedTasks.length / monthlyTasks.length) * 100
                      )
                    : 0;
                })()}%`,
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeCalendar;
