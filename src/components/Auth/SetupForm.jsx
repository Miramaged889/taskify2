import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUserPreferences } from '../../store/slices/authSlice';
import { useTranslation } from '../../utils/translations';
import { WORK_DAYS } from '../../utils/constants';
import Input from '../Common/Input';
import Button from '../Common/Button';
import Card from '../Common/Card';

const SetupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    workDays: user?.preferences?.workDays || [],
    reportTime: user?.preferences?.reportTime || '09:00',
  });
  const [loading, setLoading] = useState(false);

  const handleWorkDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      workDays: prev.workDays.includes(day)
        ? prev.workDays.filter(d => d !== day)
        : [...prev.workDays, day],
    }));
  };

  const handleTimeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      reportTime: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.workDays.length === 0) {
      alert('Please select at least one work day');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user preferences
      dispatch(updateUserPreferences(formData));
      
      // Navigate to appropriate dashboard
      navigate(user.email?.toLowerCase() === 'sarah.wilson@example.com' || user.role === 'admin' ? '/admin' : '/employee');
    } catch (error) {
      console.error('Setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('setupTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('setupDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Work Days Selection */}
          <div>
            <label className="form-label text-lg">
              {t('workDaysQuestion')}
            </label>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {WORK_DAYS.map((day) => (
                <label
                  key={day.value}
                  className={`
                    flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-colors
                    ${formData.workDays.includes(day.value)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.workDays.includes(day.value)}
                    onChange={() => handleWorkDayChange(day.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">
                    {day.label[language]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Time */}
          <div>
            <label className="form-label text-lg">
              {t('reportTimeQuestion')}
            </label>
            <div className="mt-4 max-w-xs">
              <Input
                type="time"
                value={formData.reportTime}
                onChange={handleTimeChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              loading={loading}
              size="large"
              className="px-8"
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SetupForm;