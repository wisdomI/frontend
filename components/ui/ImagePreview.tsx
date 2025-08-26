import React, { useState } from 'react';
import { X, Download, Eye } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  file, 
  onRemove, 
  className = "" 
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setIsLoading(false);

      // Cleanup URL when component unmounts
      return () => URL.revokeObjectURL(url);
    } else {
      setError(true);
      setIsLoading(false);
    }
  }, [file]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className={`relative group ${className}`}>
        <div className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`relative group ${className}`}>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Eye className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">Preview not available</p>
          </div>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Overlay with file info */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center">
          <p className="text-xs font-medium truncate px-2 mb-1">{file.name}</p>
          <p className="text-xs">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* File type indicator */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {file.type.split('/')[1]?.toUpperCase() || 'IMG'}
      </div>
    </div>
  );
};

export default ImagePreview;