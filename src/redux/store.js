import { configureStore } from '@reduxjs/toolkit'
import { designationAndRolesSlice } from '../features/designation/designationAndRoleSlice'

export const store = configureStore({
    reducer: {
        designationAndRoles: designationAndRolesSlice.reducer,
    },
})