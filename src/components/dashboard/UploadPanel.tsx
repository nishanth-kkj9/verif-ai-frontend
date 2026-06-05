import React, { useState, useRef } from 'react';
import { Upload, FileText, Award, Github, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardBody } from '../ui/Card';
import { documentsApi } from '../../api/documents';
import { Document } from '../../types';
import toast from 'react-hot-toast';

interface UploadPanelProps {
  onUploadSuccess?: (document: Document) => void;
}

type DocType = 'resume' | 'certificate' | 'transcript';

const docTypeConfig: Record<DocType, { icon: React.ComponentType<any>; label: string; color: string }> = {
  resume: { icon: FileText, label: 'Resume', color: 'text-blue-400' },
  certificate: { icon: Award, label: 'Certificate', color: 'text-purple-400' },
  transcript: { icon: Github, label: 'Transcript', color: 'text-green-400' },
};

export const UploadPanel: React.FC<UploadPanelProps> = ({ onUploadSuccess }) => {
  const [selectedType, setSelectedType] = useState<DocType>('resume');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadFile = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('text')) {
      toast.error('Please upload a PDF or document file');
      return;
    }

    setIsUploading(true);
    try {
      const response = await documentsApi.upload(file, selectedType);
      if (response.success) {
        setUploadedDocs((prev) => [...prev, response.data]);
        toast.success(`${selectedType} uploaded successfully`);
        onUploadSuccess?.(response.data);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Upload failed';
      toast.error(errorMsg);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Type Selector */}
      <div className="flex gap-3">
        {(Object.entries(docTypeConfig) as [DocType, typeof docTypeConfig[DocType]][]).map(
          ([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    selectedType === type
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                      : 'bg-slate-700/30 text-slate-400 border border-slate-600/30 hover:border-slate-500/50'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {config.label}
              </button>
            );
          }
        )}
      </div>

      {/* Upload Area */}
      <Card bordered hover={false}>
        <CardBody>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              p-12 rounded-lg border-2 border-dashed transition-all cursor-pointer
              ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600/30 bg-slate-800/20 hover:border-slate-500/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center gap-3">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-slate-400" />
              )}
              <div className="text-center">
                <p className="text-white font-semibold">
                  {isUploading ? 'Uploading...' : 'Drag and drop your file here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  or click to browse • PDF, DOC, DOCX accepted
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Uploaded Documents List */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Uploaded Documents</h3>
          {uploadedDocs.map((doc) => (
            <Card key={doc.id} bordered>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-grow">
                    <FileText className="h-5 w-5 text-blue-400" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-white">{doc.file_name}</p>
                      <p className="text-xs text-slate-400">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.status === 'pending' && (
                      <Badge variant="warning" size="sm">
                        Processing...
                      </Badge>
                    )}
                    {doc.status === 'processed' && (
                      <Badge variant="success" size="sm" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Done
                      </Badge>
                    )}
                    {doc.status === 'failed' && (
                      <Badge variant="error" size="sm" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          isLoading={isUploading}
        >
          Upload {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
        </Button>
        <Button variant="ghost">Skip for Now</Button>
      </div>
    </div>
  );
};

UploadPanel.displayName = 'UploadPanel';
