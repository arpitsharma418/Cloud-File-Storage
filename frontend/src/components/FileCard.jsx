import { useState, useRef, useEffect } from "react";
import { downloadFile, deleteFile, replaceFile } from "../services/fileService";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileCard = ({ file, onDelete, onReplace }) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async () => {
    try {
      const res = await downloadFile(file._id);
      window.open(res.data.url, "_blank");
    } catch {
      alert("Download failed");
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${file.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this file?")) return;
    try {
      await deleteFile(file._id);
      onDelete(file._id);
    } catch {
      alert("Delete failed");
    }
  };

  const handleReplace = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setLoading("replace");
    try {
      const formData = new FormData();
      formData.append("file", selected);
      const res = await replaceFile(file._id, formData);
      onReplace(res.data);
    } catch {
      alert("Replace failed");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="relative bg-white shadow p-3 flex justify-between items-center hover:shadow-md cursor-pointer">
      <div>
        <p className="font-medium text-gray-800 text-sm" title={file.fileName}>
          {file.fileName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatSize(file.fileSize)} &middot;{" "}
          {file.fileType.split("/")[1] || file.fileType}
        </p>
      </div>

      <div className="relative" ref={menuRef}>
        <div
          className="p-1 rounded-full hover:bg-zinc-200 transition duration-300 cursor-pointer opacity-60 hover:opacity-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute right-6 top-8 w-44 bg-white border border-gray-200 z-20 p-2 rounded">
            <button onClick={handleDownload} className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#555"
              >
                <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm220-358Z" />
              </svg>
              Download
            </button>

            <button onClick={handleShare} className="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#555"
              >
                <path d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z" />
              </svg>
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <label className="action-btn cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#555"
              >
                <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
              </svg>
              Replace
              <input type="file" className="hidden" onChange={handleReplace} />
            </label>

            <button onClick={handleDelete} className="danger-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#FF0000"
              >
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileCard;

{
  /* 
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleDownload}
          disabled={!!loading}
          className="text-sm px-3 py-1.5 text-white rounded disabled:opacity-50"
        >
          {loading === "download" ? (
            "..."
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm220-358Z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleShare}
          className="text-sm px-3 py-1.5"
        >
          {copied ? (
            "Copied!"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#000000"
            >
              <path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z" />
            </svg>
          )}
        </button>

        <label className="text-sm px-3 py-1.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer">
          {loading === "replace" ? "Replacing..." : "Replace"}
          <input
            type="file"
            className="hidden"
            onChange={handleReplace}
            disabled={!!loading}
          />
        </label>

        <button
          onClick={handleDelete}
          disabled={!!loading}
          className="text-sm px-3 py-1.5 border border-red-200 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
        >
          {loading === "delete" ? "..." : "Delete"}
        </button>
      </div> */
}
