import { Upload, X } from "lucide-react";

const UploadBox = ({
  files,
  setFiles,
  isUploading,
  onUpload,
}) => {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      return validTypes.includes(file.type);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
        <Upload size={50} className="text-blue-600 mb-3" />

        <h2 className="text-xl font-semibold">
          Upload Resume
        </h2>

        <p className="text-gray-500 mt-2">
          Drag & Drop or Click to Browse
        </p>

        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">
            Selected Files
          </h3>

          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 rounded-lg p-3 mb-2"
            >
              <span>{file.name}</span>

              <button
                onClick={() => removeFile(index)}
              >
                <X className="text-red-500" />
              </button>
            </div>
          ))}

          <button
            onClick={onUpload}
            disabled={isUploading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadBox;