'use client';

import { useEffect, useState, useRef } from 'react';
import {
  IconCloudUpload,
  IconFileTypePdf,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { uploadDocument, fetchDocuments } from '@/lib/api';

interface UploadedFile {
  name: string;
  status: 'indexing' | 'indexed' | 'error';
  chunks?: number;
  error?: string;
}

export default function UploadDocument() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load whatever's already indexed on the backend.
  useEffect(() => {
    let active = true;
    fetchDocuments().then((names) => {
      if (active) setFiles(names.map((name) => ({ name, status: 'indexed' as const })));
    });
    return () => { active = false; };
  }, []);

  const uploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) return;

    setFiles((prev) => {
      const others = prev.filter((f) => f.name !== file.name);
      return [...others, { name: file.name, status: 'indexing' }];
    });

    try {
      const res = await uploadDocument(file);
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { ...f, status: 'indexed', chunks: res.chunks_indexed } : f,
        ),
      );
    } catch (e) {
      setFiles((prev) =>
        prev.map((f) =>
          f.name === file.name
            ? { ...f, status: 'error', error: e instanceof Error ? e.message : 'Upload failed' }
            : f,
        ),
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach(uploadFile);
  };

  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const statusBadge = (status: UploadedFile['status']) => {
    if (status === 'indexed') return 'bg-green-50 text-green-600';
    if (status === 'error') return 'bg-red-50 text-red-600';
    return 'bg-yellow-50 text-yellow-700';
  };

  const statusLabel = (f: UploadedFile) => {
    if (f.status === 'indexed') return f.chunks ? `Indexed · ${f.chunks} chunks` : 'Indexed';
    if (f.status === 'error') return 'Error';
    return 'Indexing…';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Documents</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Upload financial PDFs — the AI Analyst can then answer from them with citations
        </p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Upload zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragging ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input ref={inputRef} type="file" accept=".pdf" multiple className="hidden" onChange={handleFileInput} />
          <IconCloudUpload size={32} className="text-gray-300 mb-3" />
          <p className="text-[13px] font-medium text-gray-700 mb-1">Drop PDF files here or click to browse</p>
          <p className="text-[11px] text-gray-400">Annual reports, earnings statements, filings — indexed for AI search</p>
        </div>

        {/* Indexed documents */}
        {files.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-[12px] font-medium text-gray-900">Indexed documents</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <IconFileTypePdf size={18} className="text-red-500 shrink-0" />
                    <span className="text-[12px] text-gray-900 truncate" title={file.error}>{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusBadge(file.status)}`}>
                      {file.status === 'indexed' && <IconCheck size={10} className="inline mr-0.5" />}
                      {statusLabel(file)}
                    </span>
                    <button onClick={() => removeFile(file.name)} className="text-gray-300 hover:text-gray-500 transition-colors">
                      <IconX size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="text-[12px] font-medium text-gray-900 mb-3">How document analysis works</h3>
          <div className="flex flex-col gap-2">
            {[
              'Upload a PDF — an annual report, earnings statement, or any financial filing.',
              'The backend indexes it with a hybrid RAG pipeline (ChromaDB vectors + BM25 keyword search).',
              'Ask the AI Analyst about it — it searches your documents and answers from the actual text.',
              'Answers include citations pointing back to the source document and page.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[11px] text-gray-500 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
            Note: documents are shared and stored on the backend (no per-user accounts yet), and may reset when the free-tier server restarts.
          </p>
        </div>
      </div>
    </div>
  );
}
