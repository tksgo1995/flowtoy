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
            <style jsx>
                {`
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin: 0;
                    }

                    .headerControls {
                        display: flex;
                        gap: 10px;
                    }

                    .historyToggleButton, .clearHistoryButton {
                        padding: 8px 12px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: 0.3s;
                    }

                    .historyToggleButton {
                        background-color: #f0f0f0;
                        color: #333;
                    }

                    .historyToggleButton:hover {
                        background-color: #e0e0e0;
                    }

                    .clearHistoryButton {
                        background-color: #f44336;
                        color: white;
                    }

                    .clearHistoryButton:hover {
                        background-color: #d32f2f;
                    }

                    @media (max-width: 768px) {
                        .header {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 10px;
                        }
                        
                        .headerControls {
                            width: 100%;
                        }
                    }
                `}
            </style>
        </header>
    );
}

export default Header;