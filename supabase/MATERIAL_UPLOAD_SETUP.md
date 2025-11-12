# Material Upload - Database & Storage Setup Guide

This guide walks you through setting up the database tables and storage buckets for the material upload feature.

## Prerequisites

- Supabase project created
- Supabase CLI installed (optional, for running migrations locally)
- Access to your Supabase Dashboard

## Step 1: Run the Database Migration

### Option A: Using Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/migration_0002_study_materials.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

### Option B: Using Supabase CLI

```bash
# From your project root
supabase db push
```

This will create:

- ✅ `study_materials` table with all necessary columns
- ✅ Indexes for performance optimization
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automatic `updated_at` timestamp
- ✅ Helper function for storage usage calculation

## Step 2: Create Storage Buckets

### Materials Bucket

1. Go to **Storage** in your Supabase Dashboard
2. Click **New Bucket**
3. Configure:
   - **Name**: `materials`
   - **Public**: ❌ (Keep private)
   - **File size limit**: 50 MB (50000000 bytes)
   - **Allowed MIME types**:
     ```
     application/pdf
     image/jpeg
     image/png
     text/plain
     application/vnd.openxmlformats-officedocument.wordprocessingml.document
     application/vnd.openxmlformats-officedocument.presentationml.presentation
     ```
4. Click **Create Bucket**

### Thumbnails Bucket

1. Click **New Bucket** again
2. Configure:
   - **Name**: `thumbnails`
   - **Public**: ❌ (Keep private)
   - **File size limit**: 2 MB (2000000 bytes)
   - **Allowed MIME types**:
     ```
     image/jpeg
     image/png
     ```
3. Click **Create Bucket**

## Step 3: Set Up Storage RLS Policies

### Materials Bucket Policies

Navigate to **Storage** > **Policies** > **materials** bucket and add these policies:

#### Policy 1: Users can upload to their own folder

- **Operation**: INSERT
- **Policy name**: `Users can upload to their own folder`
- **Policy definition**:
  ```sql
  (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)
  ```

#### Policy 2: Users can view their own files

- **Operation**: SELECT
- **Policy name**: `Users can view their own files`
- **Policy definition**:
  ```sql
  (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)
  ```

#### Policy 3: Users can update their own files

- **Operation**: UPDATE
- **Policy name**: `Users can update their own files`
- **Policy definition**:
  ```sql
  (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)
  ```

#### Policy 4: Users can delete their own files

- **Operation**: DELETE
- **Policy name**: `Users can delete their own files`
- **Policy definition**:
  ```sql
  (bucket_id = 'materials' AND (storage.foldername(name))[1] = auth.uid()::text)
  ```

### Thumbnails Bucket Policies

Navigate to **Storage** > **Policies** > **thumbnails** bucket and add the same 4 policies but change `bucket_id` to `'thumbnails'`:

#### Policy 1: Users can upload to their own folder

```sql
(bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)
```

#### Policy 2: Users can view their own files

```sql
(bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)
```

#### Policy 3: Users can update their own files

```sql
(bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)
```

#### Policy 4: Users can delete their own files

```sql
(bucket_id = 'thumbnails' AND (storage.foldername(name))[1] = auth.uid()::text)
```

## Step 4: Verify Setup

### Check Table

```sql
-- Should return the table structure
SELECT * FROM information_schema.columns
WHERE table_name = 'study_materials';
```

### Check RLS Policies

```sql
-- Should show all policies for study_materials
SELECT * FROM pg_policies
WHERE tablename = 'study_materials';
```

### Check Storage Buckets

```sql
-- Should show both buckets
SELECT * FROM storage.buckets
WHERE name IN ('materials', 'thumbnails');
```

### Test Storage Usage Function

```sql
-- Replace with a real user UUID from your auth.users table
SELECT get_user_storage_usage('YOUR_USER_UUID_HERE');
-- Should return 0 for a new user
```

## Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution**: The table already exists. Either drop it first or skip the migration.

### Issue: Cannot upload files to storage

**Solution**:

1. Check that RLS policies are correctly set
2. Verify the bucket is private (not public)
3. Ensure user is authenticated

### Issue: Storage policies not working

**Solution**:

1. Check that the policy definitions use `auth.uid()` not `auth.user_id()`
2. Ensure the folder structure matches: `{userId}/{subjectId}/{fileName}`

### Issue: "Function does not exist" error

**Solution**: Make sure you ran the entire migration, including the helper function section.

## Next Steps

Once setup is complete:

- ✅ Database table created
- ✅ Storage buckets created
- ✅ RLS policies configured
- ✅ Ready to implement upload services

Proceed to **Phase 3: Core Services - Storage Operations**
