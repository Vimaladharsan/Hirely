import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, X } from "lucide-react";

function UploadResume() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFiles = (selectedFiles) => {
    const validFiles = [];

    selectedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file.`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = validateFiles(selectedFiles);

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    console.log(files);

    // Backend integration will go here later

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6 py-10">
      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Upload Resumes
        </h1>

        <p className="text-slate-400 mb-8">
          Upload candidate resumes for AI-powered screening.
        </p>

        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-green-500 bg-slate-800"
              : "border-blue-500 hover:bg-slate-800"
          }`}
        >
          <Upload className="w-16 h-16 text-blue-500 mb-4" />

          <h2 className="text-2xl font-semibold">
            Drag & Drop Resume Here
          </h2>

          <p className="text-slate-400 mt-3">
            or click to browse files
          </p>

          <p className="text-sm text-slate-500 mt-2">
            Supports PDF, DOC and DOCX (Max 5 MB)
          </p>

          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-8">

            <h3 className="text-xl font-semibold mb-4">
              Selected Files
            </h3>

            <div className="space-y-3">

              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-800 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">

                    <FileText className="text-blue-500" />

                    <div>
                      <p>{file.name}</p>

                      <p className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => removeFile(index)}
                    className="hover:text-red-500 transition"
                  >
                    <X />
                  </button>

                </div>
              ))}

            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={files.length === 0}
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          Analyze Resumes
        </button>

      </div>
    </div>
  );
}

export default UploadResume;