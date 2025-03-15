import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import InventoryImportSlice from './slice/InventoryImportSlice';
import InventoryImportDetailSlice from './slice/InventoryImportDetailSlice';
import PurchaseOrderSlice from './slice/PurchaseOrderSlice';
import PurchaseOrderDetailSlice from './slice/PurchaseOrderDetailSlice';
import MedicineSlice from './slice/MedicineSlice';
import ShelfSlice from './slice/ShelfSlice';
import SupplierSlice from './slice/SupplierSlice';

const store = configureStore({
    reducer: {
        user: UserSlice,
        inventoryImport: InventoryImportSlice,
        inventoryImportDetail: InventoryImportDetailSlice,
        purchaseOrderByPendingStatus: PurchaseOrderSlice,
        purchaseOrderDetail: PurchaseOrderDetailSlice,
        medicine: MedicineSlice,
        shelf: ShelfSlice,
        supplier: SupplierSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;