import { EdgeStyle, FlowchartModel, NodeShape } from "@/models/flowchart";
import mermaid from "mermaid";

/**
 * Mermaid 파서 결과 Edge 인터페이스
 */
interface MermaidEdge {
  source: string;
  target: string;
  label: string;
}

/**
* Mermaid 파서 결과
*/
interface MermaidParserResult {
  nodes: Node[];
  edges: MermaidEdge[];
}

export class FlowchartConverter {
    // Mermaid -> JSON 변환
    static mermaidToJson(mermaidCode: string): string {
        const nodeRegexes = [
          { regex: /([A-Za-z0-9_]+)(\(\((.*?)\)\))/g, shape: 'circle' as NodeShape },
          { regex: /([A-Za-z0-9_]+)(\[(.*?)\])/g, shape: 'rectangle' as NodeShape },
          { regex: /([A-Za-z0-9_]+)(\{(.*?)\})/g, shape: 'diamond' as NodeShape },
          { regex: /([A-Za-z0-9_]+)(\[\[(.*?)\]\])/g, shape: 'hexagon' as NodeShape },
          { regex: /([A-Za-z0-9_]+)(\[\/(.*?)\/\])/g, shape: 'parallelogram' as NodeShape } 
        ];
        
        const result : FlowchartModel = {
          nodes: [], 
          edges: []
        };

        const edgeRegex = /([A-Za-z0-9_]+)\s*-->\s*(?:\|(.*?)\|)?\s*([A-Za-z0-9_]+)/g;

        const nodeMap: Record<string, boolean> = {};
        let match;

        nodeRegexes.forEach(({ regex, shape }) => {
          regex.lastIndex = 0;
          while((match = regex.exec(mermaidCode)) !== null) {
            const id = match[1].trim();
            const text = match[3] ? match[3].trim() : id;
            
            if (!nodeMap[id]) {
              result.nodes.push({ id, text, shape });
              nodeMap[id] = true;
            }
          }
        });

        let edgeMatch;
        edgeRegex.lastIndex = 0;

        while((edgeMatch = edgeRegex.exec(mermaidCode)) !== null) {
          const fromId = edgeMatch[1].trim();
          const toId = edgeMatch[3].trim();
          const label = edgeMatch[2] ? edgeMatch[2].trim() : '';
          

          result.edges.push({ fromId, toId, label, style: 'solid' });
        }

        result.edges.forEach(edge => {
          [edge.fromId, edge.toId].forEach(id => {
            if (!nodeMap[id]) {
              result.nodes.push({ id, text: id, shape: 'rectangle' });
              nodeMap[id] = true;
            }
          });
        });

        return JSON.stringify(result, null, 2);
    }

  // JSON -> Mermaid 변환
  static jsonToMermaid(jsonData: string): string {
    const model: FlowchartModel = JSON.parse(jsonData);
    const lines: string[] = ['graph TD'];
    
    // 노드 정의
    model.nodes.forEach(node => {
      if (node.shape === 'diamond') {
        lines.push(`    ${node.id}{"${node.text}"}`);
      } else if (node.shape === 'circle') {
        lines.push(`    ${node.id}(("${node.text}"))`);
      } else if (node.shape === 'hexagon') {
        lines.push(`    ${node.id}{{"${node.text}"}}`);
      } else {
        lines.push(`    ${node.id}["${node.text}"]`);
      }
    });
    
    // 엣지 정의
    model.edges.forEach(edge => {
      let style = '-->';
      if (edge.style === 'dotted') {
        style = '-.->'; 
      } else if (edge.style === 'dashed') {
        style = '--.->';
      }
      
      if (!edge.label) {
        lines.push(`    ${edge.fromId} ${style} ${edge.toId}`);
      } else {
        lines.push(`    ${edge.fromId} ${style}|${edge.label}| ${edge.toId}`);
      }
    });
    
    return lines.join('\n');
  }

  // JSON -> HTML Table 변환
  static jsonToHtmlTable(jsonData: string): string {
    const model: FlowchartModel = JSON.parse(jsonData);
    let html = '';
    
    // 노드 테이블
    html += '<h3>Nodes</h3>';
    html += '<table border="1" class="min-w-full divide-y divide-gray-200">';
    html += '<thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shape</th></tr></thead>';
    html += '<tbody class="bg-white divide-y divide-gray-200">';
    
    model.nodes.forEach(node => {
      html += `<tr><td class="px-6 py-4 whitespace-nowrap">${node.id}</td><td class="px-6 py-4 whitespace-nowrap">${node.text}</td><td class="px-6 py-4 whitespace-nowrap">${node.shape}</td></tr>`;
    });
    
    html += '</tbody></table>';
    
    // 엣지 테이블
    html += '<h3 class="mt-6">Edges</h3>';
    html += '<table border="1" class="min-w-full divide-y divide-gray-200">';
    html += '<thead class="bg-gray-50"><tr><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style</th></tr></thead>';
    html += '<tbody class="bg-white divide-y divide-gray-200">';
    
    model.edges.forEach(edge => {
      html += `<tr><td class="px-6 py-4 whitespace-nowrap">${edge.fromId}</td><td class="px-6 py-4 whitespace-nowrap">${edge.toId}</td><td class="px-6 py-4 whitespace-nowrap">${edge.label}</td><td class="px-6 py-4 whitespace-nowrap">${edge.style}</td></tr>`;
    });
    
    html += '</tbody></table>';
    
    return html;
  }

  // HTML Table -> JSON 변환
  static htmlTableToJson(html: string): string {
    const model: FlowchartModel = {
      nodes: [],
      edges: []
    };
    
    try {
      // 브라우저 환경에서 DOM 파싱
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // 노드 테이블 파싱
      const tables = doc.querySelectorAll('table');
      const nodeTable = tables[0];
      const nodeRows = nodeTable.querySelectorAll('tbody tr');
      
      nodeRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          const id = cells[0].textContent || '';
          const text = cells[1].textContent || '';
          const shape = (cells[2].textContent || '') as NodeShape;
          
          model.nodes.push({
            id,
            text,
            shape
          });
        }
      });
      
      // 엣지 테이블 파싱
      const edgeTable = tables[1];
      const edgeRows = edgeTable.querySelectorAll('tbody tr');
      
      edgeRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
          const fromId = cells[0].textContent || '';
          const toId = cells[1].textContent || '';
          const label = cells[2].textContent || '';
          const style = (cells[3].textContent || '') as EdgeStyle;
          
          model.edges.push({
            fromId,
            toId,
            label,
            style
          });
        }
      });
    } catch (error) {
      console.error('HTML 파싱 오류:', error);
    }
    
    return JSON.stringify(model, null, 2);
  }
}