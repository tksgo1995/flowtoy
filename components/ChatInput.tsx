'use client';

import { useState } from "react";

interface ChatInputProps {
    onSendMessage: (message: string) => Promise<void>;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState<string>('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;
        
        try{
            await onSendMessage(message);
            setMessage('');
        } catch(error) {
            console.error('Error sending message:', error);
        }
    }

    return (
        <div className="inputContainer">
            <form onSubmit={handleSubmit} className="inputForm">
                <textarea
                    className="textArea"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="여기에 질문을 입력하세요. 예: '회원가입 프로세스의 플로우차트를 생성해줘'"
                    disabled={isLoading}
                    rows = {5}
                />
                <button type="submit" className="submitButton" disabled={isLoading || !message.trim()}>
                    {isLoading ? '처리 중...' : '질문하기'}
                </button>
            </form>
            <style jsx>
                    {`
                        .inputForm {
                            width: 100%;
                            margin-bottom: 20px;
                        }
                        
                        .textArea {
                        width: 100%;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        resize: vertical;
                        font-size: 16px;
                        margin-bottom: 15px;
                        font-family: inherit;
                        }

                        .submitButton {
                        padding: 10px 20px;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 16px;
                        transition: background-color 0.3s;
                        }

                        .submitButton:hover {
                        background-color: #45a049;
                        }

                        .submitButton:disabled {
                        background-color: #cccccc;
                        cursor: not-allowed;
                        }
                    `}
                </style>
        </div>
        
    );
};

export default ChatInput;