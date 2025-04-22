'use client';

interface HeaderProps {
    showChatHistory: boolean;
    toggleChatHistory: () => void;
    clearChatHistory: () => void;
    hasChatHistory: boolean;
}

const Header: React.FC<HeaderProps> = ({ showChatHistory, toggleChatHistory, clearChatHistory, hasChatHistory }) => {
    return (
        <header className="header">
            <h1 className="headerTitle">AI에게 질문하기</h1>
            <div className="headerControls">
                <button onClick={toggleChatHistory} className="historyToggleButton">
                    {showChatHistory ? '대화 내역 숨기기' : '대화 내역 보기'}
                </button>
                {hasChatHistory && (
                    <button onClick={clearChatHistory} className="clearHistoryButton">
                        초기화
                    </button>
                )}
            </div>
        </header>
    );
}