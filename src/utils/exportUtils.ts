
import { GameState } from '../types/gameTypes';
import { Language } from '../hooks/useLanguage';

export const formatCaseAsMarkdown = (gameState: GameState, language: Language): string => {
  const currentDate = new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US');
  
  const template = language === 'zh' ? {
    title: '案件档案',
    overview: '案件概况',
    caseNumber: '案件编号',
    description: '案件描述',
    victim: '受害者',
    investigationDate: '调查日期',
    suspectsFile: '嫌疑人档案',
    evidenceList: '证据清单',
    number: '编号',
    name: '姓名',
    occupation: '职业',
    relationship: '与受害者关系',
    motive: '动机',
    evidenceName: '证据名称',
    location: '发现地点',
    description2: '详细描述',
    investigationRecord: '调查记录',
    interrogationRecord: '审讯记录',
    sceneRecreation: '现场重现',
    noRecords: '暂无记录'
  } : {
    title: 'Case File',
    overview: 'Case Overview',
    caseNumber: 'Case Number',
    description: 'Description',
    victim: 'Victim',
    investigationDate: 'Investigation Date',
    suspectsFile: 'Suspects File',
    evidenceList: 'Evidence List',
    number: 'No.',
    name: 'Name',
    occupation: 'Occupation',
    relationship: 'Relationship with Victim',
    motive: 'Motive',
    evidenceName: 'Evidence Name',
    location: 'Location Found',
    description2: 'Description',
    investigationRecord: 'Investigation Records',
    interrogationRecord: 'Interrogation Records',
    sceneRecreation: 'Crime Scene Recreation',
    noRecords: 'No records available'
  };

  let markdown = `# ${template.title} #${gameState.caseId}\n\n`;
  
  // Case overview
  markdown += `## ${template.overview}\n\n`;
  markdown += `- **${template.caseNumber}**: #${gameState.caseId}\n`;
  markdown += `- **${template.description}**: ${gameState.caseDescription}\n`;
  markdown += `- **${template.victim}**: ${gameState.victim}\n`;
  markdown += `- **${template.investigationDate}**: ${currentDate}\n\n`;
  
  // Suspects
  markdown += `## ${template.suspectsFile}\n\n`;
  if (gameState.suspects.length > 0) {
    markdown += `| ${template.number} | ${template.name} | ${template.occupation} | ${template.relationship} | ${template.motive} |\n`;
    markdown += '|------|------|------|-------------|------|\n';
    
    gameState.suspects.forEach((suspect, index) => {
      markdown += `| ${index + 1} | ${suspect.name} | ${suspect.occupation} | ${suspect.relationship} | ${suspect.motive.substring(0, 50)}... |\n`;
    });
    markdown += '\n';
  } else {
    markdown += `${template.noRecords}\n\n`;
  }
  
  // Evidence
  markdown += `## ${template.evidenceList}\n\n`;
  if (gameState.evidence.length > 0) {
    markdown += `| ${template.number} | ${template.evidenceName} | ${template.location} | ${template.description2} |\n`;
    markdown += '|------|----------|----------|----------|\n';
    
    gameState.evidence.forEach((evidence, index) => {
      markdown += `| ${index + 1} | ${evidence.name} | ${evidence.location} | ${evidence.description} |\n`;
    });
    markdown += '\n';
  } else {
    markdown += `${template.noRecords}\n\n`;
  }
  
  // Investigation records placeholder
  markdown += `## ${template.investigationRecord}\n\n`;
  markdown += `### ${template.interrogationRecord}\n`;
  markdown += `${template.noRecords}\n\n`;
  markdown += `### ${template.sceneRecreation}\n`;
  markdown += `${template.noRecords}\n\n`;
  
  return markdown;
};

export const downloadMarkdownFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
