import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import api from './api';
    
export default function Login() {
    const navigate = useNavigate();
    
    // DUA BARIS INI YANG SEBELUMNYA HILANG:
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('auth_token', response.data.acces_token);
            
            navigate('/dashboard'); 
            
        } catch (error) {
            alert(error.response?.data?.messages || 'Login Gagal');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-900 overflow-hidden relative">
            {/* Ornamen Cahaya Background */}
            <div className="absolute w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 bottom-10 right-10"></div>

            {/* Komponen Pembungkus 3D Tilt */}
            <Tilt 
                tiltMaxAngleX={15} 
                tiltMaxAngleY={15} 
                perspective={1000} 
                glareEnable={true} 
                glareMaxOpacity={0.4} 
                glareColor="white" 
                glarePosition="all"
                scale={1.05}
                transitionSpeed={2500}
            >
                <form onSubmit={handleLogin} className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-2xl shadow-2xl w-96 text-white">
                    <h2 className="text-3xl font-bold mb-8 text-center tracking-wider">E-Office Admin</h2>
                    
                    <div className="mb-5">
                        <label className="block text-sm mb-2 text-gray-300">Email Superadmin</label>
                        <input 
                            type="email" 
                            className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-gray-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-8">
                        <label className="block text-sm mb-2 text-gray-300">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-blue-400 text-white placeholder-gray-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.5)] hover:shadow-[0_0_25px_rgba(37,99,235,0.8)]">
                        MASUK
                    </button>
                </form>
            </Tilt>
        </div>
    );
}