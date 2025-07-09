import { useState } from "react";

import { useTranslation } from "../../utils/translations";
import { getTaskStats, formatDate, exportToCsv } from "../../utils/helpers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  RadarController,
  Filler,
} from "chart.js";
import { Doughnut, Pie, Line } from "react-chartjs-2";
import Card from "../../components/Common/Card";
import Select from "../../components/Common/Select";
import { useSelector } from "react-redux";
import DatePicker from "../../components/Common/DatePicker";
import Button from "../../components/Common/Button";
import {
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Mock Data
const mockTasks = [
  {
    id: 1,
    title: "Complete Project Documentation",
    description: "Write comprehensive documentation for the project",
    status: "completed",
    priority: "high",
    project: "proj1",
    assignee: "user1",
    dueDate: "2024-03-25",
    createdAt: "2024-03-01",
  },
  {
    id: 2,
    title: "Fix Navigation Bug",
    description: "Debug and fix navigation issues in the app",
    status: "progress",
    priority: "urgent",
    project: "proj1",
    assignee: "user1",
    dueDate: "2024-03-20",
    createdAt: "2024-03-05",
  },
  {
    id: 3,
    title: "Update User Interface",
    description: "Implement new UI design changes",
    status: "review",
    priority: "medium",
    project: "proj2",
    assignee: "user1",
    dueDate: "2024-03-22",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    title: "Setup Testing Environment",
    description: "Configure testing framework and write initial tests",
    status: "todo",
    priority: "low",
    project: "proj2",
    assignee: "user1",
    dueDate: "2024-03-28",
    createdAt: "2024-03-15",
  },
];

const mockProjects = [
  {
    id: "proj1",
    name: "Project Alpha",
  },
  {
    id: "proj2",
    name: "Project Beta",
  },
];

const mockUser = {
  id: "user1",
  name: "John Doe",
  role: "employee",
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
  RadarController,
  Filler
);

const EmployeeReports = () => {
  // Use mock data instead of Redux state for development
  const tasks = mockTasks;
  const projects = mockProjects;
  const user = mockUser;
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [filters, setFilters] = useState({
    project: "all",
    status: "all",
    priority: "all",
    dateRange: {
      start: null,
      end: null,
    },
  });

  const handleFilterChange = (key, value) => {
    if (key === "dateStart" || key === "dateEnd") {
      setFilters((prev) => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [key === "dateStart" ? "start" : "end"]: value,
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter((task) => {
    if (task.assignee !== user?.id) return false;

    const projectMatch =
      filters.project === "all" || task.project === filters.project;
    const statusMatch =
      filters.status === "all" || task.status === filters.status;
    const priorityMatch =
      filters.priority === "all" || task.priority === filters.priority;

    let dateMatch = true;
    if (filters.dateRange.start && filters.dateRange.end && task.dueDate) {
      const taskDate = new Date(task.dueDate);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      dateMatch = taskDate >= startDate && taskDate <= endDate;
    }

    return projectMatch && statusMatch && priorityMatch && dateMatch;
  });

  const stats = getTaskStats(filteredTasks);

  // Project options
  const projectOptions = [
    { value: "all", label: t("allProjects") },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  // Status options
  const statusOptions = [
    { value: "all", label: t("allStatuses") },
    { value: "todo", label: t("todo") },
    { value: "progress", label: t("progress") },
    { value: "review", label: t("review") },
    { value: "completed", label: t("completed") },
  ];

  // Priority options
  const priorityOptions = [
    { value: "all", label: t("allPriorities") },
    { value: "low", label: t("low") },
    { value: "medium", label: t("medium") },
    { value: "high", label: t("high") },
    { value: "urgent", label: t("urgent") },
  ];

  // Task Status Chart Data
  const statusChartData = {
    labels: [t("todo"), t("progress"), t("review"), t("completed")],
    datasets: [
      {
        label: t("tasks"),
        data: [stats.todo, stats.progress, stats.review, stats.completed],
        backgroundColor: ["#6b7280", "#3b82f6", "#f59e0b", "#22c55e"],
        borderWidth: 1,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  // Task Priority Chart Data
  const priorityStats = {
    low: filteredTasks.filter((task) => task.priority === "low").length,
    medium: filteredTasks.filter((task) => task.priority === "medium").length,
    high: filteredTasks.filter((task) => task.priority === "high").length,
    urgent: filteredTasks.filter((task) => task.priority === "urgent").length,
  };

  const priorityChartData = {
    labels: [t("low"), t("medium"), t("high"), t("urgent")],
    datasets: [
      {
        label: t("tasks"),
        data: [
          priorityStats.low,
          priorityStats.medium,
          priorityStats.high,
          priorityStats.urgent,
        ],
        backgroundColor: ["#6b7280", "#3b82f6", "#f59e0b", "#ef4444"],
        borderWidth: 1,
        borderColor: "#ffffff",
        hoverOffset: 4,
      },
    ],
  };

  // Project Progress Chart
  const projectProgressData = {
    labels: projects.map((project) => project.name),
    datasets: [
      {
        label: t("progress") + " (%)",
        data: projects.map((project) => {
          const projectTasks = filteredTasks.filter(
            (task) => task.project === project.id
          );
          const completedTasks = projectTasks.filter(
            (task) => task.status === "completed"
          );
          return projectTasks.length > 0
            ? Math.round((completedTasks.length / projectTasks.length) * 100)
            : 0;
        }),
        backgroundColor: "rgba(14, 165, 233, 0.2)",
        borderColor: "#0ea5e9",
        borderWidth: 2,
        pointBackgroundColor: "#0ea5e9",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "rgba(17, 24, 39, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: document.documentElement.classList.contains("dark")
          ? "#f9fafb"
          : "#111827",
        bodyColor: document.documentElement.classList.contains("dark")
          ? "#f9fafb"
          : "#111827",
        borderColor: "#f0760a",
        borderWidth: 2,
        cornerRadius: 8,
      },
    },
  };

  const doughnutOptions = {
    ...chartOptions,
    cutout: "60%",
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "bottom",
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
          font: {
            size: 11,
            weight: "500",
          },
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
          font: {
            size: 11,
            weight: "500",
          },
        },
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const handleExportData = () => {
    const exportData = filteredTasks.map((task) => {
      const project = projects.find((p) => p.id === task.project);

      return {
        Title: task.title,
        Description: task.description || "",
        Status: t(task.status),
        Priority: t(task.priority),
        Project: project?.name || "No Project",
        "Due Date": task.dueDate ? formatDate(task.dueDate) : "",
        "Created Date": formatDate(task.createdAt),
      };
    });

    exportToCsv(
      exportData,
      `my-tasks-report-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return (
    <div className="space-y-8 p-6 min-h-screen">
      <div className="flex items-center justify-between animate-slide-down">
        <div className="flex items-center gap-4">
          <div className="relative">
            <DocumentChartBarIcon className="h-10 w-10 text-primary-500 animate-bounce-in" />
            <SparklesIcon className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-happy bg-clip-text text-transparent">
              {t("myReports")}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {t("myReportsDescription")}
            </p>
          </div>
        </div>
        <Button
          onClick={handleExportData}
          icon={
            <DocumentArrowDownIcon className="h-5 w-5 animate-bounce-light" />
          }
          variant="outline"
          className="hover:scale-105 transform transition-all duration-300 hover:shadow-lg"
        >
          {t("exportData")}
        </Button>
      </div>

      {/* Filters */}
      <Card className="transform hover:scale-[1.01] transition-all duration-300 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {t("filters")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
          <Select
            label={t("project")}
            value={filters.project}
            onChange={(e) => handleFilterChange("project", e.target.value)}
            options={projectOptions}
            className="focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          />
          <Select
            label={t("status")}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={statusOptions}
            className="focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          />
          <Select
            label={t("priority")}
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            options={priorityOptions}
            className="focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          />
          <DatePicker
            label={t("from")}
            selected={filters.dateRange.start}
            onChange={(date) => handleFilterChange("dateStart", date)}
            maxDate={filters.dateRange.end}
            className="focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          />
          <DatePicker
            label={t("to")}
            selected={filters.dateRange.end}
            onChange={(date) => handleFilterChange("dateEnd", date)}
            minDate={filters.dateRange.start}
            className="focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
          />
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up">
        <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <div className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors duration-300">
            {stats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("totalTasks")}
          </div>
        </Card>
        <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <div className="text-3xl font-bold text-success-600 group-hover:text-success-500 transition-colors duration-300">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("completedTasks")}
          </div>
        </Card>
        <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <div className="text-3xl font-bold text-error-600 group-hover:text-error-500 transition-colors duration-300">
            {stats.overdue}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("overdueTasks")}
          </div>
        </Card>
        <Card className="text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg group">
          <div className="text-3xl font-bold text-primary-600 group-hover:text-primary-500 transition-colors duration-300">
            {stats.total > 0
              ? Math.round((stats.completed / stats.total) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("completion")}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
        <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            {t("tasksByStatus")}
          </h2>
          <div className="h-64 animate-fade-in">
            <Doughnut data={statusChartData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            {t("tasksByPriority")}
          </h2>
          <div className="h-64 animate-fade-in">
            <Pie data={priorityChartData} options={doughnutOptions} />
          </div>
        </Card>

        <Card className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-lg col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            {t("projectProgress")}
          </h2>
          <div className="h-64 animate-fade-in">
            <Line data={projectProgressData} options={lineOptions} />
          </div>
        </Card>
      </div>

      {/* Detailed Task Table */}
      <Card className="transform hover:scale-[1.01] transition-all duration-300 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {t("detailedTaskList")} ({filteredTasks.length} {t("tasks")})
        </h2>
        <div className="overflow-x-auto animate-fade-in">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("taskTitle")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("project")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("status")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("priority")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("dueDate")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => {
                const project = projects.find((p) => p.id === task.project);

                return (
                  <tr
                    key={task.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {task.title}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {project?.name || "No Project"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full transform hover:scale-105 transition-all duration-300 ${
                          task.status === "completed"
                            ? "bg-gradient-to-r from-success-100 to-success-200 text-success-800 dark:from-success-900 dark:to-success-800 dark:text-success-200"
                            : task.status === "progress"
                            ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 dark:from-primary-900 dark:to-primary-800 dark:text-primary-200"
                            : task.status === "review"
                            ? "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 dark:from-warning-900 dark:to-warning-800 dark:text-warning-200"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {t(task.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full transform hover:scale-105 transition-all duration-300 ${
                          task.priority === "urgent"
                            ? "bg-gradient-to-r from-error-100 to-error-200 text-error-800 dark:from-error-900 dark:to-error-800 dark:text-error-200"
                            : task.priority === "high"
                            ? "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 dark:from-warning-900 dark:to-warning-800 dark:text-warning-200"
                            : task.priority === "medium"
                            ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 dark:from-primary-900 dark:to-primary-800 dark:text-primary-200"
                            : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900 dark:to-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {t(task.priority)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {task.dueDate ? formatDate(task.dueDate) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeReports;
