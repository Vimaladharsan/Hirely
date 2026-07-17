import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ScreeningProvider } from "./context/ScreeningContext";

import Landing from "./pages/Landing";
import JobDescription from "./pages/JobDescription";
import UploadResume from "./pages/UploadResume";
import Dashboard from "./pages/Dashboard";
import CandidateDetails from "./pages/CandidateDetails";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ScreeningProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/job" element={<JobDescription />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/candidate/:id" element={<CandidateDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ScreeningProvider>
  );
}

export default App;
