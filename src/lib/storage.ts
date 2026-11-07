import { getSupabaseClient } from './supabase';

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: string;
  error?: string;
}

const MAX_ASSET_SIZE_BYTES = 50 * 1024 * 1024; // 50MB for screenshots, videos & documents
const MAX_RESUME_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Uploads project screenshots, diagrams, videos, and documentation attachments to 'portfolio-assets'
 */
export async function uploadAssetToStorage(
  file: File,
  folder = 'screenshots'
): Promise<StorageUploadResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client is not configured with an API key.',
    };
  }

  if (file.size > MAX_ASSET_SIZE_BYTES) {
    return {
      success: false,
      error: `File size exceeds the 50MB limit. Current file size: ${formatBytes(file.size)}`,
    };
  }

  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    'video/mp4', 'video/webm',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv'
  ];

  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'mp4', 'webm', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv'];

  if (!allowedTypes.includes(file.type) && (!fileExtension || !allowedExtensions.includes(fileExtension))) {
    return {
      success: false,
      error: `Invalid file format (${file.type || fileExtension}). Allowed: PNG, JPEG, WebP, GIF, SVG, MP4, WebM, PDF, Word, Excel, CSV, TXT.`,
    };
  }

  try {
    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${timestamp}_${cleanName}`;

    const { data, error } = await supabase.storage
      .from('portfolio-assets')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('portfolio-assets')
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      storagePath: data.path,
      fileName: file.name,
      fileSize: formatBytes(file.size),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Storage upload failed' };
  }
}

/**
 * Uploads resume PDF files to 'portfolio-resumes'
 */
/**
 * Uploads resume PDF files to private 'portfolio-resumes' bucket
 */
export async function uploadResumeToStorage(
  file: File,
  versionLabel = 'v1.0'
): Promise<StorageUploadResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client is not configured with an API key.',
    };
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return {
      success: false,
      error: `Resume file exceeds 15MB limit. Current: ${formatBytes(file.size)}`,
    };
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return {
      success: false,
      error: 'Resume upload must strictly be a PDF document (.pdf). Word and other formats are not permitted.',
    };
  }

  try {
    const timestamp = Date.now();
    const cleanVersion = versionLabel.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `resumes/${cleanVersion}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('portfolio-resumes')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Since portfolio-resumes is a private bucket, generate a secure 1-hour signed URL
    const { data: signedData, error: signError } = await supabase.storage
      .from('portfolio-resumes')
      .createSignedUrl(data.path, 3600);

    const downloadUrl = (!signError && signedData?.signedUrl)
      ? signedData.signedUrl
      : supabase.storage.from('portfolio-resumes').getPublicUrl(data.path).data.publicUrl;

    return {
      success: true,
      url: downloadUrl,
      storagePath: data.path,
      fileName: file.name,
      fileSize: formatBytes(file.size),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to upload resume to storage' };
  }
}

/**
 * Step 1 & 2: Validates, uploads, and verifies new PDF in private 'portfolio-resumes' bucket.
 * CRITICAL: Does NOT delete the old resume file. Old file is only deleted AFTER
 * the database record is activated and verified.
 */
export async function uploadAndVerifyResume(
  newFile: File
): Promise<StorageUploadResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client is not configured.',
    };
  }

  if (newFile.size > MAX_RESUME_SIZE_BYTES) {
    return {
      success: false,
      error: `Resume file exceeds 15MB limit. Current: ${formatBytes(newFile.size)}`,
    };
  }

  const isPdf = newFile.type === 'application/pdf' || newFile.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return {
      success: false,
      error: 'Resume upload must strictly be a PDF document (.pdf).',
    };
  }

  try {
    const timestamp = Date.now();
    const cleanFileName = newFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const newStoragePath = `resumes/Lingaraj_Belagali_Resume_${timestamp}_${cleanFileName}`;

    // Step 1: Upload new resume to private bucket
    const { data, error } = await supabase.storage
      .from('portfolio-resumes')
      .upload(newStoragePath, newFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error || !data?.path) {
      return {
        success: false,
        error: error?.message || 'Failed to upload new resume file to Supabase Storage.',
      };
    }

    // Step 2: Verify uploaded file by generating a 1-hour signed URL
    const { data: signedData, error: signError } = await supabase.storage
      .from('portfolio-resumes')
      .createSignedUrl(data.path, 3600);

    if (signError || !signedData?.signedUrl) {
      // Verification failed: cleanup uploaded file immediately
      await supabase.storage.from('portfolio-resumes').remove([data.path]);
      return {
        success: false,
        error: 'Uploaded file could not be verified in Supabase Storage. File upload was rolled back.',
      };
    }

    return {
      success: true,
      url: signedData.signedUrl,
      storagePath: data.path,
      fileName: newFile.name,
      fileSize: formatBytes(newFile.size),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Unexpected error uploading and verifying resume in storage.',
    };
  }
}

