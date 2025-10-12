// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { supabase } from "@/utils/supabase";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";



Deno.serve(async (req) => {
  const { userid } = await req.json();

  const data = {
    message: `Hello ${userid}!`,
  }

  const user = await supabase.auth.getUser();


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
               const { data: userData, error: userDataError } = await supabase.from('userdata').select('*').eq('user_id', userid as string).single();
               if(userDataError) { 
                 console.log('userDataError', userDataError);
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
                 return { ...activity, mediaUrls: signedMediaUrls, likes, userData };
             })
          
        )
 
        const flattedData = enrichData.flat();

        return new Response(JSON.stringify(flattedData), { headers: { "Content-Type": "application/json" } });
     }
     return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetchActivitiesData' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
