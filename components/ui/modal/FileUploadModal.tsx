import React, { useState } from 'react';
import { X, Send, Image as ImageIcon, FileText, Video } from 'lucide-react';
import FileUpload from '../FileUpload';
import ImagePreview from '../ImagePreview';
import { Button } from '../button';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (files: File[], message?: string) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onSend
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleSend = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSend(selectedFiles, message);
      
      // Reset state
      setSelectedFiles([]);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <Video className="w-4 h-4 text-purple-500" />;
    } else {
      return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const isImage = (file: File) => file.type.startsWith('image/');

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Upload Files</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* File Upload Area */}
            {selectedFiles.length === 0 && (
              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.xls"
                multiple={true}
                maxSize={10}
              />
            )}

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFiles([])}
                  >
                    Clear All
                  </Button>
                </div>

                {/* Image Previews Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {selectedFiles.filter(isImage).map((file, index) => (
                    <ImagePreview
                      key={index}
                      file={file}
                      onRemove={() => removeFile(selectedFiles.indexOf(file))}
                      className="w-full"
                    />
                  ))}
                </div>

                {/* Non-image Files List */}
                {selectedFiles.filter(file => !isImage(file)).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Other Files:</h4>
                    {selectedFiles.filter(file => !isImage(file)).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileTypeIcon(file)}
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[300px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(selectedFiles.indexOf(file))}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add More Files Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*,video/*,.pdf,.doc,.docx,.xlsx,.xls';
                    input.multiple = true;
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) {
                        const newFiles = Array.from(files);
                        setSelectedFiles(prev => [...prev, ...newFiles]);
                      }
                    };
                    input.click();
                  }}
                  className="w-full"
                >
                  Add More Files
                </Button>
              </div>
            )}

            {/* Message Input */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Add a message (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message to send with your files..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-blue focus:border-event-blue resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Files</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploadModal;