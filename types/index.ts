export interface ChatMessage{
    role: "user" | "assistant" | "system";
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

// 노드 모양 타입
export type NodeShape = 'rectangle' | 'diamond' | 'circle' | 'hexagon' | 'parallelogram';

// 엣지 스타일 타입
export type EdgeStyle = 'solid' | 'dotted' | 'dashed';

// 노드 인터페이스
export interface Node {
    id: string;
    text: string;
    shape: NodeShape;
}

// 엣지 인터페이스
export interface Edge {
    fromId: string;
    toId: string;
    label: string;
    style: EdgeStyle;
}

// 전체 플로우차트 모델
export interface FlowchartModel {
    nodes: Node[];
    edges: Edge[];
}