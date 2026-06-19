const express = require("express");
const router = express.Router();
const multer = require("multer");
const protect = require("../middleware/auth");
const {
  uploadNewFile,
  getUserFiles,
  downloadFile,
  replaceFile,
  removeFile,
  getSharedFile,
} = require("../controllers/fileController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.get("/", protect, getUserFiles);
router.post("/upload", protect, upload.single("file"), uploadNewFile);
router.get("/download/:id", protect, downloadFile);
router.put("/replace/:id", protect, upload.single("file"), replaceFile);
router.delete("/:id", protect, removeFile);
router.get("/share/:shareId", getSharedFile);

module.exports = router;
