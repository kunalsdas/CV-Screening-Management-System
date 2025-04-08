"use server";

import db from "@/db/drizzle";
import { jobListings } from "@/db/schema";
import { eq } from "drizzle-orm";

// Fetch all job listings
export async function getJobListings() {
  return await db.select().from(jobListings);
}

// Create a new job listing
export async function createJobListing(job: Partial<typeof jobListings.$inferInsert>) {
  await db.insert(jobListings).values(job);
}

// Update an existing job listing
export async function updateJobListing(job: Partial<typeof jobListings.$inferInsert>) {
  if (!job.id) throw new Error("Job ID is required for updating.");
  await db.update(jobListings).set(job).where(eq(jobListings.id, job.id));
}

// Delete a job listing
export async function deleteJobListing(id: string) {
  await db.delete(jobListings).where(eq(jobListings.id, id));
}