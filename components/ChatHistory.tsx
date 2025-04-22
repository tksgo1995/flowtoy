import { ChatMessage } from "@/models/chat";
import { useEffect, useRef } from "react";

interface ChatHistoryProps {
  messages: ChatMessage[];
  showChatHistory: boolean;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, showChatHistory }) => {
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // 대화 내역 자동 스크롤
  useEffect(() => {
    if (chatHistoryRef.current && showChatHistory) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, showChatHistory]);

  if(!showChatHistory) return null;

  // 메시지 역할에 따른 라벨 및 클래스 결정
  const getRoleInfo = (role: string) => {
    switch (role) {
      case "user":
        return { label: "사용자", className: "userMessage" };
      case "bot":
        return { label: "AI", className: "botMessage" };
      default:
        return { label: role, className: "defaultMessage" };
    }
  }

  return(
    <div className="chatHistoryContainer" ref={chatHistoryRef}>
      {messages.length === 0 ? (
        <div className="emptyChatHistory">
          <p>대화 내역이 없습니다.</p>
        </div>      
      ): (
        messages.map((chat, index) => {
          const { label, className } = getRoleInfo(chat.role);
          return (
            <div key={index} className={`chatMessage ${className}`}>
              <div className="chatMessageHeader">{label}</div>
              <div className="chatMessageContent">{chat.content}</div>
            </div>
          );
        })
      )}
    </div>
  );
};