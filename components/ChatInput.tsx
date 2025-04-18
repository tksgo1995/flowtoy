'use client';

import { ChatInputProps } from "@/types";
import { ChangeEvent, FormEvent, useState } from "react";

export default function ChatInput({onSendMessage, isLoading}:ChatInputProps){
    const [message, setMessage] = useState<string>("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(message.trim() === "") return;

        onSendMessage(message);
        setMessage("");
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    return(
        <form onSubmit={handleSubmit} className="inputForm">
            <textarea
                className="textarea"
                value={message}
                onChange={handleChange}
                placeholder="여기에 질문을 입력하세요. 예: '회원가입 프로세스의 플로우차트를 생성해줘'"
                rows={5}
            />
            <button 
                type="submit"
                className="submitButton"
                disabled={isLoading || !message.trim()}
            >
                질문하기
            </button>
        </form>
    );
}