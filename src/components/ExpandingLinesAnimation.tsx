import React, { useEffect, useRef } from 'react';

interface ExpandingLinesAnimationProps {
  className?: string;
}

const ExpandingLinesAnimation: React.FC<ExpandingLinesAnimationProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 创建中心点
    const centerDot = document.createElement('div');
    centerDot.className = 'center-dot';
    centerDot.style.width = centerDot.style.height = '8px';
    centerDot.style.left = 'calc(50% - 4px)';
    centerDot.style.top = 'calc(50% - 4px)';
    centerDot.style.background = 'rgba(64, 240, 255, 0.9)'; // 使用青色以匹配项目主题
    centerDot.style.zIndex = '10';
    centerDot.style.position = 'absolute';
    centerDot.style.borderRadius = '50%';
    centerDot.style.boxShadow = '0 0 10px rgba(64, 240, 255, 0.5)'; // 添加发光效果
    container.appendChild(centerDot);

    // 创建多层线条容器
    for (let layer = 0; layer < 4; layer++) {
      const lineContainer = document.createElement('div');
      lineContainer.className = 'line-container';
      lineContainer.style.position = 'absolute';
      lineContainer.style.width = '100%';
      lineContainer.style.height = '100%';
      lineContainer.style.animationDuration = `${10 + layer * 3}s`;
      lineContainer.style.animationDirection = layer % 2 ? 'reverse' : 'normal';
      lineContainer.style.animationName = 'rotateLines';
      lineContainer.style.animationIterationCount = 'infinite';
      lineContainer.style.animationTimingFunction = 'linear';
      lineContainer.style.transformOrigin = 'center';

      const lineCount = 16 + layer * 4;
      for (let i = 0; i < lineCount; i++) {
        const line = document.createElement('div');
        line.className = 'expanding-line';
        line.style.position = 'absolute';
        line.style.height = '1px';
        line.style.left = '50%';
        line.style.top = '50%';
        line.style.transformOrigin = 'left center';
        line.style.background = `rgba(64, 240, 255, ${0.4 - layer * 0.08})`; // 使用青色以匹配项目主题
        line.style.boxShadow = `0 0 5px rgba(64, 240, 255, ${0.3 - layer * 0.05})`; // 添加发光效果
        line.style.animationName = 'expandLine';
        line.style.animationDuration = '4s';
        line.style.animationIterationCount = 'infinite';
        line.style.animationTimingFunction = 'ease-in-out';
        line.style.animationDelay = `${(i / lineCount) * 3}s`;
        line.style.transform = `rotate(${(360 / lineCount) * i}deg)`;

        const lineDot = document.createElement('div');
        lineDot.className = 'line-dot';
        lineDot.style.position = 'absolute';
        lineDot.style.width = '3px';
        lineDot.style.height = '3px';
        lineDot.style.borderRadius = '50%';
        lineDot.style.background = `rgba(64, 240, 255, ${0.9 - layer * 0.15})`; // 使用青色以匹配项目主题
        lineDot.style.boxShadow = `0 0 8px rgba(64, 240, 255, ${0.6 - layer * 0.1})`; // 添加发光效果
        lineDot.style.left = '70px'; // 调整线条长度以适应较小的容器
        lineDot.style.top = 'calc(50% - 1.5px)';
        line.appendChild(lineDot);

        lineContainer.appendChild(line);
      }

      container.appendChild(lineContainer);
    }

    // 添加CSS动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rotateLines {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes expandLine {
        0% {
          width: 0;
          opacity: 0;
        }
        20%,
        80% {
          width: 70px;
          opacity: 1;
        }
        100% {
          width: 0;
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // 清理函数
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`expanding-lines-container ${className}`}
      style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}
    />
  );
};

export default ExpandingLinesAnimation; 