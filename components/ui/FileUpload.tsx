import React, { useRef, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  children: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  accept = "image/*", 
  multiple = true, 
  children 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      onFileSelect(fileArray);
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        {children}
      </div>
    </>
  );
};

export default FileUpload;