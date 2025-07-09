import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "../../store/slices/taskSlice";
import { setProjects } from "../../store/slices/projectSlice";
import { useTranslation } from "../../utils/translations";
import { getTaskStats } from "../../utils/helpers";
import { mockTasks, mockProjects } from "../../utils/mockData";
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
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

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  useEffect(() => {
    // Load initial data
    dispatch(setTasks(mockTasks));
    dispatch(setProjects(mockProjects));
  }, [dispatch]);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter((task) => task.assignee === user?.id);
  const stats = getTaskStats(myTasks);
  const myProjects = projects.filter((project) =>
    myTasks.some((task) => task.project === project.id)
  );
  const activeProjects = myProjects.filter(
    (p) => p.status === "progress"
  ).length;

  const statsCards = [
    {
      title: t("totalTasks"),
      value: stats.total,
      icon: ClipboardDocumentListIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-primary-400 to-primary-600",
      shadow: "shadow-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("completedTasks"),
      value: stats.completed,
      icon: CheckCircleIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-success-400 to-success-600",
      shadow: "shadow-success-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("overdueTasks"),
      value: stats.overdue,
      icon: ClockIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-error-400 to-error-600",
      shadow: "shadow-lg",
      animation: "animate-bounce-in",
    },
    {
      title: t("activeProjects"),
      value: activeProjects,
      icon: FolderIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-info-400 to-info-600",
      shadow: "shadow-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("pendingTasks"),
      value: stats.todo,
      icon: ExclamationTriangleIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-warning-400 to-warning-600",
      shadow: "shadow-warning-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("reviewTasks"),
      value: stats.review,
      icon: ExclamationTriangleIcon,
      color: "text-white",
      bg: "bg-gradient-to-br from-accent-400 to-accent-600",
      shadow: "shadow-warning-glow",
      animation: "animate-bounce-in",
    },
  ];

  // Task Status Chart Data
  const chartData = {
    labels: [t("todo"), t("progress"), t("review"), t("completed")],
    datasets: [
      {
        label: t("tasks"),
        data: [stats.todo, stats.progress, stats.review, stats.completed],
        backgroundColor: [
          "#f39532", // primary-400
          "#0ea5e9", // info-500
          "#f59e0b", // warning-500
          "#10b981", // success-500
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 8,
        hoverBackgroundColor: [
          "#f0760a", // primary-500
          "#0284c7", // info-600
          "#d97706", // warning-600
          "#059669", // success-600
        ],
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
        rtl: isRTL,
        textDirection: isRTL ? "rtl" : "ltr",
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
    scales: {
      x: {
        reverse: isRTL,
        grid: {
          display: false,
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: document.documentElement.classList.contains("dark")
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: document.documentElement.classList.contains("dark")
            ? "#ffffff"
            : "#000000",
          font: {
            size: 11,
            weight: "500",
          },
        },
      },
    },
  };

  return (
    <div
      className={`space-y-8 p-6 min-h-screen from-neutral-50 via-primary-50/30 to-accent-50/20 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 ${
        isRTL ? "rtl" : "ltr"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Welcome Message with Sparkles */}
      <div
        className={`${
          isRTL ? "text-right" : "text-left"
        } animate-fade-in p-6 rounded-2xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-primary-200/30 shadow-lg`}
      >
        <div className="flex items-center gap-3 mb-2">
          <SparklesIcon className="h-8 w-8 text-primary-500 animate-pulse-slow" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-accent-500 to-info-500 bg-clip-text text-transparent">
            {isRTL
              ? `${t("welcome")} ${user?.name}`
              : `${t("welcome")}, ${user?.name}!`}
          </h1>
        </div>
        <p className="text-lg text-neutral-700 dark:text-neutral-300 font-medium">
          {t("dashboardWelcome")}
        </p>
      </div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={stat.title}
            className={`
              ${stat.animation} ${stat.shadow} 
              hover:scale-105 hover:shadow-xl transition-all duration-300 
              border-2 border-white/50 overflow-hidden relative group cursor-pointer
            `}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`absolute inset-0 ${stat.bg}`} />
            <div className="relative z-10 p-6">
              <div className={`flex items-center ${isRTL ? "flex-row" : ""}`}>
                <div className="p-3 rounded-xl bg-white/30 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 border border-white/50">
                  <stat.icon
                    className={`h-8 w-8 ${stat.color} group-hover:animate-wiggle drop-shadow-sm`}
                  />
                </div>
                <div className={`${isRTL ? "mr-4" : "ml-4"} text-white`}>
                  <p className="text-3xl font-bold mb-1 group-hover:animate-pulse drop-shadow-sm">
                    {stat.value}
                  </p>
                  <p className="text-sm opacity-95 font-medium drop-shadow-sm">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Task Status Chart */}
        <Card className="lg:col-span-2 animate-slide-in shadow-xl border-2 border-primary-200/30 bg-white dark:bg-neutral-800">
          <div className="flex items-center gap-3 mb-6 p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="p-2 rounded-lg bg-gradient-to-r from-primary-400 to-primary-600">
              <TrophyIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t("taskOverview")}
            </h2>
          </div>
          <div className="h-80 p-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* Enhanced Recent Projects */}
        <Card className="animate-slide-in shadow-xl border-2 border-accent-200/30 bg-white dark:bg-neutral-800">
          <div className="flex items-center gap-3 mb-6 p-6 border-b border-neutral-200 dark:border-neutral-700">
            <div className="p-2 rounded-lg bg-gradient-to-r from-accent-400 to-accent-600">
              <FolderIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t("myProjects")}
            </h2>
          </div>
          <div className="space-y-4 p-6">
            {myProjects.slice(0, 5).map((project, index) => (
              <div
                key={project.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl
                  bg-gradient-to-r from-neutral-50 to-accent-50/50 
                  dark:from-neutral-700 dark:to-neutral-600
                  border border-accent-200/30 dark:border-neutral-600
                  hover:shadow-lg transition-all duration-300
                  hover:scale-105 animate-fade-in hover:border-accent-400/50
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {project.name}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {isRTL
                      ? `${project.progress}% ${t("complete")}`
                      : `${project.progress}% ${t("complete")}`}
                  </p>
                </div>
                <div className="w-20 h-3 bg-neutral-200 dark:bg-neutral-600 rounded-full overflow-hidden border border-neutral-300 dark:border-neutral-500">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-1000 ease-out
                      ${
                        project.progress > 80
                          ? "bg-gradient-to-r from-success-400 to-success-600"
                          : project.progress > 50
                          ? "bg-gradient-to-r from-primary-400 to-primary-600"
                          : "bg-gradient-to-r from-warning-400 to-warning-600"
                      }
                    `}
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
    </div>
  );
};

export default EmployeeDashboard;
