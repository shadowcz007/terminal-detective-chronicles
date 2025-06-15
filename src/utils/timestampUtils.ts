export interface TimestampInfo {
  current: Date;
  historical: Date;
  currentFormatted: string;
  historicalFormatted: string;
  yearsDifference: number;
  historicalPeriod: string;
  historicalContext: string[];
  seasonalContext: string;
  economicContext: string;
  technologicalContext: string;
  randomSeed: number;
  timeVariant: string;
}

export const generateTimestamps = (): TimestampInfo => {
  const current = new Date();
  
  // **增强随机性：基于当前时间戳生成种子**
  const currentTimestamp = current.getTime();
  const randomBase = Math.sin(currentTimestamp) * 10000;
  const randomSeed = Math.abs(randomBase - Math.floor(randomBase));
  
  // **基于时间戳的复合随机数生成器**
  const seededRandom = (seed: number, multiplier: number = 1) => {
    const x = Math.sin(seed * multiplier) * 10000;
    return x - Math.floor(x);
  };
  
  // **动态时间范围选择：基于时间戳的分布**
  const timeDistribution = seededRandom(randomSeed, 12.345);
  let yearsAgo: number;
  
  if (timeDistribution < 0.1) {
    // 10% - 极近期事件 (1-3年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 23.456) * 3) + 1;
  } else if (timeDistribution < 0.25) {
    // 15% - 近期事件 (3-8年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 34.567) * 6) + 3;
  } else if (timeDistribution < 0.50) {
    // 25% - 现代历史 (8-20年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 45.678) * 13) + 8;
  } else if (timeDistribution < 0.75) {
    // 25% - 当代历史 (20-40年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 56.789) * 21) + 20;
  } else if (timeDistribution < 0.90) {
    // 15% - 中期历史 (40-60年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 67.890) * 21) + 40;
  } else {
    // 10% - 远期历史 (60-100年)
    yearsAgo = Math.floor(seededRandom(randomSeed, 78.901) * 41) + 60;
  }
  
  const historical = new Date();
  historical.setFullYear(current.getFullYear() - yearsAgo);
  
  // **高度随机化的日期设置**
  const monthSeed = seededRandom(randomSeed, 89.012);
  const daySeed = seededRandom(randomSeed, 90.123);
  const hourSeed = seededRandom(randomSeed, 101.234);
  const minuteSeed = seededRandom(randomSeed, 112.345);
  
  historical.setMonth(Math.floor(monthSeed * 12));
  historical.setDate(Math.floor(daySeed * 28) + 1); // 避免月末日期问题
  historical.setHours(Math.floor(hourSeed * 24));
  historical.setMinutes(Math.floor(minuteSeed * 60));
  
  const currentFormatted = formatDate(current);
  const historicalFormatted = formatDate(historical);
  const historicalYear = historical.getFullYear();
  
  // **时间变体：增加叙事层次**
  const timeVariants = [
    '历史转折点', '关键时刻', '变革时期', '动荡年代', 
    '繁荣时光', '衰落时代', '复兴时期', '过渡阶段',
    '黄金年代', '困难时期', '突破时刻', '沉寂岁月'
  ];
  const variantIndex = Math.floor(seededRandom(randomSeed, 123.456) * timeVariants.length);
  const timeVariant = timeVariants[variantIndex];
  
  return {
    current,
    historical,
    currentFormatted,
    historicalFormatted,
    yearsDifference: yearsAgo,
    historicalPeriod: getHistoricalPeriod(historicalYear),
    historicalContext: getHistoricalContext(historicalYear, randomSeed),
    seasonalContext: getSeasonalContext(historical.getMonth(), randomSeed),
    economicContext: getEconomicContext(historicalYear),
    technologicalContext: getTechnologicalContext(historicalYear),
    randomSeed,
    timeVariant
  };
};

const formatDate = (date: Date): string => {
  const months = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  
  return `${date.getFullYear()}年${months[date.getMonth()]}${date.getDate()}日 ${hour}:${minute}`;
};

const getHistoricalPeriod = (year: number): string => {
  if (year >= 2020) return '新冠疫情与数字化转型时代';
  if (year >= 2015) return '移动互联网与人工智能崛起时代';
  if (year >= 2010) return '社交网络与智能手机革命时代';
  if (year >= 2005) return '网络2.0与全球化深度融合时代';
  if (year >= 2000) return '千禧年与互联网泡沫时代';
  if (year >= 1995) return '万维网商业化与PC普及时代';
  if (year >= 1990) return '冷战结束与全球化开始时代';
  if (year >= 1985) return '个人电脑革命与经济转型时代';
  if (year >= 1980) return '改革开放与信息技术萌芽时代';
  if (year >= 1975) return '石油危机与产业结构调整时代';
  if (year >= 1970) return '环保觉醒与反文化运动时代';
  if (year >= 1965) return '太空竞赛与民权运动时代';
  if (year >= 1960) return '经济繁荣与社会变革时代';
  if (year >= 1955) return '冷战升级与科技发展时代';
  if (year >= 1950) return '战后重建与婴儿潮时代';
  if (year >= 1945) return '二战结束与新世界秩序时代';
  return '战争与动荡时代';
};

