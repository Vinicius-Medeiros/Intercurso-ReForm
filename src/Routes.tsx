import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/login/login";
import { RegisterPage } from "./pages/register/Register";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </BrowserRouter>
    )
}