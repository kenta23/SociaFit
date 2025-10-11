import { supabase } from "./supabase";


export const getAuthUser = async () => await supabase.auth.getUser();

export const getUserData = async (userid: string) => { 

    const { data: userData, error } = await supabase.from('userdata').select('*').eq('user_id', userid as string).single();
    if (error) { 
        console.log('error', error);
    }


    const { data: following, error: followingError } = await supabase.from('following').select('*').eq('user_id', userid as string)
    if (followingError) { 
        console.log('followingError', followingError);
    }

    const { data: likes, error: likesError } = await supabase.from('likes').select('*').eq('user_id', userid as string);
    if (likesError) { 
        console.log('totalLikesError', likesError);
    }

    const { data: activities, error: activitiesError } = await supabase.from('activities').select('*').eq('user_id', userid as string);
    if (activitiesError) { 
        console.log('totalActivitiesError', activitiesError);
    }


    return { userData, following, likes, activities };
   
}
