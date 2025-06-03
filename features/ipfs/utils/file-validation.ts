export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Common image types

  // Check if file is provided
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: `Invalid file type. Only ${ALLOWED_TYPES.map(type => type.split('/')[1]).join(', ')} are allowed.` };
  }

  // Check file size
  if (file.size > MAX_SIZE_BYTES) {
    return { isValid: false, error: `File size exceeds the maximum limit of ${MAX_SIZE_MB}MB.` };
  }

  // If all checks pass
  return { isValid: true };
};
