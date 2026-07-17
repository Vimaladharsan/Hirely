import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobDescription() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  const handleContinue = () => {
    if (!jobTitle || !company || !description) {
      alert("Please fill in all fields.");
      return;
    }

    // Later we'll send this to the backend
    console.log({
      jobTitle,
      company,
      description,
    });

    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center px-6">

      <div className="w-full max-w-4xl bg-slate-900 rounded-2xl p-8 shadow-xl">

        <h1 className="text-4xl font-bold text-white mb-8">
          Create Job
        </h1>

        <div className="space-y-6">

          <div>
            <label className="text-gray-300 block mb-2">
              Job Title
            </label>

            <input
              type="text"
              placeholder="Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Company
            </label>

            <input
              type="text"
              placeholder="Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Job Description
            </label>

            <textarea
              rows="10"
              placeholder="Paste the complete Job Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition"
          >
            Continue →
          </button>

        </div>

      </div>

    </div>
  );
}

export default JobDescription;