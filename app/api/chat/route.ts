import { AIResponse } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const {message} = body as {message: string};

        if(!message){
            return NextResponse.json(
                {error: "메시지가 필요합니다."},
                {status: 400}
            );
        }

        var userMessage = message;
        var assistantMessage = "회원가입 프로세스의 플로우차트를 생성해줘";
        var systemMessage = "너는 플로우차트를 그려주는 AI야. 사용자가 질문하면 그에 맞는 플로우차트를 생성해줘.";
        const aiResponse: AIResponse = await callAzureOpenAI(userMessage, assistantMessage, systemMessage);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json(aiResponse);
    } catch(error){
        console.error("AI 응답 생성 중 오류:", error);
        return NextResponse.json(
            {error: "서버 오류가 발생했습니다."},
            {status: 500}
        );
    }
}

// Azure OpenAI 서비스 연동 함수 (예시)
async function callAzureOpenAI(userMessage: string, assistantMessage: string, systemMessage: string): Promise<AIResponse> {
    
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID;
    
    if (!endpoint || !apiKey || !deploymentId) {
      throw new Error('Azure OpenAI 환경 변수가 설정되지 않았습니다.');
    }
    
    const response = await fetch(`${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=2023-05-15`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: [
            { role: 'system', content: systemMessage},
            { role: 'assistant', content: assistantMessage },
            { role: 'user', content: userMessage },
        ],
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
    };
  }