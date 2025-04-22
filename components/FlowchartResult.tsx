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
    const tableRef = React.useRef<HTMLTableElement>(null);

    // Mermaid 초기화
    useEffect(() => {
        mermaid.initialize({
            startOnLoad: true,
            theme: 'neutral',
            securityLevel: 'loose',
            flowchart: {
                curve: 'basis',
                useMaxWidth: true,
                htmlLabels: true,
            },
        })
    }, []);

    // 플로우차트 렌더링
    useEffect(() => {
        if(flowchartData && flowchartRef.current && activeTab === 'flowchart') {
            try{
                // 플로우차트 데이터를 Mermaid 코드로 반환
                const mermaidCode = messageProcessingService.convertFlowchartToMermaid(flowchartData);

                // Mermaid 렌더링 준비
                flowchartRef.current.innerHTML = '';
                flowchartRef.current.className = 'mermaid';
                flowchartRef.current.textContent = mermaidCode;

                // Mermaid 렌더링 실행
                mermaid.run({
                    nodes: [flowchartRef.current],
                });
            } catch(error) {
                console.error('Error rendering flowchart:', error);
                flowchartRef.current.innerHTML = '<div class="error-message">플로우차트 렌더링에 실패했습니다.</div>';
            }
        }
    }, [flowchartData, activeTab]);

    // 테이블 렌더링
    useEffect(() => {
        if(flowchartData && tableRef.current && activeTab === 'table') {
            try{
                // 테이블 데이터 생성
                const tableHTML = messageProcessingService.convertFlowchartToHtmlTable(flowchartData);
                tableRef.current.innerHTML = tableHTML;
            } catch(error) {
                console.error('Error rendering table:', error);
                if(tableRef.current) {
                    tableRef.current.innerHTML = '<div class="error-message">테이블 렌더링에 실패했습니다.</div>';
                }
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
        </div>
    );
}