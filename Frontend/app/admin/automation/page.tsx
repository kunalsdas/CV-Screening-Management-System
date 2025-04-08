"use client";

import { useState, useEffect } from "react";
import { fetchJobListings } from "./actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const [jobListings, setJobListings] = useState<{ id: string; title: string }[]>([]);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchJobs() {
      try {
        const jobs = await fetchJobListings();
        if (isMounted) setJobListings(jobs);
      } catch (error) {
        console.error("Failed to fetch job listings:", error);
      }
    }
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAutomation = async () => {
    if (!selectedJob) {
      return alert("Please select a job first.");
    }

    setIsLoading(true);
    setShowModal(true);
    setProgressValue(10);

    try {
      const response = await fetch("https://primary-production-1e6c.up.railway.app/webhook/onestop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob.id, jobTitle: selectedJob.title }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start automation: ${response.statusText}`);
      }

      let progress = 20;
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const result = await response.json();
      setResponseData(Array.isArray(result) ? result : [result]); // Ensure responseData is an array
      setProgressValue(100);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process job automation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Job Automation</h1>
      <Card className="p-6 flex items-center gap-4 w-full max-w-md">
        <Select onValueChange={(value) => setSelectedJob(jobListings.find(job => job.id === value) || null)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Job" />
          </SelectTrigger>
          <SelectContent>
            {jobListings.map((job) => (
              <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAutomation} className="whitespace-nowrap">One-Stop Automation</Button>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-5xl p-6 rounded-lg bg-white shadow-lg overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Resume Screening Results</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Fetching results...</p>
              <Progress value={progressValue} className="h-2" />
            </div>
          ) : responseData.length > 0 ? (
            <div className="space-y-4">
              {responseData.map((data, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">

            <h3 className="text-lg font-semibold">Document {index + 1}</h3>

            <pre>{JSON.stringify(data, null, 2)}</pre>

          </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">No data received.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
