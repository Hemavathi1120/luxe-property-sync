
export const CLOUDINARY_CONFIG = {
  cloudName: "dobktsnix",
  uploadPreset: "Real-Estate"
};

export const getCloudinaryUrl = (publicId: string, transformations?: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;
  const transform = transformations ? `/${transformations}` : '';
  return `${baseUrl}${transform}/image/upload/${publicId}`;
};

export const getOptimizedImageUrl = (publicId: string, width?: number, height?: number) => {
  let transform = 'f_auto,q_auto';
  if (width) transform += `,w_${width}`;
  if (height) transform += `,h_${height}`;
  return getCloudinaryUrl(publicId, transform);
};
