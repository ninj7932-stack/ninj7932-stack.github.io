import React, { useState } from 'react';
import { Radio, Volume2, Eye, Download, ChevronRight } from 'lucide-react';

const Propaganda = () => {
  const [activeTab, setActiveTab] = useState('broadcasts');

  const broadcasts = [
    {
      id: 'BC-001',
      title: 'The Truth About Site-416',
      date: '20██-12-15',
      status: 'ACTIVE',
      reach: '2.3M',
      description: 'Leaked documents exposing unethical experimentation on Class-D personnel. Foundation response: CONTAINED.'
    },
    {
      id: 'BC-002',
      title: 'UNGOC Cover-Up Operation',
      date: '20██-11-28',
      status: 'ARCHIVED',
      reach: '890K',
      description: 'Evidence of GOC destroying beneficial anomalies without assessment. Public awareness campaign successful.'
    },
    {
      id: 'BC-003',
      title: 'The Merchant Speaks',
      date: '20██-10-01',
      status: 'CLASSIFIED',
      reach: '████████',
      description: '[CONTENT REDACTED BY O5 REQUEST] - Message from the Founder regarding the Order\'s true purpose.'
    },
    {
      id: 'BC-004',
      title: 'Ordo Divinus Atrocities',
      date: '20██-09-14',
      status: 'ACTIVE',
      reach: '1.7M',
      description: 'Documented evidence of OD cult rituals involving civilian casualties. International investigation ongoing.'
    }
  ];

  const materials = [
    {
      type: 'POSTER',
      title: 'BE INFORMED. BE ENLIGHTENED.',
      description: 'Standard recruitment poster for general distribution.',
      status: 'APPROVED'
    },
    {
      type: 'PAMPHLET',
      title: 'What They Don\'t Want You to Know',
      description: 'Educational material about Foundation containment practices.',
      status: 'APPROVED'
    },
    {
      type: 'VIDEO',
      title: 'The Veil Must Fall',
      description: 'Documentary footage compiled from multiple leaked sources.',
      status: 'RESTRICTED'
    },
    {
      type: 'AUDIO',
      title: 'Pirate Radio Broadcast Scripts',
      description: 'Pre-recorded messages for emergency broadcast systems.',
      status: 'APPROVED'
    }
  ];

  const quotes = [
    { text: '"The truth is not a privilege. It is a right."', author: 'The Merchant' },
    { text: '"In darkness, we find clarity. In knowledge, we find power."', author: 'Agent Echo' },
    { text: '"They contain what they fear. We expose what they hide."', author: 'OWL Doctrine' },
    { text: '"Against all odds we endure. Against all lies we persist."', author: 'Order Motto' },
  ];

  return (
    <div className="space-y-6" data-testid="propaganda-section">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wider mb-2 flex items-center justify-center gap-3">
          <Radio size={24} /> PROPAGANDA DIVISION
        </h2>
        <p className="text-green-500/60 text-sm">Spreading enlightenment through truth</p>
      </div>

      {/* Quote Banner */}
      <div className="border border-green-500/30 p-6 text-center bg-black/50">
        <blockquote className="text-lg italic mb-2 text-glow">
          {quotes[Math.floor(Date.now() / 10000) % quotes.length].text}
        </blockquote>
        <cite className="text-sm text-green-500/60">
          — {quotes[Math.floor(Date.now() / 10000) % quotes.length].author}
        </cite>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-500/30">
        <button
          onClick={() => setActiveTab('broadcasts')}
          className={`px-4 py-2 text-xs uppercase tracking-wider ${activeTab === 'broadcasts' ? 'border-b-2 border-green-500 text-green-400' : 'text-green-500/60'}`}
          data-testid="broadcasts-tab"
        >
          Active Broadcasts
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 text-xs uppercase tracking-wider ${activeTab === 'materials' ? 'border-b-2 border-green-500 text-green-400' : 'text-green-500/60'}`}
          data-testid="materials-tab"
        >
          Distribution Materials
        </button>
      </div>

      {/* Broadcasts Tab */}
      {activeTab === 'broadcasts' && (
        <div className="space-y-4">
          {broadcasts.map((broadcast) => (
            <div key={broadcast.id} className="owl-panel">
              <div className="owl-panel-header">
                <span className="text-xs font-mono">{broadcast.id}</span>
                <span className={`text-xs ${broadcast.status === 'ACTIVE' ? 'text-green-400' : broadcast.status === 'CLASSIFIED' ? 'text-red-500' : 'text-green-500/60'}`}>
                  {broadcast.status}
                </span>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{broadcast.title}</h3>
                  <span className="text-xs text-green-500/60">{broadcast.date}</span>
                </div>
                <p className={`text-sm text-green-500/80 mb-3 ${broadcast.status === 'CLASSIFIED' ? 'redacted' : ''}`}>
                  {broadcast.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-500/60">
                    Estimated Reach: <span className="text-green-400">{broadcast.reach}</span>
                  </span>
                  <button className="flex items-center gap-1 text-green-500 hover:text-green-400">
                    <Eye size={12} /> View Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material, idx) => (
            <div key={idx} className="owl-panel">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs border border-green-500/50 px-2 py-0.5">
                    {material.type}
                  </span>
                  <span className={`text-xs ${material.status === 'RESTRICTED' ? 'text-yellow-500' : 'text-green-400'}`}>
                    [{material.status}]
                  </span>
                </div>
                <h3 className="font-bold mb-2">{material.title}</h3>
                <p className="text-sm text-green-500/70 mb-3">{material.description}</p>
                <button 
                  className="owl-btn w-full flex items-center justify-center gap-2 text-xs"
                  disabled={material.status === 'RESTRICTED'}
                >
                  <Download size={12} /> 
                  {material.status === 'RESTRICTED' ? 'CLEARANCE REQUIRED' : 'DOWNLOAD'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mission Statement */}
      <div className="border border-green-500/30 p-6 bg-black/50">
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider">Propaganda Division Mission</h3>
        <p className="text-sm text-green-500/80 leading-relaxed">
          The Propaganda Division is responsible for disseminating truth to the public while maintaining 
          operational security. Our mission is to expose the wrongdoings of oppressive organizations 
          while recruiting like-minded individuals to our cause. All materials are vetted by the 
          Masquerade Initiative before distribution.
        </p>
        <div className="mt-4 text-xs text-green-500/50">
          Director: ████████ | Established: 20██ | Active Operations: 12
        </div>
      </div>
    </div>
  );
};

export default Propaganda;
