import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X } from "lucide-react";

function UploadResume() {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    // Later we'll send files to FastAPI
    console.log(files);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6">
      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-4xl font-bold mb-8">
          Upload Resumes
        </h1>

        <label className="border-2 border-dashed border-blue-500 rounded-xl p-10 flex flex-col items-center cursor-pointer hover:bg-slate-800 transition">

          <Upload className="w-14 h-14 text-blue-500 mb-4" />

          <p className="text-lg">
            Drag & Drop or Click to Upload
          </p>

          <p className="text-gray-400 mt-2">
            Supports PDF and DOCX
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <div className="mt-8 space-y-3">

          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-slate-800 rounded-lg p-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-500" />
                <span>{file.name}</span>
              </div>

              <button onClick={() => removeFile(index)}>
                <X className="text-red-500" />
              </button>
            </div>
          ))}

        </div>

        <button
          onClick={handleUpload}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-semibold transition"
        >
          Analyze Resumes
        </button>

      </div>
    </div>
  );
}

export default UploadResume;