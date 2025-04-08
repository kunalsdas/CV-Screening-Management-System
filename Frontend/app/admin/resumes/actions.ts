// actions.ts
"use server";

import db from "@/db/drizzle";
import { resumes, jobListings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import path from "path";

// Fetch all job listings
export async function getJobListings() {
  return await db.select().from(jobListings);
}

// Upload resume
export async function uploadResume(formData: FormData) {
  const file = formData.get("resume") as File;
  const jobId = formData.get("jobId") as string;
  if (!file || !jobId) throw new Error("Resume file and Job ID are required.");

  const filePath = path.join("public/uploads", file.name);
  const fileBuffer = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(fileBuffer));

  await db.insert(resumes).values({
    jobId,
    filePath: `/uploads/${file.name}`,
  });
}

// Placeholder function for screening resumes
export async function screenDriveCVs() {
  console.log("Screening resumes...");
}
