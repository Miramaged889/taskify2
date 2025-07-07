import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setLanguage, updateNotifications, updatePreferences } from '../../store/slices/settingsSlice';
import { useTranslation } from '../../utils/translations';
import { WORK_DAYS } from '../../utils/constants';
import Card from '../../components/Common/Card';
import Toggle from '../../components/Common/Toggle';
import Select from '../../components/Common/Select';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import toast from 'react-hot-toast';

const EmployeeSettings = () => {
  const dispatch = useDispatch();
  const { theme, language, notifications, preferences } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [loading, setLoading] = useState(false);

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
    
    document.documentElement.setAttribute('lang', newLanguage);
    document.documentElement.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
    document.body.className = newLanguage === 'ar' ? 'rtl font-arabic' : 'ltr font-english';
  };

  const handleNotificationChange = (key, value) => {
    dispatch(updateNotifications({ [key]: value }));
  };

  const handleWorkDayChange = (day) => {
    const newWorkDays = localPreferences.workDays.includes(day)
      ? localPreferences.workDays.filter(d => d !== day)
      : [...localPreferences.workDays, day];
    
    setLocalPreferences(prev => ({
      ...prev,
      workDays: newWorkDays,
    }));
  };

  const handleTimeChange = (e) => {
    setLocalPreferences(prev => ({
      ...prev,
      reportTime: e.target.value,
    }));
  };

  const handleSavePreferences = async () => {
    if (localPreferences.workDays.length === 0) {
      toast.error('Please select at least one work day');
      return;
    }
    
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(updatePreferences(localPreferences));
      toast.success(t('settingsSaved'));
    } catch (error) {
      toast.error(t('serverError'));
    } finally {
      setLoading(false);
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('settings')}
        </h1>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <h2 className="settings-title">{t('generalSettings')}</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('theme')}
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              options={themeOptions}
            />
            
            <Select
              label={t('language')}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              options={languageOptions}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-section">
        <h2 className="settings-title">{t('notificationSettings')}</h2>
        
        <div className="space-y-4">
          <Toggle
            label={t('emailNotifications')}
            enabled={notifications.email}
            onChange={(value) => handleNotificationChange('email', value)}
          />
          
          <Toggle
            label={t('desktopNotifications')}
            enabled={notifications.desktop}
            onChange={(value) => handleNotificationChange('desktop', value)}
          />
          
          <Toggle
            label={t('taskUpdateNotifications')}
            enabled={notifications.taskUpdates}
            onChange={(value) => handleNotificationChange('taskUpdates', value)}
          />
          
          <Toggle
            label={t('dailyReportNotifications')}
            enabled={notifications.dailyReports}
            onChange={(value) => handleNotificationChange('dailyReports', value)}
          />
        </div>
      </div>

      {/* Work Preferences */}
      <div className="settings-section">
        <h2 className="settings-title">{t('workPreferences')}</h2>
        
        <div className="space-y-6">
          {/* Work Days */}
          <div>
            <label className="form-label">{t('workDays')}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
              {WORK_DAYS.map((day) => (
                <label
                  key={day.value}
                  className={`
                    flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors
                    ${localPreferences.workDays.includes(day.value)
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={localPreferences.workDays.includes(day.value)}
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
          <div className="max-w-xs">
            <Input
              label={t('reportTime')}
              type="time"
              value={localPreferences.reportTime}
              onChange={handleTimeChange}
              required
            />
          </div>

          <Button
            onClick={handleSavePreferences}
            loading={loading}
          >
            {t('savePreferences')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettings;