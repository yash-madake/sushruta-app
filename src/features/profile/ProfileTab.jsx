import React, { useState, useRef } from 'react';

const ProfileTab = ({ data, refreshData, userRole = 'senior' }) => {
  // 1. NORMALIZE ROLE
  const currentRole = (userRole || 'senior').toLowerCase();
  const isSenior = currentRole === 'senior' || currentRole === 'patient';
  const isCaretakerOrDoctor = currentRole === 'caretaker' || currentRole === 'doctor';

  // 2. STATE MANAGEMENT
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(data?.user || { name: "User", age: 65 });
  const [connectIdInput, setConnectIdInput] = useState("");
  const fileInputRef = useRef(null);

  // 3. GENERATE DYNAMIC ID (Simulated)
  const [sushrutaId] = useState(() => {
    const prefix = formData.age >= 60 ? "SNR" : "SH";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${randomNum}`;
  });

  // 4. VOICE FEEDBACK ENGINE (Browser API)
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(text);
      msg.rate = 1;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleChange = (e, field, sub) => {
    if (sub) {
      const parent = formData[field] || {};
      setFormData({ ...formData, [field]: { ...parent, [sub]: e.target.value } });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const saveProfile = () => {
    speak("Saving changes to your secure profile.");
    if (refreshData) refreshData({ ...data, user: formData });
    setEditMode(false);
    alert("Profile Updated!");
  };

  const handleConnectionAction = (action) => {
    speak(`You have ${action}ed the connection request.`);
    alert(`Request ${action}ed successfully.`);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in h-full overflow-y-auto pb-24">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 shadow-sm">
            <i className="ph-fill ph-user-circle text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isSenior ? "My Profile" : "Senior Profile View"}
          </h1>
        </div>

        {/* Edit button ONLY for Senior */}
        {isSenior && (
          <button 
            onClick={() => { if(editMode) saveProfile(); else { speak("Edit mode active"); setEditMode(true); } }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow transition hover:bg-blue-700"
          >
            {editMode ? 'Save' : 'Edit'}
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 1. BASIC DETAILS CARD (Visible to Everyone) */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-teal-500">
          <h3 className="font-bold text-teal-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg">
            <i className="ph-fill ph-identification-card text-2xl"></i> 1. Basic Details
          </h3>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4 cursor-pointer" onClick={() => editMode && fileInputRef.current.click()}>
              <img src={formData.photo || `https://ui-avatars.com/api/?name=${formData.name}`} className="w-full h-full rounded-full object-cover border-4 border-teal-50 shadow-md" alt="User Profile" />
              {editMode && (
                <div className="overlay absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-2xl">
                  <i className="ph-bold ph-camera"></i>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files[0];
                if(f){ const r=new FileReader(); r.onloadend=()=>setFormData({...formData, photo:r.result}); r.readAsDataURL(f); }
              }} />
            </div>
            
            <div className="bg-slate-100 px-4 py-1 rounded-lg border border-slate-200 mb-4">
              <span className="text-xs font-bold text-slate-500 mr-2">Sushruta ID:</span>
              <span className="font-mono font-bold text-teal-700">{sushrutaId}</span>
            </div>
            {!editMode && <h2 className="text-2xl font-bold text-slate-800">{formData.name}</h2>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="form-label">Full Name</label><input disabled={!editMode} value={formData.name} onChange={(e)=>handleChange(e,'name')} className="form-input font-semibold" /></div>
            <div><label className="form-label">Phone Number</label><input disabled={!editMode} value={formData.phone} onChange={(e)=>handleChange(e,'phone')} className="form-input" /></div>
            <div><label className="form-label">Date of Birth</label><input type="date" disabled={!editMode} value={formData.dob} onChange={(e)=>handleChange(e,'dob')} className="form-input" /></div>
            <div><label className="form-label">Language</label><select disabled={!editMode} value={formData.language} onChange={(e)=>handleChange(e,'language')} className="form-input"><option>Hindi</option><option>English</option><option>Marathi</option></select></div>
            <div className="md:col-span-2"><label className="form-label">Address</label><textarea disabled={!editMode} value={formData.address} onChange={(e)=>handleChange(e,'address')} className="form-input" rows="2"></textarea></div>
          </div>
        </div>

        {/* --- 2. CARETAKER / DOCTOR BLOCK (Accept/Deny) --- */}
        {isCaretakerOrDoctor && (
          <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-md">
            <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-lg">
              <i className="ph-fill ph-bell-ringing text-indigo-600"></i> Action Required
            </h3>
            <div className="bg-white p-5 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  {formData.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">Connection Request from {formData.name}</p>
                  <p className="text-sm text-slate-500 italic">"Allow access to medical history"</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleConnectionAction("Accept")} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">Accept</button>
                <button onClick={() => handleConnectionAction("Deny")} className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-red-50">Deny</button>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. SENIOR PRIVATE SECTIONS (Strictly Hidden for Caretaker/Doctor) --- */}
        {isSenior && (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-red-500">
              <h3 className="font-bold text-red-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg"><i className="ph-fill ph-ambulance text-2xl"></i> 2. Emergency Details</h3>
              <div className="p-5 bg-red-50 rounded-xl border border-red-100 mb-4 text-left">
                <p className="text-xs font-bold text-red-700 uppercase mb-3">Primary Contact</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="form-label text-red-700">Name</label><input disabled={!editMode} value={formData.emergencyPrimary?.name || ''} className="form-input border-red-200 bg-white" /></div>
                  <div><label className="form-label text-red-700">Phone</label><input disabled={!editMode} value={formData.emergencyPrimary?.contact || ''} className="form-input border-red-200 bg-white" /></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div><label className="form-label">Hospital</label><input disabled={!editMode} value={formData.hospitalPref} className="form-input" /></div>
                <div><label className="form-label text-red-600">Allergies</label><input disabled={!editMode} value={formData.allergies} className="form-input border-red-100 text-red-600 bg-red-50 font-bold" /></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border shadow-sm border-l-4 border-l-blue-500 text-left">
              <h3 className="font-bold text-blue-800 border-b pb-4 mb-6 flex items-center gap-2 text-lg"><i className="ph-fill ph-heartbeat text-2xl"></i> 3. Medical History</h3>
              <div className="grid gap-6">
                <div><label className="form-label">Chronic Conditions</label><textarea disabled={!editMode} value={formData.chronicConditions} className="form-input bg-blue-50/50" rows="3"></textarea></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="form-label">Recent Surgeries</label><input disabled={!editMode} value={formData.surgeries} className="form-input" /></div>
                  <div><label className="form-label">Ongoing Treatments</label><input disabled={!editMode} value={formData.treatments} className="form-input" /></div>
                </div>
              </div>
            </div>

            {/* Connection Tool for Senior */}
            <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h2 className="text-xl font-bold flex items-center gap-2"><i className="ph-fill ph-user-plus text-blue-400"></i> Add Connection</h2>
                <p className="text-slate-400 text-sm">Enter ID to share health records.</p>
              </div>
              <div className="flex w-full md:w-auto bg-white/10 p-1.5 rounded-xl border border-white/20">
                <input placeholder="Enter ID" className="bg-transparent px-4 py-2 outline-none flex-1 text-white" value={connectIdInput} onChange={(e) => setConnectIdInput(e.target.value)} />
                <button onClick={() => { speak(`Request sent to ${connectIdInput}`); alert("Sent!"); setConnectIdInput(""); }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;