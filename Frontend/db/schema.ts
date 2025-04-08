import { date, pgTable, text, uuid, integer, jsonb } from "drizzle-orm/pg-core";


// Job Listings Table
export const jobListings = pgTable("job_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Replacing categoryId with a dropdown text field
  requiredSkills: jsonb("required_skills").notNull(),
  preferredSkills: jsonb("preferred_skills"),
  minExperience: integer("min_experience").notNull(),
  maxExperience: integer("max_experience"),
  educationLevel: text("education_level").notNull(),
  certifications: jsonb("certifications"),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(),
  salaryRange: jsonb("salary_range"),
  createdAt: date("created_at").notNull().defaultNow(),
});

// Resume Table (For AI Screening)
export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  isQualified: text("is_qualified"),
  fullName: text("full_name"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  linkedin: text("linkedin"),
  location: jsonb("location"), // Stores city and country
  totalExperienceYears: text("total_experience_years"),
  shortestJobDuration: text("shortest_job_duration"),
  longestJobDuration: text("longest_job_duration"),
  employmentGap: jsonb("employment_gap"), // Stores { exists: "yes/no", duration: "N/A" }
  jobSwitchFrequency: text("job_switch_frequency"),
  careerProgression: text("career_progression"),
  currentJobTitle: text("current_job_title"),
  currentCompany: text("current_company"),
  lastJobTitle: text("last_job_title"),
  lastCompany: text("last_company"),
  education: jsonb("education"), // Stores { level: "Master's", university: "IIT Bombay" }
  skills: jsonb("skills"), // Extracted skills from the resume
  atcScore: text("atc_score"), // AI ATC Score
  matchScore: integer("match_score"), // AI Match Score
  jobTitle: text("job_title"), 
  createdAt: date("created_at").notNull().defaultNow(),
  
});

 
export type JobListing = typeof jobListings.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
