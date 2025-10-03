# Image Upload Troubleshooting Guide

## Issues Fixed

### 1. **Incorrect Blob Handling**
**Problem:** You were trying to upload `imageUri` directly instead of converting it to a blob.

**Solution:** 
```typescript
// ❌ Wrong
.upload(fullPath, imageUri, { contentType })

// ✅ Correct
const response = await fetch(imageUri);
const blob = await response.blob();
.upload(fullPath, blob, { contentType })
```

### 2. **Wrong Bucket Usage**
**Problem:** You were checking for a user-specific bucket but uploading to 'media' bucket.

**Solution:** Use a consistent bucket name ('media') and organize files by user ID in folders.

### 3. **Missing Images Field**
**Problem:** You removed the `images` field from the database insert.

**Solution:** Added back the images field to store the uploaded image URLs.

### 4. **RLS Policy Structure**
**Problem:** Your RLS policy expects the first folder to be the user ID.

**Solution:** Upload files with path structure: `{userId}/{filename}`

## Setup Steps

### 1. Run the SQL Policies
Execute the SQL commands in `docs/SUPABASE_STORAGE_POLICIES.sql` in your Supabase SQL Editor.

### 2. Verify Bucket Creation
Check that the 'media' bucket exists in your Supabase Storage dashboard.

### 3. Test Upload
Use the `ImageUploadTest` component to verify uploads work.

## Common Issues & Solutions

### Issue: "Bucket not found"
**Solution:** The bucket will be created automatically, but you can also create it manually in Supabase dashboard.

### Issue: "Permission denied"
**Solution:** Make sure you've run the RLS policies SQL and the user is authenticated.

### Issue: "File too large"
**Solution:** The bucket has a 50MB limit. Reduce image quality or implement client-side compression.

### Issue: "Invalid file type"
**Solution:** The bucket only allows image types. Make sure you're uploading valid image files.

### Issue: "RLS policy violation"
**Solution:** Ensure the file path starts with the user ID: `{userId}/filename.jpg`

## Testing Your Setup

### 1. Use the Test Component
```typescript
import ImageUploadTest from '@/components/ImageUploadTest';

// Add this to any screen for testing
<ImageUploadTest />
```

### 2. Check Console Logs
Look for these logs in your console:
- "Creating bucket: media" (if bucket doesn't exist)
- "Upload result: {success: true, publicUrl: '...'}"
- Any error messages

### 3. Verify in Supabase Dashboard
1. Go to Storage → media bucket
2. Check if files are uploaded with correct folder structure
3. Verify the file paths start with user ID

## File Path Structure

Your files will be stored as:
```
media/
├── {user-id-1}/
│   ├── 1234567890_abc123.jpg
│   └── 1234567891_def456.png
└── {user-id-2}/
    ├── 1234567892_ghi789.jpg
    └── 1234567893_jkl012.png
```

## RLS Policy Explanation

The RLS policy works as follows:
```sql
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

This means:
- Only files in the 'media' bucket
- The first folder in the path must match the authenticated user's ID
- Users can only upload to their own folder

## Debugging Steps

1. **Check Authentication**
   ```typescript
   const user = await supabase.auth.getUser();
   console.log('User:', user.data.user?.id);
   ```

2. **Check Bucket Exists**
   ```typescript
   const { data, error } = await supabase.storage.getBucket('media');
   console.log('Bucket:', data, error);
   ```

3. **Check Upload Result**
   ```typescript
   const result = await uploadImageToSupabase(...);
   console.log('Upload result:', result);
   ```

4. **Check File Path**
   ```typescript
   // Make sure the path is: {userId}/filename.jpg
   const fullPath = `${userId}/${uniqueFileName}`;
   console.log('Full path:', fullPath);
   ```

## Performance Tips

1. **Compress Images Before Upload**
   ```typescript
   const result = await ImagePicker.launchImageLibraryAsync({
     quality: 0.7, // Reduce quality for smaller files
     allowsEditing: true,
   });
   ```

2. **Upload in Background**
   ```typescript
   // Use React Native's background task for large uploads
   import { AppState } from 'react-native';
   ```

3. **Show Progress**
   ```typescript
   const [uploadProgress, setUploadProgress] = useState(0);
   // Implement progress tracking
   ```

## Security Considerations

1. **File Type Validation**: Only allow image types
2. **File Size Limits**: 50MB limit per file
3. **User Isolation**: Users can only access their own files
4. **Public Access**: Media bucket is public for viewing

## Next Steps

1. Test the upload functionality
2. Implement image compression if needed
3. Add progress indicators for better UX
4. Consider implementing image resizing
5. Add error recovery mechanisms
