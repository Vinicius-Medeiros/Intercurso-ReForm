import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { RegisterPage } from "./pages/register/Register";
import { IslandLayout } from "./layout/IslandLayout";
import Landing from "./pages/landing/Landing";
import { Header } from "./components/header/Header";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { AccountPage } from "./pages/account/Account";
import { MaterialsPage } from "./pages/materials/Materials";
import { PurchasesPage } from "./pages/purchases/Purchases";
import { SalesPage } from "./pages/sales/Sales";
import { InitAuth } from "./components/InitAuth";
import { DashboardLayout } from "./layout/DashboardLayout";
import { CompaniesPage } from "./pages/companies/Companies";
import { LoginPage } from "./pages/login/login";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export const Router = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    
    return (
        <BrowserRouter>
            <InitAuth />
            <Routes>
                <Route element={<IslandLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route index path="/landing" element={<Landing />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/dashboard/account" replace />} />
                        <Route path="account" element={<AccountPage />} />
                        <Route path="materials" element={<MaterialsPage />} />
                        <Route path="purchases" element={<PurchasesPage />} />
                        <Route path="sales" element={<SalesPage />} />
                        <Route path="companies" element={<CompaniesPage />} />
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/landing"} replace />} />
            </Routes>
        </BrowserRouter>
    );
};