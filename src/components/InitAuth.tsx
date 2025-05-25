import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { useNavigate } from 'react-router';

export const InitAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                dispatch(login({
                    user
                }));
            } catch (error) {
                localStorage.removeItem('user');
                navigate("/")
            }
        }
    }, [dispatch]);

    return null; // Este componente não renderiza nada
}; 