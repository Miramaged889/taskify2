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
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import Card from "../../components/Common/Card";
import Select from "../../components/Common/Select";
import DatePicker from "../../components/Common/DatePicker";
import Button from "../../components/Common/Button";
import {
  DocumentArrowDownIcon,
  DocumentChartBarIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { teams } from "../../utils/mockData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminReports = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { members } = useSelector((state) => state.team);
  const { projects } = useSelector((state) => state.projects);
  const { role, teamId, user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [filters, setFilters] = useState({
    employee: "all",
    project: "all",
    status: "all",
    priority: "all",
    team: role === "account_manager" ? teamId : "all",
    dateRange: {
      start: null,
      end: null,
    },
  });

  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonTeam, setComparisonTeam] = useState("");

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

  // Get available teams for filtering
  const availableTeams = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  // Filter tasks based on current filters
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Filter by team
    if (filters.team !== "all") {
      const team = teams.find((t) => t.id === filters.team);
      if (team) {
        filteredTasks = filteredTasks.filter((task) =>
          team.members.includes(task.assignee)
        );
      }
    }

    // Filter by employee
    if (filters.employee !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.assignee === filters.employee
      );
    }

    // Filter by project
    if (filters.project !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.project === filters.project
      );
    }

    // Filter by status
    if (filters.status !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }

    // Filter by priority
    if (filters.priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }

    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      filteredTasks = filteredTasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return taskDate >= startDate && taskDate <= endDate;
      });
    }

    return filteredTasks;
  };

  const filteredTasks = getFilteredTasks();

  // Get comparison team data
  const getComparisonTeamData = () => {
    if (!comparisonTeam || comparisonTeam === filters.team) {
      return null;
    }

    const team = teams.find((t) => t.id === comparisonTeam);
    if (!team) return null;

    const comparisonTasks = tasks.filter((task) =>
      team.members.includes(task.assignee)
    );
    return getTaskStats(comparisonTasks);
  };

  const comparisonStats = getComparisonTeamData();

  // Get team members for employee filter
  const getTeamMembers = () => {
    if (filters.team === "all") {
      return members.filter((m) => m.role === "employee");
    }

    const team = teams.find((t) => t.id === filters.team);
    if (team) {
      return members.filter(
        (m) => team.members.includes(m.id) && m.role === "employee"
      );
    }

    return [];
  };

  const teamMembers = getTeamMembers();

  // Get projects for project filter
  const getTeamProjects = () => {
    if (filters.team === "all") {
      return projects;
    }

    const team = teams.find((t) => t.id === filters.team);
    if (team) {
      const teamMemberIds = team.members;
      return projects.filter((project) =>
        teamMemberIds.some((memberId) => project.assignees?.includes(memberId))
      );
    }

    return [];
  };

  const teamProjects = getTeamProjects();

  const stats = getTaskStats(filteredTasks);

  // Task Status Chart Data
  const statusChartData = {
    labels: [t("todo"), t("progress"), t("review"), t("completed")],
    datasets: [
      {
        label: t("tasks"),
        data: [stats.todo, stats.progress, stats.review, stats.completed],
        backgroundColor: ["#f39532", "#0ea5e9", "#f59e0b", "#10b981"],
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 8,
      },
    ],
  };

  // Priority Chart Data
  const priorityChartData = {
    labels: [t("low"), t("medium"), t("high"), t("urgent")],
    datasets: [
      {
        label: t("tasks"),
        data: [
          filteredTasks.filter((t) => t.priority === "low").length,
          filteredTasks.filter((t) => t.priority === "medium").length,
          filteredTasks.filter((t) => t.priority === "high").length,
          filteredTasks.filter((t) => t.priority === "urgent").length,
        ],
        backgroundColor: ["#10b981", "#f59e0b", "#f97316", "#ef4444"],
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 8,
      },
    ],
  };

  // Team Performance Chart Data (for comparison)
  const teamComparisonData = comparisonStats
    ? {
        labels: [t("todo"), t("progress"), t("review"), t("completed")],
        datasets: [
          {
            label:
              filters.team !== "all"
                ? teams.find((t) => t.id === filters.team)?.name
                : t("selectedTeam"),
            data: [stats.todo, stats.progress, stats.review, stats.completed],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "#3b82f6",
            borderWidth: 2,
            borderRadius: 8,
          },
          {
            label: teams.find((t) => t.id === comparisonTeam)?.name,
            data: [
              comparisonStats.todo,
              comparisonStats.progress,
              comparisonStats.review,
              comparisonStats.completed,
            ],
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderColor: "#10b981",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
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
        displayColors: true,
      },
    },
  };

  const handleExportData = () => {
    const exportData = filteredTasks.map((task) => ({
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignee:
        members.find((m) => m.id === task.assignee)?.name || task.assignee,
      project:
        projects.find((p) => p.id === task.project)?.name || task.project,
      dueDate: task.dueDate ? formatDate(new Date(task.dueDate)) : "",
      createdAt: task.createdAt ? formatDate(new Date(task.createdAt)) : "",
    }));

    exportToCsv(
      exportData,
      `task-report-${new Date().toISOString().split("T")[0]}`
    );
  };

  return (
    <div className="space-y-8 p-6 min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/20 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl shadow-lg">
            <DocumentChartBarIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("reports")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {role === "account_manager"
                ? t("teamPerformanceReports")
                : t("comprehensiveAnalytics")}
            </p>
          </div>
        </div>

        <Button
          onClick={handleExportData}
          className="px-6 py-3 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          {t("exportData")}
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-neutral-800 shadow-xl border-2 border-primary-200/30">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {t("filters")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Team Filter */}
            <Select
              label={t("team")}
              value={filters.team}
              onChange={(e) => handleFilterChange("team", e.target.value)}
              options={[
                { value: "all", label: t("allTeams") },
                ...availableTeams,
              ]}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />

            {/* Employee Filter */}
            <Select
              label={t("employee")}
              value={filters.employee}
              onChange={(e) => handleFilterChange("employee", e.target.value)}
              options={[
                { value: "all", label: t("allEmployees") },
                ...teamMembers.map((member) => ({
                  value: member.id,
                  label: member.name,
                })),
              ]}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />

            {/* Project Filter */}
            <Select
              label={t("project")}
              value={filters.project}
              onChange={(e) => handleFilterChange("project", e.target.value)}
              options={[
                { value: "all", label: t("allProjects") },
                ...teamProjects.map((project) => ({
                  value: project.id,
                  label: project.name,
                })),
              ]}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />

            {/* Status Filter */}
            <Select
              label={t("status")}
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              options={[
                { value: "all", label: t("allStatuses") },
                { value: "todo", label: t("todo") },
                { value: "progress", label: t("progress") },
                { value: "review", label: t("review") },
                { value: "completed", label: t("completed") },
              ]}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />

            {/* Priority Filter */}
            <Select
              label={t("priority")}
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              options={[
                { value: "all", label: t("allPriorities") },
                { value: "low", label: t("low") },
                { value: "medium", label: t("medium") },
                { value: "high", label: t("high") },
                { value: "urgent", label: t("urgent") },
              ]}
              className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
            />

            {/* Date Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("dateRange")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <DatePicker
                  selected={filters.dateRange.start}
                  onChange={(date) => handleFilterChange("dateStart", date)}
                  placeholderText={t("from")}
                  className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                />
                <DatePicker
                  selected={filters.dateRange.end}
                  onChange={(date) => handleFilterChange("dateEnd", date)}
                  placeholderText={t("to")}
                  className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Team Comparison Toggle - Only for sarah.wilson@example.com */}
          {user?.email?.toLowerCase() === "sarah.wilson@example.com" && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UsersIcon className="h-5 w-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("teamComparison")}
                  </h3>
                </div>
                <Button
                  onClick={() => setComparisonMode(!comparisonMode)}
                  variant={comparisonMode ? "primary" : "outline"}
                  className="px-4 py-2"
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  {comparisonMode
                    ? t("disableComparison")
                    : t("enableComparison")}
                </Button>
              </div>

              {comparisonMode && (
                <div className="mt-4">
                  <Select
                    label={t("compareWithTeam")}
                    value={comparisonTeam}
                    onChange={(e) => setComparisonTeam(e.target.value)}
                    options={[
                      { value: "", label: t("selectTeam") },
                      ...availableTeams.filter(
                        (team) => team.value !== filters.team
                      ),
                    ]}
                    className="bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-neutral-100"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 border-2 border-primary-200/30">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("totalTasks")}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-900/30 border-2 border-success-200/30">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("completedTasks")}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-900/30 border-2 border-warning-200/30">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">
              {stats.overdue}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("overdueTasks")}
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-info-50 to-info-100 dark:from-info-900/20 dark:to-info-900/30 border-2 border-info-200/30">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-info-600 dark:text-info-400 mb-2">
              {Math.round((stats.completed / stats.total) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t("completionRate")}
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Chart */}
        <Card className="bg-white dark:bg-neutral-800 shadow-xl border-2 border-primary-200/30">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("taskStatusDistribution")}
            </h3>
          </div>
          <div className="p-6 h-80">
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Priority Chart */}
        <Card className="bg-white dark:bg-neutral-800 shadow-xl border-2 border-primary-200/30">
          <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("taskPriorityDistribution")}
            </h3>
          </div>
          <div className="p-6 h-80">
            <Pie data={priorityChartData} options={chartOptions} />
          </div>
        </Card>

        {/* Team Comparison Chart */}
        {comparisonMode && comparisonTeam && teamComparisonData && (
          <Card className="lg:col-span-2 bg-white dark:bg-neutral-800 shadow-xl border-2 border-primary-200/30">
            <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t("teamPerformanceComparison")}
              </h3>
            </div>
            <div className="p-6 h-80">
              <Bar data={teamComparisonData} options={chartOptions} />
            </div>
          </Card>
        )}
      </div>

      {/* Detailed Task List */}
      <Card className="bg-white dark:bg-neutral-800 shadow-xl border-2 border-primary-200/30">
        <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("detailedTaskList")} ({filteredTasks.length})
          </h3>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-neutral-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("task")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("assignee")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("priority")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t("dueDate")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50 dark:hover:bg-neutral-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {members.find((m) => m.id === task.assignee)?.name ||
                        task.assignee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : task.status === "progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : task.status === "review"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}
                    >
                      {t(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.priority === "urgent"
                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          : task.priority === "high"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {t(task.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {task.dueDate ? formatDate(new Date(task.dueDate)) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;
