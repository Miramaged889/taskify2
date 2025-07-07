import { useState } from "react";
import { useSelector } from "react-redux";
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
import { Doughnut, Pie, Line, Radar } from "react-chartjs-2";
import Card from "../../components/Common/Card";
import Select from "../../components/Common/Select";
import DatePicker from "../../components/Common/DatePicker";
import Button from "../../components/Common/Button";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

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

const AdminReports = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [filters, setFilters] = useState({
    employee: "all",
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
    const employeeMatch =
      filters.employee === "all" || task.assignee === filters.employee;
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

    return (
      employeeMatch && projectMatch && statusMatch && priorityMatch && dateMatch
    );
  });

  const stats = getTaskStats(filteredTasks);

  // Employee options
  const employeeOptions = [
    { value: "all", label: t("allEmployees") },
    ...members
      .filter((member) => member.role === "employee")
      .map((member) => ({
        value: member.id,
        label: member.name,
      })),
  ];

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

  // Employee Performance Chart
  const employeePerformanceData = {
    labels: members
      .filter((member) => member.role === "employee")
      .map((member) => member.name),
    datasets: [
      {
        label: t("assignedTasks"),
        data: members
          .filter((member) => member.role === "employee")
          .map(
            (member) =>
              filteredTasks.filter((task) => task.assignee === member.id).length
          ),
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "#3b82f6",
        borderWidth: 2,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#3b82f6",
      },
      {
        label: t("completedTasks"),
        data: members
          .filter((member) => member.role === "employee")
          .map(
            (member) =>
              filteredTasks.filter(
                (task) =>
                  task.assignee === member.id && task.status === "completed"
              ).length
          ),
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "#22c55e",
        borderWidth: 2,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#22c55e",
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
        },
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

  const radarOptions = {
    ...chartOptions,
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
        },
        grid: {
          circular: true,
        },
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
        },
      },
    },
  };

  const handleExportData = () => {
    const exportData = filteredTasks.map((task) => {
      const assignee = members.find((m) => m.id === task.assignee);
      const project = projects.find((p) => p.id === task.project);

      return {
        Title: task.title,
        Description: task.description || "",
        Status: t(task.status),
        Priority: t(task.priority),
        Assignee: assignee?.name || "Unassigned",
        Project: project?.name || "No Project",
        "Due Date": task.dueDate ? formatDate(task.dueDate) : "",
        "Created Date": formatDate(task.createdAt),
      };
    });

    exportToCsv(
      exportData,
      `tasks-report-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("reports")}
        </h1>
        <Button
          onClick={handleExportData}
          icon={<DocumentArrowDownIcon className="h-5 w-5" />}
          variant="outline"
        >
          {t("exportData")}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("filters")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label={t("employee")}
            value={filters.employee}
            onChange={(e) => handleFilterChange("employee", e.target.value)}
            options={employeeOptions}
          />
          <Select
            label={t("project")}
            value={filters.project}
            onChange={(e) => handleFilterChange("project", e.target.value)}
            options={projectOptions}
          />
          <Select
            label={t("status")}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            options={statusOptions}
          />
          <Select
            label={t("priority")}
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            options={priorityOptions}
          />
          <DatePicker
            label={t("from")}
            selected={filters.dateRange.start}
            onChange={(date) => handleFilterChange("dateStart", date)}
            maxDate={filters.dateRange.end}
          />
          <DatePicker
            label={t("to")}
            selected={filters.dateRange.end}
            onChange={(date) => handleFilterChange("dateEnd", date)}
            minDate={filters.dateRange.start}
          />
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("totalTasks")}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-success-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("completedTasks")}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-error-600">
            {stats.overdue}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t("overdueTasks")}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("tasksByStatus")}
          </h2>
          <div className="h-64">
            <Doughnut data={statusChartData} options={doughnutOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("tasksByPriority")}
          </h2>
          <div className="h-64">
            <Pie data={priorityChartData} options={doughnutOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("employeePerformance")}
          </h2>
          <div className="h-64">
            <Radar data={employeePerformanceData} options={radarOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("projectProgress")}
          </h2>
          <div className="h-64">
            <Line data={projectProgressData} options={lineOptions} />
          </div>
        </Card>
      </div>

      {/* Detailed Task Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("detailedTaskList")} ({filteredTasks.length} {t("tasks")})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("taskTitle")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("assignee")}
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
              {filteredTasks.map((task) => {
                const assignee = members.find((m) => m.id === task.assignee);
                const project = projects.find((p) => p.id === task.project);

                return (
                  <tr
                    key={task.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {task.title}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {assignee?.name || "Unassigned"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                      {project?.name || "No Project"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.status === "completed"
                            ? "bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"
                            : task.status === "progress"
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                            : task.status === "review"
                            ? "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {t(task.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === "urgent"
                            ? "bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200"
                            : task.priority === "high"
                            ? "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"
                            : task.priority === "medium"
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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

export default AdminReports;
