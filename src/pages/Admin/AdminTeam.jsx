import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMember,
  updateMember,
  deleteMember,
} from "../../store/slices/teamSlice";
import { useTranslation } from "../../utils/translations";
import {
  generateId,
  validateEmail,
  validateRequired,
} from "../../utils/helpers";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  SparklesIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import TeamMemberForm from "../../components/forms/adminForms/TeamMemberForm";
import toast from "react-hot-toast";

const AdminTeam = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.team);
  const { tasks } = useSelector((state) => state.tasks);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "employee",
    department: "",
    position: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleCreateMember = () => {
    setSelectedMember(null);
    setModalMode("create");
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "employee",
      department: "",
      position: "",
    });
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setModalMode("edit");
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      department: member.department || "",
      position: member.position || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    const memberTasks = tasks.filter((task) => task.assignee === memberId);

    if (memberTasks.length > 0) {
      toast.error(t("cannotDeleteMemberWithTasks"));
      return;
    }

    if (confirm(t("confirmDelete"))) {
      dispatch(deleteMember(memberId));
      toast.success(t("memberDeleted"));
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

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = t("requiredField");
    }

    if (!validateRequired(formData.email)) {
      newErrors.email = t("requiredField");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("invalidEmail");
    } else {
      // Check for duplicate email
      const existingMember = members.find(
        (member) =>
          member.email === formData.email &&
          (modalMode === "create" || member.id !== selectedMember?.id)
      );
      if (existingMember) {
        newErrors.email = t("emailAlreadyExists");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const memberData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (modalMode === "create") {
        memberData.id = generateId();
        memberData.createdAt = new Date().toISOString();
        memberData.avatar = null;
        memberData.preferences = {
          workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          reportTime: "09:00",
          timezone: "UTC",
        };

        dispatch(addMember(memberData));
        toast.success(t("memberAdded"));
      } else {
        memberData.id = selectedMember.id;
        memberData.createdAt = selectedMember.createdAt;
        memberData.avatar = selectedMember.avatar;
        memberData.preferences = selectedMember.preferences;

        dispatch(updateMember(memberData));
        toast.success(t("memberUpdated"));
      }

      setIsModalOpen(false);
    } catch {
      toast.error(t("serverError"));
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: t("totalMembers"),
      value: members.length,
      icon: UserPlusIcon,
      bg: "bg-gradient-to-br from-primary-400 to-primary-600",
      color: "text-white",
      shadow: "shadow-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("totalTeams"),
      value: [...new Set(members.map(m => m.department))].length,
      icon: SparklesIcon,
      bg: "bg-gradient-to-br from-accent-400 to-accent-600",
      color: "text-white",
      shadow: "shadow-accent-glow",
      animation: "animate-bounce-in",
    },
    {
      title: t("totalTasks"),
      value: tasks.length,
      icon: FireIcon,
      bg: "bg-gradient-to-br from-warning-400 to-warning-600",
      color: "text-white",
      shadow: "shadow-warning-glow",
      animation: "animate-bounce-in",
    },
  ];

  return (
    <div
      className={`space-y-8 p-6 min-h-screen ${directionClass} animate-fade-in`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex items-center ${
          isRTL ? "flex-row" : ""
        } justify-between animate-slide-down`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <UserGroupIcon className="h-10 w-10 text-primary-500 animate-bounce-in" />
            <SparklesIcon className="h-4 w-4 text-accent-400 absolute -top-1 -right-1 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-happy bg-clip-text text-transparent">
              {t("team")}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              {t("teamDescription")}
            </p>
          </div>
        </div>
        <Button
          onClick={handleCreateMember}
          icon={<UserPlusIcon className="h-5 w-5 animate-bounce-light" />}
          variant="primary"
          className="hover:scale-105 transform transition-all duration-300 hover:shadow-lg"
        >
          {t("addMember")}
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Team Members Grid */}
      <Card className="transform hover:scale-[1.01] transition-all duration-300 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          {t("teamMembers")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`flex items-center ${
                  isRTL
                    ? "flex-row space-x-reverse space-x-4"
                    : "space-x-4"
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      member.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=f0760a&color=fff`
                    }
                    alt={member.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-800 transform group-hover:scale-110 transition-all duration-300"
                  />
                  {member.status === "active" && (
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success-500 border-2 border-white dark:border-neutral-800 animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-500 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.role}
                  </p>
                  <div
                    className={`flex items-center mt-2 ${
                      isRTL
                        ? "flex-row space-x-reverse space-x-2"
                        : "space-x-2"
                    }`}
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("tasks")}: {member.tasks?.length || 0}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      •
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("projects")}: {member.projects?.length || 0}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex ${
                    isRTL
                      ? "flex-row space-x-reverse space-x-2"
                      : "flex-col space-y-2"
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditMember(member)}
                    className="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-300 hover:scale-110 transform"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMember(member.id)}
                    className="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400 transition-colors duration-300 hover:scale-110 transform"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Member Progress */}
              <div className="mt-4">
                <div
                  className={`flex items-center ${
                    isRTL ? "flex-row" : ""
                  } justify-between mb-2`}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("taskCompletion")}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {member.tasks?.length > 0
                      ? Math.round(
                          (member.tasks.filter((t) => t.status === "completed")
                            .length /
                            member.tasks.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000 ease-out animate-pulse-slow"
                    style={{
                      width: `${
                        member.tasks?.length > 0
                          ? Math.round(
                              (member.tasks.filter(
                                (t) => t.status === "completed"
                              ).length /
                                member.tasks.length) *
                                100
                            )
                          : 0
                      }%`,
                      marginLeft: isRTL ? "auto" : 0,
                      marginRight: isRTL ? 0 : "auto",
                      direction: isRTL ? "rtl" : "ltr",
                    }}
                  />
                </div>
              </div>

              {/* Skills Tags */}
              {member.skills && member.skills.length > 0 && (
                <div className="mt-4">
                  <div
                    className={`flex flex-wrap gap-2 ${
                      isRTL ? "justify-end" : "justify-start"
                    }`}
                  >
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 text-xs rounded-full bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 dark:from-primary-900/30 dark:to-primary-800/30 dark:text-primary-200 transform hover:scale-110 transition-all duration-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Member Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMember ? t("editMember") : t("addMember")}
        className="animate-fade-in-up"
      >
        <TeamMemberForm
          formData={formData}
          errors={errors}
          loading={loading}
          onSubmit={handleSubmit}
          onChange={handleChange}
          mode={modalMode}
          isRTL={isRTL}
        />
      </Modal>
    </div>
  );
};

export default AdminTeam;
