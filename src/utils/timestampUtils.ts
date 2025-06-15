
export interface TimestampInfo {
  current: Date;
  historical: Date;
  currentFormatted: string;
  historicalFormatted: string;
  yearsDifference: number;
  historicalPeriod: string;
}

export const generateTimestamps = (): TimestampInfo => {
  const current = new Date();
  
  // Generate a random historical timestamp between 1-50 years ago
  const yearsAgo = Math.floor(Math.random() * 50) + 1;
  const historical = new Date();
  historical.setFullYear(current.getFullYear() - yearsAgo);
  
  // Add some randomness to month and day
  historical.setMonth(Math.floor(Math.random() * 12));
  historical.setDate(Math.floor(Math.random() * 28) + 1);
  
  const currentFormatted = formatDate(current);
  const historicalFormatted = formatDate(historical);
  
  return {
    current,
    historical,
    currentFormatted,
    historicalFormatted,
    yearsDifference: yearsAgo,
    historicalPeriod: getHistoricalPeriod(historical.getFullYear())
  };
};

const formatDate = (date: Date): string => {
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日`;
};

const getHistoricalPeriod = (year: number): string => {
  if (year >= 2020) return '新兴科技时代';
  if (year >= 2010) return '移动互联网时代';
  if (year >= 2000) return '互联网泡沫时代';
  if (year >= 1990) return '数字化转型时代';
  if (year >= 1980) return '个人电脑兴起时代';
  return '工业化晚期时代';
};

export const getHistoricalContext = (year: number): string[] => {
  const contexts: Record<string, string[]> = {
    '2020-2024': [
      'COVID-19疫情改变社会结构',
      '远程办公和数字化转型加速',
      '人工智能技术突破性发展',
      '新能源和可持续发展成为主流',
      '元宇宙和虚拟现实技术兴起'
    ],
    '2015-2019': [
      '移动互联网完全普及',
      '共享经济和独角兽公司涌现',
      '人工智能和大数据技术发展',
      '电子商务彻底改变零售业',
      '社交媒体影响力达到顶峰'
    ],
    '2010-2014': [
      '智能手机革命和移动应用兴起',
      '社交网络平台快速发展',
      '云计算技术开始普及',
      '电子商务和在线支付系统成熟',
      '初创公司和风险投资繁荣'
    ],
    '2000-2009': [
      '互联网泡沫破裂和重建',
      '搜索引擎和网络广告模式确立',
      '电子商务平台开始兴起',
      '数字音乐和在线娱乐发展',
      '全球化和信息技术融合'
    ],
    '1990-1999': [
      '万维网和互联网商业化',
      '个人电脑进入家庭和办公室',
      '软件产业和科技公司快速发展',
      '移动通信技术开始普及',
      '数字化和信息化浪潮兴起'
    ],
    '1980-1989': [
      '个人电脑革命和软件产业诞生',
      '企业数字化和办公自动化',
      '电子游戏产业开始发展',
      '新兴科技公司和创业文化',
      '信息技术基础设施建设'
    ]
  };
  
  for (const [period, events] of Object.entries(contexts)) {
    const [start, end] = period.split('-').map(Number);
    if (year >= start && year <= end) {
      return events;
    }
  }
  
  return ['传统工业社会向信息社会转型', '科技创新和社会变革的萌芽期'];
};
