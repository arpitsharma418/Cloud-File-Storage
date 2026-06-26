import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedFile } from "../services/fileService";

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SharedFilePage = () => {
  const { shareId } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getSharedFile(shareId)
      .then((res) => setFile(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 font-medium">File not found</p>
          <p className="text-sm text-gray-400 mt-1">
            This link may be invalid or the file has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    const res = await fetch(file.url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <div className="border p-4 bg-white">
        <div>
          <h1 className="font-bold">File Information</h1>
          <div className="opacity-80 py-2">
            <p>Shared via skydock</p>
            <p>
              {" "}
              <span className="font-semibold">Filename:</span> {file.fileName}
            </p>
            <p>
              <span className="font-semibold">Size:</span>{" "}
              {formatSize(file.fileSize)}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="inline-block w-full px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
        >
          Download File
        </button>
      </div>
    </div>
  );
};

export default SharedFilePage;
