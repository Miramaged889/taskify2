import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import { formatTime } from "../../utils/helpers";
import { mockConversations, mockMessages } from "../../utils/mockData";
import Card from "../../components/Common/Card";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Avatar from "../../components/Common/Avatar";
import Badge from "../../components/Common/Badge";
import Modal from "../../components/Common/Modal";
import ChatGroupForm from "../../components/forms/adminForms/ChatGroupForm";
import {
  PaperAirplaneIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  ChatBubbleLeftEllipsisIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

const AdminChat = () => {
  const { user } = useSelector((state) => state.auth);
  const { members } = useSelector((state) => state.team);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  // Add RTL detection
  const isRTL = language === "ar";
  const directionClass = isRTL ? "rtl" : "ltr";

  const [activeTab, setActiveTab] = useState("individual"); // "individual" or "group"
  const [activeConversation, setActiveConversation] = useState(
    mockConversations.find((conv) => conv.type === "individual")
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [groupFormErrors, setGroupFormErrors] = useState({});
  const [groupFormLoading, setGroupFormLoading] = useState(false);

  const conversations = mockConversations
    .filter((conv) => conv.type === activeTab)
    .filter((conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const messages = mockMessages.filter(
    (msg) => msg.conversationId === activeConversation?.id
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGroupFormChange = (field, value) => {
    setGroupFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (groupFormErrors[field]) {
      setGroupFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleGroupMemberToggle = (id) => {
    if (!id) return;

    setGroupFormData((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((existingId) => existingId !== id)
        : [...prev.members, id],
    }));
  };

  const validateGroupForm = () => {
    const newErrors = {};

    if (!groupFormData.name.trim()) {
      newErrors.name = t("requiredField");
    }

    if (groupFormData.members.length < 2) {
      newErrors.members = t("minimumTwoMembers");
    }

    setGroupFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGroupFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateGroupForm()) return;

    setGroupFormLoading(true);

    try {
      // Add group chat creation logic here
      console.log("Creating group chat:", groupFormData);

      setIsGroupModalOpen(false);
      setGroupFormData({
        name: "",
        description: "",
        members: [],
      });
      toast.success(t("groupChatCreated"));
    } catch {
      toast.error(t("serverError"));
    } finally {
      setGroupFormLoading(false);
    }
  };

  const getOnlineStatus = () => {
    return Math.random() > 0.5;
  };

  const renderChatHeader = () => (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div
        className={`flex items-center ${
          isRTL ? "flex-row justify-between" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center ${
            isRTL ? "space-x-reverse space-x-3" : "space-x-3"
          }`}
        >
          <div className="relative">
            <Avatar name={activeConversation?.name} size="large" />
            {activeConversation?.type === "individual" && getOnlineStatus() && (
              <div
                className={`absolute -bottom-1 ${
                  isRTL ? "-left-1" : "-right-1"
                } w-4 h-4 bg-success-500 border-2 border-white dark:border-gray-800 rounded-full`}
              ></div>
            )}
          </div>
          <div>
            <div
              className={`flex items-center ${
                isRTL ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeConversation?.name}
              </h3>
              {activeConversation?.type === "group" ? (
                <UserGroupIcon
                  className={`h-5 w-5 text-primary-600 ${
                    isRTL ? "flex-row mr-2" : "ml-2"
                  }`}
                />
              ) : (
                getOnlineStatus() && (
                  <Badge variant="success" size="small">
                    {t("online")}
                  </Badge>
                )
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeConversation?.type === "group"
                ? `${activeConversation?.participants.length} ${t("members")}`
                : getOnlineStatus()
                ? t("activeNow")
                : t("lastSeen")}
            </p>
          </div>
        </div>

        <div className={`flex items-center ${isRTL ? "flex-row" : ""}`}>
          {activeConversation?.type === "individual" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                icon={<PhoneIcon className="h-5 w-5" />}
                onClick={() => console.log("Start voice call")}
                title={t("startVoiceCall")}
              />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                icon={<VideoCameraIcon className="h-5 w-5" />}
                onClick={() => console.log("Start video call")}
                title={t("startVideoCall")}
              />
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            icon={<InformationCircleIcon className="h-5 w-5" />}
            onClick={() => console.log("Show chat info")}
            title={t("chatInfo")}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${directionClass}`} dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={`flex items-center ${
          isRTL ? "flex-row justify-between" : "justify-between"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("chat")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t("chatDescription")}
          </p>
        </div>
        {activeTab === "group" && (
          <Button
            onClick={() => setIsGroupModalOpen(true)}
            className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <PlusIcon className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
            <span>{t("newGroupChat")}</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Sidebar */}
        <div className={`lg:col-span-1 ${isRTL ? "order-2" : "order-1"}`}>
          <Card className="p-0 h-full flex flex-col">
            {/* Chat Type Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "individual"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("individual")}
              >
                {t("individual")}
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "group"
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
                onClick={() => setActiveTab("group")}
              >
                {t("groups")}
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <MagnifyingGlassIcon
                  className={`absolute ${
                    isRTL ? "left-3" : "right-3"
                  } top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`}
                />
                <Input
                  placeholder={t("searchConversations")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isRTL ? "pl-12 text-right" : "pr-12 text-left"}
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <ChatBubbleLeftEllipsisIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? t("noConversationsFound")
                      : activeTab === "individual"
                      ? t("noIndividualChats")
                      : t("noGroupChats")}
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`
                      p-4 cursor-pointer transition-colors
                      ${
                        activeConversation?.id === conversation.id
                          ? "bg-primary-50 dark:bg-primary-900"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }
                    `}
                  >
                    <div
                      className={`flex items-start ${
                        isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                      }`}
                    >
                      <div className="relative">
                        <Avatar name={conversation.name} size="medium" />
                        {conversation.type === "individual" &&
                          getOnlineStatus() && (
                            <div
                              className={`absolute -bottom-1 ${
                                isRTL ? "-left-1" : "-right-1"
                              } w-3 h-3 bg-success-500 border-2 border-white dark:border-gray-800 rounded-full`}
                            ></div>
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          } justify-between`}
                        >
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                        <div
                          className={`flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                          } justify-between mt-1`}
                        >
                          {conversation.type === "group" && (
                            <span className="text-xs text-gray-400">
                              {conversation.participants.length} {t("members")}
                            </span>
                          )}
                          {conversation.unreadCount > 0 && (
                            <Badge variant="primary" size="small">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-3 ${isRTL ? "order-2" : "order-1"}`}>
          <Card className="p-0 h-full flex flex-col">
            {activeConversation ? (
              <>
                {renderChatHeader()}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const sender = members.find(
                      (m) => m.id === message.senderId
                    );
                    const isOwnMessage = message.senderId === user?.id;
                    const showAvatar =
                      !isOwnMessage &&
                      (!messages[index - 1] ||
                        messages[index - 1].senderId !== message.senderId);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isOwnMessage
                            ? isRTL
                              ? "justify-end"
                              : "justify-start"
                            : isRTL
                            ? "justify-start"
                            : "justify-end"
                        }`}
                      >
                        <div
                          className={`flex items-end ${
                            isOwnMessage !== isRTL
                              ? "flex-row space-x-2"
                              : "space-x-2"
                          } max-w-[80%]`}
                        >
                          {showAvatar && !isOwnMessage && (
                            <Avatar
                              name={sender?.name}
                              size="small"
                              className="mb-1"
                            />
                          )}
                          <div
                            className={`flex flex-col ${
                              isOwnMessage !== isRTL
                                ? "items-start"
                                : "items-end"
                            }`}
                          >
                            {showAvatar &&
                              !isOwnMessage &&
                              activeConversation?.type === "group" && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  {sender?.name}
                                </span>
                              )}
                            <div
                              className={`
                                px-4 py-2 rounded-2xl
                                ${
                                  isOwnMessage
                                    ? `bg-primary-600 text-white ${
                                        isRTL
                                          ? "rounded-bl-md"
                                          : "rounded-br-md"
                                      }`
                                    : `bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white ${
                                        isRTL
                                          ? "rounded-br-md"
                                          : "rounded-bl-md"
                                      }`
                                }
                              `}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row space-x-reverse space-x-3" : "space-x-3"
                    }`}
                  >
                    <div className="flex-1">
                      <Input
                        placeholder={t("typeMessage")}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`resize-none h-10 ${
                          isRTL ? "text-right" : "text-left"
                        }`}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      className={`shrink-0 flex items-center h-10 ${
                        isRTL ? "flex-row justify-between mr-2" : ""
                      }`}
                      disabled={!newMessage.trim()}
                    >
                      <PaperAirplaneIcon
                        className={`h-4 w-4 ${
                          isRTL ? "ml-2 transform rotate-180" : "mr-2"
                        }`}
                      />
                      <span>{t("send")}</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t("selectConversation")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("selectConversationDescription")}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Group Chat Modal */}
      <Modal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        title={t("createGroupChat")}
      >
        <ChatGroupForm
          formData={groupFormData}
          errors={groupFormErrors}
          loading={groupFormLoading}
          onSubmit={handleGroupFormSubmit}
          onChange={handleGroupFormChange}
          onMemberToggle={handleGroupMemberToggle}
          isRTL={isRTL}
        />
      </Modal>
    </div>
  );
};

export default AdminChat;
