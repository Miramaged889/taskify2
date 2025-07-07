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
} from "date-fns";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Select from "../../components/Common/Select";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "@heroicons/react/24/outline";

const AdminCalendar = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");

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
      const taskDate = new Date(task.dueDate);
      const dateMatch = taskDate.toDateString() === date.toDateString();
      const memberMatch =
        selectedMember === "all" || task.assignee === selectedMember;
      const projectMatch =
        selectedProject === "all" || task.project === selectedProject;

      return dateMatch && memberMatch && projectMatch;
    });
  };

  const memberOptions = [
    { value: "all", label: t("allMembers") },
    ...members.map((member) => ({
      value: member.id,
      label: member.name,
    })),
  ];

  const projectOptions = [
    { value: "all", label: t("allProjects") },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("calendar")}
        </h1>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t("filterByMember")}
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            options={memberOptions}
          />
          <Select
            label={t("filterByProject")}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            options={projectOptions}
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
              icon={language === 'ar' ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
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
              icon={language === 'ar' ? <ChevronLeftIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
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
                  min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 
                  ${
                    isCurrentMonth
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-900"
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
                      : "text-gray-400 dark:text-gray-600"
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
                    {dayTasks.slice(0, 3).map((task) => {
                      const assignee = members.find(
                        (m) => m.id === task.assignee
                      );
                      return (
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
                          title={`${task.title} - ${
                            assignee?.name || "Unassigned"
                          }`}
                        >
                          {task.title}
                        </div>
                      );
                    })}
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
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <CalendarIcon className="h-6 w-6 text-primary-600 mr-3" />
            {t("taskSummary")}
          </h2>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full">
            {format(currentDate, "MMMM yyyy")}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {
                    tasks.filter((task) => {
                      if (!task.dueDate) return false;
                      const taskDate = new Date(task.dueDate);
                      return (
                        taskDate.getMonth() === currentDate.getMonth() &&
                        taskDate.getFullYear() === currentDate.getFullYear()
                      );
                    }).length
                  }
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("totalTasks")}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-1">
                  {
                    tasks.filter((task) => {
                      if (!task.dueDate) return false;
                      const taskDate = new Date(task.dueDate);
                      return (
                        taskDate.getMonth() === currentDate.getMonth() &&
                        taskDate.getFullYear() === currentDate.getFullYear() &&
                        task.status === "completed"
                      );
                    }).length
                  }
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("completedTasks")}
                </div>
              </div>
              <div className="bg-success-50 dark:bg-success-900/20 p-3 rounded-lg">
                <svg className="h-6 w-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {
                    tasks.filter((task) => {
                      if (!task.dueDate) return false;
                      const taskDate = new Date(task.dueDate);
                      return (
                        taskDate.getMonth() === currentDate.getMonth() &&
                        taskDate.getFullYear() === currentDate.getFullYear() &&
                        task.status === "progress"
                      );
                    }).length
                  }
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("inProgress")}
                </div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">
                <svg className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-error-600 dark:text-error-400 mb-1">
                  {
                    tasks.filter((task) => {
                      if (!task.dueDate) return false;
                      const taskDate = new Date(task.dueDate);
                      const now = new Date();
                      return taskDate < now && task.status !== "completed";
                    }).length
                  }
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t("overdueTasks")}
                </div>
              </div>
              <div className="bg-error-50 dark:bg-error-900/20 p-3 rounded-lg">
                <svg className="h-6 w-6 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
                const monthlyTasks = tasks.filter((task) => {
                  if (!task.dueDate) return false;
                  const taskDate = new Date(task.dueDate);
                  return (
                    taskDate.getMonth() === currentDate.getMonth() &&
                    taskDate.getFullYear() === currentDate.getFullYear()
                  );
                });
                const completedTasks = monthlyTasks.filter(task => task.status === "completed");
                const percentage = monthlyTasks.length > 0 ? Math.round((completedTasks.length / monthlyTasks.length) * 100) : 0;
                return `${percentage}%`;
              })()}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(() => {
                  const monthlyTasks = tasks.filter((task) => {
                    if (!task.dueDate) return false;
                    const taskDate = new Date(task.dueDate);
                    return (
                      taskDate.getMonth() === currentDate.getMonth() &&
                      taskDate.getFullYear() === currentDate.getFullYear()
                    );
                  });
                  const completedTasks = monthlyTasks.filter(task => task.status === "completed");
                  return monthlyTasks.length > 0 ? Math.round((completedTasks.length / monthlyTasks.length) * 100) : 0;
                })()}%` 
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminCalendar;
