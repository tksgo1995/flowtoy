'use client';

import { ResultTabsProps } from "@/types";

export default function ResultTabs({activeTab, onTabChange}: ResultTabsProps){
    return(
        <div className="tabContainer">
            <button
                className={`tabButton ${activeTab === 'flowchart' ? 'activeTab' : ''}`}
                onClick={() => onTabChange('flowchart')}
            >
                플로우차트로 보기
            </button>
            <button
                className={`tabButton ${activeTab === 'table' ? 'activeTab' : ''}`}
                onClick={() => onTabChange('table')}
            >
                테이블로 보기
            </button>
        </div>
    );
}