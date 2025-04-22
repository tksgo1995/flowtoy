import { FlowchartModel } from "@/models/flowchart";
import chatService from "./ChatService";
import { FlowchartConverter } from "@/lib/flowchartConverter";

export interface ChatMessage {
    role: "user" | "assistant" | "system" | "bot";
    content: string;
}

export class MessageProcessingService {
    async normalizeMessage(message: string, currentFlowchartData: FlowchartModel, chatHistory: ChatMessage[]): Promise<string> {
        try{
            const assistantMessage = `
            
            `;

            const historyMessages = this.formatChatHistoryForPrompt(chatHistory);
            const userMessage = `
            ##History
            ${historyMessages}
            ##Current Flowchart Data
            ${JSON.stringify(currentFlowchartData, null, 2)}
            ##User
            ${message}
            `;

            return await chatService.chat(userMessage, assistantMessage);
        } catch(error){
            console.error('Error normalizing message:', error);
            return message; // 에러 발생 시 원래 메시지 반환
        }
    }

    private formatChatHistoryForPrompt(chatHistory: ChatMessage[]): string {
        if(!chatHistory.length) return "이전 대화 내역이 없습니다.";

        return chatHistory.map((chat, index) => {
            let roleText = '';

            switch(chat.role){
                case "user":
                    roleText = "사용자";
                    break;
                default:
                    roleText = chat.role;
            }

            return `${index + 1}. ${roleText}: ${chat.content}`;
        }).join("\n");

    }

    async generateFlowchartData(message: string, currentFlowchartData: FlowchartModel, chatHistory: ChatMessage[]): Promise<FlowchartModel> {
        try{
            // 대화 내역 포맷팅
            const historyContext = this.formatChatHistoryForPrompt(chatHistory);
            const assistantMessage = `
                
            `;
            
            const userMessage = `
            ##History
            ${historyContext}
            ##Current Flowchart Data
            ${JSON.stringify(currentFlowchartData, null, 2)}
            ##User
            ${message}
            `;

            const response = await chatService.chat(userMessage, assistantMessage);
            return JSON.parse(response) as FlowchartModel;
        } catch(error){
            console.error('Error generating flowchart data:', error);
            return this.getDefaultFlowchartData(message); // 에러 발생 시 기본 플로우차트 데이터 반환
        }
    }

    private getDefaultFlowchartData(message: string): FlowchartModel {
        // 메시지에 '회원가입'이 포함된 경우 회원가입 플로우차트 반환
        if (message.toLowerCase().includes('회원가입')) {
          return {
            nodes: [
              { id: '1', text: '회원가입 시작', shape: 'rectangle' },
              { id: '2', text: '사용자 정보 입력', shape: 'rectangle' },
              { id: '3', text: '유효성 검사', shape: 'diamond' },
              { id: '4', text: '이메일 인증', shape: 'rectangle' },
              { id: '5', text: '인증 완료?', shape: 'diamond' },
              { id: '6', text: '회원가입 완료', shape: 'rectangle' }
            ],
            edges: [
              { fromId: '1', toId: '2', label: '시작', style: 'solid' },
              { fromId: '2', toId: '3', label: '정보 제출', style: 'solid' },
              { fromId: '3', toId: '2', label: '유효하지 않음', style: 'dashed' },
              { fromId: '3', toId: '4', label: '유효함', style: 'solid' },
              { fromId: '4', toId: '5', label: '인증 코드 입력', style: 'solid' },
              { fromId: '5', toId: '4', label: '인증 실패', style: 'dashed' },
              { fromId: '5', toId: '6', label: '인증 성공', style: 'solid' }
            ]
          };
        }
        
        // 기본 플로우차트
        return {
          nodes: [
            { id: '1', text: '시작', shape: 'rectangle' },
            { id: '2', text: '프로세스 1', shape: 'rectangle' },
            { id: '3', text: '조건 확인', shape: 'diamond' },
            { id: '4', text: '프로세스 2', shape: 'rectangle' },
            { id: '5', text: '종료', shape: 'rectangle' }
          ],
          edges: [
            { fromId: '1', toId: '2', label: '시작', style: 'solid' },
            { fromId: '2', toId: '3', label: '다음', style: 'solid' },
            { fromId: '3', toId: '4', label: '조건 충족', style: 'solid' },
            { fromId: '3', toId: '5', label: '조건 미충족', style: 'dashed' },
            { fromId: '4', toId: '5', label: '완료', style: 'solid' }
          ]
        };
      }
      convertFlowchartToMermaid(flowchartData: FlowchartModel): string {
        return FlowchartConverter.jsonToMermaid(JSON.stringify(flowchartData));
      }
      
      /**
       * 플로우차트 JSON 데이터를 HTML 테이블로 변환
       */
      convertFlowchartToHtmlTable(flowchartData: FlowchartModel): string {
        return FlowchartConverter.jsonToHtmlTable(JSON.stringify(flowchartData));
      }
      
      /**
       * Mermaid 코드를 플로우차트 JSON 데이터로 변환
       */
      convertMermaidToFlowchart(mermaidCode: string): FlowchartModel {
        const jsonString = FlowchartConverter.mermaidToJson(mermaidCode);
        return JSON.parse(jsonString);
      }
}

const messageProcessingService = new MessageProcessingService();
export default messageProcessingService;