// **增强历史背景选择的随机性**
export const getHistoricalContext = (year: number, randomSeed: number): string[] => {
  const seededRandom = (seed: number, multiplier: number = 1) => {
    const x = Math.sin(seed * multiplier) * 10000;
    return x - Math.floor(x);
  };

  const contexts: Record<string, string[]> = {
    '2020-2024': [
      'COVID-19疫情彻底改变全球社会结构和工作方式',
      '远程办公成为常态，数字化转型全面加速',
      'ChatGPT等生成式AI技术引发技术革命',
      '新能源汽车和可持续发展成为全球共识',
      '元宇宙概念兴起，虚拟现实技术快速发展',
      '供应链危机暴露全球化脆弱性',
      '加密货币市场剧烈波动，Web3概念普及',
      '短视频平台重塑社交媒体格局',
      '碳中和目标推动能源结构转型',
      '芯片短缺影响全球制造业',
      '远程医疗和数字健康技术普及'
    ],
    '2015-2019': [
      '移动支付在中国完全普及，改变消费习惯',
      '共享经济模式爆发，独角兽公司大量涌现',
      '人工智能和机器学习技术商业化应用',
      '电子商务彻底重塑传统零售业态',
      '社交媒体影响力达到历史顶峰',
      '中美贸易摩擦升级，全球化遭遇挑战',
      '新能源技术突破，特斯拉引领汽车革命',
      '直播经济兴起，网红经济蓬勃发展',
      '区块链技术从概念走向应用',
      '5G技术标准确立，通信革命来临',
      '共享单车改变城市出行方式'
    ],
    '2010-2014': [
      'iPhone和Android引发智能手机革命',
      '微博、微信等社交平台重新定义社交方式',
      '云计算技术开始大规模商业应用',
      '移动互联网创业浪潮席卷全球',
      'O2O模式兴起，线上线下深度融合',
      '大数据概念普及，数据成为新石油',
      '4G网络建设完成，移动互联网全面爆发'
    ],
    '2005-2009': [
      '全球金融危机重创世界经济体系',
      'YouTube、Facebook等平台重新定义媒体',
      '中国制造业崛起，成为世界工厂',
      '新能源概念兴起，环保意识觉醒',
      '房地产泡沫破裂，次贷危机爆发',
      '智能手机技术储备，为移动革命奠基',
      '社交网络开始改变人际交往模式'
    ],
    '2000-2004': [
      '互联网泡沫破裂，纳斯达克暴跌',
      '9·11事件改变全球安全格局',
      '中国加入WTO，融入全球经济体系',
      '搜索引擎技术成熟，Google崛起',
      '电子商务模式开始被市场接受',
      '宽带网络普及，改变上网体验',
      '数字音乐革命，传统唱片业受冲击'
    ],
    '1995-1999': [
      '万维网商业化，互联网进入大众视野',
      '亚洲金融危机席卷东南亚国家',
      '个人电脑价格下降，进入普通家庭',
      '电子邮件成为主流通信方式',
      '电子商务雏形出现，网上购物兴起',
      '移动通信技术快速发展，手机普及',
      '千年虫危机引发全球技术恐慌'
    ],
    '1990-1994': [
      '苏联解体，冷战正式结束',
      '万维网技术诞生，信息时代来临',
      '中国改革开放进入新阶段',
      '个人电脑开始商业化普及',
      '经济全球化进程明显加速',
      '环保运动兴起，可持续发展理念萌芽',
      '卫星通信技术发展，全球通信网络形成'
    ],
    '1985-1989': [
      '个人电脑革命全面展开，微软DOS系统普及',
      '柏林墙倒塌，东西方对立格局松动',
      '股市黑色星期一，全球金融市场震荡',
      '切尔诺贝利核事故，核安全受到质疑',
      '企业数字化和办公自动化开始普及',
      '电子游戏产业快速发展，任天堂崛起',
      '新兴科技公司大量涌现，创业文化兴起'
    ],
    '1980-1984': [
      '改革开放政策全面启动，经济特区设立',
      'IBM PC发布，个人电脑标准化开始',
      '有线电视网络建设，媒体传播方式改变',
      '石油价格波动，能源危机影响全球经济',
      '信息技术基础设施大规模建设',
      '跨国公司全球化布局加速',
      '新材料和生物技术开始商业化应用'
    ],
    '1975-1979': [
      '石油危机引发全球经济衰退',
      '个人计算机技术萌芽，苹果公司成立',
      '环保运动兴起，地球日活动开始',
      '卫星通信技术发展，全球通信改善',
      '制造业开始向发展中国家转移',
      '新能源技术研发投入增加',
      '消费电子产品开始普及'
    ],
    '1970-1974': [
      '互联网前身ARPANET建立',
      '水门事件震惊美国政坛',
      '石油输出国组织实施石油禁运',
      '环保法律法规开始建立',
      '集成电路技术快速发展',
      '跨国企业全球化经营模式兴起',
      '反战运动和民权运动持续发酵'
    ],
    '1965-1969': [
      '阿波罗登月计划激发科技热潮',
      '民权运动达到高潮，社会变革加速',
      '反战示威活动席卷全球',
      '大型机计算机开始商业应用',
      '卫星电视技术出现，媒体传播革命',
      '青年反文化运动兴起',
      '太空竞赛推动科技创新'
    ],
    '1960-1964': [
      '肯尼迪遇刺震惊全世界',
      '民权运动蓬勃发展，种族隔离受到挑战',
      '冷战升级，古巴导弹危机爆发',
      '电视媒体影响力急剧上升',
      '青年文化和摇滚乐兴起',
      '太空竞赛正式开始',
      '核武器扩散引发国际担忧'
    ],
    '1955-1959': [
      '冷战格局基本形成，军备竞赛升级',
      '苏联发射人造卫星，太空时代开启',
      '经济繁荣期，消费主义文化兴起',
      '电视机开始普及，改变家庭生活',
      '民权运动萌芽，罗莎·帕克斯事件',
      '摇滚乐诞生，青年文化崛起',
      '核能和平利用开始推广'
    ],
    '1950-1954': [
      '朝鲜战争爆发，冷战正式开始',
      '经济快速复苏，婴儿潮一代诞生',
      '麦卡锡主义盛行，政治气氛紧张',
      '电视广播技术快速发展',
      '汽车工业蓬勃发展，郊区化兴起',
      '抗生素等医疗技术取得突破',
      '核武器研发竞赛加剧'
    ],
    '1945-1949': [
      '二战结束，联合国成立',
      '冷战格局开始形成',
      '战后经济重建全面展开',
      '核武器时代来临，广岛长崎事件',
      '布雷顿森林体系建立，美元霸权确立',
      '大量难民和移民潮涌现',
      '科技发展加速，为后续革命奠基'
    ]
  };
  
  for (const [period, events] of Object.entries(contexts)) {
    const [start, end] = period.split('-').map(Number);
    if (year >= start && year <= end) {
      // **基于随机种子的事件选择**
      const shuffled = [...events].sort((a, b) => {
        const aHash = seededRandom(randomSeed, a.charCodeAt(0));
        const bHash = seededRandom(randomSeed, b.charCodeAt(0));
        return aHash - bHash;
      });
      
      // **动态数量选择：3-6个事件**
      const countSeed = seededRandom(randomSeed, 999.888);
      const count = Math.floor(countSeed * 4) + 3; // 3-6个事件
      
      return shuffled.slice(0, count);
    }
  }
  
  // **默认情况的随机化**
  const defaultEvents = [
    '传统社会向现代社会转型期', 
    '工业化和城市化进程加速', 
    '科学技术开始影响日常生活',
    '社会价值观念发生重大变化',
    '国际关系格局重新洗牌',
    '经济发展模式面临转型'
  ];
  
  const shuffled = defaultEvents.sort((a, b) => {
    const aHash = seededRandom(randomSeed, a.charCodeAt(0) * 1.1);
    const bHash = seededRandom(randomSeed, b.charCodeAt(0) * 1.1);
    return aHash - bHash;
  });
  
  return shuffled.slice(0, 3);
};

