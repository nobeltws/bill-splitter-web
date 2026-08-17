export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function cropImage(
  imageSrc: string,
  cropArea: CropArea,
  fileName: string,
): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
      );
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas toBlob failed"));
            return;
          }
          const cropped = new File([blob], fileName, { type: "image/jpeg" });
          resolve(cropped);
        },
        "image/jpeg",
        0.9,
      );
    });
    image.addEventListener("error", () =>
      reject(new Error("Failed to load image for cropping")),
    );
    image.src = imageSrc;
  });
}
