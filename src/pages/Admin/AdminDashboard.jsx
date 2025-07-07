import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../../store/slices/taskSlice";
import { setProjects } from "../../store/slices/projectSlice";
import { setMembers } from "../../store/slices/teamSlice";
import { useTranslation } from "../../utils/translations";
import { getTaskStats } from "../../utils/helpers";
import { mockTasks, mockProjects, mockUsers } from "../../utils/mockData";
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Card from "../../components/Common/Card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { members } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  useEffect(() => {
    // Load initial data
    dispatch(setTasks(mockTasks));
    dispatch(setProjects(mockProjects));
    dispatch(setMembers(mockUsers));
  }, [dispatch]);

  const stats = getTaskStats(tasks);
  const activeProjects = projects.filter((p) => p.status === "progress").length;
  const totalMembers = members.length;

  const statsCards = [
    {
      title: t("totalTasks"),
      value: stats.total,
      icon: ClipboardDocumentListIcon,
      color: "text-primary-600",
      bg: "bg-primary-100 dark:bg-primary-800",
    },
    {
      title: t("completedTasks"),
      value: stats.completed,
      icon: CheckCircleIcon,
      color: "text-success-600",
      bg: "bg-success-100 dark:bg-success-800",
    },
    {
      title: t("overdueTasks"),
      value: stats.overdue,
      icon: ClockIcon,
      color: "text-error-600",
      bg: "bg-error-100 dark:bg-error-800",
    },
    {
      title: t("activeProjects"),
      value: activeProjects,
      icon: FolderIcon,
      color: "text-secondary-600",
      bg: "bg-secondary-100 dark:bg-secondary-800",
    },
    {
      title: t("teamMembers"),
      value: totalMembers,
      icon: UsersIcon,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-800",
    },
  ];

  // Task Status Chart Data
  const chartData = {
    labels: [t("todo"), t("progress"), t("review"), t("completed")],
    datasets: [
      {
        label: t("tasks"),
        data: [stats.todo, stats.progress, stats.review, stats.completed],
        backgroundColor: ["#6b7280", "#3b82f6", "#f59e0b", "#22c55e"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        rtl: isRTL,
        textDirection: isRTL ? "rtl" : "ltr",
      },
      tooltip: {
        rtl: isRTL,
        textDirection: isRTL ? "rtl" : "ltr",
      },
    },
    scales: {
      x: {
        reverse: isRTL,
      },
    },
  };

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Welcome Message */}
      <div className={`${isRTL ? "text-right" : "text-left"}`}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isRTL
            ? `${t("welcome")} ${user?.name}`
            : `${t("welcome")}, ${user?.name}!`}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t("adminDashboardWelcome")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="stats-card">
            <div className="flex items-center">
              <div className={`stats-card-icon ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`${isRTL ? "mr-4" : "ml-4"}`}>
                <p className="stats-card-value">{stat.value}</p>
                <p className="stats-card-label text-xs">{stat.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Chart */}
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("taskOverview")}
          </h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Recent Projects */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("recentProjects")}
          </h2>
          <div className="space-y-3">
            {projects.slice(0, 5).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isRTL
                      ? `${project.progress}% ${t("complete")}`
                      : `${t("complete")} %${project.progress}`}
                  </p>
                </div>
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-primary-600 rounded-full"
                    style={{
                      width: `${project.progress}%`,
                      marginLeft: isRTL ? "auto" : 0,
                      marginRight: isRTL ? 0 : "auto",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("teamPerformance")}
        </h2>
        <div className="overflow-x-auto">
          <table
            className={`w-full text-sm ${isRTL ? "text-right" : "text-left"}`}
          >
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("teamMember")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("assignedTasks")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("completedTasks")}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t("completion")}
                </th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter((member) => member.role === "employee")
                .map((member) => {
                  const memberTasks = tasks.filter(
                    (task) => task.assignee === member.id
                  );
                  const completedTasks = memberTasks.filter(
                    (task) => task.status === "completed"
                  );
                  const completionRate =
                    memberTasks.length > 0
                      ? Math.round(
                          (completedTasks.length / memberTasks.length) * 100
                        )
                      : 0;

                  return (
                    <tr
                      key={member.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {member.name}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {memberTasks.length}
                      </td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {completedTasks.length}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div
                            className={`w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full ${
                              isRTL ? "ml-2" : "mr-2"
                            }`}
                          >
                            <div
                              className="h-2 bg-success-600 rounded-full"
                              style={{
                                width: `${completionRate}%`,
                                marginRight: isRTL ? 0 : "auto",
                                marginLeft: isRTL ? "auto" : 0,
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {isRTL
                              ? `%${completionRate}`
                              : `${completionRate}%`}
                          </span>
                        </div>
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

export default AdminDashboard;
