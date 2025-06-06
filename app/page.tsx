'use client';
import ChatHistory from "@/components/ChatHistory";
import ChatInput from "@/components/ChatInput";
import FlowchartResult from "@/components/FlowchartResult";
import Header from "@/components/Header";
import TabSelector from "@/components/TabSelector";
import { ChatMessage } from "@/models/chat";
import { FlowchartModel } from "@/models/flowchart";
import messageProcessingService from "@/services/MessageProcessingService";
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

    let normalizedMessage = userMessage;
    try {
      // 1. 사용자 메시지 정규화 (대화 내역 포함)
      const normalizeResponse = await messageProcessingService.normalizeMessage(userMessage, chatHistory, flowchartData);

      // 2. 정규화된 메시지 파싱
      try{
        const parsedResponse = JSON.parse(normalizeResponse);
        if (parsedResponse && parsedResponse.normalizedUserMessage){
          normalizedMessage = parsedResponse.normalizedUserMessage;
          console.log('정규화된 메시지:', normalizedMessage);
          if(parsedResponse.thought){
            console.log('정규화 thought:', parsedResponse.thought);
          }
        }
      } catch (error) {
        console.error('정규화 응답 파싱 오류:', error);
      }

      // 3. 플로우차트 데이터 생성 (대화 내역 포함)
      const data = await messageProcessingService.generateFlowchartData(normalizedMessage, chatHistory, flowchartData);
      console.log('생성된 플로우차트 데이터:', data);

      // 4. 결과 설정
      setFlowchartData(data);

      // 5. AI 응답 메시지(bot) 추가
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
          {/* 헤더 */}
          <Header
            showChatHistory={showChatHistory}
            toggleChatHistory={toggleChatHistory}
            clearChatHistory={clearChatHistory}
            hasChatHistory={chatHistory.length > 0}
          />

          {/* 대화 내역 */}
          <ChatHistory
            messages={chatHistory}
            showChatHistory={showChatHistory}
          />

          {/* 채팅 입력 */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />

          {/* 탭 선택기 */}
          <TabSelector
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* 결과 표시 영역 */}
          <div className="resultContainer">
            <FlowchartResult
              flowchartData={flowchartData}
              activeTab={activeTab}
              error={error}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
      <style jsx>
        {`
          .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .main {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding: 1rem 0;
          }

          .chatContainer {
            width: 100%;
            max-width: 1024px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }

          .resultContainer {
            width: 100%;
            min-height: 400px;
            border: 1px solid #eee;
            border-radius: 4px;
            padding: 20px;
            background-color: #f9f9f9;
          }

          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }
            
            .chatContainer {
              padding: 15px;
            }
          }
        `}
      </style>
    </div>
  );
}
