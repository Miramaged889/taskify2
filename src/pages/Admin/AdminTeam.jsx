import { useState, useMemo, useCallback } from "react";
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
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,

} from "@heroicons/react/24/outline";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Modal from "../../components/Common/Modal";
import Avatar from "../../components/Common/Avatar";
import Badge from "../../components/Common/Badge";
import Input from "../../components/Common/Input";
import Select from "../../components/Common/Select";
import TeamMemberForm from "../../components/forms/adminForms/TeamMemberForm";
import toast from "react-hot-toast";

const AdminTeam = () => {
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.team);
  const { tasks } = useSelector((state) => state.tasks);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  // Add RTL detection
  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterPerformance, setFilterPerformance] = useState("all");
  const [selectedView, setSelectedView] = useState("grid"); // grid, list, hierarchy
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

  // Get unique departments
  const departments = useMemo(() => {
    const depts = [
      ...new Set(members.map((m) => m.department).filter(Boolean)),
    ];
    return ["all", ...depts];
  }, [members]);

  const getMemberStats = useCallback(
    (memberId) => {
      const memberTasks = tasks.filter((task) => task.assignee === memberId);
      const completedTasks = memberTasks.filter(
        (task) => task.status === "completed"
      );
      const inProgressTasks = memberTasks.filter(
        (task) => task.status === "progress"
      );

      return {
        total: memberTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        completionRate:
          memberTasks.length > 0
            ? Math.round((completedTasks.length / memberTasks.length) * 100)
            : 0,
      };
    },
    [tasks]
  );

  // Filter and search members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = filterRole === "all" || member.role === filterRole;

      const matchesDepartment =
        filterDepartment === "all" || member.department === filterDepartment;

      const stats = getMemberStats(member.id);
      const matchesPerformance =
        filterPerformance === "all" ||
        (filterPerformance === "high" && stats.completionRate >= 75) ||
        (filterPerformance === "medium" &&
          stats.completionRate >= 50 &&
          stats.completionRate < 75) ||
        (filterPerformance === "low" && stats.completionRate < 50);

      return (
        matchesSearch && matchesRole && matchesDepartment && matchesPerformance
      );
    });
  }, [
    members,
    searchQuery,
    filterRole,
    filterDepartment,
    filterPerformance,
    getMemberStats,
  ]);

  // Calculate team performance metrics
  const teamMetrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const overdueTasks = tasks.filter((t) => {
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date() && t.status !== "completed";
    }).length;

    return {
      taskCompletion: totalTasks
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0,
      overdueTasks,
      activeProjects: [...new Set(tasks.map((t) => t.project))].length,
      avgTasksPerMember: Math.round(totalTasks / (members.length || 1)),
    };
  }, [tasks, members]);

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

  // Get member availability
  const getMemberAvailability = (member) => {
    const workDays = member.preferences?.workDays || [];
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return workDays.includes(today);
  };

  // Get member expertise level
  const getMemberExpertise = (member) => {
    const stats = getMemberStats(member.id);
    if (stats.completionRate >= 80) return "expert";
    if (stats.completionRate >= 60) return "advanced";
    if (stats.completionRate >= 40) return "intermediate";
    return "beginner";
  };

  return (
    <div className={`space-y-6 ${directionClass}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header with Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div
          className={`flex items-center ${
            isRTL ? "justify-between flex-row" : "justify-between"
          }`}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("teamManagement")}
          </h1>
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse space-x-2" : "space-x-2"
            }`}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedView("grid")}
              className={selectedView === "grid" ? "bg-primary-50 dark:bg-primary-900" : ""}
              title={t("gridView")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedView("list")}
              className={selectedView === "list" ? "bg-primary-50 dark:bg-primary-900" : ""}
              title={t("listView")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedView("hierarchy")}
              className={selectedView === "hierarchy" ? "bg-primary-50 dark:bg-primary-900" : ""}
              title={t("hierarchyView")}
            >
              <UserGroupIcon className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleCreateMember}
              className={`flex items-center ${
                isRTL ? "flex-row" : ""
              }`}
            >
              <PlusIcon className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
              <span>{t("add")} {t("member")}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder={t("searchMembers")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={
                <MagnifyingGlassIcon
                  className={`h-5 w-5 text-gray-400 ${
                    isRTL ? "transform rotate-180" : ""
                  }`}
                />
              }
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            options={[
              { value: "all", label: t("allRoles") },
              { value: "admin", label: t("admin") },
              { value: "employee", label: t("employee") },
            ]}
            className={isRTL ? "text-right" : "text-left"}
          />
          <Select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            options={departments.map((dept) => ({
              value: dept,
              label: dept === "all" ? t("allDepartments") : t(dept),
            }))}
            className={isRTL ? "text-right" : "text-left"}
          />
          <Select
            value={filterPerformance}
            onChange={(e) => setFilterPerformance(e.target.value)}
            options={[
              { value: "all", label: t("allPerformance") },
              { value: "high", label: t("highPerformance") },
              { value: "medium", label: t("mediumPerformance") },
              { value: "low", label: t("lowPerformance") },
            ]}
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {members.length}
              </div>
              <div className="text-sm text-primary-700 dark:text-primary-300">
                {t("totalMembers")}
              </div>
            </div>
            <UserGroupIcon className="h-8 w-8 text-primary-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900 dark:to-success-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                {teamMetrics.taskCompletion}%
              </div>
              <div className="text-sm text-success-700 dark:text-success-300">
                {t("taskCompletion")}
              </div>
            </div>
            <ChartBarIcon className="h-8 w-8 text-success-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900 dark:to-warning-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                {teamMetrics.activeProjects}
              </div>
              <div className="text-sm text-warning-700 dark:text-warning-300">
                {t("activeProjects")}
              </div>
            </div>
            <BriefcaseIcon className="h-8 w-8 text-warning-500" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-error-50 to-error-100 dark:from-error-900 dark:to-error-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-error-600 dark:text-error-400">
                {teamMetrics.overdueTasks}
              </div>
              <div className="text-sm text-error-700 dark:text-error-300">
                {t("overdueTasks")}
              </div>
            </div>
            <CalendarIcon className="h-8 w-8 text-error-500" />
          </div>
        </Card>
      </div>

      {/* Team Members View */}
      {selectedView === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const stats = getMemberStats(member.id);
            const isAvailable = getMemberAvailability(member);
            const expertise = getMemberExpertise(member);

            return (
              <Card
                key={member.id}
                className={`team-card relative overflow-hidden ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {/* Status Indicator */}
                <div
                  className={`absolute top-4 ${
                    isRTL ? "left-4" : "right-4"
                  } h-3 w-3 rounded-full ${
                    isAvailable ? "bg-success-500" : "bg-gray-300"
                  }`}
                />

                <div className="space-y-4">
                  {/* Header */}
                  <div
                    className={`flex items-start ${
                      isRTL ? "space-x-reverse space-x-4" : "space-x-4"
                    }`}
                  >
                    <Avatar
                      name={member.name}
                      src={member.avatar}
                      size="large"
                      className="ring-2 ring-offset-2 ring-primary-500"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {member.name}
                      </h3>
                      <div
                        className={`flex items-center ${
                          isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                        }`}
                      >
                        <Badge
                          variant={
                            member.role === "admin" ? "primary" : "default"
                          }
                          size="small"
                        >
                          {t(member.role)}
                        </Badge>
                        <Badge
                          variant={
                            expertise === "expert"
                              ? "success"
                              : expertise === "advanced"
                              ? "warning"
                              : expertise === "intermediate"
                              ? "info"
                              : "default"
                          }
                          size="small"
                        >
                          {t(expertise)}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  {/* Contact & Role Info */}
                  <div className="space-y-2 text-sm">
                    <div
                      className={`flex items-center text-gray-500 dark:text-gray-400 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      <EnvelopeIcon
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {member.email}
                    </div>
                    {member.phone && (
                      <div
                        className={`flex items-center text-gray-500 dark:text-gray-400 ${
                          isRTL ? "space-x-reverse" : ""
                        }`}
                      >
                        <PhoneIcon
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {member.phone}
                      </div>
                    )}
                    {member.department && (
                      <div
                        className={`flex items-center text-gray-500 dark:text-gray-400 ${
                          isRTL ? "space-x-reverse" : ""
                        }`}
                      >
                        <BriefcaseIcon
                          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                        />
                        {t(member.department)} • {member.position}
                      </div>
                    )}
                    <div
                      className={`flex items-center text-gray-500 dark:text-gray-400 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      <MapPinIcon
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {member.location}
                    </div>
                    <div
                      className={`flex items-center text-gray-500 dark:text-gray-400 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      <ClockIcon
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {member.preferences?.reportTime} (
                      {member.preferences?.timezone})
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {t("skills")}
                    </h4>
                    <div
                      className={`flex flex-wrap gap-2 ${
                        isRTL ? "space-x-reverse" : ""
                      }`}
                    >
                      {member.skills?.map((skill) => (
                        <Badge key={skill} variant="default" size="small">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div
                    className={`flex ${
                      isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                    }`}
                  >
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-500"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-500"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-500"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {member.socialLinks?.dribbble && (
                      <a
                        href={member.socialLinks.dribbble}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-primary-500"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" />
                        </svg>
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {member.stats &&
                      Object.entries(member.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {value}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {t(key)}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Performance Metrics */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {stats.total}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("tasks")}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-success-600">
                          {stats.completed}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("completed")}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-primary-600">
                          {stats.completionRate}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {t("rate")}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-500"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex ${
                      isRTL
                        ? "justify-start space-x-reverse space-x-2"
                        : "justify-end space-x-2"
                    } pt-4 border-t border-gray-200 dark:border-gray-700`}
                  >
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleEditMember(member)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      className="text-error-600 hover:bg-error-50"
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      {t("delete")}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedView === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <table className={`w-full ${isRTL ? "text-right" : "text-left"}`}>
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th
                    className={`py-3 px-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("member")}
                  </th>
                  <th
                    className={`py-3 px-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("contact")}
                  </th>
                  <th
                    className={`py-3 px-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("role")}
                  </th>
                  <th
                    className={`py-3 px-4 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t("department")}
                  </th>
                  <th className="py-3 px-4 text-center">{t("performance")}</th>
                  <th
                    className={`py-3 px-4 ${
                      isRTL ? "text-right" : "text-center"
                    }`}
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => {
                  const stats = getMemberStats(member.id);
                  const isAvailable = getMemberAvailability(member);

                  return (
                    <tr
                      key={member.id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="py-3 px-4">
                        <div
                          className={`flex items-center ${
                            isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                          }`}
                        >
                          <div className="relative">
                            <Avatar
                              name={member.name}
                              src={member.avatar}
                              size="small"
                            />
                            <div
                              className={`absolute -top-1 ${
                                isRTL ? "-left-1" : "-right-1"
                              } h-2 w-2 rounded-full ${
                                isAvailable ? "bg-success-500" : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.position}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {member.email}
                          {member.phone && <div>{member.phone}</div>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            member.role === "admin" ? "primary" : "default"
                          }
                          size="small"
                        >
                          {t(member.role)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-500">
                          {member.department ? t(member.department) : "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stats.completionRate}%
                          </div>
                          <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500"
                              style={{ width: `${stats.completionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          isRTL ? "text-left" : "text-right"
                        }`}
                      >
                        <div
                          className={`flex ${
                            isRTL
                              ? "justify-start space-x-reverse space-x-2"
                              : "justify-end space-x-2"
                          }`}
                        >
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => handleEditMember(member)}
                          >
                            {t("edit")}
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            className="text-error-600 hover:bg-error-50"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            {t("delete")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedView === "hierarchy" && (
        <Card className="p-6">
          <div className="flex justify-center">
            <div className="space-y-8">
              {/* Admins Level */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-4">
                  {members
                    .filter((m) => m.role === "admin")
                    .map((admin) => (
                      <div
                        key={admin.id}
                        className="flex flex-col items-center space-y-2"
                      >
                        <Avatar
                          name={admin.name}
                          src={admin.avatar}
                          size="large"
                          className="ring-2 ring-primary-500"
                        />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.name}
                        </div>
                        <Badge variant="primary" size="small">
                          {t("admin")}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              {/* Connection Lines */}
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 mx-auto" />

              {/* Employees Level */}
              <div className="grid grid-cols-4 gap-6">
                {members
                  .filter((m) => m.role === "employee")
                  .map((employee) => (
                    <div
                      key={employee.id}
                      className="flex flex-col items-center space-y-2"
                    >
                      <Avatar
                        name={employee.name}
                        src={employee.avatar}
                        size="medium"
                        className="ring-2 ring-gray-300"
                      />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.department ? t(employee.department) : "-"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? t("addMember") : t("editMember")}
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
