import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProject,
  updateProject,
  deleteProject,
} from "../../store/slices/projectSlice";
import { useTranslation } from "../../utils/translations";
import { generateId, calculateProgress } from "../../utils/helpers";
import {
  PlusIcon,
  FolderIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import Badge from "../../components/Common/Badge";
import Avatar from "../../components/Common/Avatar";
import ProjectForm from "../../components/forms/adminForms/ProjectForm";
import toast from "react-hot-toast";

const AdminProjects = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { members } = useSelector((state) => state.team);
  const { tasks } = useSelector((state) => state.tasks);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    status: "planning",
    teamMembers: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCreateProject = () => {
    setSelectedProject(null);
    setModalMode("create");
    setFormData({
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      status: "planning",
      teamMembers: [],
    });
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setModalMode("edit");
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate ? new Date(project.startDate) : null,
      endDate: project.endDate ? new Date(project.endDate) : null,
      status: project.status,
      teamMembers: project.teamMembers || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId) => {
    if (confirm(t("confirmDelete"))) {
      dispatch(deleteProject(projectId));
      toast.success(t("projectDeleted"), {
        icon: "🗑️",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
          color: "#fff",
        },
      });
    }
  };

  const handleChange = (field, value) => {
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

  const handleTeamMemberToggle = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter((id) => id !== memberId)
        : [...prev.teamMembers, memberId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("requiredField");
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.startDate > formData.endDate
    ) {
      newErrors.endDate = t("endDateMustBeAfterStartDate");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const projectData = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toISOString() : null,
        endDate: formData.endDate ? formData.endDate.toISOString() : null,
        updatedAt: new Date().toISOString(),
      };

      if (modalMode === "create") {
        projectData.id = generateId();
        projectData.createdAt = new Date().toISOString();
        projectData.createdBy = "1"; // Current user ID
        projectData.progress = 0;

        dispatch(addProject(projectData));
        toast.success(t("projectCreated"), {
          icon: "🚀",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f0760a 0%, #10b981 100%)",
            color: "#fff",
          },
        });
      } else {
        projectData.id = selectedProject.id;
        projectData.createdAt = selectedProject.createdAt;
        projectData.createdBy = selectedProject.createdBy;
        projectData.progress = selectedProject.progress;

        dispatch(updateProject(projectData));
        toast.success(t("projectUpdated"), {
          icon: "✨",
          style: {
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)",
            color: "#fff",
          },
        });
      }

      setIsModalOpen(false);
    } catch {
      toast.error(t("serverError"), {
        icon: "💥",
        style: {
          borderRadius: "12px",
          background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter((task) => task.project === projectId);
  };

  const getProjectProgress = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    return calculateProgress(projectTasks);
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        variant: "success",
        icon: StarIcon,
        gradient: "from-success-400 to-success-600",
        glow: "shadow-success-glow",
      },
      progress: {
        variant: "primary",
        icon: RocketLaunchIcon,
        gradient: "from-primary-400 to-primary-600",
        glow: "shadow-glow",
      },
      "on-hold": {
        variant: "warning",
        icon: FireIcon,
        gradient: "from-warning-400 to-warning-600",
        glow: "shadow-lg",
      },
      planning: {
        variant: "default",
        icon: SparklesIcon,
        gradient: "from-accent-400 to-accent-600",
        glow: "shadow-accent-glow",
      },
    };
    return configs[status] || configs.planning;
  };

  const statsCards = [
    {
      title: t("totalProjects"),
      value: projects.length,
      icon: FolderIcon,
      bg: "bg-gradient-to-br from-primary-400 to-primary-600",
      color: "text-white",
      animation: "animate-bounce-in",
      shadow: "shadow-primary-glow",
    },
    {
      title: t("activeProjects"),
      value: projects.filter((p) => p.status === "progress").length,
      icon: RocketLaunchIcon,
      bg: "bg-gradient-to-br from-success-400 to-success-600",
      color: "text-white",
      animation: "animate-bounce-in",
      shadow: "shadow-success-glow",
    },
    {
      title: t("completedProjects"),
      value: projects.filter((p) => p.status === "completed").length,
      icon: StarIcon,
      bg: "bg-gradient-to-br from-accent-400 to-accent-600",
      color: "text-white",
      animation: "animate-bounce-in",
      shadow: "shadow-accent-glow",
    },
  ];

  return (
    <div
      className={`space-y-8 p-6 min-h-screen ${directionClass} animate-fade-in`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated Header */}
      <div
        className={`flex items-center ${
          isRTL ? "flex-row" : ""
        } justify-between animate-fade-in`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <FolderIcon className="h-10 w-10 text-primary-500 animate-bounce-in" />
            <SparklesIcon className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-happy bg-clip-text text-transparent">
              {t("projects")}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {t("manageYourProjects")}
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateProject}
          icon={<PlusIcon className="h-5 w-5" />}
          className="animate-bounce-in shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary-500 to-primary-600 border-0"
          isRTL={isRTL}
        >
          {t("add")} {t("project")}
        </Button>
      </div>

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

      {/* Enhanced Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => {
          const progress = getProjectProgress(project.id);
          const teamMembersData = members.filter((member) =>
            project.teamMembers?.includes(member.id)
          );
          const statusConfig = getStatusConfig(project.status);

          return (
            <Card
              key={project.id}
              className={`
                animate-bounce-in hover:scale-105 transition-all duration-300 
                ${statusConfig.glow} border-0 bg-gradient-to-br from-white to-neutral-50 
                dark:from-neutral-800 dark:to-neutral-900 overflow-hidden group
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-6 relative">
                {/* Decorative Element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />

                {/* Header */}
                <div
                  className={`flex items-start ${
                    isRTL ? "flex-row-reverse" : ""
                  } justify-between relative z-10`}
                >
                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                    }`}
                  >
                    <div
                      className={`
                      p-3 rounded-xl bg-gradient-to-br ${statusConfig.gradient} 
                      group-hover:scale-110 transition-transform duration-300
                    `}
                    >
                      <FolderIcon className="h-8 w-8 text-white group-hover:animate-wiggle" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                        {project.name}
                      </h3>
                      <Badge
                        variant={statusConfig.variant}
                        size="small"
                        className="animate-pulse-slow"
                      >
                        <statusConfig.icon className="h-3 w-3 mr-1" />
                        {t(project.status)}
                      </Badge>
                    </div>
                  </div>

                  <div
                    className={`flex items-center ${
                      isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                  >
                    <button
                      onClick={() => handleEditProject(project)}
                      className={`
                        p-2 rounded-lg text-neutral-400 hover:text-white transition-all duration-300
                        hover:bg-gradient-to-r hover:from-primary-400 hover:to-primary-600
                        hover:scale-110 hover:shadow-glow
                      `}
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
                      onClick={() => handleDeleteProject(project.id)}
                      className={`
                        p-2 rounded-lg text-neutral-400 hover:text-white transition-all duration-300
                        hover:bg-gradient-to-r hover:from-error-400 hover:to-error-600
                        hover:scale-110 hover:shadow-lg
                      `}
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
                {project.description && (
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed relative z-10">
                    {project.description}
                  </p>
                )}

                {/* Progress */}
                <div className="relative z-10">
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    } justify-between mb-2`}
                  >
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {t("progress")}
                    </span>
                    <span
                      className={`
                      text-sm font-bold px-2 py-1 rounded-full
                      ${
                        progress > 80
                          ? "text-success-600 bg-success-100 dark:bg-success-900/30"
                          : progress > 50
                          ? "text-primary-600 bg-primary-100 dark:bg-primary-900/30"
                          : "text-warning-600 bg-warning-100 dark:bg-warning-900/30"
                      }
                    `}
                    >
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className={`
                        h-full rounded-full transition-all duration-1000 ease-out
                        ${
                          progress > 80
                            ? "bg-gradient-to-r from-success-400 to-success-600"
                            : progress > 50
                            ? "bg-gradient-to-r from-primary-400 to-primary-600"
                            : "bg-gradient-to-r from-warning-400 to-warning-600"
                        }
                      `}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Members */}
                {teamMembersData.length > 0 && (
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      {t("teamMembers")}
                    </p>
                    <div
                      className={`flex ${
                        isRTL ? "flex-row-reverse" : ""
                      } -space-x-2`}
                    >
                      {teamMembersData
                        .slice(0, 4)
                        .map((member, memberIndex) => (
                          <div
                            key={member.id}
                            className="relative group/member"
                          >
                            <Avatar
                              name={member.name}
                              size="small"
                              className={`
                              border-2 border-white dark:border-neutral-800 
                              hover:scale-110 transition-transform duration-300
                              animate-bounce-in
                            `}
                              style={{
                                animationDelay: `${memberIndex * 100}ms`,
                              }}
                            />
                            <div
                              className={`
                            absolute -top-10 left-1/2 transform -translate-x-1/2 
                            bg-neutral-800 text-white text-xs py-1 px-2 rounded 
                            opacity-0 group-hover/member:opacity-100 transition-opacity duration-300
                            pointer-events-none z-50
                          `}
                            >
                              {member.name}
                            </div>
                          </div>
                        ))}
                      {teamMembersData.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 flex items-center justify-center border-2 border-white dark:border-neutral-800 text-white text-xs font-bold">
                          +{teamMembersData.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div
              className={`
              p-2 rounded-lg 
              ${
                modalMode === "create"
                  ? "bg-gradient-to-r from-primary-400 to-primary-600"
                  : "bg-gradient-to-r from-accent-400 to-accent-600"
              }
            `}
            >
              <FolderIcon className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-happy bg-clip-text text-transparent font-bold">
              {modalMode === "create" ? t("createProject") : t("editProject")}
            </span>
          </div>
        }
        className="animate-bounce-in shadow-glow-lg border-0"
      >
        <div className="p-2 rounded-xl bg-transparent">
          <ProjectForm
            formData={formData}
            errors={errors}
            loading={loading}
            onSubmit={handleSubmit}
            onChange={handleChange}
            onTeamMemberToggle={handleTeamMemberToggle}
            isRTL={isRTL}
            mode={modalMode}
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminProjects;
