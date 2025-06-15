
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Clock, Search, Users, Zap, BookOpen, Play } from 'lucide-react';

const Welcome = () => {
  const { language, toggleLanguage } = useLanguage();

  const features = [
    {
      icon: Clock,
      titleKey: 'feature1Title',
      descKey: 'feature1Desc'
    },
    {
      icon: Search,
      titleKey: 'feature2Title',
      descKey: 'feature2Desc'
    },
    {
      icon: Users,
      titleKey: 'feature3Title',
      descKey: 'feature3Desc'
    },
    {
      icon: Zap,
      titleKey: 'feature4Title',
      descKey: 'feature4Desc'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 语言切换 */}
        <div className="flex justify-end mb-8">
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

        {/* 主标题 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent animate-pulse">
            {t('gameTitle', language)}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('gameSubtitle', language)}
          </p>
        </div>

        {/* 游戏特色 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black/20 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <CardTitle className="text-cyan-300 text-lg">
                  {t(feature.titleKey, language)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 text-center">
                  {t(feature.descKey, language)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/terminal">
            <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
              <Play className="w-6 h-6 mr-2" />
              {t('startGame', language)}
            </Button>
          </Link>
          
          <Link to="/guide">
            <Button variant="outline" size="lg" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg font-semibold transition-all duration-300">
              <BookOpen className="w-6 h-6 mr-2" />
              {t('gameGuide', language)}
            </Button>
          </Link>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>{t('welcomeFooter', language)}</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
