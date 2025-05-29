import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ImageUploadProps = {
  onImageSelect?: (file: File) => void;
};

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    onImageSelect?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-12 transition-colors",
        isDragging ? "border-primary bg-muted/50" : "border-muted-foreground/25",
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
      />
      
      <div className="text-center">
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-xl font-medium mb-2">Drop your image here</p>
        <p className="text-sm text-muted-foreground">
          or click
        </p>
      </div>
    </div>
  );
}