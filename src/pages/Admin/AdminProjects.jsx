import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addProject,
  updateProject,
  deleteProject,
} from "../../store/slices/projectSlice";
import { useTranslation } from "../../utils/translations";
import { generateId, calculateProgress } from "../../utils/helpers";
import { PlusIcon, FolderIcon } from "@heroicons/react/24/outline";
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
      toast.success(t("projectDeleted"));
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
        toast.success(t("projectCreated"));
      } else {
        projectData.id = selectedProject.id;
        projectData.createdAt = selectedProject.createdAt;
        projectData.createdBy = selectedProject.createdBy;
        projectData.progress = selectedProject.progress;

        dispatch(updateProject(projectData));
        toast.success(t("projectUpdated"));
      }

      setIsModalOpen(false);
    } catch {
      toast.error(t("serverError"));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("projects")}
        </h1>
        <Button
          onClick={handleCreateProject}
          icon={<PlusIcon className="h-5 w-5" />}
        >
          {t("add")} {t("project")}
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          // const projectTasks = getProjectTasks(project.id);
          const progress = getProjectProgress(project.id);
          const teamMembersData = members.filter((member) =>
            project.teamMembers?.includes(member.id)
          );

          return (
            <Card key={project.id} className="project-card">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                    <FolderIcon className={`h-8 w-8 text-primary-600 ${language === 'ar' ? 'ml-3' : 'mr-3'}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <Badge
                        variant={
                          project.status === "completed"
                            ? "success"
                            : project.status === "progress"
                            ? "primary"
                            : project.status === "on-hold"
                            ? "warning"
                            : "default"
                        }
                        size="small"
                      >
                        {t(project.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProject(project)}
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
                      onClick={() => handleDeleteProject(project.id)}
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
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("progress")}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Team Members */}
                {teamMembersData.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {teamMembersData.slice(0, 3).map((member) => (
                        <Avatar
                          key={member.id}
                          name={member.name}
                          src={member.avatar}
                          size="small"
                          className="border-2 border-white dark:border-gray-800"
                        />
                      ))}
                    </div>
                    {teamMembersData.length > 3 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{teamMembersData.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? t("createProject") : t("editProject")}
      >
        <ProjectForm
          formData={formData}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onTeamMemberToggle={handleTeamMemberToggle}
          mode={modalMode}
        />
      </Modal>
    </div>
  );
};

export default AdminProjects;
