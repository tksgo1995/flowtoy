'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface FlowchartViewerProps {
  code: string;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
        flowchart: {
            curve: 'stepAfter',
        },
    });

    if (containerRef.current) {
      try {
        containerRef.current.innerHTML = '';
        const id = `mermaid-${Math.floor(Math.random() * 100000)}`;
        
        // 타입 문제 해결을 위해 수정된 부분
        mermaid.render(id, code).then((result) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = result.svg;
          }
        }).catch((error) => {
          console.error('Mermaid rendering error:', error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="text-red-500">Error rendering diagram</div>`;
          }
        });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500">Error rendering diagram</div>`;
        }
      }
    }
  }, [code]);

  return <div ref={containerRef} className="mermaid-container" />;
};