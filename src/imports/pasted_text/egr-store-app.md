Create a professional, modern and responsive web application called **“e-GR Store”** with the tagline **“Digital Government Resolution Repository”**.

The application is designed as an internal Government Office system for storing, organizing, searching and accessing Government Resolutions (GRs). The primary goal is to allow officers and staff to quickly find any GR without manually searching through folders or physical records.

## Design Direction

Create a clean, professional government-office dashboard. Avoid flashy startup-style gradients and unnecessary animations.

Use:

* Clean white/light background
* Navy blue and professional blue accents
* Subtle borders and shadows
* Modern typography
* Government-office inspired layout
* Excellent readability
* Responsive design for desktop, tablet and mobile
* Sidebar navigation on desktop
* Collapsible sidebar on smaller screens

The interface should feel like a real production-ready government application, not a student project.

## Application Layout

### 1. Login Page

Create a professional login screen:

Logo/Icon:
“e-GR Store”

Subtitle:
“Digital Government Resolution Repository”

Fields:

* Username
* Password

Buttons:

* Login

Include a small footer:
“Authorized Government Office System”

For the demo, use mock authentication.

---

### 2. Main Dashboard

After login, show the main dashboard.

Sidebar:

* Dashboard
* GR Repository
* Search GR
* Add New GR
* Import Excel
* Important GRs
* Departments
* Reports
* Settings

Bottom of sidebar:

* Logged-in user
* Admin
* Logout

Dashboard header:

“Good Morning, Admin”

Subtitle:
“Government Resolution Management Dashboard”

Statistics cards:

1. Total GRs
   2,458

2. Current Year GRs
   326

3. Departments
   18

4. Important GRs
   74

Add small icons and clean visual indicators.

---

### 3. Global GR Search

Create a prominent search section:

“Search Government Resolutions”

Search input placeholder:

“Search by GR number, subject, department or keyword…”

Filters:

* Department
* Category
* From Date
* To Date
* Year

Button:
“Search”

Example search results:

GR/REV/2026/125
Revenue Department
10 August 2026
Subject: Land Acquisition and Compensation

Actions:

* View
* Download

Another example:

GR/UDD/2026/087
Urban Development Department
04 August 2026
Subject: Urban Development Guidelines

Actions:

* View
* Download

---

### 4. GR Repository

Create a professional table.

Columns:

* GR Number
* Date
* Department
* Subject
* Category
* Status
* Actions

Example records:

GR/REV/2026/125
10 Aug 2026
Revenue
Land Acquisition
Revenue
Active

GR/UDD/2026/087
04 Aug 2026
Urban Development
Development Guidelines
UDD
Active

GR/FIN/2026/045
01 Aug 2026
Finance
Budget Guidelines
Finance
Active

Actions:

* View
* Edit
* Download

Add:

* Pagination
* Search
* Filters

---

### 5. GR Details Page

When the user opens a GR, show:

GR Number:
GR/REV/2026/125

GR Date:
10 August 2026

Department:
Revenue Department

Category:
Revenue

Subject:
Land Acquisition and Compensation

Keywords:
Land, Acquisition, Compensation, Revenue

Description:
Detailed information about the Government Resolution.

Buttons:

[ View PDF ]

[ Download PDF ]

[ Add to Important ]

On the right side, create a PDF preview area using a realistic document placeholder for the demo.

---

### 6. Add New GR

Create a professional form.

Fields:

GR Number *
GR Date *
Department *
Category *
Subject *
Keywords
Description
Upload GR PDF *

Buttons:

[Save GR]
[Cancel]

Show validation messages for required fields.

---

### 7. Excel Import Feature

This is one of the most important demo features.

Page title:

“Import GR Records from Excel”

Description:

“Upload an Excel file to import multiple Government Resolution records at once.”

Create a drag-and-drop upload area:

“Drag & Drop Excel file here”

or

[ Choose Excel File ]

Supported formats:
.xlsx, .xls

Add button:

[ Download Excel Template ]

After selecting a file, show a realistic preview table:

Total Records: 250

Valid Records: 247

Duplicate Records: 3

Preview columns:

GR Number
GR Date
Department
Subject
Category
Keywords

Show validation status.

Example:

✅ 247 Valid Records

⚠️ 3 Duplicate Records

Buttons:

[ Import Valid Records ]

[ Cancel ]

After import, show a success notification:

“247 GR records imported successfully.”

This can use mock data for the demo.

---

### 8. Important GRs

Create a page where users can save frequently used GRs.

Display cards/table:

GR Number
Department
Subject
Date

Actions:

* Open
* Remove from Important

---

### 9. Departments

Create department cards:

Revenue Department
Urban Development Department
Finance Department
General Administration
Rural Development
Public Works Department
Education Department
Health Department

Each card should show:

* Department name
* Number of GRs
* View GRs button

---

### 10. Reports

Create a simple analytics dashboard.

Charts:

* GRs by Department
* GRs by Year
* GRs by Category
* Monthly GR additions

Use realistic mock data.

Add:
“Export Report” button.

---

### 11. Settings

Include:

Profile
Change Password
Application Preferences
Language: English / Marathi
Theme preference

---

## Important Demo Data

Use realistic fictional/sample GR data. Clearly treat all sample data as demo data.

Do NOT use real confidential government documents.

Create at least 15 sample GR records across different departments so that search and filtering look realistic.

## Search Behavior

Make the search interface functional using mock frontend data.

Search should work with:

* GR Number
* Subject
* Department
* Category
* Keywords

Filters should also work.

## Excel Import Behavior

For the demo, implement a functional frontend Excel parser if possible.

When an Excel file is uploaded:

1. Read the spreadsheet
2. Convert rows to records
3. Validate required fields
4. Detect duplicate GR numbers
5. Display preview
6. Show valid/duplicate counts
7. Allow confirmation
8. Add valid records to the frontend repository

Use a suitable Excel parsing library such as SheetJS/xlsx.

## Technology

Use:

React.js
TypeScript
Tailwind CSS
Modern component architecture
Lucide icons
Recharts for charts
SheetJS/xlsx for Excel import

Use reusable components and clean folder structure.

For this demo, backend/database integration is not required yet. Use mock/local data and localStorage where appropriate.

## UX Requirements

* Fast navigation
* Clean spacing
* Accessible buttons
* Clear empty states
* Toast notifications
* Loading states
* Confirmation dialogs for delete/import
* Responsive design
* Professional hover states
* No excessive animations

## Branding

Application name:

e-GR Store

Tagline:

“Digital Government Resolution Repository”

Footer:

“e-GR Store • Government Resolution Management System”
“Demo Version”

Create a polished, realistic, production-style interface suitable for presenting to a Collector Office officer as a software concept/demo.

The final result should look like a serious internal government information-management system rather than a generic admin dashboard.
