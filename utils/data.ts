import { getAuthUser } from "./auth";
import { supabase } from "./supabase";



export const getUserFollowingsData = async () => { 

    const user = await getAuthUser();

    console.log('user', user);

    const { data, error } = await supabase.from('following').select('*').eq('user_id', user.data.user?.id as string);


    if(error) { 
        console.log('error', error);
    }

    console.log('data from following', data);

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

                return { ...activity, mediaUrls, likes: likesData };
              })
            );

            return enriched;
          })
        );

        // flatten and return a single activities array
        return byFollowing.flat();

    }
    return [];
}