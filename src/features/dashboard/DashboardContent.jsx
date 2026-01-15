import React, { useState, useEffect } from 'react';
import VitalsCard from './VitalsCard';
import SosButton from './SosButton';
import ManualEntryModal from '../../components/ui/ManualEntryModal';
import NotificationAlert from '../../components/ui/NotificationAlert';
import ChartModal from '../../components/charts/ChartModal';
import HealthScoreRing from '../../components/charts/HealthScoreRing'; // Importing Ring directly for simplicity
import { MockBackend } from '../../services/mockBackend';

const DashboardContent = ({ data, refreshData, user, setTab }) => {
  const [connected, setConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [sosStep, setSosStep] = useState(0);
  const [editingMetric, setEditingMetric] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);
  
  // Role Logic
  const userRole = user?.role?.toLowerCase() || 'senior';
  const isDoctor = userRole === 'doctor';
  const isCareTeam = ['doctor', 'caretaker'].includes(userRole);

  // Live Data State
  const [liveSteps, setLiveSteps] = useState(data.vitals.steps);
  const [liveHeart, setLiveHeart] = useState(data.vitals.heartRate);
  const [liveBP, setLiveBP] = useState(data.vitals.bp);
  const [liveSleep, setLiveSleep] = useState(data.vitals.sleep);

  // 1. Sync State on Data Change
  useEffect(() => {
    setLiveSteps(data.vitals.steps);
    setLiveHeart(data.vitals.heartRate);
    setLiveBP(data.vitals.bp);
    setLiveSleep(data.vitals.sleep);
  }, [data]);

  // 2. Mock Alert Logic
  useEffect(() => {
    const interval = setInterval(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; 
        const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        
        const found = data.reminders.find(r => r.day === now.getDate() && r.time === formattedTime && !r.completed && !r.notified);
        if (found) setActiveAlert(found);
    }, 5000); 
    return () => clearInterval(interval);
  }, [data]);

  // 3. Live Watch Simulation
  useEffect(() => {
    let interval;
    if(connected) {
        interval = setInterval(() => {
            setLiveSteps(prev => {
                const newVal = Number(prev) + Math.floor(Math.random() * 3);
                // Update DB implicitly for persistence
                const current = MockBackend.getData();
                current.vitals.steps = newVal;
                MockBackend.updateData(current);
                return newVal;
            });
            setLiveHeart(() => 70 + Math.floor(Math.random() * 5));
        }, 2000);
    }
    return () => clearInterval(interval);
  }, [connected]);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => { setConnected(true); setSyncing(false); refreshData(); }, 1500);
  };

  const handleSOS = () => {
    if (sosStep === 0) { 
        setSosStep(1); 
        setTimeout(() => setSosStep(0), 3000); 
    } else { 
        alert(`🚨 SOS ALERT SENT TO ALL CONTACTS!`);
        setSosStep(0); 
    }
  };

  const handleSaveManual = (val) => {
    if(val && editingMetric) {
        const newData = {...data};
        let key = '';
        let finalVal = val;
        let graphVal = parseInt(val, 10); 

        if(editingMetric.includes('Steps')) key = 'steps';
        else if(editingMetric.includes('BP')) { key = 'bp'; graphVal = parseInt(val.split('/')[0]); finalVal = val; }
        else if(editingMetric.includes('Sleep')) { key = 'sleep'; finalVal = val.display; graphVal = val.value; }
        else if(editingMetric.includes('Heart')) key = 'heartRate';

        if(key) {
            if(key === 'heartRate') newData.vitals.heartRate = graphVal;
            else if(key === 'steps') newData.vitals.steps = graphVal;
            else newData.vitals[key] = finalVal;
            
            MockBackend.updateData(newData);
            refreshData();
        }
        setEditingMetric(null);
    }
  };

  const completeReminder = () => {
    if(!activeAlert) return;
    const newReminders = data.reminders.map(r => r.id === activeAlert.id ? { ...r, completed: true } : r);
    MockBackend.updateData({ ...data, reminders: newReminders });
    refreshData();
    setActiveAlert(null);
  };

  // Helper to get historic array for charts
  const getHistoryArray = (metric) => {
    if (metric === 'Steps') return data.history.steps;
    if (metric === 'Heart Rate') return data.history.heart;
    if (metric === 'BP') return data.history.bp;
    if (metric === 'Sleep') return data.history.sleep;
    return [];
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-32">
      {/* Modals */}
      {editingMetric && <ManualEntryModal metric={editingMetric} onClose={() => setEditingMetric(null)} onSave={handleSaveManual} />}
      {activeAlert && <NotificationAlert reminder={activeAlert} onComplete={completeReminder} onClose={() => setActiveAlert(null)} />}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Namaste, {user.name.split(' ')[0]} 🙏</h1>
          <p className="text-sm md:text-base text-slate-500">Here's your health summary.</p>
        </div>
        
        {/* Connect Watch Button */}
        {!isCareTeam && (
          <button 
            onClick={handleSync} 
            className={`shrink-0 flex items-center justify-center gap-2 w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-2.5 rounded-full font-bold shadow-md transition-all ${connected ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700'} ${syncing ? 'animate-pulse' : ''}`}
          >
            <i className={`ph-bold ${connected ? 'ph-bluetooth-connected' : 'ph-bluetooth'} text-xl`}></i> 
            <span className="hidden md:inline">{syncing ? 'Syncing...' : connected ? 'Live Sync On' : 'Connect Watch'}</span>
          </button>
        )}
      </div>

      {/* SOS Button Component */}
      <SosButton isCareTeam={isCareTeam} sosStep={sosStep} handleSOS={handleSOS} user={user} />

      {/* Grid of Vitals Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VitalsCard 
          title="Daily Steps" value={liveSteps} subtitle="Daily Steps" icon="ph-sneaker-move" color="teal" 
          progress={(liveSteps / data.vitals.target) * 100}
          onClick={() => setSelectedMetric('Steps')}
          onAddClick={() => setEditingMetric('Daily Steps')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Heart Rate" value={liveHeart} unit="bpm" subtitle="Heart Rate" icon="ph-heartbeat" color="red"
          onClick={() => setSelectedMetric('Heart Rate')}
          onAddClick={() => setEditingMetric('Heart Rate')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Blood Pressure" value={liveBP} subtitle="Blood Pressure" icon="ph-drop" color="blue"
          onClick={() => setSelectedMetric('BP')}
          onAddClick={() => setEditingMetric('BP')}
          isDoctor={isDoctor}
        />
        <VitalsCard 
          title="Sleep" 
          value={typeof liveSleep === 'object' ? liveSleep.display : liveSleep} 
          unit={typeof liveSleep !== 'object' ? 'h' : ''}
          subtitle="Sleep Duration" icon="ph-moon-stars" color="purple"
          onClick={() => setSelectedMetric('Sleep')}
          onAddClick={() => setEditingMetric('Sleep Duration')}
          isDoctor={isDoctor}
        />
      </div>

      {/* Chart Modal (If metric selected) */}
      {selectedMetric && (
        <ChartModal 
            type={selectedMetric} 
            history={getHistoryArray(selectedMetric)} 
            currentVal={
                selectedMetric === 'Steps' ? liveSteps : 
                selectedMetric === 'Heart Rate' ? liveHeart : 
                0 // Simplified for brevity
            } 
            close={() => setSelectedMetric(null)} 
        />
      )}
    </div>
  );
};

export default DashboardContent;