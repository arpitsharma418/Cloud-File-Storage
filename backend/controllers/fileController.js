const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");
const {
  uploadFile,
  deleteFile,
  getSignedUrl,
  getPublicUrl,
} = require("../services/supabaseStorage");

const uploadNewFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const shareId = uuidv4();
    const ext = req.file.originalname.split(".").pop();
    const storagePath = `${req.user.id}/${shareId}.${ext}`;

    await uploadFile(storagePath, req.file.buffer, req.file.mimetype);

    const file = await File.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      storagePath,
      shareId,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Upload failed" });
  }
};

const getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch files" });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    const signedUrl = await getSignedUrl(file.storagePath);
    res.json({ url: signedUrl });
  } catch (error) {
    res.status(500).json({ message: "Download failed" });
  }
};

const replaceFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    await deleteFile(file.storagePath);

    const ext = req.file.originalname.split(".").pop();
    const newStoragePath = `${req.user.id}/${file.shareId}.${ext}`;

    await uploadFile(newStoragePath, req.file.buffer, req.file.mimetype);

    file.fileName = req.file.originalname;
    file.fileType = req.file.mimetype;
    file.fileSize = req.file.size;
    file.storagePath = newStoragePath;
    file.updatedAt = new Date();
    await file.save();

    res.json(file);
  } catch (error) {
    console.error("Replace error:", error.message);
    res.status(500).json({ message: "Replace failed" });
  }
};

const removeFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!file) return res.status(404).json({ message: "File not found" });

    await deleteFile(file.storagePath);
    await File.deleteOne({ _id: file._id });

    res.json({ message: "File deleted" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Delete failed" });
  }
};

const getSharedFile = async (req, res) => {
  try {
    const file = await File.findOne({ shareId: req.params.shareId });

    if (!file) return res.status(404).json({ message: "File not found" });

    const publicUrl = getPublicUrl(file.storagePath);

    res.json({
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      url: publicUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load shared file" });
  }
};

module.exports = {
  uploadNewFile,
  getUserFiles,
  downloadFile,
  replaceFile,
  removeFile,
  getSharedFile,
};
