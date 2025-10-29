import { getAuthUser } from "./auth";
import { supabase } from "./supabase";



export const getUserAvatar = async (): Promise<string | null> => { 
    const user = await getAuthUser();

    const { data: avatarData, error: avatarError } = await supabase.storage.from('avatar').list(user.data.user?.id as string);

    if(avatarError) { 
      console.log('avatarError', avatarError);
    }

    if(avatarData) { 
   
      const folderPath = `${user.data.user?.id}/${avatarData[0].name}`;
       const { data: signed, error: signedError } = await supabase.storage.from('avatar').createSignedUrl(folderPath, 60 * 60);

       if(signedError) { 
        console.log('signedError', signedError);
       }

       return signed?.signedUrl as string;
    }

    return null;
}

export const getFeedActivities = async (userid: string) => {  

  console.log('userid from feeds', userid);
 //for followed users
 const user = await getAuthUser();
 const { data, error } = await supabase.from('following').select('*').eq('user_id', userid ?? (user.data.user?.id as string));

 if(error) { 
     console.log('error', error);
 }
 console.log('data from following', data);
 //for followed users 
 if(data) { 
     // collect activities for each followed user and enrich with signed media URLs
     const byFollowing = await Promise.all(
       
       data.map(async (following) => {
         //get activities for each followed user
         const { data: followingActivitiesData, error: followingActivitiesError } = await supabase
           .from('activities')
           .select('*')
           .eq('user_id', following.user_followed as string);

         if (followingActivitiesError) {
           console.log('followingActivitiesError', followingActivitiesError);
         }

         const enriched = await Promise.all(
           (followingActivitiesData ?? []).map(async (activity) => {
             const folder = String(activity.post_id ?? '');

             //get likes for each activity
             const { data: likesData, error: likesError } = await supabase
             .from('likes')
             .select('*', { count: 'exact' })
             .eq('activity', activity.id as number);

             //get userdata 
             const { data: userdata, error: userdataError } = await supabase.from('userdata').select('*').eq('user_id', following.user_followed as string).single();
          
             if (userdataError) {
               console.log('userdataError', userdataError);
             }


             console.log('userdata', userdata);

             if (!folder) {
               return { ...activity, mediaUrls: [] as string[], likes: likesData };
             }
             

             const { data: mediaFiles, error: mediaError } = await supabase.storage
               .from('media')
               .list(folder);

             if (mediaError) {
               console.log('mediaError', mediaError);
             }

             const paths = (mediaFiles ?? []).map((f) => `${folder}/${f.name}`);

             let mediaUrls: string[] = [];
             
             if (paths.length > 0) {
               const { data: signed, error: signedErr } = await supabase.storage
                 .from('media')
                 .createSignedUrls(paths, 60 * 60);
               if (signedErr) {
                 console.log('signedErr', signedErr);
               }
               mediaUrls = (signed ?? []).map((s) => s.signedUrl);
             }

             return { ...activity, mediaUrls, likes: likesData, userdata };
           })
         );

         return enriched;
       })
     );

     // flatten and return a single activities array
     return byFollowing.flat();

 }
}

//feed data for user data or followed users
export const getUserActivities = async (userid: string) => { 

    const user = await getAuthUser() ;

    console.log('user', user);
    console.log('userid', userid);
    console.log('user.data.user?.id', user.data.user?.id);

    //for your account data
   if (userid === user.data.user?.id) { 
       const { data: activities, error: activitiesError } = await supabase.from('activities').select('*').eq('user_id', userid as string);
       const { data: mediaUrls, error: mediaUrlsError } = await supabase.storage.from('media').list(userid as string);
   
   
       if(mediaUrlsError) { 
        console.log('mediaUrlsError', mediaUrlsError);
       }

       if(activitiesError) { 
        console.log('activitiesError', activitiesError);
       }

       const enrichData = await Promise.all(
          (activities || []).map(async (activity) => { 

              //get likes 
              const { data: likes, error: likesError } = await supabase.from('likes').select('*').eq('activity', activity.id as number);
       
              if(likesError) { 
                console.log('likesError', likesError);
              }

              //get userdata
              const { data: userdata, error: userdataError } = await supabase.from('userdata').select('*').eq('user_id', userid as string).single();
              if(userdataError) { 
                console.log('userdataError', userdataError);
              }

                //get media urls on each activity
                const folder = String(activity.post_id ?? '');
                const paths = (mediaUrls ?? []).map((f) => `${folder}/${f.name}`);
                let signedMediaUrls: string[] = [];


                if (paths.length > 0) {
                    const { data: signed, error: signedErr } = await supabase.storage
                        .from('media')
                        .createSignedUrls(paths, 60 * 60);
                    if(signedErr) { 
                        console.log('signedErr', signedErr);
                    }
                    signedMediaUrls = (signed ?? []).map((s) => s.signedUrl);
                }


               
                return { ...activity, mediaUrls: signedMediaUrls, likes, userdata };
            })
         
       )

       return enrichData.flat();
    }
    return [];
}


export const getUserDetails = async (userid?: string) => { 
   const user = userid ?? (await getAuthUser()).data.user?.id as string;

   console.log('user from userdetails', user);

   const { data: followers, error: followersError } = await supabase.from('following').select('*').eq('user_followed', user as string);

   if (followersError) { 
    console.log('followersError', followersError);
   }


   console.log('FOLLOWERS COUNT', followers?.length);


   const { data: activities, error: activitiesError } = await supabase.from('activities').select('*').eq('user_id', user as string);

   const { data: userData, error: userDataError } = await supabase.from('userdata').select('*').eq('user_id', user as string).single();
   
   const { data: authUser, error: authUserError } = await getAuthUser();
  

   const totalLikes = await supabase.from('likes').select('activity, activities!inner(user_id)', { count: 'exact', head: true }).eq('activities.user_id', user as string);

  //  console.log('activities error', activitiesError);
  //  console.log('userData error', userDataError);
  //  console.log('authUser error', authUserError);
  //  console.log('followers error', followersError); 

   console.log('TOTAL LIKEES', totalLikes);



   


    //  const countActivityLikes = await Promise.all((activities ?? []).map(async (activity) => { 
    //     const { count: totalActivityLikes, error: totalActivityLikesError } = await supabase
    //       .from('likes')
    //       .select('*')
    //       .eq('activity', activity.id as number);

    //     if(totalActivityLikesError) { 
    //       console.log('totalActivityLikesError', totalActivityLikesError);
    //       return 0;
    //     }

    //     console.log('totalActivityLikes', totalActivityLikes);
        
    //     return totalActivityLikes;
    //   })
    // )

    console.log('countActivityLikes', activities?.length);

    return { followers, totalLikes: totalLikes.count, countActivities: activities?.length, userData, name: userData?.full_name, email: authUser.user?.email };

   
}