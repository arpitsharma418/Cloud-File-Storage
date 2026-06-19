import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import FileCard from "../components/FileCard";
import { fetchFiles, uploadFile } from "../services/fileService";

const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [download, setDownloading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles()
      .then((res) => setFiles(res.data))
      .catch(() => alert("Could not load files"))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    setDownloading(true);
    const selected = e.target.files[0];
    if (!selected) return;
    try {
      const formData = new FormData();
      formData.append("file", selected);
      const res = await uploadFile(formData);
      setFiles((prev) => [res.data, ...prev]);
    } catch {
      alert("Upload failed");
    } finally {
      e.target.value = "";
      setDownloading(false);
    }
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f._id !== id));
  };

  const handleReplace = (updatedFile) => {
    setFiles((prev) =>
      prev.map((f) => (f._id === updatedFile._id ? updatedFile : f)),
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="sm:flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">My Files</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and preview your uploaded files.
            </p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-[#3946fe] text-white flex items-center gap-1 px-4 py-2 text-sm rounded hover:bg-[#1722b7] transition w-full sm:w-fit justify-center mt-5 sm:mt-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
            </svg>
            <h1>{download ? "Uploading" : "Upload File"}</h1>
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading files...</p>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
              fill="#000000"
            >
              <path d="M160-160q-33 0-56.5-23.5T80-240v-400q0-33 23.5-56.5T160-720h240l80-80h320q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm73-280h207v-207L233-440Zm-73-40 160-160H160v160Zm0 120v120h640v-480H520v280q0 33-23.5 56.5T440-360H160Zm280-160Z" />
            </svg>
            <p className="mt-4 text-sm text-black font-medium">
              No files yet. Upload your first file.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onDelete={handleDelete}
                onReplace={handleReplace}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
