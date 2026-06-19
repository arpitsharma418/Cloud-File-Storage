# MyArchive

Upload files. Share them. Replace them without breaking links.

---

## Overview

MyArchive is a personal cloud storage app. Sign in with Google, upload your files, and get a shareable link for each one. If you update a file later, the link stays the same.

---

## Features

- Google OAuth login
- Upload files up to 50MB
- View all your files on a personal dashboard
- Download files securely
- Share files via a public link
- Replace a file without changing its share link
- Delete files

---

## How File Sharing Works

Every file gets a unique ID when uploaded. The share link is built around that ID:

```
https://yourapp.com/share/abc-123-xyz
```

Anyone with this link can view and download the file without signing in.

---

## Replace Without Breaking Links

This is the key feature. If you share your resume and then update it, you normally have to send a new link. With MyArchive you do not.

When you replace a file:

1. The old file is removed from storage
2. The new file is uploaded in its place
3. The metadata is updated with the new file details
4. The share ID stays the same

The person you shared the link with will now get the updated file automatically.

---

## Authentication

Login uses Google OAuth. On first login your account is created automatically. After that, every request uses a JWT token stored in the browser.

---

## Storage

Files are stored in Supabase Storage. MongoDB only stores metadata — file name, size, type, and the share ID. The actual file never touches the database.

---

## Deployment

| Part     | Platform  |
|----------|-----------|
| Frontend | Vercel    |
| Backend  | Render    |
| Database | MongoDB Atlas |
| Storage  | Supabase  |

---

## Environment Variables

**Backend**

```
MONGO_URI=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
SUPABASE_BUCKET=
FRONTEND_URL=
```

**Frontend**

```
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```