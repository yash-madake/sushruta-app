import { login } from '../../services/api'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginView = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 2. Call the REAL backend
      const user = await login(phone, password);
      
      console.log('Login Success:', user);
      navigate('/dashboard'); // Redirect on success
    } catch (err) {
      setError(err.message); // Show error from backend (e.g., "Invalid credentials")
    }
  };

  
  return (
    <div className="animate-fade-in max-w-sm mx-auto w-full">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">Welcome Back</h2>
      <p className="text-slate-500 mb-8">Access your health dashboard</p>
      
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Phone Input */}
        <div className="relative">
          <i className="ph-bold ph-phone absolute left-3 top-3.5 text-slate-400"></i>
          <input
            name="loginPhone"
            type="tel"
            placeholder="Mobile Number"
            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* PIN Input */}
        <div className="relative">
          <i className="ph-bold ph-lock-key absolute left-3 top-3.5 text-slate-400"></i>
          <input
            name="loginPin"
            type="password"
            placeholder="4-Digit PIN"
            className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Login Button */}
        <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition flex justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="text-center mt-6 text-slate-500">
        New to Sushruta? <button onClick={() => setView('role-select')} className="text-blue-900 font-bold hover:underline">Create Account</button>
      </p>
    </div>
  );
};

export default LoginView;