import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '../appwrite/auth';
import Loader from '../components/Loader';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [strength, setStrength] = useState(0);
    const navigate = useNavigate();

    const calculateStrength = (pass) => {
        let score = 0;
        if (/[a-z]/.test(pass)) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        if (pass.length >= 10) score += 2;
        else if (pass.length >= 8) score += 1;
        return Math.min(6, score);
    };

    const getStrengthColor = (strength) => {
        const colors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-lime-500',
            'bg-green-500',
            'bg-green-600'
        ];
        return colors[Math.floor((strength / 6) * (colors.length - 1))];
    };

    useEffect(() => {
        const newErrors = {};
        const passStrength = calculateStrength(password);
        setStrength(passStrength);

        // Name validation
        if (name.length > 0 && name.length < 5) {
            newErrors.name = 'Username must be at least 5 characters';
        }

        // Email validation
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        // Password validation
        if (password && passStrength < 3) {
            newErrors.password = 'Password too weak';
        }

        // Confirm password
        if (confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
    }, [name, email, password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createAccount(email, password, name);
            navigate('/login');
        } catch (err) {
            setErrors({ server: err.message });
        }
        setLoading(false);
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500">Join our community today</p>
                </div>

                {errors.server && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg">{errors.server}</div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="mt-2">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
                                    style={{ width: `${(strength / 6) * 100}%` }}
                                ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className={`mr-1 ${/[a-z]/.test(password) ? 'text-green-500' : ''}`}>•</span>
                                    Lowercase
                                </div>
                                <div className="flex items-center">
                                    <span className={`mr-1 ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}>•</span>
                                    Uppercase
                                </div>
                                <div className="flex items-center">
                                    <span className={`mr-1 ${/[0-9]/.test(password) ? 'text-green-500' : ''}`}>•</span>
                                    Number
                                </div>
                                <div className="flex items-center">
                                    <span className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}`}>•</span>
                                    Special
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-800"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={Object.keys(errors).length > 0 || !name || !email || !password || !confirmPassword}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity hover:scale-101"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
}