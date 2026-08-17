"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
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
`;

const CropContainer = styled.div`
  position: relative;
  flex: 1;
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedFile = await cropImage(imageSrc, croppedAreaPixels, fileName);
      onConfirm(croppedFile);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Overlay>
      <CropContainer>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={undefined}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
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
