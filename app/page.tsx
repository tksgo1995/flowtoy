import { MermaidEditor } from "@/components/MermaidEditor";
import Image from "next/image";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Flowchart Converter</h1>
      <MermaidEditor />
    </main>
  );
}
