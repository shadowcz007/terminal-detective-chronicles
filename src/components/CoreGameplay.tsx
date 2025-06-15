
import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal, Zap, Target } from 'lucide-react';

const CoreGameplay = () => {
  const { language } = useLanguage();

  const features = [
    {
      icon: Zap,
      titleKey: 'aiCaseGeneration',
      descKey: 'aiCaseGenerationDesc',
      color: 'text-yellow-400'
    },
    {
      icon: Terminal,
      titleKey: 'intelligentInterrogation',
      descKey: 'intelligentInterrogationDesc',
      color: 'text-cyan-400'
    },
    {
      icon: Target,
      titleKey: 'deductiveReasoning',
      descKey: 'deductiveReasoningDesc',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card 
            key={index} 
            className="bg-black/20 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105"
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <Icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <CardTitle className="text-cyan-300">
                {t(feature.titleKey, language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                {t(feature.descKey, language)}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CoreGameplay;
