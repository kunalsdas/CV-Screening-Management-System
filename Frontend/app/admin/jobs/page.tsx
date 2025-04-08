"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getJobListings, createJobListing, updateJobListing, deleteJobListing } from "./actions";
import { jobCategories } from "@/data/jobCategories";
import { employmentTypes } from "@/data/employmentTypes";

type Job = {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceLevel: string;
  minExperience: number;
  maxExperience?: number;
  educationLevel: string;
  certifications?: string[];
  location: string;
  employmentType: string;
  salaryRange?: string[];
  createdAt: string;
};

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<Job>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const data = await getJobListings();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  async function handleSave() {
    try {
      if (editingJob.id) {
        await updateJobListing(editingJob);
      } else {
        await createJobListing(editingJob);
      }
      setIsModalOpen(false);
      setEditingJob({});
      fetchJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteJobListing(id);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  }

  return (
    <div className="m-10 flex flex-col gap-5">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Job Listings</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingJob({})}>Post Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-6">
            <DialogHeader>
              <DialogTitle>{editingJob.id ? "Edit Job" : "Post a Job"}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Job Title" value={editingJob.title || ""} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} />
              <Select value={editingJob.category} onValueChange={(value) => setEditingJob({ ...editingJob, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Location" value={editingJob.location || ""} onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })} />
              <Input placeholder="Required Skills (comma separated)" value={editingJob.requiredSkills?.join(", ") || ""} onChange={(e) => setEditingJob({ ...editingJob, requiredSkills: e.target.value.split(", ") })} />
              <Input placeholder="Education Level" value={editingJob.educationLevel || ""} onChange={(e) => setEditingJob({ ...editingJob, educationLevel: e.target.value })} />
              <Input placeholder="Preferred Skills (comma separated)" value={editingJob.preferredSkills?.join(", ") || ""} onChange={(e) => setEditingJob({ ...editingJob, preferredSkills: e.target.value.split(", ") })} />
              <Input placeholder="Certifications (comma separated)" value={editingJob.certifications?.join(", ") || ""} onChange={(e) => setEditingJob({ ...editingJob, certifications: e.target.value.split(", ") })} />
              <Input type="number" placeholder="Min Experience" value={editingJob.minExperience || ""} onChange={(e) => setEditingJob({ ...editingJob, minExperience: Number(e.target.value) })} />
              <Input type="number" placeholder="Max Experience (Optional)" value={editingJob.maxExperience || ""} onChange={(e) => setEditingJob({ ...editingJob, maxExperience: Number(e.target.value) })} />
              <Select value={editingJob.employmentType} onValueChange={(value) => setEditingJob({ ...editingJob, employmentType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  {employmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Salary Range (comma separated)" value={editingJob.salaryRange?.join(", ") || ""} onChange={(e) => setEditingJob({ ...editingJob, salaryRange: e.target.value.split(", ") })} />
            </div>
            <textarea className="mt-4 w-full h-32 p-2 border rounded-md" placeholder="Job Description" value={editingJob.description || ""} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}></textarea>
            <Button className="mt-4 w-full" onClick={handleSave}>{editingJob.id ? "Update" : "Create"}</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Employment Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <TableRow key={job.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.category}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>{job.employmentType}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditingJob(job); setIsModalOpen(true); }}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(job.id)}>
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">No jobs found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
