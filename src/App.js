import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ToastContainer } from 'react-toastify';
import { HomePage } from './pages/HomePage';
import { DivideCategoryPage } from './pages/DivideCategoryPage';
import { InventoryLocationPage } from './pages/InventoryLocationPage';
import { InventoryImportPage } from './pages/InventoryImportPage';
import { InventoryExportPage } from './pages/InventoryExportPage';
import { MedicineLocationPage } from './pages/MedicineLocationPage';
import { MedicineStatusPage } from './pages/MedicineStatusPage';
import { ReportPage } from './pages/ReportPage';
import { SuplierPage } from './pages/SuplierPage';
import { StaffManagermentPage } from './pages/StaffManagermentPage';
import { InventoryControlPage } from './pages/InventoryControlPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        // Login Page
        <Route path='/login' element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        // Register Page
        <Route path='/register' element={<RegisterPage />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        //InventoryLocation page
        <Route path="/inventory-location" element={<InventoryLocationPage />} />

        //InventoryControl page
        <Route path="/inventory-control" element={<InventoryControlPage />} />

        //InventoryImport page
        <Route path="/import" element={<InventoryImportPage />} />

        //InventoryExport page
        <Route path="/export" element={<InventoryExportPage />} />

        //MedicineLocation page
        <Route path="/medicine-location" element={<MedicineLocationPage />} />

        //MedicineStatus page
        <Route path="/medicine-status" element={<MedicineStatusPage />} />
        
        //DivideCategoryPage
        <Route path="/divide-category-medicine" element={<DivideCategoryPage />} />

        //Suplier page
        <Route path="/suplier" element={<SuplierPage />} />

        //Staff page
        <Route path="/staff" element={<StaffManagermentPage />} />

        //Report page
        <Route path="/report" element={<ReportPage />} />

      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