// **增强季节背景的随机性**
const getSeasonalContext = (month: number, randomSeed: number): string => {
  const seededRandom = (seed: number, multiplier: number = 1) => {
    const x = Math.sin(seed * multiplier) * 10000;
    return x - Math.floor(x);
  };

  const seasonVariants: Record<number, string[]> = {
    0: [
      '新年伊始，万象更新的希望季节',
      '寒冬腊月，新旧交替的关键时刻',
      '元旦时光，充满憧憬的起始点',
      '隆冬季节，沉思与规划的时期'
    ],
    1: [
      '立春时节，万物复苏的transition期',
      '早春二月，生机初显的萌动时光',
      '春寒料峭，希望与挑战并存的时期',
      '节后时光，重新出发的关键节点'
    ],
    2: [
      '春暖花开，生机勃勃的成长季节',
      '阳春三月，活力四射的复苏时期',
      '春分时节，昼夜平分的平衡时刻',
      '春风和煦，充满可能的美好时光'
    ],
    3: [
      '春夏之交，活力四射的青春季节',
      '清明时节，追思与前进并存的时期',
      '春意盎然，万物竞发的繁荣时光',
      '谷雨时节，播种希望的关键时刻'
    ],
    4: [
      '初夏时光，热情洋溢的激情季节',
      '立夏时节，阳光明媚的活跃时期',
      '暮春初夏，新旧交替的转折点',
      '五月花季，浪漫与理想的时光'
    ],
    5: [
      '仲夏夜梦，充满可能的浪漫季节',
      '端午时节，传统与现代交融的时期',
      '初夏炎热，激情燃烧的黄金时光',
      '芒种时节，收获希望的忙碌时期'
    ],
    6: [
      '盛夏炎炎，热烈奔放的狂欢季节',
      '夏至时节，白昼最长的极致时刻',
      '酷暑时光，挑战与机遇并存的时期',
      '仲夏夜晚，神秘与浪漫的完美融合'
    ],
    7: [
      '夏末秋初，收获在望的转折季节',
      '大暑时节，炎热达到顶峰的时期',
      '盛夏尾声，反思与准备的关键时刻',
      '七月流火，激情与理性交织的时光'
    ],
    8: [
      '金秋九月，硕果累累的丰收季节',
      '立秋时节，炎热渐消的转换时期',
      '处暑时节，暑气渐散的舒适时光',
      '秋高气爽，收获成果的黄金时期'
    ],
    9: [
      '深秋十月，叶落归根的沉思季节',
      '秋分时节，昼夜等长的平衡时刻',
      '寒露时节，秋意渐浓的诗意时光',
      '金桂飘香，成熟与智慧的体现时期'
    ],
    10: [
      '初冬时节，萧瑟中蕴含坚韧的季节',
      '立冬时节，万物准备过冬的时期',
      '深秋初冬，沉淀与思考的关键时刻',
      '霜降时节，考验意志的挑战时光'
    ],
    11: [
      '隆冬腊月，万物蛰伏的沉寂季节',
      '大雪时节，银装素裹的纯净时期',
      '年末岁首，总结与展望的时刻',
      '冬至时节，黑夜最长的深度思考期'
    ]
  };
  
  const variants = seasonVariants[month] || ['四季轮回的自然季节'];
  const index = Math.floor(seededRandom(randomSeed, month * 12.34) * variants.length);
  return variants[index];
};

