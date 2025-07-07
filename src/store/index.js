import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import taskSlice from './slices/taskSlice';
import projectSlice from './slices/projectSlice';
import teamSlice from './slices/teamSlice';
import chatSlice from './slices/chatSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tasks: taskSlice,
    projects: projectSlice,
    team: teamSlice,
    chat: chatSlice,
    settings: settingsSlice,
  },
});

export default store;