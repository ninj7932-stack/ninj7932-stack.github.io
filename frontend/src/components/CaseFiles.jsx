import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, Eye, Trash2, Edit2, Save } from 'lucide-react';
import { playClick, playSuccess, playError } from '../utils/sounds';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const CaseFiles = ({ user, soundEnabled }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    operativeName: '',
    date: new Date().toISOString().split('T')[0],
    classification: 'STANDARD',
    description: '',
    attachments: [],
    redacted: false
  });

  const isAdmin = user?.isAdmin || user?.rank === 'O5' || user?.displayName === 'Task Master';

  useEffect(() => {
    fetchCaseFiles();
  }, []);

  const fetchCaseFiles = async () => {
    try {
      const response = await axios.get(`${API}/case-files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching case files:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(file =>
    file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.operativeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      if (soundEnabled) playError();
      return;
    }

    try {
      const fileData = {
        ...formData,
        operativeName: formData.operativeName || user?.clearanceLevel || 'Anonymous',
        createdBy: user?.displayName || 'Unknown'
      };

      if (editingFile) {
        await axios.put(`${API}/case-files/${editingFile.id}`, fileData);
      } else {
        await axios.post(`${API}/case-files`, fileData);
      }

      if (soundEnabled) playSuccess();
      setShowForm(false);
      setEditingFile(null);
      setFormData({
        title: '',
        operativeName: '',
        date: new Date().toISOString().split('T')[0],
        classification: 'STANDARD',
        description: '',
        attachments: [],
        redacted: false
      });
      fetchCaseFiles();
    } catch (error) {
      console.error('Error saving case file:', error);
      if (soundEnabled) playError();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this case file? This action cannot be undone.')) return;

    try {
      await axios.delete(`${API}/case-files/${id}`);
      if (soundEnabled) playClick();
      setSelectedFile(null);
      fetchCaseFiles();
    } catch (error) {
      console.error('Error deleting case file:', error);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file);
    setFormData({
      title: file.title,
      operativeName: file.operativeName,
      date: file.date,
      classification: file.classification,
      description: file.description,
      attachments: file.attachments || [],
      redacted: file.redacted
    });
    setShowForm(true);
    setSelectedFile(null);
  };

  const toggleRedaction = async (file) => {
    try {
      await axios.put(`${API}/case-files/${file.id}`, { redacted: !file.redacted });
      if (soundEnabled) playClick();
      fetchCaseFiles();
      if (selectedFile?.id === file.id) {
        setSelectedFile({ ...selectedFile, redacted: !file.redacted });
      }
    } catch (error) {
      console.error('Error toggling redaction:', error);
    }
  };

  const getClassificationStyle = (classification) => {
    switch (classification) {
      case 'CRITICAL':
        return 'badge-critical';
      case 'HIGH PRIORITY':
        return 'badge-high';
      case 'CONFIDENTIAL':
        return 'badge-confidential';
      default:
        return 'badge-standard';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Loading case files...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="case-files">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider flex items-center gap-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <FileText size={28} className="text-[#d4af37]" /> CASE FILES DATABASE
          </h2>
          <p className="text-white/50 text-sm mt-1">Documented investigations and evidence</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingFile(null);
            if (soundEnabled) playClick();
          }}
          className="owl-btn owl-btn-accent flex items-center gap-2"
          data-testid="new-case-file-btn"
        >
          <Plus size={16} /> NEW CASE FILE
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search case files by ID, title, operative, or content..."
          className="owl-input pl-12"
          data-testid="case-files-search"
        />
      </div>

      {/* Admin Badge */}
      {isAdmin && (
        <div className="flex items-center gap-2 p-3 border border-[#d4af37]/30 bg-[#d4af37]/5">
          <span className="admin-badge">ADMIN</span>
          <span className="text-sm text-white/70">You have edit and delete permissions for all case files.</span>
        </div>
      )}

      {/* New/Edit File Form */}
      {showForm && (
        <div className="owl-panel" data-testid="case-file-form">
          <div className="owl-panel-header">
            <span>{editingFile ? 'EDIT CASE FILE' : 'SUBMIT NEW CASE FILE'}</span>
            <button onClick={() => { setShowForm(false); setEditingFile(null); }} className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="owl-panel-content">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="owl-form-group">
                  <label className="owl-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="owl-input"
                    placeholder="Case file title..."
                    required
                    data-testid="case-file-title"
                  />
                </div>
                <div className="owl-form-group">
                  <label className="owl-label">Operative Name</label>
                  <input
                    type="text"
                    value={formData.operativeName}
                    onChange={(e) => setFormData({ ...formData, operativeName: e.target.value })}
                    className="owl-input"
                    placeholder={user?.clearanceLevel || 'Your designation...'}
                    data-testid="case-file-operative"
                  />
                </div>
                <div className="owl-form-group">
                  <label className="owl-label">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="owl-input"
                    placeholder="20██-██-██"
                    data-testid="case-file-date"
                  />
                </div>
                <div className="owl-form-group">
                  <label className="owl-label">Classification</label>
                  <select
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                    className="owl-select"
                    data-testid="case-file-classification"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="HIGH PRIORITY">High Priority</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="CONFIDENTIAL">Confidential</option>
                  </select>
                </div>
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="owl-textarea"
                  placeholder="Detailed case file description, evidence, witness statements..."
                  required
                  data-testid="case-file-description"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Attachments (comma-separated)</label>
                <input
                  type="text"
                  value={formData.attachments.join(', ')}
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="owl-input"
                  placeholder="BODYCAM_01.mp4, TESTIMONY.txt, EVIDENCE_PHOTO.jpg..."
                  data-testid="case-file-attachments"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.redacted}
                    onChange={(e) => setFormData({ ...formData, redacted: e.target.checked })}
                    className="w-5 h-5 accent-[#d4af37]"
                    data-testid="case-file-redacted"
                  />
                  <span className="text-sm uppercase tracking-wider">Mark as Redacted</span>
                </label>
              </div>
              <button type="submit" className="owl-btn owl-btn-accent w-full flex items-center justify-center gap-2">
                {editingFile ? <><Save size={16} /> UPDATE CASE FILE</> : <><FileText size={16} /> SUBMIT CASE FILE</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Detail View */}
      {selectedFile && (
        <div className="owl-panel" data-testid="case-file-detail">
          <div className="owl-panel-header">
            <span className="flex items-center gap-3">
              <FileText size={16} /> {selectedFile.id}
            </span>
            <button onClick={() => setSelectedFile(null)} className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="owl-panel-content">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedFile.title}</h3>
                <span className={`badge ${getClassificationStyle(selectedFile.classification)}`}>
                  {selectedFile.classification}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/50">Operative:</span>{' '}
                  <span>{selectedFile.operativeName}</span>
                </div>
                <div>
                  <span className="text-white/50">Date:</span>{' '}
                  <span>{selectedFile.date}</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-5">
                <div className="text-xs text-[#d4af37] mb-3 uppercase tracking-wider">Description</div>
                <p className={`text-sm leading-relaxed ${selectedFile.redacted ? 'redacted' : 'text-white/80'}`}>
                  {selectedFile.description}
                </p>
              </div>
              {selectedFile.attachments?.length > 0 && (
                <div className="border-t border-white/10 pt-5">
                  <div className="text-xs text-[#d4af37] mb-3 uppercase tracking-wider">Attachments</div>
                  <div className="space-y-2">
                    {selectedFile.attachments.map((att, idx) => (
                      <div key={idx} className="text-sm text-white/70 flex items-center gap-2 p-2 bg-white/5">
                        <FileText size={14} />
                        {att}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isAdmin && (
                <div className="flex gap-3 pt-5 border-t border-white/10">
                  <button
                    onClick={() => toggleRedaction(selectedFile)}
                    className="owl-btn flex-1 flex items-center justify-center gap-2"
                    data-testid="toggle-redaction-btn"
                  >
                    <Edit2 size={14} />
                    {selectedFile.redacted ? 'DECLASSIFY' : 'REDACT'}
                  </button>
                  <button
                    onClick={() => handleEdit(selectedFile)}
                    className="owl-btn owl-btn-accent flex-1 flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> EDIT
                  </button>
                  <button
                    onClick={() => handleDelete(selectedFile.id)}
                    className="owl-btn owl-btn-danger flex-1 flex items-center justify-center gap-2"
                    data-testid="delete-case-file-btn"
                  >
                    <Trash2 size={14} /> DELETE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Files Table */}
      <div className="owl-panel">
        <div className="owl-panel-header">
          <span>Active Case Files</span>
          <span className="text-white/50">{filteredFiles.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="owl-table" data-testid="case-files-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Classification</th>
                <th>Operative</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-white/50 py-12">
                    No case files found. Submit a new report to document evidence.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className={file.redacted ? 'opacity-60' : ''}>
                    <td className="font-mono text-[#d4af37]">{file.id}</td>
                    <td className={file.redacted ? 'redacted' : ''}>{file.title}</td>
                    <td>
                      <span className={`badge ${getClassificationStyle(file.classification)}`}>
                        {file.classification}
                      </span>
                    </td>
                    <td>{file.operativeName}</td>
                    <td className="text-white/50">{file.date}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedFile(file);
                            if (soundEnabled) playClick();
                          }}
                          className="p-2 text-white/50 hover:text-[#d4af37] transition-colors"
                          title="View"
                          data-testid={`view-${file.id}`}
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(file)}
                              className="p-2 text-white/50 hover:text-[#d4af37] transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(file.id)}
                              className="p-2 text-white/50 hover:text-red-500 transition-colors"
                              title="Delete"
                              data-testid={`delete-${file.id}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseFiles;
