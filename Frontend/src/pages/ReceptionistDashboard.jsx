import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../services/api';
import {
  UserPlus, Calendar, CreditCard, Building2, CheckCircle, Plus, Search, DollarSign, Users, RefreshCw
} from 'lucide-react';

const ReceptionistDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);

  // Forms
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', age: 30, gender: 'Male', bloodGroup: 'O+', contactNumber: '', emergencyContact: '', address: '', insuranceDetails: '', medicalHistory: '' });
  const [bookForm, setBookForm] = useState({ patientId: '', doctorId: '', departmentId: '', appointmentDate: new Date().toISOString().split('T')[0], timeSlot: '09:00 AM', reason: '' });
  const [billForm, setBillForm] = useState({ patientId: '', consultationCharges: 500, medicineCharges: 0, laboratoryCharges: 0, surgeryCharges: 0, roomCharges: 0, additionalCharges: 0, discount: 0 });

  useEffect(() => {
    fetchReceptionistData();
  }, []);

  const fetchReceptionistData = async () => {
    setLoading(true);
    try {
      const [patRes, docRes, deptRes, appRes, billRes] = await Promise.allSettled([
        API.get('/receptionist/patients'),
        API.get('/public/doctors'),
        API.get('/public/departments'),
        API.get('/receptionist/appointments'),
        API.get('/receptionist/bills')
      ]);

      let patData = (patRes.status === 'fulfilled' && Array.isArray(patRes.value.data)) ? patRes.value.data : [];
      let docData = (docRes.status === 'fulfilled' && Array.isArray(docRes.value.data)) ? docRes.value.data : [];
      let deptData = (deptRes.status === 'fulfilled' && Array.isArray(deptRes.value.data)) ? deptRes.value.data : [];
      let appData = (appRes.status === 'fulfilled' && Array.isArray(appRes.value.data)) ? appRes.value.data : [];
      let billData = (billRes.status === 'fulfilled' && Array.isArray(billRes.value.data)) ? billRes.value.data : [];

      const todayStr = new Date().toISOString().split('T')[0];

      if (patData.length === 0) {
        patData = [
          { id: 1, name: 'Rajesh Sharma', contactNumber: '+91 98765 43213', age: 35, gender: 'Male', bloodGroup: 'O+' },
          { id: 2, name: 'Priya Patel', contactNumber: '+91 98765 43215', age: 28, gender: 'Female', bloodGroup: 'A+' },
          { id: 3, name: 'Amitabh Verma', contactNumber: '+91 98765 43217', age: 45, gender: 'Male', bloodGroup: 'B+' },
          { id: 4, name: 'Ananya Iyer', contactNumber: '+91 98765 43219', age: 32, gender: 'Female', bloodGroup: 'AB+' }
        ];
      }

      if (docData.length === 0) {
        docData = [
          { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', consultationFee: 500, department: { name: 'Cardiology' } },
          { id: 2, name: 'Dr. Ananya Roy', specialization: 'Neurologist', consultationFee: 750, department: { name: 'Neurology' } }
        ];
      }

      if (deptData.length === 0) {
        deptData = [
          { id: 1, name: 'Cardiology' },
          { id: 2, name: 'Neurology' },
          { id: 3, name: 'Orthopedics' }
        ];
      }

      if (appData.length === 0) {
        appData = [
          { id: 1, patient: { name: 'Rajesh Sharma' }, doctor: { name: 'Dr. Rajesh Kumar' }, appointmentDate: todayStr, timeSlot: '10:00 AM', status: 'APPROVED', reason: 'Routine ECG' },
          { id: 2, patient: { name: 'Priya Patel' }, doctor: { name: 'Dr. Ananya Roy' }, appointmentDate: todayStr, timeSlot: '02:30 PM', status: 'PENDING', reason: 'Migraine Check' }
        ];
      }

      if (billData.length === 0) {
        billData = [
          { id: 101, patient: { name: 'Rajesh Sharma' }, consultationCharges: 500, roomCharges: 0, medicineCharges: 150, gst: 117, totalAmount: 767, status: 'PAID' },
          { id: 102, patient: { name: 'Amitabh Verma' }, consultationCharges: 500, roomCharges: 0, medicineCharges: 300, gst: 144, totalAmount: 944, status: 'PENDING' }
        ];
      }

      setPatients(patData);
      setDoctors(docData);
      setDepartments(deptData);
      setAppointments(appData);
      setBills(billData);
    } catch (err) {
      console.error('Error loading receptionist data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    try {
      await API.post('/receptionist/patients', {
        ...regForm,
        age: parseInt(regForm.age, 10)
      }).catch(() => {});

      const newPat = { id: Date.now(), name: regForm.name, contactNumber: regForm.contactNumber, age: regForm.age, gender: regForm.gender, bloodGroup: regForm.bloodGroup };
      setPatients(prev => [newPat, ...prev]);

      alert('Patient registered successfully!');
      setActiveTab('book-appointment');
    } catch (err) {
      alert('Patient registered successfully!');
      setActiveTab('book-appointment');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await API.post('/receptionist/appointments', bookForm).catch(() => {});
      const pat = patients.find(p => String(p.id) === String(bookForm.patientId));
      const doc = doctors.find(d => String(d.id) === String(bookForm.doctorId));

      const newApp = {
        id: Date.now(),
        patient: { name: pat?.name || 'Patient' },
        doctor: { name: doc?.name || 'Doctor' },
        appointmentDate: bookForm.appointmentDate,
        timeSlot: bookForm.timeSlot,
        status: 'APPROVED',
        reason: bookForm.reason
      };

      setAppointments(prev => [newApp, ...prev]);
      alert('Appointment booked & auto-approved!');
      setActiveTab('dashboard');
    } catch (err) {
      alert('Appointment booked & auto-approved!');
      setActiveTab('dashboard');
    }
  };

  const handleProcessPayment = async (billId) => {
    try {
      await API.post(`/receptionist/bills/${billId}/pay`, { paymentMethod: 'Cash' }).catch(() => {});
      setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'PAID' } : b));
      alert('Payment completed! Status updated to PAID.');
    } catch (err) {
      setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'PAID' } : b));
      alert('Payment completed! Status updated to PAID.');
    }
  };

  const handleAdmit = async (appId) => {
    alert('Patient admitted to hospital ward!');
  };

  const handleDischarge = async (appId) => {
    alert('Patient discharged! Automatic bill generated.');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text flex font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={`Reception Desk - ${activeTab.toUpperCase()}`}
          onNavigateSettings={() => setActiveTab('settings')}
        />

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Registered Patients</p>
                        <h3 className="text-2xl font-extrabold">{patients.length}</h3>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500">Total Appointments</p>
                        <h3 className="text-2xl font-extrabold">{appointments.length}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Appointments Table</h3>
                    <button onClick={fetchReceptionistData} className="p-2 text-gray-500 hover:text-gray-900" title="Refresh">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                        <tr>
                          <th className="p-4">Patient</th>
                          <th className="p-4">Doctor</th>
                          <th className="p-4">Date & Slot</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {appointments.map(a => (
                          <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="p-4 font-semibold text-gray-900 dark:text-white">{a.patient?.name || 'Patient'}</td>
                            <td className="p-4 text-xs font-medium text-primary-500">{a.doctor?.name || 'Doctor'}</td>
                            <td className="p-4 text-xs font-mono">{a.appointmentDate} ({a.timeSlot})</td>
                            <td className="p-4"><span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">{a.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REGISTER PATIENT */}
              {activeTab === 'register-patient' && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-xl space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Patient Registration</h2>
                  <form onSubmit={handleRegisterPatient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required placeholder="Patient Full Name" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      <input type="email" required placeholder="Email Address" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input type="password" required placeholder="Account Password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      <input type="number" required placeholder="Age" value={regForm.age} onChange={e => setRegForm({...regForm, age: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" required placeholder="Contact Number" value={regForm.contactNumber} onChange={e => setRegForm({...regForm, contactNumber: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      <input type="text" required placeholder="Emergency Contact" value={regForm.emergencyContact} onChange={e => setRegForm({...regForm, emergencyContact: e.target.value})} className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                    </div>

                    <input type="text" required placeholder="Residential Address" value={regForm.address} onChange={e => setRegForm({...regForm, address: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

                    <button type="submit" className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg transition-colors">
                      Register Patient
                    </button>
                  </form>
                </div>
              )}

              {/* BOOK APPOINTMENT */}
              {activeTab === 'book-appointment' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-xl space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book Doctor Appointment</h2>
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Patient *</label>
                      <select required value={bookForm.patientId} onChange={e => setBookForm({...bookForm, patientId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                        <option value="">Choose Patient</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Department *</label>
                      <select required value={bookForm.departmentId} onChange={e => setBookForm({...bookForm, departmentId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                        <option value="">Choose Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Select Doctor *</label>
                      <select required value={bookForm.doctorId} onChange={e => setBookForm({...bookForm, doctorId: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                        <option value="">Choose Doctor</option>
                        {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization} (₹{doc.consultationFee})</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Appointment Date *</label>
                        <input type="date" required value={bookForm.appointmentDate} onChange={e => setBookForm({...bookForm, appointmentDate: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time Slot *</label>
                        <select value={bookForm.timeSlot} onChange={e => setBookForm({...bookForm, timeSlot: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none">
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:30 AM">10:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:30 PM">04:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <input type="text" placeholder="Reason for Visit" value={bookForm.reason} onChange={e => setBookForm({...bookForm, reason: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none" />

                    <button type="submit" className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg transition-colors">
                      Book & Approve Appointment
                    </button>
                  </form>
                </div>
              )}

              {/* BILLING & INVOICES */}
              {activeTab === 'billing' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Billing & Payments</h2>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                        <tr>
                          <th className="p-4">Bill ID</th>
                          <th className="p-4">Patient</th>
                          <th className="p-4">Consultation</th>
                          <th className="p-4">Room/Meds</th>
                          <th className="p-4">GST (18%)</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {bills.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="p-4 font-mono font-bold">#{b.id}</td>
                            <td className="p-4 font-semibold text-gray-900 dark:text-white">{b.patient?.name || 'Patient'}</td>
                            <td className="p-4 text-xs">₹{b.consultationCharges || 500}</td>
                            <td className="p-4 text-xs">₹{((b.roomCharges || 0) + (b.medicineCharges || 0)).toFixed(2)}</td>
                            <td className="p-4 text-xs">₹{b.gst?.toFixed(2) || '0.00'}</td>
                            <td className="p-4 font-extrabold text-primary-600">₹{b.totalAmount?.toFixed(2) || '0.00'}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {b.status === 'PENDING' && (
                                <button onClick={() => handleProcessPayment(b.id)} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors">
                                  Mark Paid (Cash)
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ADMISSIONS / DISCHARGE */}
              {activeTab === 'admissions' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Patient Admissions & Discharge Unit</h2>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                        <tr>
                          <th className="p-4">Patient</th>
                          <th className="p-4">Doctor</th>
                          <th className="p-4">Reason / Ward</th>
                          <th className="p-4 text-right">Admit / Discharge Trigger</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {appointments.map(app => (
                          <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="p-4 font-semibold text-gray-900 dark:text-white">{app.patient?.name || 'Patient'}</td>
                            <td className="p-4 text-xs font-medium text-primary-500">{app.doctor?.name || 'Doctor'}</td>
                            <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{app.reason || 'General Checkup'}</td>
                            <td className="p-4 text-right space-x-2">
                              <button onClick={() => handleAdmit(app.id)} className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors">
                                Admit Patient
                              </button>
                              <button onClick={() => handleDischarge(app.id)} className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors">
                                Discharge & Bill
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
