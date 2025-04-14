'use client';

import { useState } from 'react';
import { FlowchartViewer } from './FlowchartViewer';
import { FlowchartConverter } from '@/lib/flowchartConverter';

export const MermaidEditor: React.FC = () => {
  const [mermaidCode, setMermaidCode] = useState<string>(`graph TD
    A["시작"]
    B{"결정"}
    A --> B
    B -->|"예"| C["끝"]
    B -->|"아니오"| A`);
  const [jsonData, setJsonData] = useState<string>('');
  const [htmlTable, setHtmlTable] = useState<string>('');
  
  const convertMermaidToJson = () => {
    try {
      const result = FlowchartConverter.mermaidToJson(mermaidCode);
      setJsonData(result);
    } catch (error) {
      alert('Mermaid to JSON 변환 실패: ' + error);
    }
  };
  
  const convertJsonToMermaid = () => {
    try {
      const result = FlowchartConverter.jsonToMermaid(jsonData);
      setMermaidCode(result);
    } catch (error) {
      alert('JSON to Mermaid 변환 실패: ' + error);
    }
  };
  
  const convertJsonToHtmlTable = () => {
    try {
      const result = FlowchartConverter.jsonToHtmlTable(jsonData);
      setHtmlTable(result);
    } catch (error) {
      alert('JSON to HTML Table 변환 실패: ' + error);
    }
  };
  
  const convertHtmlToJson = () => {
    try {
      const result = FlowchartConverter.htmlTableToJson(htmlTable);
      setJsonData(result);
    } catch (error) {
      alert('HTML Table to JSON 변환 실패: ' + error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Mermaid Editor</h2>
        <textarea
          className="w-full h-64 border p-2 font-mono"
          value={mermaidCode}
          onChange={(e) => setMermaidCode(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={convertMermaidToJson}
          >
            Mermaid to JSON
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={convertJsonToMermaid}
          >
            JSON to Mermaid
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <div className="border p-2 h-64 overflow-auto bg-gray-50">
          <FlowchartViewer code={mermaidCode} />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">JSON Editor</h2>
        <textarea
          className="w-full h-64 border p-2 font-mono"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
        />
        <div className="flex gap-2 mt-2">
          <button 
            className="bg-purple-500 text-white px-4 py-2 rounded"
            onClick={convertJsonToHtmlTable}
          >
            JSON to HTML Table
          </button>
          <button 
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={convertHtmlToJson}
          >
            HTML Table to JSON
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">HTML Table Preview</h2>
        <div className="border p-2 h-64 overflow-auto">
          {htmlTable && (
            <div dangerouslySetInnerHTML={{ __html: htmlTable }} />
          )}
        </div>
      </div>
    </div>
  );
};