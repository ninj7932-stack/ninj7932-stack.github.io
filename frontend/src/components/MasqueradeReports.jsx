import React, { useState } from 'react';
import { Shield, Plus, Send, Eye, Clock, CheckCircle, AlertTriangle, X } from 'lucide-react';

const MasqueradeReports = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'INTEL',
    priority: 'NORMAL',
    location: '',
    subject: '',
    details: '',
    attachments: ''
  });

  const reports = [
    {
      id: 'MR-2025-001',
      type: 'INTEL',
      priority: 'HIGH',
      subject: 'Foundation Security Protocol Changes',
      location: 'Site-416',
      status: 'VERIFIED',
      date: '2025-01-14',
      operative: 'Agent "Whisper"',
      summary: 'New biometric scanners being installed in Sector 3. Implementation expected within 72 hours.'
    },
    {
      id: 'MR-2025-002',
      type: 'CONTACT',
      priority: 'NORMAL',
      subject: 'Potential Recruit - Research Division',
      location: 'Site-416',
      status: 'PENDING',
      date: '2025-01-13',
      operative: 'Agent "Echo"',
      summary: 'Junior researcher showing sympathy to Order ideals. Recommend initial contact through secure channels.'
    },
    {
      id: 'MR-2025-003',
      type: 'WARNING',
      priority: 'CRITICAL',
      subject: 'Cover Potentially Compromised',
      location: 'Site-416',
      status: 'URGENT',
      date: '2025-01-12',
      operative: 'Agent ████████',
      summary: '[REDACTED] Security footage review may have captured unauthorized access. Requesting immediate extraction protocol evaluation.'
    },
    {
      id: 'MR-2024-089',
      type: 'INTEL',
      priority: 'LOW',
      subject: 'Class-D Transfer Schedule',
      location: 'Site-416',
      status: 'ARCHIVED',
      date: '2024-12-28',
      operative: 'Agent "Shadow"',
      summary: 'Monthly transfer schedule obtained. No high-value personnel identified in current batch.'
    },
    {
      id: 'MR-2024-088',
      type: 'ETHICS',
      priority: 'HIGH',
      subject: 'Unauthorized Testing Protocol',
      location: 'Site-416 - Lab 7B',
      status: 'VERIFIED',
      date: '2024-12-25',
      operative: 'Agent "Whisper"',
      summary: 'Dr. ████████ conducting tests outside approved parameters. Evidence documented for potential exposure.'
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'VERIFIED': return 'text-green-400 border-green-400';
      case 'PENDING': return 'text-yellow-500 border-yellow-500';
      case 'URGENT': return 'text-red-500 border-red-500';
      case 'ARCHIVED': return 'text-green-500/50 border-green-500/50';
      default: return 'text-green-500 border-green-500';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-500';
      case 'HIGH': return 'bg-orange-500/20 text-orange-500';
      case 'LOW': return 'bg-green-500/20 text-green-500/70';
      default: return 'bg-green-500/10 text-green-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'WARNING': return <AlertTriangle size={12} className="text-red-500" />;
      case 'ETHICS': return <Shield size={12} className="text-purple-400" />;
      case 'CONTACT': return <Eye size={12} className="text-blue-400" />;
      default: return <Eye size={12} className="text-green-400" />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Report submitted successfully. Your handler will review within 24 hours.');
    setShowForm(false);
    setFormData({
      type: 'INTEL',
      priority: 'NORMAL',
      location: '',
      subject: '',
      details: '',
      attachments: ''
    });
  };

  return (
    <div className="space-y-6" data-testid="masquerade-reports">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider flex items-center gap-3">
            <Shield size={24} /> MASQUERADE REPORTS
          </h2>
          <p className="text-green-500/60 text-sm mt-1">Intelligence submissions and field reports</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="owl-btn flex items-center gap-2"
          data-testid="new-report-btn"
        >
          <Plus size={14} /> NEW REPORT
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="owl-panel p-4 text-center">
          <div className="text-2xl font-bold text-green-400">5</div>
          <div className="text-xs text-green-500/60 uppercase">Active Operatives</div>
        </div>
        <div className="owl-panel p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">2</div>
          <div className="text-xs text-green-500/60 uppercase">Pending Review</div>
        </div>
        <div className="owl-panel p-4 text-center">
          <div className="text-2xl font-bold text-green-400">89</div>
          <div className="text-xs text-green-500/60 uppercase">Total Reports</div>
        </div>
        <div className="owl-panel p-4 text-center">
          <div className="text-2xl font-bold text-red-500">1</div>
          <div className="text-xs text-green-500/60 uppercase">Urgent Alerts</div>
        </div>
      </div>

      {/* New Report Form */}
      {showForm && (
        <div className="owl-panel" data-testid="report-form">
          <div className="owl-panel-header">
            <span className="text-xs uppercase tracking-wider">Submit Field Report</span>
            <button onClick={() => setShowForm(false)} className="text-green-500/60 hover:text-green-500">
              <X size={14} />
            </button>
          </div>
          <div className="owl-panel-content">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="owl-form-group">
                  <label className="owl-label">Report Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="owl-select"
                    data-testid="report-type"
                  >
                    <option value="INTEL">Intelligence</option>
                    <option value="CONTACT">Contact Report</option>
                    <option value="WARNING">Security Warning</option>
                    <option value="ETHICS">Ethics Violation</option>
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
                  placeholder="Site-416, Sector 3..."
                  data-testid="report-location"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="owl-input"
                  placeholder="Brief description of report..."
                  required
                  data-testid="report-subject"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Details</label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="owl-textarea"
                  placeholder="Full report details..."
                  required
                  data-testid="report-details"
                />
              </div>
              <button type="submit" className="owl-btn w-full flex items-center justify-center gap-2">
                <Send size={14} /> SUBMIT REPORT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="owl-panel" data-testid={`report-${report.id}`}>
            <div className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(report.type)}
                  <span className="font-mono text-xs text-green-500/60">{report.id}</span>
                  <span className={`text-xs px-2 py-0.5 ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                </div>
                <span className={`text-xs border px-2 py-0.5 ${getStatusStyle(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <h3 className="font-bold mb-2">{report.subject}</h3>
              <p className="text-sm text-green-500/70 mb-3">{report.summary}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-green-500/50">
                <span className="flex items-center gap-1">
                  <Shield size={10} /> {report.operative}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={10} /> {report.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} /> {report.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-green-500/40 py-4 border-t border-green-500/20">
        All reports are encrypted and transmitted through secure channels. 
        Your identity is protected by Masquerade protocols.
      </div>
    </div>
  );
};

export default MasqueradeReports;
