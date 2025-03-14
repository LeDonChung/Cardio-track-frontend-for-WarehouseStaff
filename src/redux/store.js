import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import InventoryImportSlice from './slice/InventoryImportSlice';
import MedicineSlice from './slice/MedicineSlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        inventoryImport: InventoryImportSlice,
        medicine: MedicineSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;