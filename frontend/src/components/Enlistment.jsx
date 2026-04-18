import React, { useState } from 'react';
import { UserPlus, Shield, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { playSuccess, playClick } from '../utils/sounds';

const Enlistment = ({ soundEnabled }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    callsign: '',
    realName: '',
    background: '',
    skills: [],
    motivation: '',
    division: '',
    agreement: false
  });
  const [submitted, setSubmitted] = useState(false);

  const divisions = [
    {
      id: 'gtd',
      name: 'Ground Team Division',
      description: 'Primary combat force for offensive and defensive operations.',
      requirements: 'Combat experience, physical fitness, tactical training'
    },
    {
      id: 'ilb',
      name: 'Iron Lotus Battalion',
      description: 'Elite special operations unit for high-risk missions.',
      requirements: 'Exceptional combat skills, psychological evaluation, Endbringer Trial'
    },
    {
      id: 'mw',
      name: 'Mortician Wing',
      description: 'Research and medical support for anomaly analysis.',
      requirements: 'Medical or scientific background, research experience'
    },
    {
      id: 'mi',
      name: 'Masquerade Initiative',
      description: 'Intelligence gathering and infiltration operations.',
      requirements: 'Social engineering skills, language proficiency, clean record'
    }
  ];

  const skillOptions = [
    'Combat Training', 'Medical', 'Research', 'Engineering', 'Languages',
    'Infiltration', 'Electronics', 'Driving/Piloting', 'Survival', 'Negotiation'
  ];

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (soundEnabled) playSuccess();
    setSubmitted(true);
  };

  const nextStep = () => {
    if (soundEnabled) playClick();
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (soundEnabled) playClick();
    setStep(prev => prev - 1);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12" data-testid="enlistment-success">
        <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
        <h2 className="text-2xl font-bold mb-4 text-glow">APPLICATION RECEIVED</h2>
        <p className="text-green-500/80 mb-6">
          Your enlistment application has been submitted for review. A Masquerade operative 
          will contact you within 72 hours using secure channels.
        </p>
        <div className="border border-green-500/30 p-4 text-left text-sm">
          <div className="mb-2"><span className="text-green-500/60">Callsign:</span> {formData.callsign}</div>
          <div className="mb-2"><span className="text-green-500/60">Division:</span> {divisions.find(d => d.id === formData.division)?.name}</div>
          <div><span className="text-green-500/60">Application ID:</span> OWL-REC-{Date.now().toString(36).toUpperCase()}</div>
        </div>
        <div className="mt-8 text-xs text-green-500/50">
          "BE INFORMED. BE ENLIGHTENED." - The Merchant
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" data-testid="enlistment-form">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wider mb-2 flex items-center justify-center gap-3">
          <UserPlus size={24} /> ENLISTMENT PORTAL
        </h2>
        <p className="text-green-500/60 text-sm">Join the Order of the White Lotus</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 border flex items-center justify-center text-xs ${step >= s ? 'border-green-500 bg-green-500/20 text-green-400' : 'border-green-500/30 text-green-500/30'}`}>
              {s}
            </div>
            {s < 4 && <div className={`w-12 h-px ${step > s ? 'bg-green-500' : 'bg-green-500/30'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Warning */}
      <div className="border border-yellow-500/50 bg-yellow-500/10 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
        <div className="text-sm text-yellow-500/80">
          <strong>WARNING:</strong> By proceeding, you acknowledge that membership in the Order of the White Lotus 
          may place you in conflict with global authorities. This is not a game.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="owl-panel">
            <div className="owl-panel-header">
              <span className="text-xs uppercase tracking-wider">Step 1: Basic Information</span>
            </div>
            <div className="owl-panel-content space-y-4">
              <div className="owl-form-group">
                <label className="owl-label">Callsign / Codename *</label>
                <input
                  type="text"
                  value={formData.callsign}
                  onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                  className="owl-input"
                  placeholder="Your operational designation..."
                  required
                  data-testid="callsign-input"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Real Name (Optional - Will be encrypted)</label>
                <input
                  type="text"
                  value={formData.realName}
                  onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                  className="owl-input"
                  placeholder="████████████"
                  data-testid="realname-input"
                />
              </div>
              <div className="owl-form-group">
                <label className="owl-label">Background</label>
                <select
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  className="owl-select"
                  data-testid="background-select"
                >
                  <option value="">Select background...</option>
                  <option value="military">Military / Law Enforcement</option>
                  <option value="medical">Medical / Scientific</option>
                  <option value="technical">Technical / Engineering</option>
                  <option value="intelligence">Intelligence / Security</option>
                  <option value="civilian">Civilian</option>
                  <option value="classified">[CLASSIFIED]</option>
                </select>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="owl-btn w-full flex items-center justify-center gap-2"
                disabled={!formData.callsign}
                data-testid="next-step-1"
              >
                CONTINUE <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="owl-panel">
            <div className="owl-panel-header">
              <span className="text-xs uppercase tracking-wider">Step 2: Skills Assessment</span>
            </div>
            <div className="owl-panel-content space-y-4">
              <p className="text-sm text-green-500/60">Select all applicable skills:</p>
              <div className="grid grid-cols-2 gap-2">
                {skillOptions.map((skill) => (
                  <label
                    key={skill}
                    className={`flex items-center gap-2 p-2 border cursor-pointer transition-colors ${formData.skills.includes(skill) ? 'border-green-500 bg-green-500/10' : 'border-green-500/30 hover:border-green-500/50'}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="accent-green-500"
                    />
                    <span className="text-xs">{skill}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prevStep} className="owl-btn flex-1">
                  BACK
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="owl-btn flex-1 flex items-center justify-center gap-2"
                  data-testid="next-step-2"
                >
                  CONTINUE <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Division Selection */}
        {step === 3 && (
          <div className="owl-panel">
            <div className="owl-panel-header">
              <span className="text-xs uppercase tracking-wider">Step 3: Division Selection</span>
            </div>
            <div className="owl-panel-content space-y-4">
              <p className="text-sm text-green-500/60">Select your preferred division:</p>
              <div className="space-y-2">
                {divisions.map((div) => (
                  <label
                    key={div.id}
                    className={`block p-3 border cursor-pointer transition-colors ${formData.division === div.id ? 'border-green-500 bg-green-500/10' : 'border-green-500/30 hover:border-green-500/50'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        name="division"
                        value={div.id}
                        checked={formData.division === div.id}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        className="accent-green-500"
                      />
                      <span className="font-bold text-sm">{div.name}</span>
                    </div>
                    <p className="text-xs text-green-500/60 ml-5">{div.description}</p>
                    <p className="text-xs text-yellow-500/60 ml-5 mt-1">Requirements: {div.requirements}</p>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prevStep} className="owl-btn flex-1">
                  BACK
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="owl-btn flex-1 flex items-center justify-center gap-2"
                  disabled={!formData.division}
                  data-testid="next-step-3"
                >
                  CONTINUE <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Motivation & Agreement */}
        {step === 4 && (
          <div className="owl-panel">
            <div className="owl-panel-header">
              <span className="text-xs uppercase tracking-wider">Step 4: Final Review</span>
            </div>
            <div className="owl-panel-content space-y-4">
              <div className="owl-form-group">
                <label className="owl-label">Why do you wish to join the Order?</label>
                <textarea
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  className="owl-textarea"
                  placeholder="State your motivation..."
                  required
                  data-testid="motivation-textarea"
                />
              </div>
              <div className="border border-green-500/30 p-4 text-xs">
                <p className="font-bold mb-2">ORDER OF THE WHITE LOTUS - OATH OF ENLISTMENT</p>
                <p className="text-green-500/60 mb-4">
                  I solemnly pledge to uphold the principles of the Order: to expose corruption, 
                  protect the innocent, and seek enlightenment through truth. I understand that 
                  my service may require sacrifice and that I will be held accountable for my 
                  actions. Against all odds, I will endure.
                </p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreement}
                    onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                    className="accent-green-500"
                    required
                    data-testid="agreement-checkbox"
                  />
                  <span>I accept the Oath of Enlistment and understand its implications</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={prevStep} className="owl-btn flex-1">
                  BACK
                </button>
                <button
                  type="submit"
                  className="owl-btn flex-1 flex items-center justify-center gap-2 pulse-glow"
                  disabled={!formData.agreement || !formData.motivation}
                  data-testid="submit-enlistment"
                >
                  <Shield size={14} /> SUBMIT APPLICATION
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Enlistment;
