'use client';

interface TabSelectorProps {
    activeTab: 'flowchart' | 'table';
    onTabChange: (tab: 'flowchart' | 'table') => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="tabContainer">
            <button
                className={`tabButton ${activeTab === 'flowchart' ? 'active' : ''}`}
                onClick={() => onTabChange('flowchart')}
            >
                플로우차트로 보기
            </button>
            <button
                className={`tabButton ${activeTab === 'table' ? 'active' : ''}`}
                onClick={() => onTabChange('table')}
            >
                테이블로 보기
            </button>
        </div>
    );
};