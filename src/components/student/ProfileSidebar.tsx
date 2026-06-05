import React, { useState } from 'react';
import { Bell, GraduationCap, Briefcase, Globe, Linkedin, Camera, CheckCircle2 } from 'lucide-react';
import UploadRow from './UploadRow'; // Assuming UploadRow is in the same directory or correctly imported

const ProfileSidebar: React.FC = () => {
  const [isHoveringProfile, setIsHoveringProfile] = useState(false);

  return (
    <div className="w-80 flex-shrink-0 sticky top-6">
      <div className="glass-card rounded-3xl p-5">
        {/* SECTION A — Profile Header */}
        <div className="text-center">
          <div
            className="relative w-20 h-20 mx-auto rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 profile-ring-hover"
            onMouseEnter={() => setIsHoveringProfile(true)}
            onMouseLeave={() => setIsHoveringProfile(false)}
          >
            <span className="text-2xl font-bold text-white">PS</span>
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            {isHoveringProfile && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mt-3">Priya Sharma</h3>
          <p className="text-xs text-slate-500 mt-0.5">B.Tech CSE • NITK 2025</p>
          <div className="inline-flex items-center gap-1 mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span>Open to Work</span>
          </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION B — Upload Documents */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Verification Documents
          </h4>
          <UploadRow icon="resume" label="Resume" status="uploaded" value="resume_priya.pdf" />
          <UploadRow icon="certificate" label="Certificates" status="connected" value="3 uploaded" />
          <UploadRow icon="github" label="GitHub" status="connected" value="priya-sharma" />
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION C — Links */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Profile Links
          </h4>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Portfolio</span>
            </div>
            <a href="#" className="text-xs text-indigo-500 hover:underline cursor-pointer flex items-center gap-1">
              priya.dev <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">LinkedIn</span>
            </div>
            <a href="#" className="text-xs text-indigo-500 hover:underline cursor-pointer flex items-center gap-1">
              linkedin.com/in/priya <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* SECTION D — Current Status */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Currently
          </h4>
          <div className="flex items-center gap-2 py-1">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">Working at Infosys</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-700">Studying B.Tech CSE</span>
          </div>
          <button className="text-xs text-indigo-400 hover:text-indigo-600 mt-1">
            + Edit Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
