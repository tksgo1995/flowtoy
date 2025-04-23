'use client';

import { FlowchartModel } from "@/models/flowchart";
import messageProcessingService from "@/services/MessageProcessingService";
import mermaid from "mermaid";
import React, { useEffect } from "react";

interface FlowchartResultProps {
    flowchartData: FlowchartModel | null;
    isLoading: boolean;
    error: string | null;
    activeTab: 'flowchart' | 'table';
}

const FlowchartResult: React.FC<FlowchartResultProps> = ({ flowchartData, isLoading, error, activeTab }) => {
    const flowchartRef = React.useRef<HTMLDivElement>(null);
    const tableRef = React.useRef<HTMLDivElement>(null);

    // Mermaid 초기화
    useEffect(() => {
        // 라이브러리 초기화
        mermaid.initialize({
            startOnLoad: false, // 자동 렌더링 비활성화
            theme: 'neutral',
            securityLevel: 'loose',
            flowchart: {
                curve: 'basis',
                useMaxWidth: true,
                htmlLabels: true,
            },
        });
    }, []);

    // 플로우차트 렌더링
    useEffect(() => {
        if(flowchartData && flowchartRef.current && activeTab === 'flowchart') {
            try {
                // 플로우차트 데이터를 Mermaid 코드로 변환
                const mermaidCode = messageProcessingService.convertFlowchartToMermaid(flowchartData);
                
                console.log("생성된 mermaid 코드:", mermaidCode); // 디버깅용
                
                // mermaid 요소 준비
                flowchartRef.current.innerHTML = ''; // 기존 내용 삭제
                
                // pre 요소 생성 (코드 형식 유지)
                const preElement = document.createElement('pre');
                preElement.className = 'mermaid';
                preElement.textContent = mermaidCode; // textContent로 설정하여 HTML 이스케이프
                
                // 요소 추가
                flowchartRef.current.appendChild(preElement);
                
                // mermaid 실행
                // 약간의 지연을 주어 DOM이 업데이트될 시간을 줌
                setTimeout(() => {
                    try {
                        mermaid.run({
                            nodes: document.querySelectorAll('.mermaid')
                        }).catch(err => console.error('Mermaid run error:', err));
                    } catch (runError) {
                        console.error('Mermaid run error (catch):', runError);
                    }
                }, 100);
            } catch(error) {
                console.error('Error rendering flowchart:', error);
                flowchartRef.current.innerHTML = '<div class="error-message">플로우차트 렌더링에 실패했습니다.</div>';
            }
        }
    }, [flowchartData, activeTab]);

    // 테이블 렌더링
    useEffect(() => {
        if(flowchartData && tableRef.current && activeTab === 'table') {
            try {
                // 테이블 데이터 생성
                const tableHTML = messageProcessingService.convertFlowchartToHtmlTable(flowchartData);
                tableRef.current.innerHTML = tableHTML;
            } catch(error) {
                console.error('Error rendering table:', error);
                tableRef.current.innerHTML = '<div class="error-message">테이블 렌더링에 실패했습니다.</div>';
            }
        }
    }, [flowchartData, activeTab]);

    // 로딩 중일 때
    if(isLoading){
        return (
            <div className="loadingIndicator">
                <p>AI가 플로우차트를 생성하는 중입니다...</p>
            </div>
        );
    }

    // 오류가 있을 때
    if (error){
        return (
            <div className="errorMessage">
                {error}
            </div>
        );
    }

    // 데이터가 없을 때
    if(!flowchartData) {
        return (
            <div className="emptyState">
                <p>여기에 플로우차트가 표시됩니다.</p>
            </div>
        );
    }

    // 데이터가 있을 때
    return (
        <div className="flowchartResult">
            {activeTab === 'flowchart' ? (
                <div ref={flowchartRef} className="mermaidContainer"></div>
            ) : (
                <div ref={tableRef} className="tableContainer"></div>
            )}

            <style jsx global>{`
.error-message {
    color: #d32f2f;
    padding: 15px;
    text-align: center;
    border: 1px solid #ffcdd2;
    border-radius: 4px;
    background-color: #ffebee;
    margin: 20px 0;
}

/* mermaid 관련 추가 스타일 */
.mermaid {
    text-align: center;
    font-size: 16px;
    white-space: pre;
}

/* 테이블 스타일링 */
.flowchart-tables {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
    color: #333;
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.table-section {
    margin-bottom: 24px;
}

.table-section h2 {
    font-size: 20px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #2c3e50;
}

.flowchart-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    margin-bottom: 20px;
}

.flowchart-table thead {
    background-color: #3f51b5;
    color: white;
}

.flowchart-table th {
    padding: 12px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
}

.flowchart-table td {
    padding: 10px 15px;
    border-bottom: 1px solid #eeeeee;
    font-size: 14px;
}

.flowchart-table tbody tr:last-child td {
    border-bottom: none;
}

.flowchart-table tbody tr:hover {
    background-color: #f5f7ff;
}

/* 형태 뱃지 스타일 */
.shape-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: white;
}

.shape-badge.circle {
    background-color: #4caf50;
}

.shape-badge.rectangle {
    background-color: #2196f3;
}

.shape-badge.diamond {
    background-color: #ff9800;
}

.shape-badge.hexagon {
    background-color: #9c27b0;
}

.shape-badge.parallelogram {
    background-color: #e91e63;
}

/* 스타일 뱃지 */
.style-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: white;
}

.style-badge.solid {
    background-color: #3f51b5;
}

.style-badge.dashed {
    background-color: #9c27b0;
}

.style-badge.dotted {
    background-color: #e91e63;
}
            `}</style>
        </div>
    );
}

export default FlowchartResult;