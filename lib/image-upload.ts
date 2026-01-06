/**
 * Utility function for uploading and optimizing images
 */

export interface UploadOptions {
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export interface UploadResponse {
  success: boolean;
  filename?: string;
  path?: string;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: string;
  dimensions?: { width: number; height: number };
  error?: string;
}

export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);
  
  if (options.folder) {
    formData.append('folder', options.folder);
  }
  
  if (options.maxWidth) {
    formData.append('maxWidth', options.maxWidth.toString());
  }
  
  if (options.maxHeight) {
    formData.append('maxHeight', options.maxHeight.toString());
  }

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Validate image file before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

