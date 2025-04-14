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