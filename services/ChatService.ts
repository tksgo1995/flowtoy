export interface ChatRequest{
    userMessage: string;
    assistantMessage?: string;
    systemMessage?: string;
}

export interface TokenInfo{
    inputTokenCount: number;
    outputTokenCount: number;
    totalTokenCount: number;
}

export interface ChatResponse{
    sucess: boolean;
    apiCode: number;
    message: string;
    responseData:{
        userMessage: string;
        token:TokenInfo;
    }
}

export class ChatService{
    private readonly apiUrl: string;

    constructor(apiUrl?: string) {
        // this.apiUrl = apiUrl || 'https://localhost:7141/api/test/Call';
        this.apiUrl = apiUrl || 'https://pumex-cyd2abaybge8bkfw.koreacentral-01.azurewebsites.net/api/test/Call';
    }

    async sendMessage(
        userMessage: string,
        assistantMessage: string = '',
        systemMessage: string = ''
    ): Promise<ChatResponse>{
        try{
            const requestBody: ChatRequest = {
                userMessage,
                assistantMessage,
                systemMessage
            };

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if(!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data: ChatResponse = await response.json();

            return data;
        } catch(error){
            console.error('Error in sendMessage:', error);
            throw error;
        }
    }

    async chat(userMessage: string, assistantMessage: string): Promise<string>{
        try{
            const response = await this.sendMessage(userMessage, assistantMessage);
            const token = response.responseData.token;
            console.log('Token:', token);

            return response.responseData.userMessage;
        }catch(error){
            console.error('Error in chat:', error);
            return '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.';
        }
    }

    async chatWithTokenInfo(userMessage: string): Promise<{message: string, tokenInfo: TokenInfo}>{
        try{
            const response = await this.sendMessage(userMessage);
            return {
                message: response.responseData.userMessage,
                tokenInfo: response.responseData.token
            };
        }catch(error){
            console.error('Error in chatWithTokenInfo:', error);
            throw error;
        }
    }
}

const chatService = new ChatService();
export default chatService;