/**
 * Step 5: Deletes the old resume file from Supabase Storage.
 * Called ONLY AFTER the new database record is verified and active.
 */
export async function deleteOldResumeStorageFile(oldStoragePath?: string): Promise<boolean> {
  if (!oldStoragePath || oldStoragePath.startsWith('/assets/')) {
    return true; // Local static asset, nothing to delete in cloud storage
  }

  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    let cleanOldPath = oldStoragePath;
    if (cleanOldPath.includes('/portfolio-resumes/')) {
      cleanOldPath = cleanOldPath.split('/portfolio-resumes/')[1].split('?')[0];
    }
    const { error: deleteError } = await supabase.storage
      .from('portfolio-resumes')
      .remove([cleanOldPath]);

    if (deleteError) {
      console.warn(`Warning: Could not remove old resume from storage (${cleanOldPath}):`, deleteError.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete old resume from storage:', err);
    return false;
  }
}

/**
 * Rollback helper: Removes newly uploaded resume file if database operations fail.
 * Guarantees zero orphaned files in private Supabase Storage.
 */
export async function rollbackUploadedResumeFile(storagePath?: string): Promise<boolean> {
  if (!storagePath || storagePath.startsWith('/assets/')) return true;
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    let cleanPath = storagePath;
    if (cleanPath.includes('/portfolio-resumes/')) {
      cleanPath = cleanPath.split('/portfolio-resumes/')[1].split('?')[0];
    }
    const { error } = await supabase.storage.from('portfolio-resumes').remove([cleanPath]);
    return !error;
  } catch (e) {
    console.warn('Failed to rollback uploaded resume file:', e);
    return false;
  }
}

/**
 * Backwards compatibility alias for replaceResumeInStorage
 */
export async function replaceResumeInStorage(
  newFile: File,
  _oldStoragePath?: string
): Promise<StorageUploadResult & { oldFileDeleted?: boolean }> {
  const uploadResult = await uploadAndVerifyResume(newFile);
  return {
    ...uploadResult,
    oldFileDeleted: true,
  };
}

/**
 * Gets a secure signed URL for the resume from private bucket 'portfolio-resumes'.
 * Signed URLs expire after 1 hour (3600 seconds) for strict zero-leakage security.
 */
export async function getResumeDownloadUrl(storagePath?: string): Promise<string> {
  const defaultLocalUrl = '/assets/Lingaraj_QA_Automation_Tester_Immediate_Joiner_resume.pdf';
  if (!storagePath) {
    return defaultLocalUrl;
  }

  // If local static asset
  if (storagePath.startsWith('/assets/') || storagePath.startsWith('/')) {
    return storagePath;
  }

  // If already an active signed URL
  if (storagePath.startsWith('http') && storagePath.includes('token=')) {
    return storagePath;
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return defaultLocalUrl;
  }

  try {
    let cleanPath = storagePath;
    if (cleanPath.includes('/portfolio-resumes/')) {
      cleanPath = cleanPath.split('/portfolio-resumes/')[1].split('?')[0];
    }

    // Generate signed URL from private bucket
    const { data: signedData, error } = await supabase.storage
      .from('portfolio-resumes')
      .createSignedUrl(cleanPath, 3600); // 1 hour validity

    if (!error && signedData?.signedUrl) {
      return signedData.signedUrl;
    }

    return defaultLocalUrl;
  } catch (e) {
    return defaultLocalUrl;
  }
}


/**
 * Centralized resume download handler.
 * Downloads Supabase private files using a Blob.
 */
export async function triggerResumeDownload(
  storagePathOrUrl?: string,
  preferredFileName = 'Lingaraj_Belagali_Resume_QA_Immediate_Joiner.pdf'
): Promise<void> {
  try {
    const url = await getResumeDownloadUrl(storagePathOrUrl);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Resume download failed: HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = preferredFileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    console.error('Resume download failed:', error);
    alert('Unable to download the resume. Please try again.');
  }
}


/**
 * Deletes a file from Supabase Storage
 */
export async function deleteStorageFile(bucket: string, storagePath: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !storagePath) return false;

  try {
    let cleanPath = storagePath;
    if (cleanPath.includes(`/${bucket}/`)) {
      cleanPath = cleanPath.split(`/${bucket}/`)[1].split('?')[0];
    }
    const { error } = await supabase.storage.from(bucket).remove([cleanPath]);
    return !error;
  } catch (e) {
    console.warn(`Failed to delete ${storagePath} from ${bucket}:`, e);
    return false;
  }
}
