import { supabase } from './supabase';


export interface ImageUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  path?: string;
}

/**
 * Uploads an image to Supabase storage
 * @param imageUri - The local URI of the image (from ImagePicker)
 * @param fileName - The original filename
 * @param bucketName - The Supabase storage bucket name (usually user ID)
 * @param folder - Optional folder within the bucket
 * @returns Promise<ImageUploadResult>
 */


export const uploadImageToSupabase = async (
  imageUri: string,
  fileName: string,
  bucketName: string,
  folder?: string
): Promise<ImageUploadResult> => {
  try {
    // Read the file from the URI
    const response = await fetch(imageUri);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFileName = `${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    
    // Determine content type based on file extension
    let contentType = 'image/jpeg';
    switch (fileExtension) {
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'heic':
        contentType = 'image/jpeg'; // Convert HEIC to JPEG
        break;
      default:
        contentType = 'image/jpeg';
    }
    
    // Create the full path - for RLS policy, the first folder should be the user ID
    const fullPath = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
    
    // Check if bucket exists, create if it doesn't
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError && bucketError.message.includes('not found')) {
      console.log('Creating bucket:', bucketName);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return {
          success: false,
          error: `Failed to create bucket: ${createError.message}`
        };
      }
    }
    
    // Upload to Supabase storage using the correct bucket
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, blob, {
        contentType,
        upsert: false
      });
    
    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      path: data.path
    };

  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};





/**
 * Uploads multiple images to Supabase storage
 * @param images - Array of ImagePicker results
 * @param bucketName - The Supabase storage bucket name
 * @param folder - Optional folder within the bucket
 * @returns Promise<ImageUploadResult[]>
 */


export const uploadMultipleImages = async (
  images: any[],
  bucketName: string,
  folder?: string
): Promise<ImageUploadResult[]> => {
  const uploadPromises = images.map(async (imageResult) => {
    if (imageResult.assets && imageResult.assets[0]) {
      const asset = imageResult.assets[0];
      return await uploadImageToSupabase(
        asset.uri,
        asset.fileName || 'image.jpg',
        bucketName,
        folder
      );
    }
    return {
      success: false,
      error: 'No asset found in image result'
    };
  });

  return await Promise.all(uploadPromises);
};

/**
 * Deletes an image from Supabase storage
 * @param path - The path of the image in storage
 * @param bucketName - The Supabase storage bucket name
 * @returns Promise<boolean>
 */
export const deleteImageFromSupabase = async (
  path: string,
  bucketName: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};
