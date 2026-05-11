'use client';

import React, { useState } from 'react';
import { IconUpload } from '@tabler/icons-react';
import { uploadDocument } from '../lib/api';

export default function Documents() {
  const [files, setFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    for (const file of filesToUpload) {
      if (file.type === 'application/pdf') {
        try {
          await uploadDocument(file);
          setFiles((prev) => [...prev, file.name]);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }
    setIsUploading(false);
  };

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <h1 className="text-xl font-medium">Documents</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Upload and manage financial documents</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="rounded-lg border p-8" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
            className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <IconUpload size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto', marginBottom: '0.75rem' }} />
            <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>Drop PDF files here or click to browse</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Only PDF documents are supported</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>Indexed documents</h3>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border" style={{ backgroundColor: 'var(--color-main-bg)', borderColor: 'var(--color-border)' }}>
                    <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{file}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#10b98133', color: '#10b981' }}>
                      Indexed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}