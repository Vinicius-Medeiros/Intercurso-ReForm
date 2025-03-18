import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/login/login";

export const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </BrowserRouter>
    )
}