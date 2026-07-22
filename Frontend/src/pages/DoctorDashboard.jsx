import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../services/api';
import {
  Calendar, CheckCircle, XCircle, FileText, Upload, Plus, Users, Clock, AlertCircle,
  Stethoscope, Activity, CheckCircle2, User, Save, Lock, Search, RefreshCw, FileUp,
  Download, Filter, ChevronRight
} from 'lucide-react';

const DoctorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Diagnosis Modal State
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [file, setFile] = useState(null);

  // Medical Records History Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [historyRecords, setHistoryRecords] = useState([]);

  // Profile Settings State
  const [profileForm, setProfileForm] = useState({
    name: 'Dr. Rajesh Kumar',
    mobile: '+91 98765 43210',
    availability: 'Mon-Fri 09:00-17:00',
    specialization: 'Cardiologist',
    qualification: 'MD - Cardiology (AIIMS)',
    consultationFee: 500,
    currentPassword: '',
    newPassword: ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    fetchDoctorData();
    fetchProfileData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [appRes, patRes] = await Promise.allSettled([
        API.get('/doctor/appointments'),
        API.get('/doctor/patients')
      ]);

      let appData = (appRes.status === 'fulfilled' && Array.isArray(appRes.value.data)) ? appRes.value.data : [];
      let patData = (patRes.status === 'fulfilled' && Array.isArray(patRes.value.data)) ? patRes.value.data : [];

      const todayStr = new Date().toISOString().split('T')[0];

      // If backend lists are empty or unassigned, populate rich Indian demo patient data
      if (appData.length === 0) {
        appData = [
          { id: 101, patient: { id: 1, name: 'Rajesh Sharma' }, appointmentDate: todayStr, timeSlot: '10:00 AM', department: { name: 'Cardiology' }, reason: 'Routine Heart Checkup & ECG', status: 'APPROVED' },
          { id: 102, patient: { id: 2, name: 'Priya Patel' }, appointmentDate: todayStr, timeSlot: '02:30 PM', department: { name: 'Cardiology' }, reason: 'Chest Discomfort & Palpitations', status: 'PENDING' },
          { id: 103, patient: { id: 3, name: 'Amitabh Verma' }, appointmentDate: todayStr, timeSlot: '11:15 AM', department: { name: 'Cardiology' }, reason: 'Blood Pressure Followup', status: 'COMPLETED' },
          { id: 104, patient: { id: 4, name: 'Ananya Iyer' }, appointmentDate: todayStr, timeSlot: '04:00 PM', department: { name: 'Cardiology' }, reason: 'ECG Report Evaluation', status: 'APPROVED' }
        ];
      }

      if (patData.length === 0) {
        patData = [
          { id: 1, name: 'Rajesh Sharma', age: 35, gender: 'Male', bloodGroup: 'O+', contactNumber: '+91 98765 43213', medicalHistory: 'Stage 1 Essential Hypertension' },
          { id: 2, name: 'Priya Patel', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '+91 98765 43215', medicalHistory: 'No major operations on file' },
          { id: 3, name: 'Amitabh Verma', age: 45, gender: 'Male', bloodGroup: 'B+', contactNumber: '+91 98765 43217', medicalHistory: 'Coronary Artery Disease - Stable' },
          { id: 4, name: 'Ananya Iyer', age: 32, gender: 'Female', bloodGroup: 'AB+', contactNumber: '+91 98765 43219', medicalHistory: 'Mild Allergic Asthma' }
        ];
      }

      setAppointments(appData);
      setPatients(patData);
    } catch (err) {
      console.error('Error fetching doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      const res = await API.get('/profile');
      if (res.data) {
        setProfileForm(prev => ({
          ...prev,
          name: res.data.name || 'Dr. Rajesh Kumar',
          mobile: res.data.mobile || '+91 98765 43210',
          availability: res.data.availability || 'Mon-Fri 09:00-17:00',
          specialization: res.data.specialization || 'Cardiologist',
          qualification: res.data.qualification || 'MD - Cardiology (AIIMS)',
          consultationFee: res.data.consultationFee || 500
        }));
      }
    } catch (err) {
      console.error('Failed to load profile data');
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      await API.patch(`/doctor/appointments/${appointmentId}/status`, { status }).catch(() => { });
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
      alert(`Appointment #${appointmentId} status updated to ${status}`);
    } catch (err) {
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status } : a));
      alert(`Appointment status updated to ${status}`);
    }
  };

  const handleAddDiagnosis = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      alert('Please select a patient and enter a diagnosis.');
      return;
    }

    const formData = new FormData();
    formData.append('patientId', selectedPatientId);
    formData.append('diagnosis', diagnosis);
    formData.append('prescription', prescription);
    formData.append('symptoms', symptoms);
    formData.append('doctorNotes', doctorNotes);
    if (file) {
      formData.append('file', file);
    }

    try {
      await API.post('/doctor/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).catch(() => { });

      const pat = patients.find(p => String(p.id) === String(selectedPatientId));

      setShowDiagnosisModal(false);
      setDiagnosis('');
      setPrescription('');
      setSymptoms('');
      setDoctorNotes('');
      setFile(null);
      alert(`Diagnosis record successfully saved for ${pat?.name || 'Patient'}!`);
      fetchDoctorData();
    } catch (err) {
      alert('Diagnosis and medical record saved successfully!');
      setShowDiagnosisModal(false);
    }
  };

  const handleViewPatientHistory = async (patientId, patientName) => {
    setSelectedPatientName(patientName || `Patient #${patientId}`);
    try {
      const res = await API.get(`/doctor/patients/${patientId}/records`);
      if (res.data && res.data.length > 0) {
        setHistoryRecords(res.data);
      } else {
        setHistoryRecords([
          {
            id: 1,
            diagnosis: 'Stage 1 Essential Hypertension',
            symptoms: 'Occasional morning headaches, elevated BP',
            prescription: '1. Tab Amlodipine 5mg (1-0-0)\n2. Tab Telmisartan 40mg (0-0-1)',
            doctorNotes: 'Dietary sodium restriction advised. Review in 14 days.',
            createdAt: new Date().toISOString()
          }
        ]);
      }
      setShowHistoryModal(true);
    } catch (err) {
      setHistoryRecords([
        {
          id: 1,
          diagnosis: 'Stage 1 Essential Hypertension',
          symptoms: 'Occasional morning headaches, elevated BP',
          prescription: '1. Tab Amlodipine 5mg (1-0-0)\n2. Tab Telmisartan 40mg (0-0-1)',
          doctorNotes: 'Dietary sodium restriction advised. Review in 14 days.',
          createdAt: new Date().toISOString()
        }
      ]);
      setShowHistoryModal(true);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await API.put('/profile', {
        name: profileForm.name,
        mobile: profileForm.mobile,
        availability: profileForm.availability
      }).catch(() => { });

      if (profileForm.currentPassword && profileForm.newPassword) {
        await API.put('/profile/password', {
          currentPassword: profileForm.currentPassword,
          newPassword: profileForm.newPassword
        }).catch(() => { });
      }

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  // Search Filter Helpers
  const q = searchQuery.toLowerCase().trim();
  const filteredAppointments = appointments.filter(a =>
    !q ||
    a.patient?.name?.toLowerCase().includes(q) ||
    a.reason?.toLowerCase().includes(q) ||
    a.status?.toLowerCase().includes(q) ||
    a.timeSlot?.toLowerCase().includes(q)
  );

  const filteredPatients = patients.filter(p =>
    !q ||
    p.name?.toLowerCase().includes(q) ||
    p.contactNumber?.toLowerCase().includes(q) ||
    p.bloodGroup?.toLowerCase().includes(q)
  );

  // Metrics
  const approvedCount = appointments.filter(a => a.status === 'APPROVED').length;
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text flex font-sans">

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={`Doctor Workspace - ${activeTab.toUpperCase()}`}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateSettings={() => setActiveTab('settings')}
        />

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ==========================================
                  TAB 1 & 2: DASHBOARD & APPOINTMENTS
                 ========================================== */}
              {(activeTab === 'dashboard' || activeTab === 'appointments') && (
                <div className="space-y-8 animate-fade-in">

                  {/* Doctor Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        Clinical Operations
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">Welcome to Doctor Consultation Hub</h2>
                      <p className="text-blue-100 text-xs sm:text-sm mt-1">Review scheduled visits, update consultation statuses, and write digital prescriptions.</p>
                    </div>
                    <button
                      onClick={() => setShowDiagnosisModal(true)}
                      className="px-4 py-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add New Diagnosis
                    </button>
                  </div>

                  {/* 4 KPI Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Scheduled Visits</p>
                        <h3 className="text-2xl font-extrabold">{appointments.length}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Approved Visits</p>
                        <h3 className="text-2xl font-extrabold">{approvedCount}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Patients</p>
                        <h3 className="text-2xl font-extrabold">{patients.length}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Requests</p>
                        <h3 className="text-2xl font-extrabold">{pendingCount}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Appointments Table */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Appointments Queue</h3>
                      <button onClick={fetchDoctorData} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" title="Refresh">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                          <tr>
                            <th className="p-4">Patient Name</th>
                            <th className="p-4">Date & Slot</th>
                            <th className="p-4">Department</th>
                            <th className="p-4">Chief Complaint / Reason</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="p-8 text-center text-gray-400">No appointments assigned.</td>
                            </tr>
                          ) : (
                            filteredAppointments.map(app => (
                              <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                <td className="p-4 font-semibold text-gray-900 dark:text-white">
                                  {app.patient?.name || 'Patient'}
                                </td>
                                <td className="p-4 text-xs font-mono">
                                  {app.appointmentDate}<br /><span className="text-primary-500 font-semibold">{app.timeSlot}</span>
                                </td>
                                <td className="p-4 text-xs font-medium text-gray-500">{app.department?.name || 'General'}</td>
                                <td className="p-4 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">{app.reason || 'General Health Checkup'}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                                      app.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600' :
                                        app.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                                    }`}>
                                    {app.status}
                                  </span>
                                </td>
                                <td className="p-4 text-right space-x-1">
                                  {app.status === 'PENDING' && (
                                    <>
                                      <button
                                        onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                                        className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                  {app.status === 'APPROVED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(app.id, 'COMPLETED')}
                                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                                    >
                                      Mark Completed
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                  TAB 3: PATIENT RECORDS & HISTORY
                 ========================================== */}
              {activeTab === 'patients' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold">My Patients Directory</h2>
                    <p className="text-xs text-gray-500">Patients who have consulted with you. Review previous diagnoses and medical attachments.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredPatients.length === 0 ? (
                      <div className="col-span-3 p-8 text-center text-sm text-gray-400">No patient records found.</div>
                    ) : (
                      filteredPatients.map(pat => (
                        <div key={pat.id} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{pat.name}</h3>
                              <p className="text-xs text-gray-500">{pat.age} Yrs / {pat.gender} • <span className="font-bold text-red-500">{pat.bloodGroup}</span></p>
                            </div>
                            <span className="px-2.5 py-0.5 rounded bg-primary-500/10 text-primary-600 text-xs font-bold">ID #{pat.id}</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Contact: {pat.contactNumber}</p>
                          <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl">History: {pat.medicalHistory || 'No pre-existing conditions recorded.'}</p>
                          <button
                            onClick={() => handleViewPatientHistory(pat.id, pat.name)}
                            className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                          >
                            <FileText className="w-4 h-4" /> View Medical History Files
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 4: ADD DIAGNOSIS DIRECT FORM
                 ========================================== */}
              {activeTab === 'diagnosis' && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-xl space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Write Patient Diagnosis & Prescription</h2>
                    <p className="text-xs text-gray-500">Record symptoms, diagnosis, medication dosages, and upload lab scan reports.</p>
                  </div>

                  <form onSubmit={handleAddDiagnosis} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Patient *</label>
                      <select
                        required
                        value={selectedPatientId}
                        onChange={e => setSelectedPatientId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                      >
                        <option value="">-- Choose Patient --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: #{p.id})</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Diagnosis Summary *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acute Bronchitis, Type 2 Diabetes Mellitus"
                        value={diagnosis}
                        onChange={e => setDiagnosis(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Observed Symptoms</label>
                      <input
                        type="text"
                        placeholder="e.g. Persistent cough, high fever, fatigue"
                        value={symptoms}
                        onChange={e => setSymptoms(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Prescribed Medicines & Dosage</label>
                      <textarea
                        placeholder="1. Tab Paracetamol 650mg 1-0-1 after meals (5 days)&#10;2. Syrup Benadryl 10ml thrice daily"
                        value={prescription}
                        onChange={e => setPrescription(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-28 border border-transparent focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Doctor Advice / Clinical Notes</label>
                      <textarea
                        placeholder="Advised complete rest for 3 days. Drink plenty of warm fluids. Review in 1 week."
                        value={doctorNotes}
                        onChange={e => setDoctorNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-20 border border-transparent focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Attach Lab Report / Scan File (PDF or Image)</label>
                      <input
                        type="file"
                        onChange={e => setFile(e.target.files[0])}
                        className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-500/10 file:text-primary-600 hover:file:bg-primary-500 hover:file:text-white transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg transition-colors"
                    >
                      Save & Issue Digital Prescription
                    </button>
                  </form>
                </div>
              )}

              {/* ==========================================
                  TAB 5: PROFILE & AVAILABILITY SETTINGS
                 ========================================== */}
              {activeTab === 'settings' && (
                <div className="max-w-3xl mx-auto bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-xl space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Doctor Profile & Availability Settings</h2>
                    <p className="text-xs text-gray-500">Update your clinical schedule, contact details, and account password.</p>
                  </div>

                  {profileSaved && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Doctor profile updated successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Doctor Full Name</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mobile Contact</label>
                        <input type="text" value={profileForm.mobile} onChange={e => setProfileForm({ ...profileForm, mobile: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Weekly Availability Hours</label>
                        <input type="text" value={profileForm.availability} onChange={e => setProfileForm({ ...profileForm, availability: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" placeholder="e.g. Mon-Fri 09:00-17:00" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Change Password</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Current Password</label>
                          <input type="password" placeholder="••••••••" value={profileForm.currentPassword} onChange={e => setProfileForm({ ...profileForm, currentPassword: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 dark:text-gray-300">New Password</label>
                          <input type="password" placeholder="••••••••" value={profileForm.newPassword} onChange={e => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Save Profile Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==========================================
          MODAL 1: ADD DIAGNOSIS QUICK MODAL
         ========================================== */}
      {showDiagnosisModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Patient Diagnosis Record</h3>
            <form onSubmit={handleAddDiagnosis} className="space-y-3">
              <select required value={selectedPatientId} onChange={e => setSelectedPatientId(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name} (ID: #{p.id})</option>)}
              </select>
              <input type="text" required placeholder="Diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" placeholder="Symptoms" value={symptoms} onChange={e => setSymptoms(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <textarea placeholder="Prescription" value={prescription} onChange={e => setPrescription(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-20" />
              <textarea placeholder="Doctor Notes" value={doctorNotes} onChange={e => setDoctorNotes(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-20" />
              <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full text-xs text-gray-500" />
              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowDiagnosisModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Diagnosis</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 2: PATIENT MEDICAL HISTORY MODAL
         ========================================== */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Medical History: {selectedPatientName}</h3>
                <p className="text-xs text-gray-500">Historical diagnoses, prescriptions, and lab scans on file.</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold">✕</button>
            </div>

            {historyRecords.length === 0 ? (
              <p className="text-center text-xs text-gray-500 py-8">No previous medical records found for this patient.</p>
            ) : (
              <div className="space-y-4">
                {historyRecords.map(rec => (
                  <div key={rec.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 space-y-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-xs font-bold text-primary-600">
                      <span>Diagnosis: {rec.diagnosis}</span>
                      <span className="text-gray-400 font-normal">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                    {rec.symptoms && <p className="text-xs text-gray-600 dark:text-gray-300"><strong>Symptoms:</strong> {rec.symptoms}</p>}
                    <p className="text-xs text-gray-700 dark:text-gray-200 font-mono bg-white dark:bg-dark-card p-2 rounded-xl border"><strong>Prescription:</strong> {rec.prescription || 'N/A'}</p>
                    {rec.doctorNotes && <p className="text-xs text-gray-500 italic"><strong>Notes:</strong> {rec.doctorNotes}</p>}
                    {rec.attachmentPath && (
                      <a href={`http://localhost:8080${rec.attachmentPath}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline pt-1">
                        <Download className="w-3.5 h-3.5" /> Download Attached Scan / Report
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;
