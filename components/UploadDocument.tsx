'use client';

import { useState, useRef } from 'react';
import {
  IconCloudUpload,
  IconFileTypePdf,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { uploadMockDocument } from '@/lib/api';

interface UploadedFile {
  name: string;
  status: 'indexing' | 'indexed' | 'error';
}

export default function UploadDocument() {
  const [files, setFiles] = useState<UploadedFile[]>([
    { name: 'AAPL_Annual_Report_2024.pdf', status: 'indexed' },
    { name: 'MSFT_Q3_Earnings_2024.pdf', status: 'indexed' },
  ]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.pdf')) return;

    const newFile: UploadedFile = { name: file.name, status: 'indexing' };
    setFiles(prev => [...prev, newFile]);

    // Demo: nothing leaves the browser. This simulates an indexing step so
    // the UI shows the full upload → indexing → indexed flow.
    const { status } = await uploadMockDocument(file);
    setFiles(prev =>
      prev.map(f => f.name === file.name ? { ...f, status } : f)
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(uploadFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(uploadFile);
    }
  };

  const removeFile = (name: string) => {
    setFiles(prev => prev.filter(f => f.name !== name));
  };

  const statusBadge = (status: UploadedFile['status']) => {
    if (status === 'indexed') return 'bg-green-50 text-green-600';
    if (status === 'error') return 'bg-red-50 text-red-600';
    return 'bg-yellow-50 text-yellow-700';
  };

  const statusLabel = (status: UploadedFile['status']) => {
    if (status === 'indexed') return 'Indexed';
    if (status === 'error') return 'Error';
    return 'Indexing...';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Documents</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Upload financial documents (demo — files stay in your browser)
        </p>
      </div>

      <div className="p-4 flex flex-col gap-4">

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragging
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
          <IconCloudUpload size={32} className="text-gray-300 mb-3" />
          <p className="text-[13px] font-medium text-gray-700 mb-1">
            Drop PDF files here or click to browse
          </p>
          <p className="text-[11px] text-gray-400">
            Supports annual reports, earnings statements and financial documents
          </p>
        </div>

        {/* Indexed documents */}
        {files.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-[12px] font-medium text-gray-900">
                Indexed documents
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <IconFileTypePdf size={18} className="text-red-500 shrink-0" />
                    <span className="text-[12px] text-gray-900">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusBadge(file.status)}`}>
                      {file.status === 'indexed' && <IconCheck size={10} className="inline mr-0.5" />}
                      {statusLabel(file.status)}
                    </span>
                    <button
                      onClick={() => removeFile(file.name)}
                      className="text-gray-300 hover:text-gray-500 transition-colors"
                    >
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
          <h3 className="text-[12px] font-medium text-gray-900 mb-3">
            About this demo
          </h3>
          <div className="flex flex-col gap-2">
            {[
              'This is a front-end demo — uploaded PDFs are listed locally and never sent anywhere.',
              'The concept: dropped documents would be indexed for retrieval-augmented search.',
              'The AI Analyst would then answer questions grounded in those documents.',
              'Replies would include citations pointing back to the source page and section.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-[11px] text-gray-500 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}