'use client';

import React, { useState } from 'react';
import { IconUpload, IconFile } from '@tabler/icons-react';
import { uploadDocument } from '../lib/api';

export default function Documents() {
  const [files, setFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    for (const file of filesToUpload) {
      if (file.type === 'application/pdf') {
        try {
          await uploadDocument(file);
          setFiles((prev) => [...prev, file.name]);
        } catch {
          console.error('Upload failed for', file.name);
        }
      }
    }
    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Documents</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Upload and manage financial documents
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Upload zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById('file-input')?.click()}
          className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors"
          style={{
            borderColor: isDragging ? '#1D9E75' : 'var(--color-border)',
            backgroundColor: isDragging ? 'rgba(29,158,117,0.05)' : 'transparent',
          }}
        >
          <IconUpload size={28} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Drop PDF files here or click to browse
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Only PDF documents are supported
          </p>
          {isUploading && (
            <p className="text-xs mt-3" style={{ color: '#34d399' }}>Uploading...</p>
          )}
          <input id="file-input" type="file" multiple accept=".pdf" onChange={handleFileInput} className="hidden" />
        </div>

        {/* Indexed list */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Indexed documents
            </h3>
            <div className="space-y-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border"
                  style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <IconFile size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{file}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: '#F0FDF4', color: '#059669' }}
                  >
                    Indexed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
