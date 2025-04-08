"use server";

import db from "@/db/drizzle";
import { jobListings } from "@/db/schema";

// Fetch job listings from the database
export async function fetchJobListings() {
  try {
    const jobs = await db.select().from(jobListings);
    return jobs.map(job => ({ id: String(job.id), title: job.title })); // Ensure id is a string for React Select
  } catch (error) {
    console.error("Error fetching job listings:", error);
    return [];
  }
}
