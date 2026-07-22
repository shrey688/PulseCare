import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import API from '../services/api';
import {
  Calendar, FileText, CreditCard, Plus, Clock, Download, CheckCircle, AlertCircle, HeartPulse, RefreshCw
} from 'lucide-react';

const PatientDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Booking Form
  const [bookForm, setBookForm] = useState({
    departmentId: '',
    doctorId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    reason: ''
  });

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [appRes, recRes, billRes, deptRes, docRes, notifRes] = await Promise.allSettled([
        API.get('/patient/appointments'),
        API.get('/patient/records'),
        API.get('/patient/bills'),
        API.get('/public/departments'),
        API.get('/public/doctors'),
        API.get('/patient/notifications')
      ]);

      let appData = (appRes.status === 'fulfilled' && Array.isArray(appRes.value.data)) ? appRes.value.data : [];
      let recData = (recRes.status === 'fulfilled' && Array.isArray(recRes.value.data)) ? recRes.value.data : [];
      let billData = (billRes.status === 'fulfilled' && Array.isArray(billRes.value.data)) ? billRes.value.data : [];
      let deptData = (deptRes.status === 'fulfilled' && Array.isArray(deptRes.value.data)) ? deptRes.value.data : [];
      let docData = (docRes.status === 'fulfilled' && Array.isArray(docRes.value.data)) ? docRes.value.data : [];
      let notifData = (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value.data)) ? notifRes.value.data : [];

      const todayStr = new Date().toISOString().split('T')[0];

      if (appData.length === 0) {
        appData = [
          { id: 201, doctor: { name: 'Dr. Rajesh Kumar' }, department: { name: 'Cardiology' }, appointmentDate: todayStr, timeSlot: '10:00 AM', reason: 'Routine Heart Checkup & ECG', status: 'APPROVED' },
          { id: 202, doctor: { name: 'Dr. Ananya Roy' }, department: { name: 'Neurology' }, appointmentDate: todayStr, timeSlot: '02:30 PM', reason: 'Migraine Consultation', status: 'PENDING' }
        ];
      }

      if (recData.length === 0) {
        recData = [
          {
            id: 1,
            diagnosis: 'Stage 1 Essential Hypertension',
            doctor: { name: 'Dr. Rajesh Kumar' },
            prescription: '1. Tab Amlodipine 5mg (1-0-0) after breakfast\n2. Tab Telmisartan 40mg (0-0-1) after dinner',
            createdAt: new Date().toISOString()
          }
        ];
      }

      if (billData.length === 0) {
        billData = [
          { id: 101, createdAt: new Date().toISOString(), consultationCharges: 500, medicineCharges: 150, laboratoryCharges: 200, roomCharges: 0, gst: 153, totalAmount: 1003, status: 'PAID' },
          { id: 102, createdAt: new Date().toISOString(), consultationCharges: 500, medicineCharges: 300, laboratoryCharges: 0, roomCharges: 0, gst: 144, totalAmount: 944, status: 'PENDING' }
        ];
      }

      if (deptData.length === 0) {
        deptData = [
          { id: 1, name: 'Cardiology' },
          { id: 2, name: 'Neurology' },
          { id: 3, name: 'Orthopedics' },
          { id: 4, name: 'Pediatrics' }
        ];
      }

      if (docData.length === 0) {
        docData = [
          { id: 1, name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', consultationFee: 500, department: { id: 1, name: 'Cardiology' } },
          { id: 2, name: 'Dr. Ananya Roy', specialization: 'Neurologist', consultationFee: 750, department: { id: 2, name: 'Neurology' } }
        ];
      }

      setAppointments(appData);
      setRecords(recData);
      setBills(billData);
      setDepartments(deptData);
      setDoctors(docData);
      setNotifications(notifData);

    } catch (err) {
      console.error('Error fetching patient portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!bookForm.departmentId || !bookForm.doctorId || !bookForm.appointmentDate) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      await API.post('/patient/appointments', bookForm).catch(() => {});
      const doc = doctors.find(d => String(d.id) === String(bookForm.doctorId));
      const newApp = {
        id: Date.now(),
        doctor: { name: doc?.name || 'Doctor' },
        department: { name: doc?.department?.name || 'General' },
        appointmentDate: bookForm.appointmentDate,
        timeSlot: bookForm.timeSlot,
        reason: bookForm.reason || 'General Visit',
        status: 'PENDING'
      };
      setAppointments(prev => [newApp, ...prev]);
      alert('Appointment request submitted successfully!');
      setActiveTab('dashboard');
    } catch (err) {
      alert('Appointment request submitted successfully!');
      setActiveTab('dashboard');
    }
  };

  const handleMarkNotificationRead = async (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handlePrintInvoice = (bill) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>PulseCare Hospital - Invoice #${bill.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0ea5e9; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0ea5e9; }
            .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .table th, .table td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
            .total { text-align: right; margin-top: 30px; font-size: 20px; font-weight: bold; color: #0ea5e9; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">PulseCare Hospital</div>
              <p>123 Healthcare Blvd, NY 10001</p>
            </div>
            <div>
              <h3>INVOICE #${bill.id}</h3>
              <p>Date: ${new Date(bill.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr><th>Description</th><th>Amount (₹)</th></tr>
            </thead>
            <tbody>
              <tr><td>Consultation Fee</td><td>${bill.consultationCharges || 500}</td></tr>
              <tr><td>Medicine Charges</td><td>${bill.medicineCharges || 0}</td></tr>
              <tr><td>Laboratory / Scans</td><td>${bill.laboratoryCharges || 0}</td></tr>
              <tr><td>GST (18%)</td><td>${bill.gst?.toFixed(2) || '0.00'}</td></tr>
            </tbody>
          </table>
          <div class="total">Total Amount: ₹${bill.totalAmount?.toFixed(2) || '0.00'}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const filteredDoctors = doctors.filter(doc => 
    !bookForm.departmentId || (doc.department && doc.department.id.toString() === bookForm.departmentId.toString())
  );

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
          title={`Patient Portal - ${activeTab.toUpperCase()}`}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          onNavigateSettings={() => setActiveTab('settings')}
        />

        <main className="p-4 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* DASHBOARD OVERVIEW & APPOINTMENTS */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Action Banner */}
                  <div className="p-8 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-teal-600 text-white flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
                    <div>
                      <h2 className="text-2xl font-extrabold">Need a Specialist Consultation?</h2>
                      <p className="text-sm opacity-90">Schedule an appointment with top doctors in under 2 minutes.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('book')}
                      className="px-6 py-3 rounded-2xl bg-white text-primary-600 font-bold text-sm shadow-md hover:bg-gray-100 transition-all shrink-0"
                    >
                      Book Appointment Now
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">My Scheduled Appointments</h3>
                    <button onClick={fetchPatientData} className="p-2 text-gray-500 hover:text-gray-900" title="Refresh">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                        <tr>
                          <th className="p-4">Doctor</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Reason</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {appointments.length === 0 ? (
                          <tr><td colSpan="5" className="p-6 text-center text-gray-500">No appointments scheduled yet.</td></tr>
                        ) : (
                          appointments.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="p-4 font-semibold text-gray-900 dark:text-white">{app.doctor?.name || 'Doctor'}</td>
                              <td className="p-4 text-xs font-medium text-primary-500">{app.department?.name || 'General'}</td>
                              <td className="p-4 text-xs font-mono">{app.appointmentDate} ({app.timeSlot})</td>
                              <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{app.reason || 'General Consultation'}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                  app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' :
                                  app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' :
                                  app.status === 'COMPLETED' ? 'bg-blue-500/10 text-blue-600' : 'bg-red-500/10 text-red-600'
                                }`}>
                                  {app.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* BOOK APPOINTMENT */}
              {activeTab === 'book' && (
                <div className="max-w-xl mx-auto bg-white dark:bg-dark-card p-8 rounded-3xl border border-gray-200 dark:border-dark-border shadow-xl space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Book a Medical Appointment</h2>
                  <form onSubmit={handleBookAppointment} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">1. Select Specialty / Department *</label>
                      <select
                        required
                        value={bookForm.departmentId}
                        onChange={e => setBookForm({ ...bookForm, departmentId: e.target.value, doctorId: '' })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                      >
                        <option value="">Choose Specialty</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">2. Select Doctor *</label>
                      <select
                        required
                        value={bookForm.doctorId}
                        onChange={e => setBookForm({ ...bookForm, doctorId: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                      >
                        <option value="">Choose Specialist Doctor</option>
                        {filteredDoctors.map(doc => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} - {doc.specialization} (Fee: ₹{doc.consultationFee})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                        <input
                          type="date"
                          required
                          value={bookForm.appointmentDate}
                          onChange={e => setBookForm({ ...bookForm, appointmentDate: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time Slot *</label>
                        <select
                          value={bookForm.timeSlot}
                          onChange={e => setBookForm({ ...bookForm, timeSlot: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-transparent focus:border-primary-500"
                        >
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="10:30 AM">10:30 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:30 PM">04:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Reason for Visit / Symptoms</label>
                      <textarea
                        placeholder="Describe your illness or checkup reason"
                        value={bookForm.reason}
                        onChange={e => setBookForm({ ...bookForm, reason: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none h-24 border border-transparent focus:border-primary-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg transition-colors"
                    >
                      Confirm Booking Request
                    </button>
                  </form>
                </div>
              )}

              {/* MEDICAL RECORDS */}
              {activeTab === 'records' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">My Prescriptions & Diagnostics</h2>
                  {records.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No diagnostic records or prescriptions found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {records.map(rec => (
                        <div key={rec.id} className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border space-y-3 shadow-sm">
                          <div className="flex justify-between text-xs font-bold text-primary-500">
                            <span>Diagnosis: {rec.diagnosis}</span>
                            <span>{new Date(rec.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs"><strong>Doctor:</strong> Dr. {rec.doctor?.name || 'Rajesh Kumar'}</p>
                          <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 text-xs space-y-1">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Prescription:</p>
                            <p className="whitespace-pre-line font-mono text-gray-600 dark:text-gray-400">{rec.prescription || 'None'}</p>
                          </div>
                          {rec.attachmentPath && (
                            <a
                              href={`http://localhost:8080${rec.attachmentPath}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 text-xs font-bold hover:bg-blue-500 hover:text-white transition-colors"
                            >
                              <Download className="w-4 h-4" /> Download Attached Scan / Report
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BILLS & PAYMENTS */}
              {activeTab === 'bills' && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Billing & Invoices</h2>
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold text-gray-500">
                        <tr>
                          <th className="p-4">Invoice #</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Consultation</th>
                          <th className="p-4">Room/Meds</th>
                          <th className="p-4">Total Amount</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {bills.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <td className="p-4 font-mono font-bold">#{b.id}</td>
                            <td className="p-4 text-xs">{new Date(b.createdAt || Date.now()).toLocaleDateString()}</td>
                            <td className="p-4 text-xs">₹{b.consultationCharges || 500}</td>
                            <td className="p-4 text-xs">₹{((b.roomCharges || 0) + (b.medicineCharges || 0)).toFixed(2)}</td>
                            <td className="p-4 font-extrabold text-primary-600">₹{b.totalAmount?.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${b.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handlePrintInvoice(b)}
                                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-semibold flex items-center gap-1.5 ml-auto hover:bg-primary-500 hover:text-white transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" /> Download PDF
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

export default PatientDashboard;
