'use client';
import { useState, useEffect } from 'react';
import { Video, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';

export default function VideoConsultation({ roomName, onClose }) {
  const [joined, setJoined] = useState(false);
  
  // Mute/Camera state purely for UI buttons before joining (Jitsi iframe handles its own)
  const [micMuted, setMicMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Load Jitsi script safely
  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleJoin = () => {
    if (!window.JitsiMeetExternalAPI) {
      alert('Video service is still loading. Please try again in a few seconds.');
      return;
    }
    
    setJoined(true);

    setTimeout(() => {
      const domain = 'meet.jit.si';
      const options = {
        roomName: `HealthSync_${roomName || 'Consultation_' + Date.now()}`,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        configOverwrite: {
          startWithAudioMuted: micMuted,
          startWithVideoMuted: camOff,
          prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
          ],
        },
      };
      
      const api = new window.JitsiMeetExternalAPI(domain, options);
      
      api.addEventListener('videoConferenceLeft', () => {
        api.dispose();
        onClose();
      });
    }, 100); // Wait for container to render
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
      <div className="p-4 bg-slate-800 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="font-bold text-lg tracking-wide">Live Telemedicine Consultation</h2>
        </div>
        {!joined && (
          <button onClick={onClose} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition">
            <PhoneOff size={20} className="text-red-400" />
          </button>
        )}
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center">
        {!joined ? (
          <div className="text-center bg-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700">
            <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to join?</h3>
            <p className="text-slate-400 mb-8">Your doctor is waiting for you in the virtual consultation room.</p>
            
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => setMicMuted(!micMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-700 text-white border border-slate-600'}`}
              >
                {micMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button 
                onClick={() => setCamOff(!camOff)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOff ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-slate-700 text-white border border-slate-600'}`}
              >
                {camOff ? <CameraOff size={24} /> : <Camera size={24} />}
              </button>
            </div>
            
            <button 
              onClick={handleJoin}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/50 transition-all text-lg"
            >
              Join Consultation
            </button>
          </div>
        ) : (
          <div id="jitsi-container" className="w-full h-full" />
        )}
      </div>
    </div>
  );
}
