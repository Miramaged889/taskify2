import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../utils/translations';
import { formatTime } from '../../utils/helpers';
import { mockConversations, mockMessages } from '../../utils/mockData';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import Avatar from '../../components/Common/Avatar';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

const EmployeeChat = () => {
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const conversations = mockConversations;
  const messages = mockMessages.filter(msg => msg.conversationId === activeConversation?.id);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add message logic here
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('chat')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="p-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('conversations')}
            </h2>
          </div>
          <div className="overflow-y-auto">
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                onClick={() => setActiveConversation(conversation)}
                className={`
                  p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                  ${activeConversation?.id === conversation.id ? 'bg-primary-50 dark:bg-primary-900' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    name={conversation.name}
                    size="medium"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {conversation.name}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-2 p-0 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar
                name={activeConversation?.name}
                size="medium"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeConversation?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activeConversation?.type === 'group' ? t('groupChat') : t('individualChat')}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`chat-message ${message.senderId === user?.id ? 'sent' : 'received'}`}
              >
                <div className={`chat-bubble ${message.senderId === user?.id ? 'sent' : 'received'}`}>
                  {message.content}
                  <div className="text-xs opacity-75 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Input
                placeholder={t('typeMessage')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                icon={<PaperAirplaneIcon className="h-5 w-5" />}
                disabled={!newMessage.trim()}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeChat;