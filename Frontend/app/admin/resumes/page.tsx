"use client";

import { useState, useEffect } from "react";
import { getJobListings } from "./actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function ResumeManagement() {
  const [jobListings, setJobListings] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      const jobs = await getJobListings();
      setJobListings(jobs);
    }
    fetchJobs();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setResume(file);
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !selectedJob) {
      return alert("Please select a job and upload a resume.");
    }

    setIsLoading(true);
    setShowModal(true);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobId", selectedJob.id);
    formData.append("jobTitle", selectedJob.title);

    try {
      const response = await fetch("https://primary-production-1e6c.up.railway.app/webhook/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      setResponseData(result);
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload and analyze resume.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Resume Management</h1>

      <div className="grid grid-cols-2 gap-6">

        {/* CV Screening Box */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">CV Screening</h2>
          <p className="text-sm text-gray-500">Select a job listing and upload your resume for screening.</p>
          <div className="mt-4 space-y-4">
            <Select
              onValueChange={(value) => {
                const selected = jobListings.find((job) => job.id === value);
                setSelectedJob(selected ? { id: selected.id, title: selected.title } : null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Job" />
              </SelectTrigger>
              <SelectContent>
                {jobListings.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="text-sm font-medium">Upload Resume (PDF)</label>
            <div className="border-2 border-dashed p-6 rounded-lg flex flex-col items-center">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="resumeInput"
                onChange={handleFileChange}
              />
              <Upload size={24} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Drag & Drop or Click to Upload</p>
              <Button className="mt-2" onClick={() => document.getElementById("resumeInput")?.click()}>
                Browse
              </Button>
            </div>

            {resume && <p className="text-sm text-gray-700 mt-2">Selected File: {resume.name}</p>}

            <Button onClick={handleResumeUpload} className="w-full mt-2">
              Analyze
            </Button>
          </div>
        </Card>

        {/* Steps Card */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Steps to Follow</h2>
          <ol className="list-decimal list-inside text-sm text-gray-700 mt-4 space-y-2">
            <li>Select a job from the dropdown.</li>
            <li>Upload your resume in PDF format.</li>
            <li>Click the "Analyze" button to process your resume.</li>
            <li>View the analysis report in the popup.</li>
          </ol>
        </Card>



      </div>

      {/* Modal Popup */}
     {/* Modal Popup */}
<Dialog open={showModal} onOpenChange={setShowModal}>
  <DialogContent className="max-w-3xl p-6 rounded-lg bg-white shadow-lg overflow-y-auto max-h-[80vh]">
    <DialogHeader>
      <DialogTitle>Resume Screening Result</DialogTitle>
    </DialogHeader>

    {isLoading ? (
      <div className="space-y-4">
        <p className="text-sm text-gray-500">Analyzing your resume...</p>
        <Progress value={60} className="h-2" />
      </div>
    ) : responseData ? (
      <div className="space-y-4">
     
       {/* General Details Section */}
       <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-blue-800">General Details</h3>
          <p><strong>Full Name:</strong> {responseData?.[0]?.output?.full_name || "N/A"}</p>
          <p><strong>Email:</strong> {responseData?.[0]?.output?.email || "N/A"}</p>
          <p><strong>Phone Number:</strong> {responseData?.[0]?.output?.phone_number || "N/A"}</p>
          <p><strong>Location:</strong> {responseData?.[0]?.output?.location?.city || "N/A"}, {responseData?.[0]?.output?.location?.country || "N/A"}</p>
          <p><strong>LinkedIn:</strong> <a href={responseData?.[0]?.output?.linkedin || "#"} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{responseData?.[0]?.output?.linkedin ? "Profile Link" : "N/A"}</a></p>
        </div>

        {/* Experience Details Section */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800">Experience Details</h3>
          <p><strong>Total Experience (Years):</strong> {responseData?.[0]?.output?.total_experience_years || "N/A"}</p>
          <p><strong>Shortest Job Duration:</strong> {responseData?.[0]?.output?.shortest_job_duration || "N/A"}</p>
          <p><strong>Longest Job Duration:</strong> {responseData?.[0]?.output?.longest_job_duration || "N/A"}</p>
          <p><strong>Employment Gap:</strong> {responseData?.[0]?.output?.employment_gap?.exists === "yes" ? responseData?.[0]?.output?.employment_gap?.duration : "No gap"}</p>
          <p><strong>Job Switch Frequency:</strong> {responseData?.[0]?.output?.job_switch_frequency || "N/A"}</p>
        </div>

        {/* Career Progression Section */}
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-purple-800">Career Progression</h3>
          <p><strong>Current Job Duration:</strong> {responseData?.[0]?.output?.current_job_time || "N/A"}</p>
          <p><strong>Current Company:</strong> {responseData?.[0]?.output?.current_company || "N/A"}</p>
          <p><strong>Last Job Title:</strong> {responseData?.[0]?.output?.last_job_title || "N/A"}</p>
          <p><strong>Last Company:</strong> {responseData?.[0]?.output?.last_company || "N/A"}</p>
        </div>

        {/* Education Section */}
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-800">Education</h3>
          <p><strong>Degree:</strong> {responseData?.[0]?.output?.education?.level || "N/A"}</p>
          <p><strong>University:</strong> {responseData?.[0]?.output?.education?.university || "N/A"}</p>
        </div>

        {/* Skills Section */}
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-green-800">Key Skills</h3>
          <p>{responseData?.[0]?.output?.key_skills?.length ? responseData?.[0]?.output?.key_skills?.join(", ") : "N/A"}</p>
        </div>

        {/* Certifications Section */}
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-orange-800">Certifications</h3>
          <p>{responseData?.[0]?.output?.certifications?.length ? responseData?.[0]?.output?.certifications?.join(", ") : "No certifications listed."}</p>
        </div>

        {/* Scoring Section */}
        <div className="bg-indigo-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-indigo-800">Scoring</h3>
          <p><strong>ATC Score:</strong> {responseData?.[0]?.output?.ATC_Score || "N/A"}</p>
          <p><strong>Match Score:</strong> {responseData?.[0]?.output?.Match_Score || "N/A"}</p>
        </div>

        {/* Relevance Summary Section */}
        <div className="bg-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800">Relevance Summary</h3>
          <p className="text-green-600"><strong>Positive:</strong> {responseData?.[0]?.output?.relevance_summary?.positive || "No positive insights found."}</p>
          <p className="text-red-600"><strong>Negative:</strong> {responseData?.[0]?.output?.relevance_summary?.negative || "No negative insights found."}</p>
        </div>
     
           </div>
    ) : (
      <p className="text-sm text-red-500">Failed to fetch screening results.</p>
    )}
  </DialogContent>
</Dialog>

    </div>
  );
}