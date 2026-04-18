import React from 'react';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const EnlistingPage = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#020202] text-white crt-screen" data-testid="enlisting-page">
      <div className="crt-scanlines"></div>
      
      {/* Header */}
      <header className="border-b border-white/30 bg-black/80 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center border border-white text-lg font-bold">
              白
            </div>
            <div>
              <div className="text-lg font-bold tracking-wider">ORDER OF THE WHITE LOTUS</div>
              <div className="text-xs text-white/60">Enlistment Portal</div>
            </div>
          </div>
          <button
            onClick={onBack}
            className="owl-btn flex items-center gap-2"
            data-testid="back-to-login"
          >
            <ArrowLeft size={16} /> BACK TO LOGIN
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="owl-panel">
          <div className="owl-panel-header">
            <span className="text-sm uppercase tracking-wider font-bold">
              WELCOME MESSAGE
            </span>
          </div>
          <div className="p-8 space-y-6 text-base leading-relaxed">
            {/* Warning Banner */}
            <div className="border border-red-500/50 bg-red-500/10 p-4 text-red-400 text-sm">
              <strong className="text-red-500">WARNING:</strong> Copying this message for other subfactions/projects will lead to a dishonorable discharge and a blacklist from OWL.
            </div>

            {/* Welcome Text */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-glow">
                Welcome to "Order of the White Lotus."
              </h2>
              
              <p>
                You will be ranked as <strong>"Enlightened Trainee"</strong> as your starting rank. 
                With this rank, you will <strong>NOT</strong> be allowed to participate in any deployments. 
                You can only attend training sessions or tryouts.
              </p>
              
              <p>
                When you attend said events, you will be promoted to <strong>"Enlightened Operative."</strong> 
                You will now be allowed to join us in deployments with this rank. However, you can not join 
                us in offensive deployments because you do not fully have the proper drill training to 
                integrate into OWL.
              </p>
              
              <p>
                Additionally, we must examine your combat skills in these trainings. You must join our 
                ROBLOX group to be ranked. When you are accepted into the group, do <code className="bg-white/10 px-2 py-1">/getrole</code>.
              </p>
            </div>

            {/* Links Section */}
            <div className="space-y-4 pt-4 border-t border-white/20">
              <h3 className="text-lg font-bold uppercase tracking-wider">Important Links</h3>
              
              <div className="space-y-3">
                <a 
                  href="https://www.roblox.com/groups/15108558/The-New-Order-SCP-Roleplay#!/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-white/30 hover:border-white hover:bg-white/5 transition-colors"
                  data-testid="roblox-group-link"
                >
                  <ExternalLink size={20} />
                  <div>
                    <div className="font-bold">ROBLOX Group</div>
                    <div className="text-sm text-white/60">Join our official ROBLOX group</div>
                  </div>
                </a>
                
                <a 
                  href="https://discord.gg/33AN6eaWa7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-white/30 hover:border-white hover:bg-white/5 transition-colors"
                  data-testid="discord-link"
                >
                  <ExternalLink size={20} />
                  <div>
                    <div className="font-bold">Discord Server</div>
                    <div className="text-sm text-white/60">Join our Discord and do /getrole</div>
                  </div>
                </a>
                
                <a 
                  href="https://docs.google.com/document/d/1267833bp3ABR5pGP2mSVpl8GYu_CGUGT8XMULFA7j_E/edit?usp=drivesdk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-white/30 hover:border-white hover:bg-white/5 transition-colors"
                  data-testid="handbook-link"
                >
                  <ExternalLink size={20} />
                  <div>
                    <div className="font-bold">Official Handbook</div>
                    <div className="text-sm text-white/60">Read through for any questions about our group</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Final Note */}
            <div className="pt-4 border-t border-white/20 text-center">
              <p className="text-white/60 text-sm">
                "BE INFORMED. BE ENLIGHTENED." - The Merchant, Founder
              </p>
              <p className="text-white/40 text-xs mt-2 uppercase tracking-wider">
                Against All Odds We Endure
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="owl-footer mt-8">
        <div className="mb-2">Order of the White Lotus - Against All Odds We Endure</div>
        <div className="text-red-500/60 text-[10px]">
          THIS SYSTEM IS FOR AUTHORIZED PERSONNEL ONLY. ALL ACTIVITIES ARE MONITORED.
        </div>
      </footer>
    </div>
  );
};

export default EnlistingPage;
