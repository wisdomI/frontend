// store/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, BreadcrumbItem } from '../types/dashbaord';

const initialState: DashboardState = {
  currentView: 'home',
  breadcrumbItems: [{ label: 'Home', path: '/dashboard/home' }],
};

interface MenuItemPayload {
  view: string;
  breadcrumb: BreadcrumbItem;
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    selectMenuItem: (state, action: PayloadAction<MenuItemPayload>) => {
      state.currentView = action.payload.view;
      // Avoid duplicating the same breadcrumb
      if (state.breadcrumbItems[state.breadcrumbItems.length - 1]?.path !== action.payload.breadcrumb.path) {
        state.breadcrumbItems = [...state.breadcrumbItems, action.payload.breadcrumb];
      }
    },
    resetBreadcrumb: (state) => {
      state.currentView = initialState.currentView;
      state.breadcrumbItems = initialState.breadcrumbItems;
    },
  },
});

export const { selectMenuItem, resetBreadcrumb } = dashboardSlice.actions;
export default dashboardSlice.reducer;