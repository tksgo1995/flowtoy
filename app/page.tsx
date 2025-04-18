'use client';

import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import ResultTabs from "@/components/ResultTabs";
import { ChatMessage } from "@/types";
import { useState } from "react";

export default function Home() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('flowchart');

  const handleSendMessage = async(message:string): Promise<void> =>{
    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if(!response.ok) {
        throw new Error('응답 오류');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, {
        role: "assistant",
        content: data.content
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory((prev) => [
        ...prev,
        { role: "system", content: "메시지 전송 중 오류가 발생했습니다." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <main className="main">
        <div className="chatContainer">
          <h1 className="title">AI에게 질문하기</h1>

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
          <ResultTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="resultContainer">
            {chatHistory.length === 0 ? (
              <EmptyState />
            ) : (
              <ChatHistory
                messages={chatHistory}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
