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

        await onSendMessage(message);
        setMessage('');
    }

    return (
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
    );
};