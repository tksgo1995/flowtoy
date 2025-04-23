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

      <style jsx>{`
        .chatHistoryContainer {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f9f9f9;
  }
  
  .emptyChatHistory {
    padding: 20px;
    text-align: center;
    color: #666;
    font-style: italic;
  }
  
  .chatMessage {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 8px;
    max-width: 80%;
  }
  
  .userMessage {
    background-color: #e3f2fd;
    margin-left: auto;
  }
  
  .assistantMessage {
    background-color: #e8f5e9;
    margin-right: auto;
  }
  
  .systemMessage {
    background-color: #fff3cd;
    color: #856404;
    margin: 10px auto;
    font-style: italic;
    max-width: 90%;
  }
  
  .botMessage {
    background-color: #f1f1f1;
    margin-right: auto;
  }
  
  .defaultMessage {
    background-color: #f5f5f5;
    margin: 0 auto;
  }
  
  .chatMessageHeader {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 12px;
    color: #666;
  }
  
  .chatMessageContent {
    word-break: break-word;
  }
      `}</style>
    </div>
  );
};

export default ChatHistory;