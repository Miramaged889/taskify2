import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "../../utils/translations";
import { formatDate } from "../../utils/helpers";
import { mockMessages } from "../../utils/mockData";
import {
  X,
  User,
  Users,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Star,
  Shield,
  MessageSquare,
  Linkedin,
  Github,
  Twitter,
  Globe,
  Award,
  TrendingUp,
  Code,
  Users as TeamIcon,
} from "lucide-react";
import Avatar from "../Common/Avatar";
import Badge from "../Common/Badge";
import Button from "../Common/Button";

const ChatInfoSidebar = ({ isOpen, onClose, conversation }) => {
  const { language } = useSelector((state) => state.settings);
  const { members } = useSelector((state) => state.team);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";

  if (!isOpen || !conversation) return null;

  const isGroup = conversation.type === "group";

  // Map participants from conversation to actual member objects
  const participants = isGroup
    ? members.filter((m) => conversation.participants?.includes(m.id))
    : [members.find((m) => m.id === conversation.participants?.[1])]; // For individual chats, get the other participant

  const technicalLead =
    participants.find((p) => p?.position === "Technical Lead") ||
    participants[0];

  // Get message count for this conversation
  const messageCount = mockMessages.filter(
    (msg) => msg.conversationId === conversation.id
  ).length;

  // Calculate days active (simplified - using creation date)
  const daysActive = Math.floor(
    (new Date() - new Date("2024-01-01")) / (1000 * 60 * 60 * 24)
  );


  const getDepartmentColor = (department) => {
    const colors = {
      engineering:
        "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
      design:
        "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
      marketing:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
      product:
        "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
      sales: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30",
      hr: "text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30",
      finance:
        "text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30",
    };
    return (
      colors[department] ||
      "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700"
    );
  };

  return (
    <div
      className={`fixed inset-y-0 ${
        isRTL ? "left-0" : "right-0"
      } w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
              {isGroup ? (
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              ) : (
                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isGroup ? t("groupInfo") : t("contactInfo")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {conversation.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isGroup ? (
            /* Group Information */
            <div className="space-y-6">
              {/* Group Avatar and Basic Info */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 via-accent-500 to-info-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {conversation.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  {conversation.lastMessage}
                </p>
              </div>

              {/* Technical Lead Section */}
              {technicalLead && (
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      {t("technicalLead")}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar
                      name={technicalLead.name}
                      src={technicalLead.avatar}
                      size="large"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {technicalLead.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {technicalLead.position}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(
                            technicalLead.department
                          )}`}
                        >
                          {technicalLead.department}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Group Members */}
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary-600" />
                  {t("groupMembers")} ({participants.length})
                </h4>
                <div className="space-y-3">
                  {participants.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Avatar
                        name={member.name}
                        src={member.avatar}
                        size="medium"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {member.position}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(
                              member.department
                            )}`}
                          >
                            {member.department}
                          </div>
                          {member.position === "Technical Lead" && (
                            <Badge variant="primary" size="small">
                              {t("lead")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/30 rounded-xl p-4 text-center shadow-sm">
                  <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {messageCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {t("messages")}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-900/30 rounded-xl p-4 text-center shadow-sm">
                  <Calendar className="h-8 w-8 text-accent-600 dark:text-accent-400 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {daysActive}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {t("daysActive")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Individual Contact Information */
            <div className="space-y-6">
              {technicalLead && (
                <>
                  {/* Contact Avatar and Basic Info */}
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <Avatar
                        name={technicalLead.name}
                        src={technicalLead.avatar}
                        size="xlarge"
                        className="mx-auto shadow-lg"
                      />
                      {technicalLead.position === "Technical Lead" && (
                        <div className="absolute -top-2 -right-2 p-2 bg-blue-500 rounded-full shadow-lg">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {technicalLead.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Badge variant="primary" className="text-sm">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {technicalLead.position}
                      </Badge>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDepartmentColor(
                          technicalLead.department
                        )}`}
                      >
                        {technicalLead.department}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                      {technicalLead.bio || t("noBioAvailable")}
                    </p>
                  </div>

                  {/* Skills Section */}
                  {technicalLead.skills && technicalLead.skills.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                        <Award className="h-5 w-5 text-primary-600" />
                        Skills & Expertise
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {technicalLead.skills
                          .slice(0, 6)
                          .map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              size="small"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        {technicalLead.skills.length > 6 && (
                          <Badge
                            variant="outline"
                            size="small"
                            className="text-xs"
                          >
                            +{technicalLead.skills.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-primary-600" />
                      {t("contactDetails")}
                    </h4>

                    {technicalLead.email && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {t("email")}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {technicalLead.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {technicalLead.phone && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {t("phone")}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {technicalLead.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {technicalLead.location && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {t("location")}
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {technicalLead.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Work Information */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-primary-600" />
                      {t("workInfo")}
                    </h4>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t("joined")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(technicalLead.joinedDate || new Date())}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {t("experience")}
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {technicalLead.experience ||
                            technicalLead.stats?.yearsOfExperience + "+ years"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Section */}
                  {technicalLead.stats && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-primary-600" />
                        Performance Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {technicalLead.stats.teamsLed && (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl p-3 text-center">
                            <TeamIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {technicalLead.stats.teamsLed}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Teams Led
                            </p>
                          </div>
                        )}
                        {technicalLead.stats.projectsArchitected && (
                          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-xl p-3 text-center">
                            <Code className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                              {technicalLead.stats.projectsArchitected}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Projects
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {technicalLead.socialLinks &&
                    Object.keys(technicalLead.socialLinks).length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                          <Globe className="h-5 w-5 text-primary-600" />
                          Social Profiles
                        </h4>
                        <div className="flex gap-3">
                          {technicalLead.socialLinks.linkedin && (
                            <Button
                              variant="outline"
                              size="small"
                              className="flex-1"
                              onClick={() =>
                                window.open(
                                  technicalLead.socialLinks.linkedin,
                                  "_blank"
                                )
                              }
                            >
                              <Linkedin className="h-4 w-4 mr-2" />
                              LinkedIn
                            </Button>
                          )}
                          {technicalLead.socialLinks.github && (
                            <Button
                              variant="outline"
                              size="small"
                              className="flex-1"
                              onClick={() =>
                                window.open(
                                  technicalLead.socialLinks.github,
                                  "_blank"
                                )
                              }
                            >
                              <Github className="h-4 w-4 mr-2" />
                              GitHub
                            </Button>
                          )}
                          {technicalLead.socialLinks.twitter && (
                            <Button
                              variant="outline"
                              size="small"
                              className="flex-1"
                              onClick={() =>
                                window.open(
                                  technicalLead.socialLinks.twitter,
                                  "_blank"
                                )
                              }
                            >
                              <Twitter className="h-4 w-4 mr-2" />
                              Twitter
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ChatInfoSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  conversation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string,
    participants: PropTypes.array,
    lastMessage: PropTypes.string,
    lastMessageTime: PropTypes.string,
    unreadCount: PropTypes.number,
  }),
};

export default ChatInfoSidebar;
