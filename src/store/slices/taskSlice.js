import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filter: {
    status: "all",
    priority: "all",
    assignee: "all",
    project: "all",
    dateRange: { start: null, end: null },
  },
  stages: {
    todo: [],
    progress: [],
    review: [],
    completed: [],
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.stages = {
        todo: action.payload.filter((task) => task.status === "todo"),
        progress: action.payload.filter((task) => task.status === "progress"),
        review: action.payload.filter((task) => task.status === "review"),
        completed: action.payload.filter((task) => task.status === "completed"),
      };
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      state.stages[action.payload.status].push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        const oldStatus = state.tasks[index].status;
        state.tasks[index] = action.payload;

        // Update stages
        state.stages[oldStatus] = state.stages[oldStatus].filter(
          (task) => task.id !== action.payload.id
        );
        state.stages[action.payload.status].push(action.payload);
      }
    },
    deleteTask: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        state.stages[task.status] = state.stages[task.status].filter(
          (task) => task.id !== action.payload
        );
      }
    },
    moveTask: (state, action) => {
      const { taskId, newStatus, newIndex } = action.payload;
      const task = state.tasks.find((task) => task.id === taskId);

      if (task) {
        const oldStatus = task.status;
        task.status = newStatus;

        // Remove from old stage
        state.stages[oldStatus] = state.stages[oldStatus].filter(
          (t) => t.id !== taskId
        );

        // Add to new stage at specific index
        state.stages[newStatus].splice(newIndex, 0, task);

        // Update task in main tasks array
        const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = task;
        }
      }
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter: (state) => {
      state.filter = {
        status: "all",
        priority: "all",
        assignee: "all",
        project: "all",
        dateRange: { start: null, end: null },
      };
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
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setFilter,
  clearFilter,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer;
