import { uploadImageToSupabase } from '@/utils/imageUpload';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';

/**
 * Test component for image upload functionality
 * Use this to test if your upload is working correctly
 */
export default function ImageUploadTest() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string>('');

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
        setUploadResult('');
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
      setUploadResult('Uploading...');
      
      const user = await supabase.auth.getUser();
      
      if (!user.data.user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const asset = selectedImage.assets[0];
      console.log('Uploading image:', {
        uri: asset.uri,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
        type: asset.type
      });

      const result = await uploadImageToSupabase(
        asset.uri,
        asset.fileName || 'image.jpg',
        'media', // bucket name
        user.data.user.id // folder name (user ID)
      );

      console.log('Upload result:', result);

      if (result.success) {
        setUploadResult(`✅ Success!\nURL: ${result.publicUrl}\nPath: ${result.path}`);
        Alert.alert('Success', 'Image uploaded successfully!');
      } else {
        setUploadResult(`❌ Failed: ${result.error}`);
        Alert.alert('Error', result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setUploadResult('');
  };

  return (
    <ScrollView style={{ padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Image Upload Test
      </Text>

      {/* Image Picker Button */}
      <Pressable
        onPress={pickImage}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 15, 
          borderRadius: 8, 
          marginBottom: 20 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Pick Image
        </Text>
      </Pressable>

      {/* Selected Image Preview */}
      {selectedImage?.assets?.[0] && (
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
            Selected Image:
          </Text>
          <Image
            source={{ uri: selectedImage.assets[0].uri }}
            style={{ 
              width: 200, 
              height: 200, 
              borderRadius: 8,
              alignSelf: 'center'
            }}
            resizeMode="cover"
          />
          <Text style={{ marginTop: 10, textAlign: 'center', color: '#666' }}>
            {selectedImage.assets[0].fileName} ({selectedImage.assets[0].fileSize} bytes)
          </Text>
        </View>
      )}

      {/* Upload Button */}
      {selectedImage && (
        <Pressable
          onPress={uploadImage}
          disabled={isUploading}
          style={{ 
            backgroundColor: isUploading ? '#ccc' : '#34C759', 
            padding: 15, 
            borderRadius: 8,
            marginBottom: 20
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Text>
        </Pressable>
      )}

      {/* Upload Result */}
      {uploadResult && (
        <View style={{ 
          backgroundColor: 'white', 
          padding: 15, 
          borderRadius: 8,
          marginBottom: 20
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>
            Upload Result:
          </Text>
          <Text style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {uploadResult}
          </Text>
        </View>
      )}

      {/* Clear Button */}
      {selectedImage && (
        <Pressable
          onPress={clearImage}
          style={{ 
            backgroundColor: '#FF3B30', 
            padding: 15, 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            Clear Image
          </Text>
        </Pressable>
      )}

      {/* Instructions */}
      <View style={{ 
        backgroundColor: '#E3F2FD', 
        padding: 15, 
        borderRadius: 8,
        marginTop: 20
      }}>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 10 }}>
          Instructions:
        </Text>
        <Text style={{ fontSize: 12, lineHeight: 18 }}>
          1. Make sure you're logged in to your app{'\n'}
          2. Pick an image from your gallery{'\n'}
          3. Click "Upload Image" to test the upload{'\n'}
          4. Check the result above{'\n'}
          5. Verify the image appears in your Supabase storage dashboard
        </Text>
      </View>
    </ScrollView>
  );
}
