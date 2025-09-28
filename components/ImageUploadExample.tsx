import { uploadImageToSupabase, uploadMultipleImages } from '@/utils/imageUpload';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

/**
 * Example component showing how to use the image upload utilities
 * This is for demonstration purposes - you can integrate this into your existing components
 */
export default function ImageUploadExample() {
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pickSingleImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImages([result]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickMultipleImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImages(prev => [...prev, ...result.assets.map(asset => ({ assets: [asset], canceled: false }))]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const uploadSingleImage = async () => {
    if (selectedImages.length === 0) {
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

      const asset = selectedImages[0].assets?.[0];
      if (!asset) {
        Alert.alert('Error', 'No image asset found');
        return;
      }

      const result = await uploadImageToSupabase(
        asset.uri,
        asset.fileName || 'image.jpg',
        user.data.user.id,
        'examples' // Optional folder
      );

      if (result.success) {
        Alert.alert('Success', `Image uploaded successfully!\nURL: ${result.publicUrl}`);
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

  const uploadMultipleImagesExample = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Images', 'Please select images first');
      return;
    }

    try {
      setIsUploading(true);
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const results = await uploadMultipleImages(
        selectedImages,
        user.data.user.id,
        'examples' // Optional folder
      );

      const successfulUploads = results.filter(result => result.success);
      const failedUploads = results.filter(result => !result.success);

      Alert.alert(
        'Upload Complete',
        `Successfully uploaded: ${successfulUploads.length}\nFailed: ${failedUploads.length}`
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImages = () => {
    setSelectedImages([]);
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Image Upload Example</Text>
      
      <Pressable
        onPress={pickSingleImage}
        style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Pick Single Image</Text>
      </Pressable>

      <Pressable
        onPress={pickMultipleImages}
        style={{ backgroundColor: '#34C759', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Pick Multiple Images</Text>
      </Pressable>

      <Text>Selected Images: {selectedImages.length}</Text>

      <Pressable
        onPress={uploadSingleImage}
        disabled={isUploading}
        style={{ 
          backgroundColor: isUploading ? '#ccc' : '#FF9500', 
          padding: 10, 
          borderRadius: 5 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isUploading ? 'Uploading...' : 'Upload Single Image'}
        </Text>
      </Pressable>

      <Pressable
        onPress={uploadMultipleImagesExample}
        disabled={isUploading}
        style={{ 
          backgroundColor: isUploading ? '#ccc' : '#FF3B30', 
          padding: 10, 
          borderRadius: 5 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isUploading ? 'Uploading...' : 'Upload Multiple Images'}
        </Text>
      </Pressable>

      <Pressable
        onPress={clearImages}
        style={{ backgroundColor: '#8E8E93', padding: 10, borderRadius: 5 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear Images</Text>
      </Pressable>
    </View>
  );
}
