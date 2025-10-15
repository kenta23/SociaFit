import { Colors } from '@/constants/Colors';
import { typography } from '@/constants/typography';
import { Database } from '@/database.types';
import { getAuthUser } from '@/utils/auth';
import { getFeedActivities, getUserActivities } from '@/utils/data';
import { supabase } from '@/utils/supabase';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Snackbar from 'react-native-snackbar';
import DisplayMapContent from './display_map_content';
import DisplayStepsCountContent from './display_steps_count_content';


export default function ActivityContent ({ userid }: { userid: string }) { 
   const colorScheme = useColorScheme() ?? 'light';
   const [isLiked, setIsLiked] = useState(false);
   const [allActivities, setAllActivities] = useState<Database['public']['Tables']['activities']['Row'][]>([]);
   const [mediaUrls, setMediaUrls] = useState<string[]>([]);
   const [likes, setLikes] = useState<Database['public']['Tables']['likes']['Row'][]>([]);
   const pathname = usePathname();



   console.log('userid from activities', userid);


 const getData = async () => { 

    const data = pathname === '/feeds' ? await getFeedActivities(userid) : pathname === '/profile' ? await getUserActivities(userid) : null;
  
    console.log('pathname', pathname);

    if(data) { 
      //pick only activity data
        setAllActivities(data);

        setMediaUrls(data.map(act => act.mediaUrls as unknown as string[]).flat());
        console.log('DATA', data);
        setLikes(data.map((activity) => activity.likes as unknown as Database['public']['Tables']['likes']['Row'][]).flat());

        console.log('data', data);
    }
  }

   useEffect(() => { 
    
        getData();
 
   }, [])


//    console.log('MEDIA URLS', mediaUrls);
//    console.log('likes', likes);
//    console.log('allActivities', allActivities);



   const handleLike = async (post_id: number) => { 
      setIsLiked(!isLiked);
      const user = await getAuthUser();
      
      if (isLiked) { 
         const { data, error } = await supabase
           .from('likes')
           .delete()
           .match({ activity: post_id, user_id: user.data.user?.id as string })
           .select('*');
         if (error) { 
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
         }
         else { 
            Snackbar.show({ 
                text: 'unliked',
                duration: Snackbar.LENGTH_SHORT,
                action: { 
                    text: 'Close',
                    onPress: () => { 
                        Snackbar.dismiss();
                    }
                }
            });

            getData();
         }
      }
      else { 
         const { data, error } = await supabase.from('likes').insert({ activity: post_id, user_id: user.data.user?.id as string }).select('*');
         if(error) { 
            Snackbar.show({ 
                text: 'Something went wrong',
                duration: Snackbar.LENGTH_SHORT,
                action: { 
                    text: 'Close',
                    onPress: () => { 
                        Snackbar.dismiss();
                    }
                }
            });
         }
         else { 
            Snackbar.show({ 
                text: 'Liked',
                duration: Snackbar.LENGTH_SHORT,
                action: { 
                    text: 'Close',
                    onPress: () => { 
                        Snackbar.dismiss();
                    }
                }
            });

            getData();
         }
      }
   }

 return (
    <View style={{ gap: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>            
   
    {/**Activity 1 */}
      {allActivities?.map((activity) => ( 
          <View key={activity.post_id} style={[styles.activity, { backgroundColor: Colors[colorScheme].frameBackground, shadowColor: '#DBDADA', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }]}>
           <View style={{ paddingHorizontal: 10, alignSelf: 'flex-start' }}>     
            
              <View style={styles.activityHeader}>   
                <View style={styles.user}>
                   <Image style={styles.userImage} contentFit="cover" source={require('@/assets/images/no-user.png')} />
                  
                  <View>
                      <Text style={typography.medium}>Unknown User</Text>
                      {/**DATE POSTED */}
                      <Text style={typography.small}>{new Date(activity.created_at).toLocaleDateString()}</Text>
                  </View> 
               </View>
 
 
               <View style={styles.activityOption}>
                   <Ionicons name='ellipsis-vertical' size={24} color='#3591DD' />
               </View>
            </View>
          </View>
 
 
 
          <View style={styles.activityContent}>
               <Text style={typography.description}>{activity.content}</Text>
                {/**ACTIVITY MEDIA */}
                    <View style={styles.activityContentImageContainer}>
                       {/**MAP CONTENT */}
                         <View style={{ flexDirection: 'row', gap: 10, height: 'auto' }}>
                            {activity.distance_travelled && <DisplayMapContent coordinates={activity.distance_travelled as { latitude: number; longitude: number }[]} />}
                            {activity.steps_total && <DisplayStepsCountContent steps={activity.steps_total || 0} />      }            
                         </View>


                       {/** DISPLAY PHOTOS*/}
                          <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'nowrap' }}>
                            {mediaUrls ? mediaUrls.map((mediaUrl) => (
                              <Image style={styles.activityContentImage} contentFit="cover" source={{ uri: mediaUrl }} />
                            )) : <Image  style={styles.activityContentImage} contentFit="cover" source={require('@/assets/images/activityimage.jpg')} />}
                         </View> 
                    </View>
 
 
                    {/** NUMBER OF REACTIONS */}
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 18 }}> 
                       <Entypo name="heart" size={16} color={Colors[colorScheme].green['600']} />
                       <Text style={typography.medium}>{likes?.length} likes</Text>
                 </View>
 
 
                 {/**Reaction button */}
                 <Pressable onPress={() => handleLike(activity.id)} style={[styles.reactionBtn, { borderColor: Colors[colorScheme].text['200'] }]}> 
                       <Entypo name={isLiked || likes.some((like) => like.activity === activity.id) ? "heart" : "heart-outlined"} size={16} color={Colors[colorScheme].green['600']} />
                       <Text style={[typography.medium, { color: Colors[colorScheme].green['600'] }]}>{isLiked || likes.some((like) => like.activity === activity.id) ? "Unlike" : "Like"}</Text>
                 </Pressable>
 
          </View>
       </View>
     ))} 
  </View>
 )
    
}


const styles = StyleSheet.create({
    reactionBtn: {
         borderTopWidth: 0.5,
         padding: 5,
         flexDirection: 'row',
         width: '100%',
         alignItems: 'center',
         justifyContent: 'center',
         gap: 5,
         marginTop: 10,
    },
    activityContentImageContainer: { 
        flexDirection: 'column',
        gap: 10,
        borderRadius: 12,
        height: 'auto',
        marginTop: 10,
        width: '100%',
    },
    activityContentImage: { 
        width: '100%',
        maxWidth: 155,
        minWidth: 110,
        height: 150,
        borderRadius: 8,
       
    },
    activityContent: { 
        paddingHorizontal: 16,
        paddingVertical: 8,


    },
    activityOption: { 
        padding: 8,
    },
    userImage: { 
        width: 30,
        height: 30,
        borderRadius: 100,
    },
    user: { 
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userName: { 
        fontSize: 12,
        fontFamily: "Inter_500Medium",
        fontWeight: "500",
    },
    date: { 
        fontSize: 9,
        fontWeight: "400",
        fontFamily: "Inter_400Regular",
    },
    activityHeader: { 
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',  
    }, 
    activity: { 
        borderRadius: 24,
        height: 'auto',
        width: '100%',
        marginHorizontal: 'auto',
        paddingBottom: 10,
        borderWidth: 1,
        borderColor: '#7B7B7B',
    },

   
  
})