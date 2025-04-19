'use client';

import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import EmptyState from "@/components/EmptyState";
import ResultTabs from "@/components/ResultTabs";
import { ChatMessage } from "@/models/chat";
import { FlowchartModel } from "@/models/flowchart";
import { useState } from "react";

export default function Home() {
  // 상태 관리
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flowchartData, setFlowchartData] = useState<FlowchartModel | null>(null);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'table'>('flowchart');
  const [error, setError] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState<boolean>(true);

  // 메시지 전송 처리
  const handleSendMessage = async(userMessage:string): Promise<void> =>{
    setIsLoading(true);
    setError(null);

    // 사용자 메시지를 채팅 내역에 추가
    const newUserMessage: ChatMessage = {role: "user", content: userMessage};
    setChatHistory(prev => [...prev, newUserMessage]);

    try {
      // 1. 사용자 메시지 정규화 (대화 내역 포함)
      const normalizedMessage = await messageProcessingService.normalizeMessage(userMessage, chatHistory);
      console.log('정규화된 메시지:', normalizedMessage);

      // 2. 플로우차트 데이터 생성 (대화 내역 포함)
      const data = await messageProcessingService.generateFlowchartData(normalizedMessage, chatHistory);
      console.log('생성된 플로우차트 데이터:', data);

      // 3. 결과 설정
      setFlowchartData(data);

      // 4. AI 응답 메시지(bot) 추가
      const botMessage: ChatMessage = { role: "bot", content: "요청하신 플로우차트를 생성했습니다." };
      setChatHistory(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      setError('플로우차트 생성에 실패했습니다. 다시 시도해 주세요.');
      const errorMessage: ChatMessage = { role: "bot", content: '플로우차트 생성에 실패했습니다. 다시 시도해 주세요.' };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // 탭 전환 처리
  const handleTabChange = (tab: 'flowchart' | 'table') => {
    setActiveTab(tab);
  }

  // 대화 내역 토글
  const toggleChatHistory = () => {
    setShowChatHistory(prev => !prev);
  }

  const clearChatHistory = () => {
    setChatHistory([]);
    setFlowchartData(null);
    setError(null);
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
