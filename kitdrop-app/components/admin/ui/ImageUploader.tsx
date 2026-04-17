"use client";
import { useState, useRef, useCallback, useMemo } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value: string | string[];
  onChange: (urls: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  bucket?: string;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label = "Upload Image",
  bucket = "product-images",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImages = useMemo(() => (Array.isArray(value)
    ? value
    : value
    ? [value]
    : []), [value]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      // Validate
      for (const file of fileArray) {
        if (!validTypes.includes(file.type)) {
          setError("Only JPG, PNG, and WebP images are allowed");
          return;
        }
        if (file.size > maxSize) {
          setError("Image must be under 5MB");
          return;
        }
      }

      setError(null);
      setUploading(true);

      try {
        const uploadedUrls: string[] = [];

        for (const file of fileArray) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("bucket", bucket);

          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Upload failed");
          }

          const data = await res.json();
          uploadedUrls.push(data.url);
        }

        if (multiple) {
          onChange([...currentImages, ...uploadedUrls]);
        } else {
          onChange(uploadedUrls[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [bucket, currentImages, multiple, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    if (multiple) {
      const updated = currentImages.filter((_, i) => i !== index);
      onChange(updated);
    } else {
      onChange("");
    }
  };

  return (
    <div>
      <label htmlFor="image-uploader-input" className="block text-[10px] sm:text-xs font-headline font-bold uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </label>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${isDragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-border-hover hover:bg-surface-high/30"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          id="image-uploader-input"
          ref={fileInputRef}
          aria-label={label}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
            }
          }}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={28} className="text-accent animate-spin" />
            <p className="text-xs text-on-surface-variant font-headline uppercase tracking-widest">
              Uploading...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={28} className="text-on-surface-variant/50" />
            <p className="text-sm text-on-surface-variant font-headline font-bold uppercase tracking-tight">
              Drop images here or tap to select
            </p>
            <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider">
              JPG, PNG, WebP · Max 5MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-error text-xs mt-2 font-headline">{error}</p>
      )}

      {/* Preview Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {currentImages.map((url, i) => (
            <div
              key={i}
              className="relative group aspect-square bg-surface-high border border-border rounded-lg overflow-hidden"
            >
              {url ? (
                <Image
                  src={url}
                  alt={`Upload ${i + 1}`}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon size={24} className="text-on-surface-variant/30" />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(i);
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                aria-label="Remove image"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
