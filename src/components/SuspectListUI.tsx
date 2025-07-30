import React from 'react';
import { Suspect } from '../types/gameTypes';

interface SuspectListUIProps {
  suspects: Suspect[];
  language: 'zh' | 'en';
  onClose: () => void;
}

export const SuspectListUI: React.FC<SuspectListUIProps> = ({ suspects, language, onClose }) => {
  const t = (key: string, lang: 'zh' | 'en') => {
    const translations = {
      zh: {
        suspectList: '嫌疑人名单',
        occupation: '职业',
        relationship: '与受害者关系',
        motive: '动机',
        close: '关闭',
        noSuspects: '暂无嫌疑人信息'
      },
      en: {
        suspectList: 'Suspect List',
        occupation: 'Occupation',
        relationship: 'Relationship with Victim',
        motive: 'Motive',
        close: 'Close',
        noSuspects: 'No suspect information available'
      }
    };
    return translations[lang][key] || key;
  };

  if (suspects.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="container-bg mx-auto max-w-4xl p-2 relative overflow-hidden">
          <div className="scanline-overlay"></div>
          <div className="border-2 border-[#3a4c6f] p-4 grid-bg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">BGONLINE.TC</div>
              <div className="flex space-x-2">
                <div className="w-6 h-1 bg-[#3a4c6f]"></div>
                <div className="w-6 h-1 bg-[#3a4c6f]"></div>
                <div className="w-6 h-1 bg-[#3a4c6f]"></div>
              </div>
            </div>
            <div className="text-center text-glow text-xl">
              {t('noSuspects', language)}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#64f0ff] text-[#64f0ff] hover:bg-[#64f0ff] hover:text-black transition-colors"
              >
                {t('close', language)}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="container-bg mx-auto max-w-7xl p-2 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="scanline-overlay"></div>
        <div className="border-2 border-[#3a4c6f] p-4 grid-bg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">BGONLINE.TC</div>
            <div className="flex space-x-2">
              <div className="w-6 h-1 bg-[#3a4c6f]"></div>
              <div className="w-6 h-1 bg-[#3a4c6f]"></div>
              <div className="w-6 h-1 bg-[#3a4c6f]"></div>
            </div>
          </div>
          
          {/* Title */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="h-1 flex-grow bg-[#3a4c6f]"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full bg-[#3a4c6f]"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
            <div className="h-1 flex-grow bg-[#3a4c6f]"></div>
          </div>
          
          <h1 className="text-2xl text-center text-glow glitch-text mb-6" data-text={t('suspectList', language)}>
            {t('suspectList', language)}
          </h1>
          
          {/* Suspects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suspects.map((suspect, index) => (
              <div key={suspect.id} className="info-box p-0">
                <div className="bg-[#1a233a] p-2 flex items-center justify-between">
                  <h2 className="text-lg text-glow glitch-text" data-text={`₩ ${(index + 1) * 500000}`}>
                    ₩ {(index + 1) * 500000}
                  </h2>
                </div>
                <div className="relative">
                  {/* Placeholder for suspect image */}
                  <div className="w-full h-48 bg-gradient-to-b from-[#1a233a] to-[#0c1424] flex items-center justify-center border border-[#3a4c6f]">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#3a4c6f] rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-[#64f0ff] text-2xl font-bold">{suspect.name.charAt(0)}</span>
                      </div>
                      <div className="text-[#64f0ff] text-sm font-mono">ID: {suspect.id}</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 text-center text-lg font-bold tracking-widest text-glow">
                    {suspect.name}
                  </div>
                </div>
                
                {/* Suspect Info Grid */}
                <div className="grid grid-cols-3 gap-2 text-xs text-center p-2">
                  <div className="p-1 border border-[#3a4c6f]">ID: {suspect.id}</div>
                  <div className="p-1 border border-[#3a4c6f]">STATUS <span className="text-yellow-500">ACTIVE</span></div>
                  <div className="p-1 border border-[#3a4c6f]">PRIORITY <span className="text-red-500">HIGH</span></div>
                </div>
                
                {/* Main Info */}
                <div className="p-2 space-y-2">
                  <div className="info-box">
                    <p className="text-xs text-gray-400">{t('occupation', language)}</p>
                    <p className="text-sm text-[#64f0ff]">{suspect.occupation}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="info-box">
                      <p className="text-xs text-gray-400">{t('relationship', language)}</p>
                      <p className="text-sm">{suspect.relationship}</p>
                    </div>
                    <div className="info-box">
                      <p className="text-xs text-gray-400">{t('motive', language)}</p>
                      <p className="text-sm text-red-400">{suspect.motive.substring(0, 50)}...</p>
                    </div>
                  </div>
                  
                  <div className="decorative-line w-full my-2"></div>
                  
                  <div className="info-box">
                    <p className="text-xs text-gray-400">DNA FINGER PRINT</p>
                    <div className="h-8 mt-1 border border-[#3a4c6f] bg-black bg-opacity-20 flex items-center justify-center">
                      <span className="text-red-500 text-xs">/////////////</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="h-1 flex-grow bg-[#3a4c6f]"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full bg-[#3a4c6f]"></div>
            <div className="w-4 h-4 border-2 border-[#3a4c6f] rounded-full"></div>
            <div className="h-1 flex-grow bg-[#3a4c6f]"></div>
          </div>
          
          {/* Close Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-[#64f0ff] text-[#64f0ff] hover:bg-[#64f0ff] hover:text-black transition-colors font-mono"
            >
              {t('close', language)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 