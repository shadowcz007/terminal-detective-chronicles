
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Play, ArrowDown } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import AnimatedTerminal from '../components/AnimatedTerminal';
import CoreGameplay from '../components/CoreGameplay';
import ExpandingLinesAnimation from '../components/ExpandingLinesAnimation';

const GameGuide = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/5 via-cyan-500/5 to-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-end">
            <div className="flex items-center space-x-2 text-sm bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className={language === 'zh' ? 'text-cyan-400' : 'text-gray-400'}>中</span>
              <Switch
                checked={language === 'en'}
                onCheckedChange={toggleLanguage}
                className="data-[state=checked]:bg-cyan-600"
              />
              <span className={language === 'en' ? 'text-cyan-400' : 'text-gray-400'}>EN</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            {/* Expanding Lines Animation */}
            <div className="mb-12 flex justify-center">
              <ExpandingLinesAnimation className="opacity-80" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
                {t('gameTitle', language)}
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl text-cyan-300 mb-6 font-light">
              {t('gameSubtitle', language)}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('heroDescription', language)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/terminal">
              <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                <Play className="w-6 h-6 mr-2" />
                {t('startYourJourney', language)}
              </Button>
            </Link>
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <ArrowDown className="w-5 h-5 mr-2" />
              {t('howItWorks', language)}
            </Button>
          </div>
        </section>

        {/* Core Gameplay Features */}
        <section id="features" className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
              {t('howItWorks', language)}
            </h3>
          </div>
          
          <CoreGameplay />
        </section>

        {/* Game Flow Steps */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((step) => (
              <Card key={step} className="bg-black/20 backdrop-blur-sm border-cyan-500/20 text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                    {step}
                  </div>
                  <CardTitle className="text-cyan-300">
                    {t(`step${step}`, language)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">
                    {t(`step${step}Desc`, language)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Terminal Preview */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
              {t('terminalPreview', language)}
            </h3>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AnimatedTerminal />
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-16 text-center">
          <Link to="/terminal">
            <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold px-12 py-6 text-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
              <Play className="w-8 h-8 mr-3" />
              {t('startYourJourney', language)}
            </Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default GameGuide;
