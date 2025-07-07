import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../utils/translations';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const EmployeeCalendar = () => {
  const { tasks } = useSelector((state) => state.tasks);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('calendar')}
        </h1>
      </div>

      <Card>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigateMonth(-1)}
              icon={<ChevronLeftIcon className="h-4 w-4" />}
            />
            <Button
              variant="ghost"
              size="small"
              onClick={() => setCurrentDate(new Date())}
            >
              {t('today')}
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigateMonth(1)}
              icon={<ChevronRightIcon className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map(day => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 
                  ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                  ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}
                  ${isCurrentDay ? 'text-primary-600 dark:text-primary-400' : ''}
                `}>
                  {format(day, 'd')}
                </div>
                
                {dayTasks.length > 0 && (
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`
                          text-xs px-2 py-1 rounded text-white truncate
                          ${task.priority === 'urgent' ? 'bg-error-500' : 
                            task.priority === 'high' ? 'bg-warning-500' : 
                            task.priority === 'medium' ? 'bg-primary-500' : 'bg-gray-500'}
                        `}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeCalendar;