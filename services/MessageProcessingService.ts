import { FlowchartModel } from "@/models/flowchart";
import chatService from "./ChatService";
import { FlowchartConverter } from "@/lib/flowchartConverter";

export interface ChatMessage {
    role: "user" | "assistant" | "system" | "bot";
    content: string;
}

export class MessageProcessingService {
    async normalizeMessage(message: string, chatHistory: ChatMessage[], currentFlowchartData: FlowchartModel | null): Promise<string> {
        try{
            const assistantMessage = `
# Action Formation and Action Ascription Analyzer

You are an AI assistant specialized in analyzing natural language to identify action formation and action ascription patterns.
Your task is to understand user messages (which may be incomplete or ambiguous) and normalize them into complete, well-formed questions or statements.

## Your Process:
1. Carefully analyze the user's message to identify:
   - The core action being described or requested
   - Any implied but unstated elements
   - The social context of the interaction
   - Potential ambiguities or incomplete elements

2. Complete any incomplete questions by adding the missing context, clarifying ambiguities, and ensuring the message has a clear action orientation.

3. Maintain the original intent and meaning of the user's message.

4. Respond in the same language the user used in their message.

## Response Format:
You must respond in JSON format with exactly these fields:
{
  "normalizedUserMessage": "The complete, well-formed version of the user's message",
  "thought": "Your analysis of how you identified action formation patterns and completed the message"
}

## Important Guidelines:
- Keep your internal analysis concise yet thorough.
- Preserve the user's original meaning and intent.
- Do not add new requests or questions not implied by the original message.
- Respond in the same language as the user's message.
- If the original message is already complete and clear, your normalizedUserMessage can be identical to the original.
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

    async generateFlowchartData(message: string, chatHistory: ChatMessage[], currentFlowchartData: FlowchartModel | null): Promise<FlowchartModel> {
        try{
            // 대화 내역 포맷팅
            const historyContext = this.formatChatHistoryForPrompt(chatHistory);
            const assistantMessage = `
# Flowchart JSON Structure Generator

You are an AI assistant specialized in converting natural language descriptions into structured flowchart JSON data.
Your task is to analyze a normalized user message and extract the actions, decisions, and connections to create a well-formed flowchart representation.

## Your Input:
You will receive a normalized user message that describes a process, workflow, or decision tree.

## Your Output:
You must generate a JSON object that follows the FlowchartModel interface structure below:

\`\`\`json
{
  "nodes": [
    {
      "id": "string",
      "text": "string",
      "shape": "rectangle" | "diamond" | "circle" | "hexagon" | "parallelogram"
    }
  ],
  "edges": [
    {
      "fromId": "string",
      "toId": "string",
      "label": "string",
      "style": "solid" | "dotted" | "dashed"
    }
  ]
}
\`\`\`

## Node Shape Guidelines:
- Use "rectangle" for processes or actions
- Use "diamond" for decision points
- Use "circle" for start/end points
- Use "hexagon" for preparation steps
- Use "parallelogram" for input/output

## Edge Style Guidelines:
- Use "solid" for normal flow
- Use "dotted" for optional paths
- Use "dashed" for conditional paths

## Important Instructions:
- Write all node text and edge labels in Korean, as the user is Korean.
- Generate unique and sequential IDs for each node (e.g., "node1", "node2").
- Ensure the flowchart accurately represents the logic and sequence of the normalized message.
- Include appropriate decision paths when the flow involves conditional branches.
- Keep node text concise but descriptive.
- Ensure that every node (except possibly end nodes) has at least one outgoing edge.
- Create a logical flow starting with a clear beginning and ending with appropriate end points.

## Response Format:
Your response must be a valid JSON object following the FlowchartModel interface.
Do not include any explanation or additional text outside the JSON structure.
            `;
            
            const userMessage = `
            ##History
            ${historyContext}
            ##Current Flowchart Data
            ${JSON.stringify(currentFlowchartData, null,  
               2)}
            ##User
            ${message}
            `;
            let response = await chatService.chat(userMessage, assistantMessage);
            response = response.replace("```json", "").replace("```", "").trim(); // JSON 포맷팅
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