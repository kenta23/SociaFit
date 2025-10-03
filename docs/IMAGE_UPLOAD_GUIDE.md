# Image Upload to Supabase Storage Guide

This guide explains how to upload images to Supabase storage using the Expo ImagePicker API in your React Native app.

## Overview

The image upload functionality is implemented in `utils/imageUpload.ts` and provides utilities for:
- Uploading single images
- Uploading multiple images
- Deleting images from storage
- Proper error handling and type safety

## Setup

### 1. Dependencies

Make sure you have the required dependencies installed:

```bash
npm install expo-image-picker @supabase/supabase-js
```

### 2. Supabase Storage Setup

1. Create a storage bucket in your Supabase dashboard
2. Set up proper RLS (Row Level Security) policies for your bucket
3. Ensure your bucket allows public access if you want to display images publicly

### 3. Environment Variables

Make sure your Supabase credentials are properly configured in your environment:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
```

## Usage

### Basic Image Picking

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    // Handle the selected image
    console.log('Selected image:', result.assets[0]);
  }
};
```

### Uploading a Single Image

```typescript
import { uploadImageToSupabase } from '@/utils/imageUpload';
import { supabase } from '@/utils/supabase';

const uploadImage = async (imageUri: string, fileName: string) => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const result = await uploadImageToSupabase(
      imageUri,
      fileName,
      user.data.user.id, // bucket name (usually user ID)
      'activities' // optional folder
    );

    if (result.success) {
      console.log('Image uploaded successfully:', result.publicUrl);
      return result.publicUrl;
    } else {
      console.error('Upload failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};
```

### Uploading Multiple Images

```typescript
import { uploadMultipleImages } from '@/utils/imageUpload';

const uploadMultipleImagesExample = async (images: ImagePicker.ImagePickerResult[]) => {
  try {
    const user = await supabase.auth.getUser();
    
    if (!user.data.user) {
      throw new Error('User not authenticated');
    }

    const results = await uploadMultipleImages(
      images,
      user.data.user.id, // bucket name
      'activities' // optional folder
    );

    // Filter successful uploads
    const successfulUploads = results
      .filter(result => result.success)
      .map(result => result.publicUrl!);

    console.log('Successfully uploaded images:', successfulUploads);
    return successfulUploads;
  } catch (error) {
    console.error('Error uploading images:', error);
    return [];
  }
};
```

### Complete Example with UI

```typescript
import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToSupabase } from '@/utils/imageUpload';
import { supabase } from '@/utils/supabase';

export default function ImageUploadComponent() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async () => {
    if (!selectedImage?.assets?.[0]) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    try {
      setIsUploading(true);
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const asset = selectedImage.assets[0];
      const result = await uploadImageToSupabase(
        asset.uri,
        asset.fileName || 'image.jpg',
        user.data.user.id,
        'uploads'
      );

      if (result.success) {
        Alert.alert('Success', 'Image uploaded successfully!');
        setSelectedImage(null);
      } else {
        Alert.alert('Error', result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Pressable
        onPress={pickImage}
        style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Pick Image</Text>
      </Pressable>

      {selectedImage && (
        <Pressable
          onPress={uploadImage}
          disabled={isUploading}
          style={{ 
            backgroundColor: isUploading ? '#ccc' : '#34C759', 
            padding: 10, 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
```

## API Reference

### `uploadImageToSupabase`

Uploads a single image to Supabase storage.

**Parameters:**
- `imageUri: string` - The local URI of the image (from ImagePicker)
- `fileName: string` - The original filename
- `bucketName: string` - The Supabase storage bucket name
- `folder?: string` - Optional folder within the bucket

**Returns:** `Promise<ImageUploadResult>`

**ImageUploadResult:**
```typescript
interface ImageUploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
  path?: string;
}
```

### `uploadMultipleImages`

Uploads multiple images to Supabase storage.

**Parameters:**
- `images: any[]` - Array of ImagePicker results
- `bucketName: string` - The Supabase storage bucket name
- `folder?: string` - Optional folder within the bucket

**Returns:** `Promise<ImageUploadResult[]>`

### `deleteImageFromSupabase`

Deletes an image from Supabase storage.

**Parameters:**
- `path: string` - The path of the image in storage
- `bucketName: string` - The Supabase storage bucket name

**Returns:** `Promise<boolean>`

## Error Handling

The utilities include comprehensive error handling:

1. **Network errors** - When fetching the image from the local URI
2. **Upload errors** - When Supabase storage rejects the upload
3. **Authentication errors** - When the user is not authenticated
4. **File format errors** - When the file format is not supported

## Best Practices

1. **Always check authentication** before attempting uploads
2. **Handle loading states** to provide user feedback
3. **Validate file types** before uploading
4. **Use appropriate image quality** settings for your use case
5. **Implement proper error handling** with user-friendly messages
6. **Clean up local files** after successful upload if needed

## File Format Support

The utility automatically handles these image formats:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- HEIC (.heic) - converted to JPEG

## Storage Organization

Consider organizing your storage with folders:
- `user_id/avatars/` - User profile pictures
- `user_id/activities/` - Activity images
- `user_id/posts/` - Post images
- `public/` - Publicly accessible images

## Security Considerations

1. **Use RLS policies** to control access to storage buckets
2. **Validate file types** on the server side
3. **Implement file size limits** to prevent abuse
4. **Use signed URLs** for sensitive images
5. **Regularly clean up** unused files

## Troubleshooting

### Common Issues

1. **"Failed to fetch image"** - Check if the image URI is valid
2. **"Upload error"** - Check Supabase storage permissions and RLS policies
3. **"User not authenticated"** - Ensure user is logged in before uploading
4. **"File too large"** - Implement file size validation

### Debug Tips

1. Enable console logging to see detailed error messages
2. Check Supabase storage logs in the dashboard
3. Verify RLS policies are correctly configured
4. Test with different image formats and sizes
