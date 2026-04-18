import React, { useState, useEffect } from 'react';
import { Shield, Plus, Send, Eye, Clock, Trash2, Edit2, X, Save } from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/sounds';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MasqueradeReports = ({ user, soundEnabled }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    type: 'INTEL',
    priority: 'NORMAL',
    location: '',
    subject: '',
    details: ''
  });

  const isAdmin = user?.isAdmin || user?.rank === 'O5' || user?.displayName === 'Task Master';

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API}/reports`);
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.details) {
      if (soundEnabled) playError();
      return;
    }

    try {
      const reportData = {
        ...formData,
        operative: user?.clearanceLevel || user?.displayName || 'Unknown'
      };

      if (editingReport) {
        await axios.put(`${API}/reports/${editingReport.id}`, formData);
      } else {
        await axios.post(`${API}/reports`, reportData);
      }
      
      if (soundEnabled) playSuccess();
      setShowForm(false);
      setEditingReport(null);
      setFormData({
        type: 'INTEL',
        priority: 'NORMAL',
        location: '',
        subject: '',
        details: ''
      });
      fetchReports();
    } catch (error) {
      console.error('Error saving report:', error);
      if (soundEnabled) playError();
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this report? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`${API}/reports/${reportId}`);
      if (soundEnabled) playClick();
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      type: report.type,
      priority: report.priority,
      location: report.location,
      subject: report.subject,
      details: report.details
    });
    setShowForm(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400 border-green-400 bg-green-400/10';
      case 'PENDING': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'URGENT': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'ONGOING': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default: return 'text-white/50 border-white/50';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      case 'LOW': return 'badge-standard';
      default: return 'text-white border-white/30 bg-white/5';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="masquerade-reports">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider flex items-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <Shield size={28} className="text-[#d4af37]" /> MASQUERADE REPORTS
          </h2>
          <p className="text-white/50 text-sm mt-1">Field intelligence and witness documentation</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingReport(null);
            setFormData({ type: 'INTEL', priority: 'NORMAL', location: '', subject: '', details: '' });
            if (soundEnabled) playClick();
          }}
          className="owl-btn owl-btn-accent flex items-center gap-2"
          data-testid="new-report-btn"
        >
          <Plus size={16} /> NEW REPORT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="owl-panel p-5 text-center">
          <div className="text-3xl font-bold text-[#d4af37]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {reports.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Pending Review</div>
        </div>
        <div className="owl-panel p-5 text-center">
          <div className="text-3xl font-bold text-green-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {reports.filter(r => r.status === 'VERIFIED').length}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Verified</div>
        </div>
        <div className="owl-panel p-5 text-center">
          <div className="text-3xl font-bold text-blue-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {reports.filter(r => r.status === 'ONGOING').length}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Ongoing</div>
        </div>
        <div className="owl-panel p-5 text-center">
          <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {reports.length}
          </div>
          <div className="text-xs text-white/50 uppercase tracking-wider mt-1">Total Reports</div>
        </div>
      </div>

      {/* New/Edit Report Form */}
      {showForm && (
        <div className="owl-panel" data-testid="report-form">
          <div className="owl-panel-header">
            <span>{editingReport ? 'EDIT REPORT' : 'SUBMIT FIELD REPORT'}</span>
            <button onClick={() => { setShowForm(false); setEditingReport(null); }} className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="owl-panel-content">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="owl-form-group">
                  <label className="owl-label">Report Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="owl-select"
                    data-testid="report-type"
                  >
                    <option value="INTEL">Intelligence</option>
                    <option value="WITNESS">Witness Interview</option>
                    <option value="MEDICAL">Medical Documentation</option>
                    <option value="ETHICS">Ethics Violation</option>
                    <option value="SURVEILLANCE">Surveillance Report</option>
                  </select>
                </div>
                <div className="owl-form-group">
                  <label className="owl-label">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="owl-select"
                    data-testid="report-priority"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="owl-input"
                  placeholder="Site-416, Sector 3, MS Reception..."
                  data-testid="report-location"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Subject *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="owl-input"
                  placeholder="Brief description of the report..."
                  required
                  data-testid="report-subject"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Details *</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="owl-textarea"
                  placeholder="Full report details, witness statements, observations..."
                  required
                  data-testid="report-details"
                />
              </div>
              <button type="submit" className="owl-btn owl-btn-accent w-full flex items-center justify-center gap-2">
                {editingReport ? <><Save size={16} /> UPDATE REPORT</> : <><Send size={16} /> SUBMIT REPORT</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="owl-panel p-12 text-center">
            <Shield size={48} className="mx-auto mb-4 text-white/20" />
            <p className="text-white/50">No reports filed yet. Submit your first field report.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="owl-panel" data-testid={`report-${report.id}`}>
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#d4af37] font-mono">{report.id}</span>
                    <span className={`badge ${getPriorityStyle(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className="text-xs text-white/40 uppercase">{report.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs border px-3 py-1 ${getStatusStyle(report.status)}`}>
                      {report.status}
                    </span>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEdit(report)}
                          className="p-2 text-white/50 hover:text-[#d4af37] transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-2 text-white/50 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{report.subject}</h3>
                <p className="text-white/70 text-sm mb-4 leading-relaxed">{report.details}</p>
                <div className="flex flex-wrap items-center gap-6 text-xs text-white/40">
                  <span className="flex items-center gap-2">
                    <Shield size={12} /> {report.operative}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye size={12} /> {report.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={12} /> {report.date}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-white/30 py-4 border-t border-white/10">
        All reports are encrypted and transmitted through secure Masquerade channels.
      </div>
    </div>
  );
};

export default MasqueradeReports;
