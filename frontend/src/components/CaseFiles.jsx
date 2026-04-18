import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, X, Eye, Trash2, Edit2 } from 'lucide-react';
import { getCaseFiles, addCaseFile, deleteCaseFile, searchCaseFiles, updateCaseFile } from '../utils/localStorage';
import { playClick, playSuccess, playError } from '../utils/sounds';

const CaseFiles = ({ user, soundEnabled }) => {
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    operativeName: '',
    date: new Date().toISOString().split('T')[0],
    classification: 'SAFE',
    description: '',
    attachments: [],
    redacted: false
  });

  useEffect(() => {
    setFiles(getCaseFiles());
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFiles(searchCaseFiles(searchQuery));
    } else {
      setFiles(getCaseFiles());
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      if (soundEnabled) playError();
      return;
    }

    const newFile = addCaseFile({
      ...formData,
      operativeName: formData.operativeName || user?.operativeId || 'ANONYMOUS'
    });
    
    setFiles(getCaseFiles());
    setFormData({
      title: '',
      operativeName: '',
      date: new Date().toISOString().split('T')[0],
      classification: 'SAFE',
      description: '',
      attachments: [],
      redacted: false
    });
    setShowForm(false);
    if (soundEnabled) playSuccess();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this case file? This action cannot be undone.')) {
      deleteCaseFile(id);
      setFiles(getCaseFiles());
      setSelectedFile(null);
      if (soundEnabled) playClick();
    }
  };

  const toggleRedaction = (id) => {
    const file = files.find(f => f.id === id);
    if (file) {
      updateCaseFile(id, { redacted: !file.redacted });
      setFiles(getCaseFiles());
      if (soundEnabled) playClick();
    }
  };

  const getClassificationStyle = (classification) => {
    switch (classification) {
      case 'KETER':
        return 'border-red-500 text-red-500';
      case 'EUCLID':
        return 'border-yellow-500 text-yellow-500';
      case 'THAUMIEL':
        return 'border-purple-500 text-purple-500';
      default:
        return 'border-green-500 text-green-500';
    }
  };

  return (
    <div className="space-y-4" data-testid="case-files">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold tracking-wider flex items-center gap-2">
          <FileText size={20} /> CASE FILES DATABASE
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (soundEnabled) playClick();
          }}
          className="owl-btn flex items-center gap-2"
          data-testid="new-case-file-btn"
        >
          <Plus size={14} /> NEW REPORT
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search case files..."
          className="owl-input pl-9"
          data-testid="case-files-search"
        />
      </div>

      {/* New File Form */}
      {showForm && (
        <div className="owl-panel" data-testid="case-file-form">
          <div className="owl-panel-header">
            <span className="text-xs uppercase tracking-wider">Submit New Case File</span>
            <button onClick={() => setShowForm(false)} className="text-green-500/60 hover:text-green-500">
              <X size={14} />
            </button>
          </div>
          <div className="owl-panel-content">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder={user?.operativeId || 'Your callsign...'}
                    data-testid="case-file-operative"
                  />
                </div>
                <div className="owl-form-group">
                  <label className="owl-label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="owl-input"
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
                    <option value="SAFE">SAFE</option>
                    <option value="EUCLID">EUCLID</option>
                    <option value="KETER">KETER</option>
                    <option value="THAUMIEL">THAUMIEL</option>
                  </select>
                </div>
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="owl-textarea"
                  placeholder="Detailed case file description..."
                  required
                  data-testid="case-file-description"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Attachments (comma-separated filenames)</label>
                <input
                  type="text"
                  value={formData.attachments.join(', ')}
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  className="owl-input"
                  placeholder="document.pdf, image.png..."
                  data-testid="case-file-attachments"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.redacted}
                    onChange={(e) => setFormData({ ...formData, redacted: e.target.checked })}
                    className="accent-green-500"
                    data-testid="case-file-redacted"
                  />
                  <span className="text-xs uppercase tracking-wider">Mark as Redacted</span>
                </label>
              </div>
              <button type="submit" className="owl-btn w-full" data-testid="case-file-submit">
                SUBMIT CASE FILE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Detail View */}
      {selectedFile && (
        <div className="owl-panel" data-testid="case-file-detail">
          <div className="owl-panel-header">
            <span className="text-xs uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} /> {selectedFile.id}
            </span>
            <button onClick={() => setSelectedFile(null)} className="text-green-500/60 hover:text-green-500">
              <X size={14} />
            </button>
          </div>
          <div className="owl-panel-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{selectedFile.title}</h3>
                <span className={`text-xs border px-2 py-1 ${getClassificationStyle(selectedFile.classification)}`}>
                  {selectedFile.classification}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-green-500/60">Operative:</span>{' '}
                  <span>{selectedFile.operativeName}</span>
                </div>
                <div>
                  <span className="text-green-500/60">Date:</span>{' '}
                  <span>{selectedFile.date}</span>
                </div>
              </div>
              <div className="border-t border-green-500/20 pt-4">
                <div className="text-xs text-green-500/60 mb-2 uppercase">Description</div>
                <p className={`text-sm leading-relaxed ${selectedFile.redacted ? 'redacted' : ''}`}>
                  {selectedFile.description}
                </p>
              </div>
              {selectedFile.attachments?.length > 0 && (
                <div className="border-t border-green-500/20 pt-4">
                  <div className="text-xs text-green-500/60 mb-2 uppercase">Attachments</div>
                  <div className="space-y-1">
                    {selectedFile.attachments.map((att, idx) => (
                      <div key={idx} className="text-xs text-green-500/80 flex items-center gap-2">
                        <FileText size={12} />
                        {att}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4 border-t border-green-500/20">
                <button
                  onClick={() => toggleRedaction(selectedFile.id)}
                  className="owl-btn flex-1 flex items-center justify-center gap-2"
                  data-testid="toggle-redaction-btn"
                >
                  <Edit2 size={14} />
                  {selectedFile.redacted ? 'DECLASSIFY' : 'REDACT'}
                </button>
                <button
                  onClick={() => handleDelete(selectedFile.id)}
                  className="owl-btn owl-btn-danger flex-1 flex items-center justify-center gap-2"
                  data-testid="delete-case-file-btn"
                >
                  <Trash2 size={14} /> DELETE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Files Table */}
      <div className="owl-panel">
        <div className="owl-panel-header">
          <span className="text-xs uppercase tracking-wider">Active Case Files</span>
          <span className="text-xs text-green-500/60">{files.length} records</span>
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
              {files.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-green-500/60 py-8">
                    No case files found. Submit a new report to get started.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file.id} className={file.redacted ? 'opacity-70' : ''}>
                    <td className="font-mono">{file.id}</td>
                    <td className={file.redacted ? 'redacted' : ''}>{file.title}</td>
                    <td>
                      <span className={`text-xs border px-1 ${getClassificationStyle(file.classification)}`}>
                        {file.classification}
                      </span>
                    </td>
                    <td>{file.operativeName}</td>
                    <td className="text-green-500/60">{file.date}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedFile(file);
                            if (soundEnabled) playClick();
                          }}
                          className="text-green-500 hover:text-green-400"
                          title="View"
                          data-testid={`view-${file.id}`}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete"
                          data-testid={`delete-${file.id}`}
                        >
                          <Trash2 size={14} />
                        </button>
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
