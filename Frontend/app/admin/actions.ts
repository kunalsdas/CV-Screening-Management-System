"use server";

import db from "@/db/drizzle";
import { resumes } from "@/db/schema";
import { eq, gt, count, sql, desc } from "drizzle-orm";

// Get general metrics for the dashboard
export async function getDashboardMetrics() {
  const totalResumes = await db.select({ count: count() }).from(resumes).then(res => res[0]?.count || 0);

  const qualifiedResumes = await db
    .select({ count: count() })
    .from(resumes)
    .where(eq(resumes.isQualified, "true"))
    .then(res => res[0]?.count || 0);

  const resumesToday = await db
    .select({ count: count() })
    .from(resumes)
    .where(eq(sql`DATE(${resumes.createdAt})`, sql`CURRENT_DATE`))
    .then(res => res[0]?.count || 0);

  const employmentGaps = await db
    .select({ count: count() })
    .from(resumes)
    .where(eq(resumes.employmentGap, "yes")) // Fixed condition
    .then(res => res[0]?.count || 0);

  // Get top 10 skills by occurrence
  const skillsData = await db
    .select({ skills: resumes.skills })
    .from(resumes);

  // Flatten and count skills
  const skillCounts: Record<string, number> = {};
  skillsData.forEach(({ skills }) => {
    skills.forEach((skill: string) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill);

    const highMatchResumes = await db
    .select({
      fullName: resumes.fullName,
      jobTitle: resumes.jobTitle,
      matchScore: resumes.matchScore,
    })
    .from(resumes)
    .where(gt(resumes.matchScore, 75))
    .orderBy(desc(resumes.matchScore))
    .limit(10);

    
  return {
    totalResumes,
    qualifiedResumes,
    resumesToday,
    employmentGaps,
    topSkills,
    highMatchResumes
  };
}
