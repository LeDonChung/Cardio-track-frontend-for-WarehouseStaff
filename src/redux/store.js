import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import InventoryImportSlice from './slice/InventoryImportSlice';
import MedicineSlice from './slice/MedicineSlice';
import ShelfSlice from './slice/ShelfSlice';
import categorySlice from './slice/CategorySlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        inventoryImport: InventoryImportSlice,
        medicine: MedicineSlice,
        shelf: ShelfSlice,
        category: categorySlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;