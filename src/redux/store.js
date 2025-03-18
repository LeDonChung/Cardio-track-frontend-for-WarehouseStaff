import { configureStore } from '@reduxjs/toolkit';
import UserSlice from './slice/UserSlice';
import InventoryImportSlice from './slice/InventoryImportSlice';
import InventoryImportDetailSlice from './slice/InventoryImportDetailSlice';
import PurchaseOrderSlice from './slice/PurchaseOrderSlice';
import PurchaseOrderDetailSlice from './slice/PurchaseOrderDetailSlice';
import MedicineSlice from './slice/MedicineSlice';
import ShelfSlice from './slice/ShelfSlice';
import SupplierSlice from './slice/SupplierSlice';
import CategorySlice from './slice/CategorySlice';
import InventoryDetailSlice from './slice/InventoryDetailSlice';

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
        categorys: CategorySlice,
        inventoryDetail: InventoryDetailSlice,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;