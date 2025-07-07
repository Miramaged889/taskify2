import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // 'light' or 'dark'
  language: 'en', // 'en' or 'ar'
  notifications: {
    email: true,
    desktop: true,
    taskUpdates: true,
    dailyReports: true,
  },
  preferences: {
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    reportTime: '09:00',
    timezone: 'UTC',
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    updateNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    resetSettings: (state) => {
      return initialState;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotifications,
  updatePreferences,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;