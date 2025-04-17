import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/login/login";
import { RegisterPage } from "./pages/register/Register";
import { IslandLayout } from "./layout/IslandLayout";
import { DefaultLayout } from "./layout/DefaultLayout";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<IslandLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
                <Route path="/home" element={<DefaultLayout />} />

            </Routes>
        </BrowserRouter>
    )
}