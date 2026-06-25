import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ImageCropperModalProps {
  imageUrl: string;
  onCrop: (croppedBase64: string) => void;
  onCancel: () => void;
  targetType?: string;
}

export function ImageCropperModal({ imageUrl, onCrop, onCancel, targetType }: ImageCropperModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CROP_SIZE = targetType === 'wallpaper' ? { w: 400, h: 225 } : { w: 128, h: 128 };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleSave = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE.w;
    canvas.height = CROP_SIZE.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const cropX = centerX - CROP_SIZE.w / 2;
    const cropY = centerY - CROP_SIZE.h / 2;

    const imgWidth = img.naturalWidth * zoom;
    const imgHeight = img.naturalHeight * zoom;
    const imgX = centerX - imgWidth / 2 + position.x;
    const imgY = centerY - imgHeight / 2 + position.y;

    const srcX = (cropX - imgX) / zoom;
    const srcY = (cropY - imgY) / zoom;
    const srcW = CROP_SIZE.w / zoom;
    const srcH = CROP_SIZE.h / zoom;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, CROP_SIZE.w, CROP_SIZE.h);

    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    onCrop(base64);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1a1a24] border border-white/10 rounded-2xl p-6 w-[500px] max-w-[90vw] flex flex-col items-center shadow-2xl"
      >
        <div className="flex justify-between w-full mb-4">
          <h2 className="text-white font-space font-medium text-lg">Crop Image</h2>
          <button onClick={onCancel} className="text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full h-[300px] bg-black/50 rounded-xl overflow-hidden cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Upload preview"
            draggable={false}
            className="absolute top-1/2 left-1/2 origin-center max-w-none pointer-events-none"
            style={{ 
              transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${zoom})`
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              const scaleX = CROP_SIZE.w / img.naturalWidth;
              const scaleY = CROP_SIZE.h / img.naturalHeight;
              setZoom(Math.max(scaleX, scaleY));
            }}
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                 style={{ width: CROP_SIZE.w, height: CROP_SIZE.h }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full mt-6 px-4">
          <ZoomOut size={18} className="text-white/50" />
          <input 
            type="range" 
            min={0.01} max={5} step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-[#c58bf2] h-1 bg-white/20 rounded-full appearance-none outline-none"
          />
          <ZoomIn size={18} className="text-white/50" />
        </div>

        <div className="flex gap-3 w-full mt-8">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-space font-medium text-white/70 hover:bg-white/5 transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl font-space font-medium text-black transition-colors flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #c58bf2 0%, #eeadd4 100%)' }}
          >
            <Check size={18} />
            Crop & Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}
