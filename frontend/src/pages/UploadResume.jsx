import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, FileText, X, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { useScreening } from "../context/useScreening";
import { analyzeResumes } from "../api/api";
import Stepper from "../components/Stepper";

function UploadResume() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { job, setJob, setCandidates } = useScreening();

  useEffect(() => {
    if (!job) {
      navigate("/job");
    }
  }, [job, navigate]);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFiles = (selectedFiles) => {
    const validFiles = [];

    selectedFiles.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file. Only PDF and DOCX are supported.`);
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

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please upload at least one resume.");
      return;
    }

    if (!job) {
      navigate("/job");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const response = await analyzeResumes({
        jobTitle: job.title,
        company: job.company,
        jobDescription: job.description,
        files,
      });

      setJob({ ...job, jobId: response.data.job_id });
      setCandidates(response.data.candidates);

      navigate("/dashboard");
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Something went wrong while analyzing resumes.";

      setError(detail);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-ink-900)] px-6 py-10 text-[var(--color-cloud)]">
      <div className="aurora opacity-60" />

      <div className="relative mx-auto max-w-3xl">
        <Link
          to="/job"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-haze)] transition-colors hover:text-[var(--color-cloud)]"
        >
          <ArrowLeft size={16} />
          Back to role
        </Link>

        <Stepper current={1} />

        <div className="surface animate-rise p-8 sm:p-10">
          <div className="mb-8">
            <p className="eyebrow">Step 2</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Upload candidate resumes
            </h1>
            <p className="mt-2 text-[var(--color-mist)]">
              Screening against{" "}
              <span className="font-semibold text-[var(--color-cloud)]">
                {job?.title}
              </span>
              {job?.company ? ` at ${job.company}` : ""}.
            </p>
          </div>

          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-[var(--color-iris-400)] bg-[var(--color-iris-500)]/10"
                : "border-[var(--color-hair-strong)] hover:border-[var(--color-iris-500)] hover:bg-[var(--color-ink-800)]"
            }`}
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[var(--color-iris-500)]/15">
              <Upload className="h-7 w-7 text-[var(--color-iris-400)]" />
            </span>

            <h2 className="mt-5 text-xl font-semibold">
              Drag &amp; drop resumes here
            </h2>
            <p className="mt-1.5 text-[var(--color-mist)]">
              or click to browse your files
            </p>
            <p className="mt-3 text-xs text-[var(--color-haze)]">
              PDF and DOCX · up to 5 MB each · multiple at once
            </p>

            <input
              type="file"
              multiple
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">
                {files.length} file{files.length > 1 ? "s" : ""} ready
              </p>

              <div className="space-y-2.5">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="surface-flat flex items-center justify-between rounded-xl p-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-iris-500)]/12">
                        <FileText size={16} className="text-[var(--color-iris-400)]" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {file.name}
                        </p>
                        <p className="readout text-xs text-[var(--color-haze)]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFile(index)}
                      className="grid h-8 w-8 place-items-center rounded-lg text-[var(--color-haze)] transition-colors hover:bg-[var(--color-weak)]/15 hover:text-[var(--color-weak)]"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-xl border border-[var(--color-weak)]/40 bg-[var(--color-weak)]/10 px-4 py-3 text-sm text-[var(--color-weak)]">
              {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="btn-primary mt-8 w-full py-4 text-base"
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Analyzing resumes…
              </>
            ) : (
              <>
                Analyze Resumes
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadResume;
