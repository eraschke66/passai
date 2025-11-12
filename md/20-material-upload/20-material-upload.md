# Phase 3: Material Upload & Management

## 🎯 What We're Building

A file upload system that allows students to add their study materials to subjects. The system extracts text from PDFs and images (using OCR), stores the files securely, and makes the content available for quiz generation. This is the content foundation - without materials, we can't generate quizzes.

## 👤 User Experience

### Uploading Materials

1. Student is on the Upload page
2. If they have no materials, be prompted to start uploading
3. Clicks "Upload Material" button
4. Will need to select a subject first so that material will be uploaded for that subject
5. Sees file picker or drag-and-drop zone
6. Can select multiple files at once (PDFs, images, text files)
7. In the "staging" area, they can see all the materials they have picked, ready for upload.
8. Can add more materials by draging or dropping or clicking to open file system
9. Can remove any material by clicking on an X on material card
10. Material added or removed from list in the staging area
11. Click on upload button to start uploading
12. Uploading will include pushing the material to Supabase storage, and extracting it's text to store in database
13. Sees upload progress for each file
14. Files are processed:

- PDFs: Text extracted automatically
- Images: OCR runs to extract text
- Text files: Content read directly

15. After processing, materials appear in the subject's material list
16. Can immediately generate quizzes from the content

### Viewing Materials

- Materials list shows:
  - File name
  - File type (PDF, Image, Text)
  - Upload date
  - File size
  - Thumbnail/preview icon
  - Processing status (Processing, Ready, Failed)
  - Actions: View, Download, Delete
- Click on a material to see:
  - Full extracted text
  - Original file preview (for PDFs)
  - Metadata (upload date, size, type)
  - Option to regenerate extraction if failed
- In materials listing, have option to show in card style or list style, like we have on subjects.

### Managing Materials

- **Delete material:** Confirmation, then removes from subject
- **Download original:** Get the original uploaded file
- **View extracted text:** See what text was extracted for quiz generation
- **Re-process:** If extraction failed, try again
- **Search materials:** Find specific materials by name

### Error Handling

- **File too large:** "File exceeds 10MB limit. Please compress or split the file."
- **Unsupported type:** "Only PDF, JPG, PNG, TXT, DOCX and PPTX files are supported."
- **OCR failed:** "Could not extract text from image. Try a clearer photo or scan."
- **PDF extraction failed:** "Could not read PDF. It may be encrypted or corrupted."
- **Storage limit reached:** "You've reached your storage limit (500MB). Delete some materials or upgrade to Premium." (We will implement and enforce premium features later when we add payment)

## 📋 Requirements

### Supported File Types

- ✅ **PDFs** (.pdf) - Extract text from documents
- ✅ **Images** (.jpg, .jpeg, .png) - OCR to extract text from photos/scans
- ✅ **Text files** (.txt) - Direct content read
- ✅ **Word documents** (.docs) - Direct content read
- ✅ **Slides** (.pptx) - Direct content read

### File Size Limits

