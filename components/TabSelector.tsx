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

            <style jsx>
                {`
                    .tabContainer {
                        display: flex;
                        margin-bottom: 20px;
                        border-bottom: 1px solid #ddd;
                    }

                    .tabButton {
                    padding: 10px 20px;
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    transition: 0.3s;
                    color: #666;
                    flex: 1;
                    text-align: center;
                    }

                    .tabButton.activeTab {
                    color: #3f51b5;
                    font-weight: bold;
                    border-bottom: 2px solid #3f51b5;
                    }
                `}
            </style>
        </div>
    );
};

export default TabSelector;