const getEconomicContext = (year: number): string => {
  if (year >= 2020) return '疫情冲击下的经济重构与数字化转型';
  if (year >= 2015) return '新经济模式兴起，传统产业数字化升级';
  if (year >= 2010) return '移动互联网经济爆发，创新创业热潮';
  if (year >= 2005) return '全球化深度发展，中国制造业崛起';
  if (year >= 2000) return '互联网泡沫与新经济模式探索';
  if (year >= 1995) return '信息经济萌芽，全球化进程加速';
  if (year >= 1990) return '市场经济转型，国际贸易自由化';
  if (year >= 1985) return '服务业兴起，制造业全球化布局';
  if (year >= 1980) return '改革开放启动，计划经济向市场经济转型';
  if (year >= 1975) return '石油危机冲击，产业结构调整';
  if (year >= 1970) return '滞胀困扰，传统经济模式受挑战';
  if (year >= 1960) return '经济快速增长，消费社会形成';
  if (year >= 1950) return '战后重建繁荣，制造业蓬勃发展';
  if (year >= 1945) return '战后经济重建，新国际经济秩序建立';
  return '工业化进程中的经济变革';
};

const getTechnologicalContext = (year: number): string => {
  if (year >= 2020) return '人工智能全面商用，量子计算和生物技术突破';
  if (year >= 2015) return '深度学习革命，物联网和5G技术成熟';
  if (year >= 2010) return '移动互联网和云计算技术普及';
  if (year >= 2005) return 'Web2.0和社交网络技术兴起';
  if (year >= 2000) return '互联网技术成熟，电子商务平台建立';
  if (year >= 1995) return '万维网技术普及，个人电脑进入家庭';
  if (year >= 1990) return '互联网前身发展，个人电脑技术成熟';
  if (year >= 1985) return '个人电脑革命，图形用户界面出现';
  if (year >= 1980) return '微处理器技术发展，个人计算时代开启';
  if (year >= 1975) return '集成电路技术突破，微型计算机出现';
  if (year >= 1970) return '计算机小型化，网络通信技术萌芽';
  if (year >= 1960) return '大型机计算机商用，太空技术发展';
  if (year >= 1950) return '电子技术快速发展，计算机技术诞生';
  if (year >= 1945) return '核技术应用，电子工业基础建立';
  return '工业技术和基础科学发展';
};
