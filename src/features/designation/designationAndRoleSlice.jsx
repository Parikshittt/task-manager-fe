import { createSlice } from "@reduxjs/toolkit";

export const designationAndRolesSlice = createSlice({
  name: "designationAndRoles",
  initialState: {
    designations : [],
    roles : []
  },
  reducers: {
    setDesignations: (state, action) => {
      state.designations = action.payload;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
    },
  },
});

export const { setDesignations, setRoles } = designationAndRolesSlice.actions;

export default designationAndRolesSlice.reducer;