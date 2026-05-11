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
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-medium">Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage financial documents</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <IconUpload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="font-medium text-gray-900">Drop PDF files here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Only PDF documents are supported</p>
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
              <h3 className="text-sm font-medium mb-3">Indexed documents</h3>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm text-gray-900">{file}</span>
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
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