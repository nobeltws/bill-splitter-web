"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { styled } from "@linaria/react";
import { cropImage } from "@/lib/cropImage";
import { Loader2 } from "lucide-react";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: #000;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
`;

const CropContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 16px;
`;

const CropImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  display: block;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #111;
`;

const ActionButton = styled.button<{ variant?: "primary" }>`
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  background: ${(p) => (p.variant === "primary" ? "var(--color-primary)" : "transparent")};
  color: ${(p) => (p.variant === "primary" ? "#fff" : "var(--color-muted-foreground)")};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface CropOverlayProps {
  imageSrc: string;
  fileName: string;
  onConfirm: (croppedFile: File) => void;
  onCancel: () => void;
}

export function CropOverlay({ imageSrc, fileName, onConfirm, onCancel }: CropOverlayProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const cropWidth = Math.round(naturalWidth * 0.9);
    const cropHeight = Math.round(naturalHeight * 0.9);
    const x = Math.round((naturalWidth - cropWidth) / 2);
    const y = Math.round((naturalHeight - cropHeight) / 2);
    const initialCrop: Crop = {
      unit: "px",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
    };
    setCrop(initialCrop);
    setCompletedCrop(initialCrop as PixelCrop);
  }

  async function handleConfirm() {
    if (!completedCrop || !imgRef.current) return;
    setProcessing(true);
    try {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      const pixelCrop = {
        x: Math.round(completedCrop.x * scaleX),
        y: Math.round(completedCrop.y * scaleY),
        width: Math.round(completedCrop.width * scaleX),
        height: Math.round(completedCrop.height * scaleY),
      };
      const croppedFile = await cropImage(imageSrc, pixelCrop, fileName);
      onConfirm(croppedFile);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Overlay>
      <CropContainer>
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        >
          <CropImage
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={handleImageLoad}
          />
        </ReactCrop>
      </CropContainer>
      <ActionBar>
        <ActionButton onClick={onCancel} disabled={processing}>
          Cancel
        </ActionButton>
        <ActionButton variant="primary" onClick={handleConfirm} disabled={processing}>
          {processing && <Loader2 size={18} className="spin" />}
          {processing ? "Cropping..." : "Confirm"}
        </ActionButton>
      </ActionBar>
    </Overlay>
  );
}
