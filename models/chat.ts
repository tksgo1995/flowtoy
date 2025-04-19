import { FlowchartModel } from "./flowchart";

export interface ChatMessage{
    role: "user" | "assistant" | "system" | "bot";
    content: string;
}

export interface AIResponse {
    content: string;
    flowchartData?: FlowchartModel;
}

export interface ChatInputProps{
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

export interface ResultTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export interface ChatHistoryProps {
    messages: ChatMessage[];
    isLoading: boolean;
}