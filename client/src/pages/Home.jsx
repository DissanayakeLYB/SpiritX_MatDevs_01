import { useEffect, useState } from 'react';
import { logout, getCurrentUser } from '../appwrite/auth';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

export default function Home() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser()
            .then(user => {
                setUser(user);
                setLoading(false);
            })
            .catch(() => navigate('/login'));
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">Hello, {user.name}!</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}