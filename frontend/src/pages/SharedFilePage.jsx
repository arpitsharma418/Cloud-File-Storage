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

        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="flex border justify-center items-center text-sm gap-2 py-2 bg-blue-600 text-white focus:ring-4 ring-blue-200 rounded focus:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffff"
          >
            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q17-72 85-137t145-65q33 0 56.5 23.5T520-716v242l64-62 56 56-160 160-160-160 56-56 64 62v-242q-76 14-118 73.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-48-22-89.5T600-680v-93q74 35 117 103.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm220-358Z" />
          </svg>
          <h1>Download File</h1>
        </a>
      </div>
    </div>
  );
};

export default SharedFilePage;
