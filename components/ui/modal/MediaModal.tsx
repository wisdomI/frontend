import React, { useState } from 'react';
import { X, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import { mockMediaFiles, mockLinks, mockDocuments, MediaFile, getFileIconColor } from '@/data/mockMedia';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MediaTab = 'photos' | 'links' | 'documents';

const MediaModal: React.FC<MediaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('photos');

  if (!isOpen) return null;

  const getCurrentData = () => {
    switch (activeTab) {
      case 'photos':
        return mockMediaFiles;
      case 'links':
        return mockLinks;
      case 'documents':
        return mockDocuments;
      default:
        return mockMediaFiles;
    }
  };

  const groupByMonth = (files: MediaFile[]) => {
    const grouped: { [key: string]: MediaFile[] } = {};
    files.forEach(file => {
      const key = `${file.month} ${file.year}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(file);
    });
    return grouped;
  };

  const renderPhotosAndVideos = () => {
    const groupedFiles = groupByMonth(getCurrentData());
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([monthYear, files]) => (
          <div key={monthYear}>
            <h3 className="text-lg font-medium text-gray-700 mb-4">{monthYear}</h3>
            <div className="grid grid-cols-5 gap-3">
              {files.map((file) => (
                <div key={file.id} className="relative group cursor-pointer">
                  <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={file.thumbnail || '/images/placeholder.jpg'}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {file.type === 'video' && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        1:05
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderLinks = () => {
    const groupedFiles = groupByMonth(getCurrentData());
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([monthYear, files]) => (
          <div key={monthYear}>
            <h3 className="text-lg font-medium text-gray-700 mb-4">{monthYear}</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <img
                        src={file.thumbnail || '/images/link-placeholder.jpg'}
                        alt={file.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-500">{file.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{file.timestamp}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDocuments = () => {
    const groupedFiles = groupByMonth(getCurrentData());
    
    return (
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([monthYear, files]) => (
          <div key={monthYear}>
            <h3 className="text-lg font-medium text-gray-700 mb-4">{monthYear}</h3>
            <div className="space-y-3">
              {files.map((file) => {
                const extension = file.name.split('.').pop()?.toLowerCase();
                let iconBg = 'bg-gray-500';
                const IconComponent = FileText;
                
                if (extension === 'pdf') {
                  iconBg = 'bg-red-500';
                } else if (extension === 'doc' || extension === 'docx') {
                  iconBg = 'bg-blue-500';
                } else if (extension === 'xlsx' || extension === 'xls') {
                  iconBg = 'bg-green-500';
                }
                
                return (
                  <div key={file.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <p className="text-sm text-gray-500">
                          {file.pages} pages • {file.size}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{file.timestamp}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Media</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'text-event-blue border-event-blue'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Photos and Videos
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'links'
                  ? 'text-event-blue border-event-blue'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'text-event-blue border-event-blue'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'photos' && renderPhotosAndVideos()}
            {activeTab === 'links' && renderLinks()}
            {activeTab === 'documents' && renderDocuments()}
          </div>
        </div>
      </div>
    </>
  );
};

export default MediaModal;