- ✅ **Free tier:** 10MB per file, 500MB total storage
- ✅ **Premium tier:** 50MB per file, 5GB total storage
- ✅ Show storage usage: "Using 245MB of 500MB"
  (Again, we will implement and enforce storage and upload limits based on subscription when we add payment. For now, everyone has a limit of 50MB in a single upload, meaning all uploads can't exceed 50MB in a single upload. 5MB limit for images, and 10MB limit for documents (PDFs))

### Upload Features

- ✅ **Drag and drop** interface
- ✅ **Click to browse** traditional file picker
- ✅ **Multiple files** at once (up to 10)
- ✅ **Progress indicator** for each file
- ✅ **Cancel upload** while in progress
- ✅ **Pause/resume** for large files (nice to have, will be added later)

### Text Extraction

- ✅ **PDF extraction:** Use PDF parsing library to get text
- ✅ **Image OCR:** Use Tesseract.js for now
- ✅ **Text cleaning:** Remove extra whitespace, fix formatting

### Storage

- ✅ **Secure storage:** Files stored in Supabase Storage
- ✅ **Private buckets:** Users can only access their own files
- ✅ **Thumbnails:** Generate thumbnails for PDFs/images
- ✅ **Metadata:** Store file name, size, type, upload date

### Material Properties

Each material has:

- ✅ **ID** (unique identifier)
- ✅ **Subject ID** (which subject it belongs to)
- ✅ **User ID** (who uploaded it)
- ✅ **File name** (original name)
- ✅ **File type** (pdf, image, text)
- ✅ **File size** (in bytes)
- ✅ **Storage path** (where file is stored)
- ✅ **Thumbnail URL** (preview image)
- ✅ **Extracted text** (content for quiz generation)
- ✅ **Processing status** (pending, processing, ready, failed)
- ✅ **Upload date** (timestamp)
- ✅ **Error message** (if processing failed)

### Validation

- ✅ **File type check** before upload
- ✅ **File size check** before upload
- ✅ **Storage limit check** before upload
- ✅ **Content validation** - Ensure extracted text is useful (min 50 characters)

## 🔄 User Flow

### First Material Upload

```
Upload page (empty materials)
    ↓
Click "Upload Material"
    ↓
Drag PDF file into drop zone
    ↓
File validates → Upload starts
    ↓
Progress bar: "Uploading... 45%"
    ↓
Upload complete → "Processing PDF..."
    ↓
Text extraction runs
    ↓
Success → "Material added! You can now generate quizzes."
    ↓
Material appears in list with "Ready" status
```

### Multiple Files Upload

```
Subject Detail Page
    ↓
Click "Upload Material"
    ↓
Select 3 files (2 PDFs, 1 image)
    ↓
All 3 start uploading in parallel
    ↓
Show progress for each file
    ↓
Files process one by one
    ↓
All complete → "3 materials added!"
```

### Failed Upload Recovery

```
Upload fails (network error)
    ↓
Show "Upload failed. Retry?"
    ↓
Click "Retry"
    ↓
Resume from where it failed
    ↓
Success
```

### OCR Failure Handling

```
Upload image with poor quality
    ↓
OCR runs but extracts gibberish
    ↓
Show "Could not extract text clearly"
    ↓
Options:
  - Upload a clearer image
  - Manually type the text
  - Skip this material
```

## 🎨 UI/UX Considerations

### Upload Interface

- **Large drop zone** - Easy to drag files onto
- **Clear instructions** - "Drag PDFs or images here, or click to browse"
- **Visual feedback** - Highlight drop zone when dragging over
- **Multiple file support** - Show all files being uploaded
- **Progress indicators** - Per-file progress bars
- **Preview thumbnails** - Show thumbnail while uploading

### Materials List

- **Grid or list view** - Toggle between views
- **Thumbnails** - Show file type icon or actual preview
- **Status badges:**
  - 🟢 "Ready" (green)
  - 🟡 "Processing" (yellow, animated)
  - 🔴 "Failed" (red, with retry button)
- **Quick actions** - View, Download, Delete on hover
- **Bulk actions** - Select multiple, delete all selected

### Material Detail View

- **Two-column layout:**
  - Left: Original file preview (PDF viewer or image)
  - Right: Extracted text (scrollable)
- **Edit extracted text** - Allow manual corrections
- **Re-extract button** - Try extraction again if failed
- **Download original** - Get the uploaded file

### Storage Usage Display

- **Progress bar** - Visual representation of storage used
- **Numbers** - "245 MB of 500 MB used"
- **Warning** - Turn red when >90% full
- **Upgrade prompt** - When limit reached

### Loading States

- **Skeleton loaders** for materials list
- **Spinner** during upload
- **Progress bar** with percentage
- **Success animation** when upload completes

## 🔗 Integration Points

### Database (study_materials table)

```
study_materials:
- id (UUID, primary key)
- subject_id (UUID, foreign key to subjects)
- user_id (UUID, foreign key to auth.users)
- file_name (text)
- file_type (text: pdf, image, text)
- file_size (bigint, bytes)
- storage_path (text, path in Supabase Storage)
- thumbnail_url (text, nullable)
- text_content (text, extracted content)
- processing_status (text: pending, processing, ready, failed)
- error_message (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

If we are gonna need more tabls or fields to store some other data, let me know.

### Supabase Storage

- **Bucket:** `materials` (private)
- **Folder structure:** `{user_id}/{subject_id}/{file_name}`
- **RLS policies:** Users can only access their own files
- **Thumbnail bucket:** `thumbnails` (private)

### Text Extraction Services

- **PDF:** Use `pdfjs-dist` library
- **DOCX:** Use `pizzip` library
- **PPTX:** Use `mammoth` library
- **OCR:** Use Tesseract.js
- **Text files:** Direct read, no processing needed

### Subject Integration

- Update subject's progress when materials added
- Count materials for progress calculation
- Enable quiz generation when enough content available

## ⚙️ Technical Considerations

### Upload Strategy (For later in app development)

- **Chunked uploads** for large files (>5MB)
- **Parallel uploads** for multiple files (max 3 at a time)
- **Resume support** - Save progress, resume if interrupted
- **Background processing** - OCR doesn't block UI

### Performance

- **Lazy loading** - Load materials on demand
- **Thumbnail generation** - Create small previews for fast loading
- **Text indexing** - For quick search through content
- **Pagination** - If subject has >50 materials

### Error Recovery

- **Retry logic** - Auto-retry failed uploads (max 3 times)
- **Queue system** - Process uploads sequentially if many at once
- **Failed job cleanup** - Delete files if processing fails

### Storage Optimization

- **Compression** - Compress images before storage (Not absolutely needed for now. But if it's not that hard, we can just do it)
- **Deduplication** - Check if identical file already uploaded
- **Cleanup** - Delete orphaned files if material deleted

When done with the Upload page, we should also add integration to the subject detail page. We have a small section in the subject detail where we should display a dialed version of the materials details in the subject. We should work on this after finishing with the upload page.

## ✅ Acceptance Criteria

The material upload system is complete when:

1. **Upload Works:**

   - ✅ Can drag and drop files
   - ✅ Can click to browse and select files
   - ✅ Can upload multiple files at once
   - ✅ Progress shown for each file
   - ✅ Files upload to Supabase Storage

2. **Text Extraction Works:**

   - ✅ PDFs: Text extracted correctly
   - ✅ DOCX: Text extracted correctly
   - ✅ PPTX: Text extracted correctly
   - ✅ Images: OCR extracts readable text
   - ✅ Text files: Content read directly
   - ✅ Extraction runs automatically after upload

3. **Materials Display Works:**

   - ✅ All materials shown in upload page
   - ✅ Status badge shows processing state
   - ✅ Thumbnails/icons displayed
   - ✅ Can view extracted text
   - ✅ Can download original file

4. **Delete Works:**

   - ✅ Confirmation shown before delete
   - ✅ File removed from storage
   - ✅ Database record deleted
   - ✅ UI updates immediately

5. **Error Handling Works:**

   - ✅ File size limit enforced
   - ✅ File type validation works
   - ✅ Storage limit checked
   - ✅ Failed uploads show clear errors
   - ✅ Can retry failed uploads

6. **Storage Management Works:**

   - ✅ Storage usage displayed
   - ✅ Free tier limit enforced (500MB)
   - ✅ Premium tier limit enforced (5GB)
   - ✅ Warning when nearing limit

7. **Performance:**

   - ✅ Upload doesn't block UI
   - ✅ Multiple uploads handled smoothly
   - ✅ Large files don't crash browser
   - ✅ Materials list loads quickly

8. **Mobile Support:**
   - ✅ Can upload from mobile device
   - ✅ Camera upload works (take photo → upload)
   - ✅ UI responsive on small screens

## 📚 Current Implementation (Reference)

## 🚧 Prerequisites

**Required:**

- ✅ Authentication system (Phase 1) - Done
- ✅ Subject management (Phase 2) - Done
- ✅ Supabase Storage bucket and tables set up - We will need to do this

---

**Once material upload works, students can add their content, and we can generate quizzes from that content in the next phase.**
