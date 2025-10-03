import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { uploadMultipleImages } from '@/utils/imageUpload';
import { useStoreDistance, useStoreStepsCount } from '@/utils/states';
import { containerStyles } from '@/utils/styles';
import { supabase } from '@/utils/supabase';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';

export default function ShareActivity() { 
    const colorScheme = useColorScheme() ?? 'light';
    const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerResult[]>([]);
    const [displayStepsCount, setDisplayStepsCount] = useState<boolean>(false);
    const [displayDistanceMap, setDisplayDistanceMap] = useState<boolean>(false);
    const [textContent, setTextContent] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { currentSteps } = useStoreStepsCount();
    const { coordinates } = useStoreDistance();
    const router = useRouter();

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images', 'livePhotos'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
    
        console.log('result', result);

        if (!result.canceled) {
          setSelectedImage(prev => 
            prev.length < 5 ? [...prev, result] : prev
          );
        }
    };

   console.log('textContent', textContent);


   const handleShareActivity = async () => { 
      try {
          setIsUploading(true);
          const user = await supabase.auth.getUser();
          
          if (!user.data.user) {
            throw new Error('User not authenticated');
          }

          const userId = user.data.user.id;

 
          const { data, error } = await supabase.from('activities').insert({ 
                content: textContent,
                user_id: userId,
                steps_total: displayStepsCount ? currentSteps : null,
                distance_travelled: displayDistanceMap ? coordinates : null,
          }).select('*').single();

          if (error) {
            console.error('Database error:', error);
            throw error;
          }

          console.log('Activity created:', data);

          if (data.id) {
            if(selectedImage.length > 0) { 
                        // Upload images to storage using the utility function
            // Use 'media' as the bucket name and userId as the folder for RLS policy
            const uploadResults = await uploadMultipleImages(
               selectedImage,
               "media",
               data.post_id as string
             );
 
             // Filter successful uploads and get their public URLs
             const uploadedImages = uploadResults
               .filter((result) => result.success && result.publicUrl)
               .map((result) => result.publicUrl!);
 
             console.log("Uploaded images:", uploadedImages);
               }

                Snackbar.show({ 
                     text: 'Activity shared successfully',
                     duration: Snackbar.LENGTH_SHORT,
                     action: { 
                          text: 'Close',
                          onPress: () => {
                               Snackbar.dismiss();
                               router.back();
                          }
                     }
                })
          }

      } catch (error) {
          console.error('Error sharing activity:', error);
          Snackbar.show({ 
                text: 'Something went wrong',
                duration: Snackbar.LENGTH_SHORT,
                action: { 
                     text: 'Close',
                     onPress: () => {
                          Snackbar.dismiss();
                     }
                }
          })
      } finally {
          setIsUploading(false);
      }
   }

   console.log('images', selectedImage.map(item => item.assets?.[0].uri));

     return ( 
            <SafeAreaView edges={['bottom']} style={[containerStyles.container, { paddingVertical: 12 }]}> 
                  <ScrollView scrollEnabled contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                      {/**Text Input field and date */}
                        <View style={[styles.contentWrapper, {  alignItems: 'flex-end', }]}>
                             <Text style={typography.description}>{new Date().toLocaleDateString()}</Text>


                            <TextInput 
                                 placeholderTextColor={Colors[colorScheme].text['200']} 
                                 multiline 
                                 numberOfLines={10}
                                 clearButtonMode='while-editing'
                                 textAlignVertical='top'
                                 onChangeText={setTextContent}
                                 value={textContent}
                                 placeholder='Share something...' style={[styles.textfield, { backgroundColor: Colors[colorScheme].text['50'] }]} />
                        </View>

                        {/**Media */}
                        <View style={[styles.contentWrapper, { marginTop: 16, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                             
                             <View style={styles.captionStyles}>
                               <Text style={[typography.subheading, { color: Colors[colorScheme].text['800'] }]}>Add Media</Text>
                               <Text style={[typography.description, { color: Colors[colorScheme].text['200'] }]}>You can upload up to 5 photos</Text>
                             </View> 



                              <View style={styles.imageGridContainer}>
                                 <Pressable onPress={pickImage} style={[styles.addImageButton, { borderColor: Colors[colorScheme].pink['400'] }]}>
                                      <Feather name="camera" size={24} color={Colors[colorScheme].pink['400']} />
                                  </Pressable> 

                                  {selectedImage.map((item, index) => (
                                       <View key={index} style={[styles.imageContainer, { borderColor: Colors[colorScheme].pink['400'] }]}>
                                            <Image 
                                                style={styles.image} 
                                                contentFit="cover" 
                                                source={item.assets ? item?.assets[0].uri : require('@/assets/fit.png')} 
                                            />
                                            <Pressable 
                                                style={styles.removeImageButton}
                                                onPress={() => setSelectedImage(prev => prev.filter((_, i) => i !== index))}
                                            >
                                                <Feather name="x" size={16} color="white" />
                                            </Pressable>
                                       </View>
                                  ))}
                              </View>
                        </View>



                        {/**Add to an activity */}
                        <View style={[styles.contentWrapper, { marginTop: 16, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                    
                             <View style={styles.captionStyles}>
                               <Text style={[typography.subheading, { color: Colors[colorScheme].text['800'] }]}>Add to the activity</Text>
                               <Text style={[typography.description, { color: Colors[colorScheme].text['200'] }]}>Include the steps count and distance on a new activity</Text>
                             </View> 




                             <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                                {/**Steps count button */}
                                 <Pressable onPress={() => setDisplayStepsCount(prev => !prev)} style={[{ width: 140, flexDirection: 'row', gap: 8, borderRadius: 100, padding: 12, borderWidth: 1, borderColor: Colors[colorScheme].green['400']}, displayStepsCount && { backgroundColor: Colors[colorScheme].green['400'] }]}> 
                                     <Ionicons name="footsteps" size={20} color={displayStepsCount ? 'white' : Colors[colorScheme].green['400']} />
                                     <Text style={[typography.medium, { color: displayStepsCount ? 'white' : Colors[colorScheme].green['400'] }]}>Steps Count</Text>
                                 </Pressable>


                              {/**Distance map button */}
                                 <Pressable onPress={() => setDisplayDistanceMap(prev => !prev)} style={[{width: 140, flexDirection: 'row', gap: 8, borderRadius: 100, padding: 12, borderWidth: 1, borderColor: Colors[colorScheme].pink['400']}, displayDistanceMap && { backgroundColor: Colors[colorScheme].pink['400'] }]}> 
                                     <FontAwesome name="map" size={20} color={displayDistanceMap ? 'white' : Colors[colorScheme].pink['400']} />
                                     <Text style={[typography.medium, { color: displayDistanceMap ? 'white' : Colors[colorScheme].pink['400'] }]}>Distance Map</Text>
                                 </Pressable>
                             </View>
                             
                        </View>


                        {/**ACTION BUTTONS */}

                        <View style={[styles.contentWrapper, { marginTop: 24, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                              <Pressable style={[styles.btnStyles, { borderColor: Colors[colorScheme].pink['400'], borderWidth: 1  }]}>
                                    <Text style={[typography.medium, { color: Colors[colorScheme].pink['400']}]}>Cancel</Text>
                               </Pressable>
                              
                              
                               <Pressable 
                                    onPress={handleShareActivity} 
                                    disabled={isUploading}
                                    style={[
                                        styles.btnStyles, 
                                        { 
                                            backgroundColor: isUploading ? Colors[colorScheme].text['400'] : Colors[colorScheme].green['600'], 
                                            borderWidth: 0 
                                        }
                                    ]}
                                >
                                    <Text style={[typography.subheading, { color: 'white' }]}>
                                        {isUploading ? 'Uploading...' : 'Share Activity'}
                                    </Text>
                               </Pressable>          
                        </View>


                  </ScrollView>
            </SafeAreaView>
     )
}


const styles = StyleSheet.create({ 
     captionStyles: { 
          flexDirection: 'column', 
          gap: 8, 
          alignItems: 'flex-start', 
          justifyContent: 'center' 
     },
     btnStyles: {
           width: '100%', 
           height: 60, 
           justifyContent: 'center', 
           alignItems: 'center', 
           padding: 12, 
           borderRadius: 100, 
       },
      contentContainer: { 
          marginBottom: 100,
          gap: 16,
          height: 'auto',
      },
      contentWrapper:  { 
         flexDirection: 'column', 
         gap: 12, 
         justifyContent: 'center',
         height: 'auto',
     },
     imageGridContainer: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
     },
     addImageButton: {
          padding: 12,
          width: 100,
          height: 100,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
     },
     imageContainer: {
          position: 'relative',
          padding: 12,
          width: 100,
          height: 100,
          borderRadius: 8,
          borderWidth: 1,
          overflow: 'hidden',
     },
     image: {
          ...StyleSheet.absoluteFillObject,
          borderRadius: 4,
     },
     removeImageButton: {
          position: 'absolute',
          top: 4,
          right: 4,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          justifyContent: 'center',
          alignItems: 'center',
     },
      textfield: {
       borderColor: 'transparent', 
      borderRadius: 8, 
      padding: 12, 
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      minHeight: 270,
      width: '100%' 
    }
})