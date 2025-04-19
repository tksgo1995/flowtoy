import chatService, { TokenInfo } from "@/services/ChatService";
import { ChatMessage } from "@/types";
import { useState } from "react";

interface UseChatReturn{
    message: ChatMessage[];
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
    tokenInfo: TokenInfo | null;
    error: string | null;
    resetChat: () => void;
}

export function useChat(): UseChatReturn {
    const [message, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (message: string) => {
        setError(null);

        setMessages(prev => [...prev, { role: "user", content: message }]);
        setIsLoading(true);
        try{
            const response = await chatService.chatWithTokenInfo(message);

            setMessages(prev => [...prev, { role: "assistant", content: response.message }]);

            setTokenInfo(response.tokenInfo);
        }catch(error){
            console.error('Error in sendMessage:', error);

            const errorMessage = error instanceof Error ? error.message : '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.';
            setError(errorMessage);

            setMessages(prev => [...prev, {
                role:'system',
                content: errorMessage
            }]);
        }finally{
            setIsLoading(false);

        }
    };

    const resetChat = () => {
        setMessages([]);
        setTokenInfo(null);
        setError(null);
    };

    return { message, isLoading, sendMessage, tokenInfo, error, resetChat };
}