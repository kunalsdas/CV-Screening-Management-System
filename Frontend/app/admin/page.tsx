"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHead, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table";
import { getDashboardMetrics } from "./actions";

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const metricsData = await getDashboardMetrics();
        setMetrics(metricsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const chartData = metrics
    ? [
        { name: "Total Resumes", value: metrics.totalResumes },
        { name: "Qualified", value: metrics.qualifiedResumes },
        { name: "Employment Gaps", value: metrics.employmentGaps },
      ]
    : [];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-sm font-semibold text-gray-600">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Total Resumes", value: metrics?.totalResumes },
            { title: "Qualified Resumes", value: metrics?.qualifiedResumes },
            { title: "Resumes Today", value: metrics?.resumesToday },
            { title: "Employment Gaps", value: metrics?.employmentGaps },
          ].map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-10 w-full" /> : (
                  <p className="text-2xl font-bold">{item.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resume Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <BarChart width={500} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {metrics?.topSkills?.slice(0, 10).map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Top Matching Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Match Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics?.highMatchResumes?.length > 0 ? (
                    metrics.highMatchResumes.map((resume: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{resume.fullName}</TableCell>
                        <TableCell>{resume.jobTitle}</TableCell>
                        <TableCell className="font-bold">{resume.matchScore}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No matches found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
