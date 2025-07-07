import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTasks } from '../../store/slices/taskSlice';
import { setProjects } from '../../store/slices/projectSlice';
import { useTranslation } from '../../utils/translations';
import { getTaskStats } from '../../utils/helpers';
import { mockTasks, mockProjects } from '../../utils/mockData';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Card from '../../components/Common/Card';
import TaskCard from '../../components/Tasks/TaskCard';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  useEffect(() => {
    // Load initial data
    dispatch(setTasks(mockTasks));
    dispatch(setProjects(mockProjects));
  }, [dispatch]);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignee === user?.id);
  const stats = getTaskStats(myTasks);

  const statsCards = [
    {
      title: t('totalTasks'),
      value: stats.total,
      icon: ClipboardDocumentListIcon,
      color: 'text-primary-600',
      bg: 'bg-primary-100 dark:bg-primary-800',
    },
    {
      title: t('completedTasks'),
      value: stats.completed,
      icon: CheckCircleIcon,
      color: 'text-success-600',
      bg: 'bg-success-100 dark:bg-success-800',
    },
    {
      title: t('overdueTasks'),
      value: stats.overdue,
      icon: ClockIcon,
      color: 'text-error-600',
      bg: 'bg-error-100 dark:bg-error-800',
    },
  ];

  const recentTasks = myTasks
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('welcome')}, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('dashboardWelcome')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="stats-card">
            <div className="flex items-center">
              <div className={`stats-card-icon ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="stats-card-value">{stat.value}</p>
                <p className="stats-card-label">{stat.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('recentTasks')}
          </h2>
          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                {t('noTasks')}
              </p>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('quickActions')}
          </h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span className="text-gray-900 dark:text-white">{t('viewAllTasks')}</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center">
                <FolderIcon className="h-5 w-5 text-secondary-600 mr-3" />
                <span className="text-gray-900 dark:text-white">{t('viewProjects')}</span>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;