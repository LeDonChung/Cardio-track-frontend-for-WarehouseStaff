import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import InventoryImportSlice from './slice/InventoryImportSlice';
import InventoryImportDetailSlice from './slice/InventoryImportDetailSlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        inventoryImport: InventoryImportSlice,
        inventoryImportDetail: InventoryImportDetailSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;