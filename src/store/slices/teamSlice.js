import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    addMember: (state, action) => {
      state.members.push(action.payload);
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter(member => member.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMembers,
  addMember,
  updateMember,
  deleteMember,
  setLoading,
  setError,
} = teamSlice.actions;

export default teamSlice.reducer;