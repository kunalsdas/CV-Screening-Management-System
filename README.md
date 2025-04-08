# AI-Powered Resume Screening System

## Problem Statement

In the hiring process, HR teams often face the challenge of screening a large number of resumes (CVs). This process is time-consuming and can lead to human bias or errors. Our goal is to build an **AI-powered tool** that automates resume shortlisting by analyzing skills, experience, and job relevance, making the screening process faster and more accurate.

## Solution Overview

We built an **AI Resume Screening System** that automates the resume screening process in multiple ways:
- **Individual Resume Screening**: Analyzing one resume at a time.
- **Multi-file Screening**: Analyzing multiple resumes at once.

Our solution tackles the problem of CV screening by integrating **n8n** for workflow automation, **Next.js** for web application development, **Google Drive** for storing resumes in **PDF format**, and **PostgreSQL** for storing and managing data, which is hosted on the **Neon platform**. 

We used **Drizzle ORM** to interact between **Next.js** and the **PostgreSQL database** in the backend.

### Key Features

1. **Automated Resume Screening**
   - Resumes are stored in **Google Drive** as PDFs.
   - We built a workflow in **n8n** that can loop through all the PDFs and extract relevant details such as name, skills, experience, and contact information.
   
2. **Interaction with Resumes**
   - HR teams can interact with resumes stored in **Google Drive**.
   - I developed a separate **n8n workflow** that triggers in the **Next.js web app**.
   - The workflow sends data to the web app and allows HR teams to receive and process relevant data interactively.

3. **Job Postings Integration**
   - HR can create **job postings** and use a dropdown to select the specific job for which the resumes are being screened.
   - We built a **CRUD (Create, Read, Update, Delete)** system for job posts where HR can manage job listings.
   - A one-stop **automation button** performs the screening of resumes against the selected job posting and displays the results in a **modal popup**.

4. **Matching Resumes with Job Posts**
   - Resumes are compared with specific job posts to ensure they are relevant.
   - We perform both **individual resume matching** and **multi-resume matching** with job postings.

5. **Intuitive Dashboard**
   - Our system includes a **dashboard** that provides **insights** and **detailed analytics** to help HR teams make informed decisions.

### Workflow Overview

1. **n8n Workflow:**
   - Our n8n workflow integrates Google Drive, processes resumes in PDF format, extracts data (like name, skills, and experience), and makes it available for HR teams.
   - The workflow is triggered via **webhooks** in the **Next.js web app**, which sends data to n8n for processing and returns results back to the web app.

2. **Database Integration:**
   - We use **PostgreSQL** hosted on the **Neon platform** to store data related to job postings and resumes.
   - The **Next.js** web app interacts with the PostgreSQL database using **Drizzle ORM** for querying and managing data.

3. **Resume Data Structure**  
   The following fields are extracted from each resume:

   - **is_qualified**
   - **full_name**
   - **email**
   - **phone_number**
   - **linkedin**
   - **location**
     - **city**
     - **country**
   - **personal_summary**
   - **total_experience_years**
   - **shortest_job_duration**
   - **longest_job_duration**
   - **employment_gap**
     - **exists**
     - **duration**
   - **job_switch_frequency**
   - **career_progression**
   - **current_job_time**
   - **current_company**
   - **last_job_title**
   - **last_company**
   - **education**
     - **level**
     - **university**
   - **key_skills**
   - **certifications**
   - **projects**
     - **title**
     - **description**
   - **ATC_Score**
   - **Match_Score**
   - **relevance_summary**
     - **positive**
     - **negative**

   - **Match Score** is calculated based on the relevance of the resume to the job posting.
   - **ATC Score** gives a rating of the candidate's qualifications and suitability for the role.

### Technologies Used

- **n8n**: For automating workflows and integrating various tools (Google Drive, PDF parsing, etc.).
- **Next.js**: For building the web app, where HR teams can interact with the system.
- **Google Drive**: For storing resumes in PDF format.
- **PostgreSQL (Neon Platform)**: For managing job posts, resume data, and other related information.
- **Drizzle ORM**: For interacting with the PostgreSQL database from the **Next.js** web app.
- **Webhook Integration**: For sending and receiving data between the web app and the n8n workflow.
- **PDF Parsing**: For extracting relevant information from resumes stored in PDF format.

### How It Works

1. **Resume Upload**: Candidates apply for jobs via a form and submit their resumes in PDF format.
2. **Resume Screening**: HR teams use the **Next.js web app** to select job postings and trigger resume screening.
3. **Automated Processing**: The n8n workflow processes resumes from Google Drive, extracts relevant data, compares it with the selected job posting, and returns the results.
4. **Results Display**: The match score and qualification details are displayed in a modal, giving HR teams a quick overview of the candidate's suitability for the role.

### Conclusion

Our **AI-Powered Resume Screening System** revolutionizes the traditional resume screening process. By automating the extraction and comparison of resume data with job postings, we enable HR teams to save time, reduce bias, and make better hiring decisions. The intuitive dashboard, database integration, and workflow automations make it easy for HR teams to interact with the system and gain valuable insights.
