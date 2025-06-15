import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { t } from '../utils/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, Lightbulb, Target, Settings, Play } from 'lucide-react';

const GameGuide = () => {
  const { language, toggleLanguage } = useLanguage();

  const commands = [
    { cmd: 'new_case', desc: 'newCaseDesc', example: 'new_case' },
    { cmd: 'status', desc: 'statusDesc', example: 'status' },
    { cmd: 'interrogate', desc: 'interrogateDesc', example: 'interrogate 张三' },
    { cmd: 'recreate', desc: 'recreateDesc', example: 'recreate 案发现场' },
    { cmd: 'config', desc: 'configDesc', example: 'config' },
    { cmd: 'help', desc: 'helpDesc', example: 'help' },
    { cmd: 'clear', desc: 'clearDesc', example: 'clear' },
    { cmd: 'difficulty', desc: 'difficultyDesc', example: 'difficulty easy' }
  ];

  const tips = [
    'tip1', 'tip2', 'tip3', 'tip4', 'tip5'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 背景效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-yellow-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 顶部语言切换 - 移除返回首页按钮，因为现在就是首页 */}
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

        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
            {t('gameGuideTitle', language)}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('gameGuideSubtitle', language)}
          </p>
        </div>

        {/* 指南内容 */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="commands" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-sm">
              <TabsTrigger value="commands" className="data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
                <Terminal className="w-4 h-4 mr-2" />
                {t('commandsTab', language)}
              </TabsTrigger>
              <TabsTrigger value="gameplay" className="data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
                <Target className="w-4 h-4 mr-2" />
                {t('gameplayTab', language)}
              </TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
                <Lightbulb className="w-4 h-4 mr-2" />
                {t('tipsTab', language)}
              </TabsTrigger>
              <TabsTrigger value="setup" className="data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
                <Settings className="w-4 h-4 mr-2" />
                {t('setupTab', language)}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="commands" className="mt-8">
              <div className="grid md:grid-cols-2 gap-4">
                {commands.map((command, index) => (
                  <Card key={index} className="bg-black/20 backdrop-blur-sm border-cyan-500/20">
                    <CardHeader>
                      <CardTitle className="text-cyan-300 font-mono text-lg">
                        {command.cmd}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 mb-3">
                        {t(command.desc, language)}
                      </CardDescription>
                      <div className="bg-slate-800/50 rounded-md p-3 font-mono text-sm text-green-400 border border-slate-700">
                        {'> '}{command.example}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gameplay" className="mt-8">
              <Card className="bg-black/20 backdrop-blur-sm border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 text-2xl">
                    {t('howToPlay', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('step1Title', language)}
                      </h3>
                      <p>{t('step1Desc', language)}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('step2Title', language)}
                      </h3>
                      <p>{t('step2Desc', language)}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('step3Title', language)}
                      </h3>
                      <p>{t('step3Desc', language)}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('step4Title', language)}
                      </h3>
                      <p>{t('step4Desc', language)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="mt-8">
              <div className="grid gap-4">
                {tips.map((tip, index) => (
                  <Card key={index} className="bg-black/20 backdrop-blur-sm border-cyan-500/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300">{t(tip, language)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="setup" className="mt-8">
              <Card className="bg-black/20 backdrop-blur-sm border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-cyan-300 text-2xl">
                    {t('setupTitle', language)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('aiSetupTitle', language)}
                      </h3>
                      <p className="mb-3">{t('aiSetupDesc', language)}</p>
                      <div className="bg-slate-800/50 rounded-md p-3 font-mono text-sm text-green-400 border border-slate-700">
                        {'> config'}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                        {t('difficultyTitle', language)}
                      </h3>
                      <p className="mb-3">{t('difficultyDesc', language)}</p>
                      <div className="bg-slate-800/50 rounded-md p-3 font-mono text-sm text-green-400 border border-slate-700">
                        {'> difficulty easy/medium/hard'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 开始游戏按钮 */}
        <div className="text-center mt-12">
          <Link to="/terminal">
            <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
              <Play className="w-6 h-6 mr-2" />
              {t('startPlayingNow', language)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameGuide;
