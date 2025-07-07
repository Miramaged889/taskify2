import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../utils/translations';
import { getTaskStats, formatDate } from '../../utils/helpers';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Card from '../../components/Common/Card';
import Select from '../../components/Common/Select';
import DatePicker from '../../components/Common/DatePicker';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const EmployeeReports = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  // Filter tasks for current user
  const myTasks = tasks.filter(task => task.assignee === user?.id);
  const stats = getTaskStats(myTasks);

  // Task Status Chart Data
  const statusChartData = {
    labels: [t('todo'), t('progress'), t('review'), t('completed')],
    datasets: [{
      label: t('tasks'),
      data: [stats.todo, stats.progress, stats.review, stats.completed],
      backgroundColor: ['#6b7280', '#3b82f6', '#f59e0b', '#22c55e'],
      borderWidth: 0,
    }],
  };

  // Task Priority Chart Data
  const priorityStats = {
    low: myTasks.filter(task => task.priority === 'low').length,
    medium: myTasks.filter(task => task.priority === 'medium').length,
    high: myTasks.filter(task => task.priority === 'high').length,
    urgent: myTasks.filter(task => task.priority === 'urgent').length,
  };

  const priorityChartData = {
    labels: [t('low'), t('medium'), t('high'), t('urgent')],
    datasets: [{
      label: t('tasks'),
      data: [priorityStats.low, priorityStats.medium, priorityStats.high, priorityStats.urgent],
      backgroundColor: ['#6b7280', '#3b82f6', '#f59e0b', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('reports')}
        </h1>
      </div>

      {/* Filters */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('filters')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePicker
            label={t('from')}
            selected={dateRange.start}
            onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
            maxDate={dateRange.end}
          />
          <DatePicker
            label={t('to')}
            selected={dateRange.end}
            onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
            minDate={dateRange.start}
          />
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('totalTasks')}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-success-600">
            {stats.completed}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('completedTasks')}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-error-600">
            {stats.overdue}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('overdueTasks')}
          </div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('completion')}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('tasksByStatus')}
          </h2>
          <div className="h-64">
            <Bar data={statusChartData} options={chartOptions} />
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('tasksByPriority')}
          </h2>
          <div className="h-64">
            <Pie data={priorityChartData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Recent Tasks Table */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('recentTasks')}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t('taskTitle')}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t('status')}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t('priority')}
                </th>
                <th className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {t('dueDate')}
                </th>
              </tr>
            </thead>
            <tbody>
              {myTasks.slice(0, 10).map(task => (
                <tr key={task.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">
                    {task.title}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.status === 'completed' ? 'bg-success-100 text-success-800' :
                      task.status === 'progress' ? 'bg-primary-100 text-primary-800' :
                      task.status === 'review' ? 'bg-warning-100 text-warning-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t(task.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'urgent' ? 'bg-error-100 text-error-800' :
                      task.priority === 'high' ? 'bg-warning-100 text-warning-800' :
                      task.priority === 'medium' ? 'bg-primary-100 text-primary-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t(task.priority)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                    {task.dueDate ? formatDate(task.dueDate) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeReports;