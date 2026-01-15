import React from 'react';

const SignupForm = ({ role, setView, handleInputChange, loading, setLoading, showToast, formData, setGenOtp }) => {

  const triggerOtp = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.name || !formData.phone || !formData.pin) {
        return showToast('Please fill required fields', 'error');
    }

    setLoading(true);
    
    // Simulate OTP Generation
    const code = Math.floor(1000 + Math.random() * 9000);
    setGenOtp(code);

    setTimeout(() => {
      // In a real app, this would be an SMS. Here we use alert for demo.
      alert(`🔐 SUSHRUTA OTP: ${code}`);
      setLoading(false);
      setView('otp');
    }, 1500);
  };

  const renderFormFields = () => {
    switch (role) {
      case 'senior':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <input name="name" placeholder="Full Name" className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none col-span-2" onChange={handleInputChange} required />
            <input name="dob" type="date" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <select name="gender" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input name="phone" type="tel" placeholder="Mobile Number" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <select name="bloodGroup" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange}>
              <option value="">Blood Group</option>
              <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option>
            </select>
            <textarea name="address" placeholder="Address (City / Area)" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none col-span-2" rows="2" onChange={handleInputChange}></textarea>
            
            <div className="col-span-2 bg-red-50 p-3 rounded-lg border border-red-100">
              <h4 className="text-red-800 text-sm font-bold mb-2">Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-2">
                <input name="emergencyName" placeholder="Contact Name" className="p-2 bg-white border border-red-200 rounded outline-none" onChange={handleInputChange} />
                <input name="emergencyPhone" placeholder="Contact Phone" className="p-2 bg-white border border-red-200 rounded outline-none" onChange={handleInputChange} />
              </div>
            </div>
            
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none col-span-2" onChange={handleInputChange} required />
          </div>
        );

      case 'caretaker':
        return (
          <div className="grid grid-cols-1 gap-4 animate-slide-up">
            <input name="name" placeholder="Full Name" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <select name="relation" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange}>
              <option value="">Relation to Senior</option>
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Professional Nurse">Professional Nurse</option>
              <option value="Other">Other</option>
            </select>
            <input name="phone" type="tel" placeholder="Mobile Number" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <input name="email" type="email" placeholder="Email (Optional)" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} />
            <input name="address" placeholder="Address (City)" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} />
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
          </div>
        );

      case 'doctor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
            <input name="name" placeholder="Dr. Full Name" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none col-span-2" onChange={handleInputChange} required />
            <select name="specialization" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange}>
              <option value="">Specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="General Physician">General Physician</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Neurologist">Neurologist</option>
            </select>
            <input name="regNo" placeholder="Medical Reg. No." className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <input name="clinic" placeholder="Hospital / Clinic Name" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none col-span-2" onChange={handleInputChange} required />
            <input name="city" placeholder="City" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <input name="phone" type="tel" placeholder="Contact Number" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none" onChange={handleInputChange} required />
            <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <label className="text-sm text-slate-500 block mb-2">Consultation Mode</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2"><input type="radio" name="mode" value="Online" onChange={handleInputChange} /> Online</label>
                <label className="flex items-center gap-2"><input type="radio" name="mode" value="Offline" onChange={handleInputChange} /> Offline</label>
                <label className="flex items-center gap-2"><input type="radio" name="mode" value="Both" onChange={handleInputChange} /> Both</label>
              </div>
            </div>
            <input name="pin" type="password" placeholder="Set 4-Digit PIN" maxLength="4" className="p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none col-span-2" onChange={handleInputChange} required />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setView('role-select')} className="text-slate-400 hover:text-blue-900 transition-colors">
          <i className="ph-bold ph-arrow-left text-xl"></i>
        </button>
        <span className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-1 rounded-full">{role} Sign Up</span>
      </div>
      
      <form onSubmit={triggerOtp} className="space-y-4">
        {renderFormFields()}
        
        <button disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition mt-6 flex justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            'Verify & Register'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;