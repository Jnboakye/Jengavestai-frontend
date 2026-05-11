'use client';

import { useState, useCallback } from 'react';
import { uploadDocument } from '../lib/api';

export default function UploadDocument() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  }, []);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    for (const file of files) {
      if (file.type === 'application/pdf') {
        try {
          const response = await uploadDocument(file);
          setUploadedFiles(prev => [...prev, file.name]);
          console.log('Upload response:', response);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }
    setIsUploading(false);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Upload Financial Documents</h3>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="text-gray-600">
          {isUploading ? (
            <div>Uploading...</div>
          ) : (
            <>
              <div className="text-lg mb-2">Drop PDF files here or click to browse</div>
              <div className="text-sm">Only PDF documents are supported</div>
            </>
          )}
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</h4>
          <ul className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}