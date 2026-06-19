const supabase = require("../config/supabase");

const BUCKET = process.env.SUPABASE_BUCKET;

const uploadFile = async (storagePath, fileBuffer, mimeType) => {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) throw new Error(error.message);
};

const deleteFile = async (storagePath) => {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);

  if (error) throw new Error(error.message);
};

const getSignedUrl = async (storagePath) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60);

  if (error) throw new Error(error.message);
  return data.signedUrl;
};

const getPublicUrl = (storagePath) => {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
};

module.exports = { uploadFile, deleteFile, getSignedUrl, getPublicUrl };
