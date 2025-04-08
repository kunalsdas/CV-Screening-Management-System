"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, Bot, Sparkles } from "lucide-react";

import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Job Listings",
    href: "/admin/jobs",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    label: "Resume Management",
    href: "/admin/resumes",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "AI Bot for CV Chat",
    href: "/admin/cvbot",
    icon: <Bot className="h-4 w-4" />,
  },
  {
    label: "One-Stop Automation",
    href: "/admin/automation",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-6 w-6" />
            <span className="">HireGenius</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((navItem) => (
              <Link
                key={navItem.label}
                href={navItem.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === navItem.href ? "bg-muted text-primary" : ""
                }`}
              >
                {navItem.icon}
                {navItem.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </aside>
  );
}
