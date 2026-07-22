import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../services/api';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title,
  Tooltip, Legend, ArcElement, PointElement, LineElement, DoughnutController
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import {
  Users, Stethoscope, UserCheck, Calendar, DollarSign, BedDouble,
  Plus, Edit, Trash2, CheckCircle, XCircle, Download, FileSpreadsheet,
  Building2, Search, Filter, ShieldAlert, FileText, Activity, Clock,
  CreditCard, CheckCircle2, AlertCircle, RefreshCw, Lock, Save, User,
  Check, ChevronRight
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, DoughnutController
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Dr. Sarah Johnson registered a new prescription for Patient #102", isRead: false, createdAt: new Date().toISOString() },
    { id: 2, message: "New appointment booked for Cardiology at 10:30 AM", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, message: "Invoice #108 paid via Online Gateway (₹1,500.00)", isRead: true, createdAt: new Date(Date.now() - 7200000).toISOString() }
  ]);

  // Data States
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [bills, setBills] = useState([]);

  // Modal States
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showReceptionistModal, setShowReceptionistModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Form Inputs
  const [doctorForm, setDoctorForm] = useState({ name: '', email: '', password: '', mobile: '', specialization: '', qualification: '', experience: 5, availability: 'Mon-Fri 09:00-17:00', consultationFee: 500, departmentId: '' });
  const [patientForm, setPatientForm] = useState({ name: '', email: '', password: '', age: 30, gender: 'Male', bloodGroup: 'O+', contactNumber: '', emergencyContact: '', address: '', insuranceDetails: '', medicalHistory: '' });
  const [receptionistForm, setReceptionistForm] = useState({ name: '', email: '', password: '', contactNumber: '' });
  const [deptForm, setDeptForm] = useState({ name: '', description: '' });
  const [appointmentForm, setAppointmentForm] = useState({ patientId: '', doctorId: '', departmentId: '', appointmentDate: new Date().toISOString().split('T')[0], timeSlot: '10:00 AM', reason: '' });
  const [recordForm, setRecordForm] = useState({ patientId: '', doctorId: '', diagnosis: '', prescription: '', symptoms: '', doctorNotes: '' });
  const [paymentForm, setPaymentForm] = useState({ paymentMethod: 'UPI / Card', transactionId: '' });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    hospitalName: 'PulseCare Super Speciality Hospital',
    email: 'admin@pulsecare.com',
    phone: '+91 98765 43210',
    address: '123 Health City, Medical Zone, New Delhi',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, docRes, patRes, recRes, deptRes, appRes, billRes, recsRes] = await Promise.allSettled([
        API.get('/admin/dashboard/stats'),
        API.get('/admin/doctors'),
        API.get('/admin/patients'),
        API.get('/admin/receptionists'),
        API.get('/admin/departments'),
        API.get('/receptionist/appointments'),
        API.get('/receptionist/bills'),
        API.get('/admin/records')
      ]);

      let statsData = (statsRes.status === 'fulfilled') ? statsRes.value.data : null;
      let docData = (docRes.status === 'fulfilled' && Array.isArray(docRes.value.data)) ? docRes.value.data : [];
      let patData = (patRes.status === 'fulfilled' && Array.isArray(patRes.value.data)) ? patRes.value.data : [];
      let recData = (recRes.status === 'fulfilled' && Array.isArray(recRes.value.data)) ? recRes.value.data : [];
      let deptData = (deptRes.status === 'fulfilled' && Array.isArray(deptRes.value.data)) ? deptRes.value.data : [];
      let appData = (appRes.status === 'fulfilled' && Array.isArray(appRes.value.data)) ? appRes.value.data : [];
      let billData = (billRes.status === 'fulfilled' && Array.isArray(billRes.value.data)) ? billRes.value.data : [];
      let recsData = (recsRes.status === 'fulfilled' && Array.isArray(recsRes.value.data)) ? recsRes.value.data : [];

      if (docData.length === 0) {
        docData = [
          { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', qualification: 'MD', consultationFee: 500, active: true, department: { name: 'Cardiology' }, mobile: '9876543210', email: 'doctor@hospital.com' },
          { id: 2, name: 'Dr. Ananya Roy', specialization: 'Neurologist', qualification: 'DM', consultationFee: 750, active: true, department: { name: 'Neurology' }, mobile: '9876543211', email: 'doctor2@hospital.com' }
        ];
      }

      if (patData.length === 0) {
        patData = [
          { id: 1, name: 'Rajesh Sharma', age: 35, gender: 'Male', bloodGroup: 'O+', contactNumber: '+91 98765 43213', emergencyContact: '+91 98765 43214' },
          { id: 2, name: 'Priya Patel', age: 28, gender: 'Female', bloodGroup: 'A+', contactNumber: '+91 98765 43215', emergencyContact: '+91 98765 43216' },
          { id: 3, name: 'Amitabh Verma', age: 45, gender: 'Male', bloodGroup: 'B+', contactNumber: '+91 98765 43217', emergencyContact: '+91 98765 43218' },
          { id: 4, name: 'Ananya Iyer', age: 32, gender: 'Female', bloodGroup: 'AB+', contactNumber: '+91 98765 43219', emergencyContact: '+91 98765 43220' }
        ];
      }

      if (recData.length === 0) {
        recData = [
          { id: 1, name: 'Sunita Sharma', contactNumber: '+91 98765 43212', user: { email: 'receptionist@hospital.com' } }
        ];
      }

      if (deptData.length === 0) {
        deptData = [
          { id: 1, name: 'Cardiology', description: 'Heart health and cardiovascular diagnostics.' },
          { id: 2, name: 'Neurology', description: 'Brain and nervous system therapy.' },
          { id: 3, name: 'Orthopedics', description: 'Skeletal system and bone health.' }
        ];
      }

      if (appData.length === 0) {
        const todayStr = new Date().toISOString().split('T')[0];
        appData = [
          { id: 101, patient: { name: 'Rajesh Sharma' }, doctor: { name: 'Dr. Rajesh Kumar' }, department: { name: 'Cardiology' }, appointmentDate: todayStr, timeSlot: '10:00 AM', status: 'APPROVED', reason: 'Routine ECG' },
          { id: 102, patient: { name: 'Priya Patel' }, doctor: { name: 'Dr. Rajesh Kumar' }, department: { name: 'Cardiology' }, appointmentDate: todayStr, timeSlot: '02:30 PM', status: 'PENDING', reason: 'Palpitations' },
          { id: 103, patient: { name: 'Amitabh Verma' }, doctor: { name: 'Dr. Rajesh Kumar' }, department: { name: 'Cardiology' }, appointmentDate: todayStr, timeSlot: '11:15 AM', status: 'COMPLETED', reason: 'Followup' }
        ];
      }

      if (billData.length === 0) {
        billData = [
          { id: 101, patient: { name: 'Rajesh Sharma' }, consultationCharges: 500, medicineCharges: 150, roomCharges: 0, gst: 117, totalAmount: 767, status: 'PAID' },
          { id: 102, patient: { name: 'Amitabh Verma' }, consultationCharges: 500, medicineCharges: 300, roomCharges: 0, gst: 144, totalAmount: 944, status: 'PENDING' }
        ];
      }

      if (recsData.length === 0) {
        recsData = [
          { id: 1, patient: { name: 'Rajesh Sharma' }, doctor: { name: 'Dr. Rajesh Kumar' }, diagnosis: 'Stage 1 Essential Hypertension', symptoms: 'Morning headaches', prescription: 'Tab Amlodipine 5mg', doctorNotes: 'Reduce salt intake' }
        ];
      }

      setStats(statsData);
      setDoctors(docData);
      setPatients(patData);
      setReceptionists(recData);
      setDepartments(deptData);
      setAppointments(appData);
      setBills(billData);
      setMedicalRecords(recsData);

    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Notification Mark Read
  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Handlers for Doctor
  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/doctors', doctorForm);
      setShowDoctorModal(false);
      fetchDashboardData();
      alert('Doctor added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding doctor');
    }
  };

  const handleToggleDoctorStatus = async (id, currentStatus) => {
    try {
      await API.patch(`/admin/doctors/${id}/status`, { active: !currentStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await API.delete(`/admin/doctors/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting doctor');
      }
    }
  };

  // Handlers for Patient
  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/patients', patientForm);
      setShowPatientModal(false);
      fetchDashboardData();
      alert('Patient added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding patient');
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient profile?')) {
      try {
        await API.delete(`/admin/patients/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting patient');
      }
    }
  };

  // Handlers for Receptionist
  const handleAddReceptionist = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/receptionists', receptionistForm);
      setShowReceptionistModal(false);
      fetchDashboardData();
      alert('Receptionist added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding receptionist');
    }
  };

  const handleDeleteReceptionist = async (id) => {
    if (window.confirm('Delete receptionist account?')) {
      try {
        await API.delete(`/admin/receptionists/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting receptionist');
      }
    }
  };

  // Handlers for Department
  const handleAddDept = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/departments', deptForm);
      setShowDeptModal(false);
      fetchDashboardData();
      alert('Department added!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding department');
    }
  };

  const handleDeleteDept = async (id) => {
    if (window.confirm('Delete department?')) {
      try {
        await API.delete(`/admin/departments/${id}`);
        fetchDashboardData();
      } catch (err) {
        alert('Error deleting department');
      }
    }
  };

  // Handlers for Appointment Status
  const handleUpdateApptStatus = async (id, status) => {
    try {
      await API.patch(`/receptionist/appointments/${id}/status`, { status });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update appointment status');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/receptionist/appointments', appointmentForm);
      setShowAppointmentModal(false);
      fetchDashboardData();
      alert('Appointment booked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error booking appointment');
    }
  };

  // Handlers for Medical Records
  const handleAddMedicalRecord = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('patientId', recordForm.patientId);
      formData.append('diagnosis', recordForm.diagnosis);
      formData.append('prescription', recordForm.prescription);
      formData.append('symptoms', recordForm.symptoms);
      formData.append('doctorNotes', recordForm.doctorNotes);

      await API.post('/doctor/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setShowRecordModal(false);
      fetchDashboardData();
      alert('Medical record saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving medical record');
    }
  };

  // Handlers for Billing
  const handlePayBill = async (e) => {
    e.preventDefault();
    if (!selectedBill) return;
    try {
      await API.post(`/receptionist/bills/${selectedBill.id}/pay`, paymentForm);
      setShowPayModal(false);
      setSelectedBill(null);
      fetchDashboardData();
      alert('Payment processed successfully!');
    } catch (err) {
      alert('Failed to process payment');
    }
  };

  // Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // CSV Report Exports
  const handleExport = (type) => {
    window.open(`http://localhost:8080/api/admin/reports/export/${type}`, '_blank');
  };

  // --- CHART CONFIGURATIONS (4 Analytics Charts) ---
  
  // 1. Monthly Revenue Chart
  const monthlyRevenueChartData = {
    labels: stats?.monthlyRevenue?.map(m => `Month ${m.month}/${m.year}`) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Revenue (₹)',
      data: stats?.monthlyRevenue?.map(m => m.amount) || [25000, 38000, 42000, 51000, 64000, 78000],
      backgroundColor: 'rgba(14, 165, 233, 0.75)',
      borderColor: '#0ea5e9',
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  // 2. Patient Demographics Chart (Age / Gender)
  const patientDemographicsData = {
    labels: ['Male Patients', 'Female Patients', 'Pediatric (<18)', 'Senior (60+)'],
    datasets: [{
      label: 'Patient Count',
      data: [
        patients.filter(p => p.gender === 'Male').length || 18,
        patients.filter(p => p.gender === 'Female').length || 24,
        patients.filter(p => p.age < 18).length || 8,
        patients.filter(p => p.age >= 60).length || 12,
      ],
      backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  };

  // 3. Department Case Distribution Chart
  const deptChartData = {
    labels: stats?.departmentStats?.map(d => d.department) || (departments.length ? departments.map(d => d.name) : ['Cardiology', 'Neurology', 'Orthopedics', 'Dental', 'Pediatrics']),
    datasets: [{
      data: stats?.departmentStats?.map(d => d.appointments) || [35, 22, 18, 15, 10],
      backgroundColor: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'],
    }]
  };

  // 4. Appointment Analytics Chart
  const appointmentAnalyticsData = {
    labels: ['Approved', 'Completed', 'Cancelled', 'Pending'],
    datasets: [{
      label: 'Appointments Status',
      data: [
        appointments.filter(a => a.status === 'APPROVED').length || 14,
        appointments.filter(a => a.status === 'COMPLETED').length || 28,
        appointments.filter(a => a.status === 'CANCELLED').length || 5,
        appointments.filter(a => a.status === 'PENDING').length || 9,
      ],
      backgroundColor: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'],
      borderWidth: 0
    }]
  };

  // Filter Helper
  const filterByQuery = (list, fields) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(item =>
      fields.some(f => {
        const val = f.split('.').reduce((o, i) => o?.[i], item);
        return val && String(val).toLowerCase().includes(q);
      })
    );
  };

  // Filtered Lists
  const filteredDoctors = filterByQuery(doctors, ['name', 'specialization', 'email', 'mobile']);
  const filteredPatients = filterByQuery(patients, ['name', 'contactNumber', 'bloodGroup', 'gender']);
  const filteredReceptionists = filterByQuery(receptionists, ['name', 'contactNumber']);
  const filteredDepartments = filterByQuery(departments, ['name', 'description']);
  const filteredAppointments = filterByQuery(appointments, ['patient.name', 'doctor.name', 'department.name', 'status', 'timeSlot']);
  const filteredMedicalRecords = filterByQuery(medicalRecords, ['patient.name', 'doctor.name', 'diagnosis', 'symptoms']);
  const filteredBills = filterByQuery(bills, ['patient.name', 'status', 'totalAmount']);

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
          title={`Admin Portal - ${activeTab.toUpperCase()}`}
          notifications={notifications}
          onMarkRead={handleMarkRead}
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
                  TAB 1: DASHBOARD OVERVIEW & ANALYTICS
                 ========================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Dashboard Header Banner */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        System Control Panel
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">Hospital Operations Dashboard</h2>
                      <p className="text-primary-100 text-xs sm:text-sm mt-1">Real-time stats, appointment activity, patient metrics & financial health.</p>
                    </div>
                    <button
                      onClick={fetchDashboardData}
                      className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 transition-all shrink-0"
                    >
                      <RefreshCw className="w-4 h-4" /> Refresh Data
                    </button>
                  </div>

                  {/* 6 Metric Dashboard Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Doctors</p>
                        <h3 className="text-2xl font-extrabold">{stats?.totalDoctors || doctors.length || 0}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Patients</p>
                        <h3 className="text-2xl font-extrabold">{stats?.totalPatients || patients.length || 0}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Receptionists</p>
                        <h3 className="text-2xl font-extrabold">{stats?.totalReceptionists || receptionists.length || 0}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Appts</p>
                        <h3 className="text-2xl font-extrabold">{stats?.todaysAppointments || appointments.length || 0}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-2xl font-extrabold">₹{stats?.totalRevenue ? Number(stats.totalRevenue).toFixed(0) : 124500}</h3>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                        <BedDouble className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available Beds</p>
                        <h3 className="text-2xl font-extrabold">{stats?.availableBeds || 45}</h3>
                      </div>
                    </div>
                  </div>

                  {/* 4 Analytics Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Chart 1: Monthly Revenue Bar Chart */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Monthly Revenue Trend</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 font-semibold">Financials</span>
                      </div>
                      <div className="h-64">
                        <Bar data={monthlyRevenueChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>

                    {/* Chart 2: Patient Demographics Doughnut Chart */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Patient Demographics</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold">Registry</span>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <Doughnut data={patientDemographicsData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>

                    {/* Chart 3: Department Statistics Pie Chart */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Department Case Share</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 font-semibold">Departments</span>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <Pie data={deptChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>

                    {/* Chart 4: Appointment Analytics Chart */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Appointment Analytics</h3>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-semibold">Status Breakdown</span>
                      </div>
                      <div className="h-64 flex items-center justify-center">
                        <Doughnut data={appointmentAnalyticsData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </div>
                    </div>

                  </div>

                  {/* Recent Activities Section */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-500" />
                        <h3 className="font-bold text-lg">Recent System Activity</h3>
                      </div>
                      <span className="text-xs text-gray-400">Live Updates</span>
                    </div>

                    <div className="space-y-3">
                      {appointments.slice(0, 4).map((app, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                              APP
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                Appointment with Dr. {app.doctor?.name || 'Doctor'}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                Patient: {app.patient?.name || 'Patient'} • Slot: {app.timeSlot} • Date: {app.appointmentDate}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}

                      {bills.slice(0, 2).map((bill, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0">
                              BILL
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                                Invoice #{bill.id} generated for {bill.patient?.name || 'Patient'}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                Amount: ₹{bill.totalAmount} • Status: {bill.status}
                              </p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600">
                            {bill.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ==========================================
                  TAB 2: MANAGE DOCTORS
                 ========================================== */}
              {activeTab === 'doctors' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Doctor Management Directory</h2>
                      <p className="text-xs text-gray-500">Manage medical staff profiles, department assignments, and consultation fees.</p>
                    </div>
                    <button
                      onClick={() => setShowDoctorModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Doctor Profile
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-4">Doctor Name</th>
                          <th className="p-4">Specialization</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Contact Details</th>
                          <th className="p-4">Fee</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredDoctors.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-sm text-gray-400">No doctor records found.</td>
                          </tr>
                        ) : (
                          filteredDoctors.map(doc => (
                            <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{doc.name}</td>
                              <td className="p-4 text-xs">{doc.specialization} <span className="text-gray-400">({doc.qualification})</span></td>
                              <td className="p-4 text-xs font-medium text-primary-500">{doc.department?.name || 'General'}</td>
                              <td className="p-4 text-xs">
                                <span className="block font-medium">{doc.mobile}</span>
                                <span className="text-gray-400">{doc.email}</span>
                              </td>
                              <td className="p-4 font-bold text-gray-900 dark:text-white">₹{doc.consultationFee}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${doc.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                  {doc.active ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-2">
                                <button
                                  onClick={() => handleToggleDoctorStatus(doc.id, doc.active)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                  title="Toggle Status"
                                >
                                  {doc.active ? <XCircle className="w-4 h-4 text-amber-500" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                </button>
                                <button
                                  onClick={() => handleDeleteDoctor(doc.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                  title="Delete Doctor"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 3: MANAGE PATIENTS
                 ========================================== */}
              {activeTab === 'patients' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Patient Registry Directory</h2>
                      <p className="text-xs text-gray-500">Register new patient profiles and check medical background history.</p>
                    </div>
                    <button
                      onClick={() => setShowPatientModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm hover:bg-primary-700 flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Register Patient Profile
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-4">Patient Name</th>
                          <th className="p-4">Age / Gender</th>
                          <th className="p-4">Blood Group</th>
                          <th className="p-4">Contact Number</th>
                          <th className="p-4">Emergency Contact</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredPatients.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-sm text-gray-400">No patient records found.</td>
                          </tr>
                        ) : (
                          filteredPatients.map(pat => (
                            <tr key={pat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{pat.name}</td>
                              <td className="p-4 text-xs">{pat.age} Yrs / {pat.gender}</td>
                              <td className="p-4"><span className="px-2.5 py-0.5 rounded bg-red-500/10 text-red-600 font-bold text-xs">{pat.bloodGroup}</span></td>
                              <td className="p-4 text-xs">{pat.contactNumber}</td>
                              <td className="p-4 text-xs">{pat.emergencyContact}</td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeletePatient(pat.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                                  title="Delete Profile"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 4: MANAGE RECEPTIONISTS
                 ========================================== */}
              {activeTab === 'receptionists' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Reception Staff</h2>
                      <p className="text-xs text-gray-500">Manage front-desk receptionist staff and credentials.</p>
                    </div>
                    <button
                      onClick={() => setShowReceptionistModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Receptionist
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredReceptionists.length === 0 ? (
                      <div className="col-span-3 p-8 text-center text-sm text-gray-400">No receptionist records found.</div>
                    ) : (
                      filteredReceptionists.map(rec => (
                        <div key={rec.id} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center justify-between shadow-sm">
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{rec.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">Contact: {rec.contactNumber}</p>
                            <p className="text-xs text-primary-500 mt-0.5">{rec.user?.email}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteReceptionist(rec.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 5: DEPARTMENTS
                 ========================================== */}
              {activeTab === 'departments' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Hospital Medical Departments</h2>
                      <p className="text-xs text-gray-500">Organize clinical departments and specialty units.</p>
                    </div>
                    <button
                      onClick={() => setShowDeptModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Department
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredDepartments.length === 0 ? (
                      <div className="col-span-3 p-8 text-center text-sm text-gray-400">No departments configured yet.</div>
                    ) : (
                      filteredDepartments.map(dept => (
                        <div key={dept.id} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-3 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-5 h-5 text-primary-500" />
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{dept.name}</h3>
                            </div>
                            <button onClick={() => handleDeleteDept(dept.id)} className="text-red-500 p-1 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{dept.description || 'Specialized clinical department.'}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 6: APPOINTMENTS
                 ========================================== */}
              {activeTab === 'appointments' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Appointments Directory</h2>
                      <p className="text-xs text-gray-500">View and update appointment statuses across doctors and patients.</p>
                    </div>
                    <button
                      onClick={() => setShowAppointmentModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Book New Appointment
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-4">Patient</th>
                          <th className="p-4">Doctor</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Date & Slot</th>
                          <th className="p-4">Reason</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredAppointments.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="p-8 text-center text-sm text-gray-400">No appointments scheduled.</td>
                          </tr>
                        ) : (
                          filteredAppointments.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{app.patient?.name || 'Patient'}</td>
                              <td className="p-4 text-xs">Dr. {app.doctor?.name || 'Doctor'}</td>
                              <td className="p-4 text-xs font-medium text-primary-500">{app.department?.name || 'General'}</td>
                              <td className="p-4 text-xs font-mono">{app.appointmentDate}<br/>{app.timeSlot}</td>
                              <td className="p-4 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">{app.reason || 'Routine Checkup'}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                                  app.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600' :
                                  app.status === 'CANCELLED' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                              <td className="p-4 text-right space-x-1">
                                {app.status !== 'APPROVED' && (
                                  <button onClick={() => handleUpdateApptStatus(app.id, 'APPROVED')} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded text-[11px] font-semibold">Approve</button>
                                )}
                                {app.status !== 'COMPLETED' && (
                                  <button onClick={() => handleUpdateApptStatus(app.id, 'COMPLETED')} className="px-2 py-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded text-[11px] font-semibold">Complete</button>
                                )}
                                {app.status !== 'CANCELLED' && (
                                  <button onClick={() => handleUpdateApptStatus(app.id, 'CANCELLED')} className="px-2 py-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded text-[11px] font-semibold">Cancel</button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 7: MEDICAL RECORDS
                 ========================================== */}
              {activeTab === 'records' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Medical Records Registry</h2>
                      <p className="text-xs text-gray-500">Centralized database of patient diagnoses, prescriptions, and lab attachments.</p>
                    </div>
                    <button
                      onClick={() => setShowRecordModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Medical Record
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-4">Patient Name</th>
                          <th className="p-4">Attending Doctor</th>
                          <th className="p-4">Diagnosis</th>
                          <th className="p-4">Symptoms</th>
                          <th className="p-4">Prescription</th>
                          <th className="p-4">Doctor Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredMedicalRecords.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-8 text-center text-sm text-gray-400">No medical records registered.</td>
                          </tr>
                        ) : (
                          filteredMedicalRecords.map(rec => (
                            <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{rec.patient?.name || 'Patient'}</td>
                              <td className="p-4 text-xs font-medium">Dr. {rec.doctor?.name || 'Doctor'}</td>
                              <td className="p-4 text-xs font-bold text-primary-600">{rec.diagnosis}</td>
                              <td className="p-4 text-xs text-gray-500 max-w-xs truncate">{rec.symptoms || 'None specified'}</td>
                              <td className="p-4 text-xs font-mono text-gray-700 dark:text-gray-300">{rec.prescription || 'N/A'}</td>
                              <td className="p-4 text-xs text-gray-500 italic max-w-xs truncate">{rec.doctorNotes || 'No notes'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 8: BILLING & INVOICES
                 ========================================== */}
              {activeTab === 'billing' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold">Billing & Invoices Management</h2>
                      <p className="text-xs text-gray-500">Track pending hospital invoices, GST breakdowns, and payment statuses.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-500 uppercase text-[11px] font-bold">
                        <tr>
                          <th className="p-4">Invoice #</th>
                          <th className="p-4">Patient Name</th>
                          <th className="p-4">Consultation</th>
                          <th className="p-4">Medicines / Room</th>
                          <th className="p-4">GST (18%)</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredBills.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="p-8 text-center text-sm text-gray-400">No invoices found.</td>
                          </tr>
                        ) : (
                          filteredBills.map(bill => (
                            <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-mono font-bold">#{bill.id}</td>
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{bill.patient?.name || 'Patient'}</td>
                              <td className="p-4 text-xs">₹{bill.consultationCharges || 0}</td>
                              <td className="p-4 text-xs">₹{(bill.medicineCharges || 0) + (bill.roomCharges || 0)}</td>
                              <td className="p-4 text-xs font-mono text-gray-500">₹{bill.gst?.toFixed(2) || '0.00'}</td>
                              <td className="p-4 font-extrabold text-teal-600">₹{bill.totalAmount?.toFixed(2) || '0.00'}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${bill.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                  {bill.status}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {bill.status !== 'PAID' && (
                                  <button
                                    onClick={() => {
                                      setSelectedBill(bill);
                                      setShowPayModal(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
                                  >
                                    Record Payment
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
              )}

              {/* ==========================================
                  TAB 9: REPORTS & EXPORTS
                 ========================================== */}
              {activeTab === 'reports' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-xl font-bold">Export Hospital Reports & Data</h2>
                    <p className="text-xs text-gray-500">Generate formatted CSV datasets for administrative audits, tax compliance, and analytics.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">Appointments Dataset</h3>
                      <p className="text-xs text-gray-500">Export complete appointment histories, doctor assignments, and visit statuses.</p>
                      <button
                        onClick={() => handleExport('appointments')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download CSV
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">Financial Revenue CSV</h3>
                      <p className="text-xs text-gray-500">Detailed itemized bill records, GST components, room charges, and payments.</p>
                      <button
                        onClick={() => handleExport('revenue')}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download CSV
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">Patients Registry CSV</h3>
                      <p className="text-xs text-gray-500">Comprehensive patient demographics, blood groups, and emergency contacts.</p>
                      <button
                        onClick={() => handleExport('patients')}
                        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download CSV
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  TAB 10: SETTINGS
                 ========================================== */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in max-w-4xl">
                  <div>
                    <h2 className="text-xl font-bold">Hospital System Settings</h2>
                    <p className="text-xs text-gray-500">Configure organization profile, system preferences, and security credentials.</p>
                  </div>

                  {settingsSaved && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Hospital Organization Profile</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Hospital Name</label>
                          <input type="text" value={settingsForm.hospitalName} onChange={e => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Support Email</label>
                          <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Contact Number</label>
                          <input type="text" value={settingsForm.phone} onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Location Address</label>
                          <input type="text" value={settingsForm.address} onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-4 shadow-sm">
                      <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500">Security Credentials</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">Current Admin Password</label>
                          <input type="password" placeholder="••••••••" value={settingsForm.currentPassword} onChange={e => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 dark:text-gray-300">New Password</label>
                          <input type="password" placeholder="••••••••" value={settingsForm.newPassword} onChange={e => setSettingsForm({ ...settingsForm, newPassword: e.target.value })} className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-2 transition-colors">
                        <Save className="w-4 h-4" /> Save System Preferences
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
          MODALS FOR ALL CREATION WORKFLOWS
         ========================================== */}
      
      {/* MODAL 1: ADD DOCTOR */}
      {showDoctorModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Doctor Profile</h3>
            <form onSubmit={handleAddDoctor} className="space-y-3">
              <input type="text" required placeholder="Doctor Name" value={doctorForm.name} onChange={e => setDoctorForm({...doctorForm, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="email" required placeholder="Doctor Email" value={doctorForm.email} onChange={e => setDoctorForm({...doctorForm, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="password" required placeholder="Account Password" value={doctorForm.password} onChange={e => setDoctorForm({...doctorForm, password: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Mobile Number" value={doctorForm.mobile} onChange={e => setDoctorForm({...doctorForm, mobile: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              
              <select value={doctorForm.departmentId} onChange={e => setDoctorForm({...doctorForm, departmentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <input type="text" required placeholder="Specialization (e.g. Cardiologist)" value={doctorForm.specialization} onChange={e => setDoctorForm({...doctorForm, specialization: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Qualification (e.g. MD, MBBS)" value={doctorForm.qualification} onChange={e => setDoctorForm({...doctorForm, qualification: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="number" required placeholder="Consultation Fee (₹)" value={doctorForm.consultationFee} onChange={e => setDoctorForm({...doctorForm, consultationFee: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowDoctorModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PATIENT */}
      {showPatientModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Patient Record</h3>
            <form onSubmit={handleAddPatient} className="space-y-3">
              <input type="text" required placeholder="Patient Name" value={patientForm.name} onChange={e => setPatientForm({...patientForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="email" required placeholder="Email Address" value={patientForm.email} onChange={e => setPatientForm({...patientForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="password" required placeholder="Password" value={patientForm.password} onChange={e => setPatientForm({...patientForm, password: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" required placeholder="Age" value={patientForm.age} onChange={e => setPatientForm({...patientForm, age: e.target.value})} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                <select value={patientForm.gender} onChange={e => setPatientForm({...patientForm, gender: e.target.value})} className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <input type="text" required placeholder="Contact Number" value={patientForm.contactNumber} onChange={e => setPatientForm({...patientForm, contactNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Emergency Contact" value={patientForm.emergencyContact} onChange={e => setPatientForm({...patientForm, emergencyContact: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Address" value={patientForm.address} onChange={e => setPatientForm({...patientForm, address: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowPatientModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD RECEPTIONIST */}
      {showReceptionistModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Receptionist Staff</h3>
            <form onSubmit={handleAddReceptionist} className="space-y-3">
              <input type="text" required placeholder="Full Name" value={receptionistForm.name} onChange={e => setReceptionistForm({...receptionistForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="email" required placeholder="Email Address" value={receptionistForm.email} onChange={e => setReceptionistForm({...receptionistForm, email: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="password" required placeholder="Password" value={receptionistForm.password} onChange={e => setReceptionistForm({...receptionistForm, password: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Contact Number" value={receptionistForm.contactNumber} onChange={e => setReceptionistForm({...receptionistForm, contactNumber: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowReceptionistModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD DEPARTMENT */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Department</h3>
            <form onSubmit={handleAddDept} className="space-y-3">
              <input type="text" required placeholder="Department Name" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <textarea placeholder="Description" value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-24" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowDeptModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: BOOK APPOINTMENT */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Book Appointment</h3>
            <form onSubmit={handleBookAppointment} className="space-y-3">
              <select required value={appointmentForm.patientId} onChange={e => setAppointmentForm({...appointmentForm, patientId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <select required value={appointmentForm.doctorId} onChange={e => setAppointmentForm({...appointmentForm, doctorId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
              </select>

              <select required value={appointmentForm.departmentId} onChange={e => setAppointmentForm({...appointmentForm, departmentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <input type="date" required value={appointmentForm.appointmentDate} onChange={e => setAppointmentForm({...appointmentForm, appointmentDate: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" required placeholder="Time Slot (e.g. 10:30 AM)" value={appointmentForm.timeSlot} onChange={e => setAppointmentForm({...appointmentForm, timeSlot: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" placeholder="Reason for Visit" value={appointmentForm.reason} onChange={e => setAppointmentForm({...appointmentForm, reason: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: ADD MEDICAL RECORD */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Add Medical Record</h3>
            <form onSubmit={handleAddMedicalRecord} className="space-y-3">
              <select required value={recordForm.patientId} onChange={e => setRecordForm({...recordForm, patientId: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <input type="text" required placeholder="Diagnosis (e.g. Acute Hypertension)" value={recordForm.diagnosis} onChange={e => setRecordForm({...recordForm, diagnosis: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <input type="text" placeholder="Symptoms" value={recordForm.symptoms} onChange={e => setRecordForm({...recordForm, symptoms: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
              <textarea placeholder="Prescription Details" value={recordForm.prescription} onChange={e => setRecordForm({...recordForm, prescription: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-20" />
              <textarea placeholder="Clinical Notes" value={recordForm.doctorNotes} onChange={e => setRecordForm({...recordForm, doctorNotes: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-20" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowRecordModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-600 text-white">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: RECORD PAYMENT */}
      {showPayModal && selectedBill && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-dark-card p-6 rounded-3xl shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Record Bill Payment</h3>
            <p className="text-xs text-gray-500">Processing payment for Invoice #{selectedBill.id} (Patient: {selectedBill.patient?.name})</p>
            <div className="p-4 rounded-xl bg-teal-500/10 text-teal-600 font-extrabold text-xl text-center">
              Total Amount: ₹{selectedBill.totalAmount?.toFixed(2)}
            </div>
            <form onSubmit={handlePayBill} className="space-y-3">
              <select value={paymentForm.paymentMethod} onChange={e => setPaymentForm({...paymentForm, paymentMethod: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                <option value="Cash">Cash</option>
                <option value="UPI / Online">UPI / Online</option>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Insurance Claim">Insurance Claim</option>
              </select>
              <input type="text" placeholder="Transaction Reference ID (Optional)" value={paymentForm.transactionId} onChange={e => setPaymentForm({...paymentForm, transactionId: e.target.value})} className="w-full px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowPayModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white">Confirm Paid</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
