import { ChatHistoryProps } from "@/types";

export default function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
    return (
      <div className="chatHistory">
        {messages.map((chat, index) => {
          let messageClass = 'chatMessage';
          
          // 메시지 역할에 따라 클래스 추가
          if (chat.role === 'user') {
            messageClass += ' userMessage';
          } else if (chat.role === 'assistant') {
            messageClass += ' aiMessage';
          } else if (chat.role === 'system') {
            messageClass += ' systemMessage';
          }
          
          return (
            <div key={index} className={messageClass}>
              <p>{chat.content}</p>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="loadingIndicator">
            <p>답변 생성 중...</p>
          </div>
        )}
      </div>
    );
  }