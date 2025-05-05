import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/login/login";
import { RegisterPage } from "./pages/register/Register";
import { IslandLayout } from "./layout/IslandLayout";
import Landing from "./pages/landing/Landing";
import { Header } from "./components/header/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<IslandLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route element={<MainLayout />}>
                    <Route index element={<Landing />} />
                    <Route path="/home" element={<Landing />} />
                </Route>
                <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    )
}