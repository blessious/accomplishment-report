# Boac Accomplishment Hub

Build the frontend prototype for the "LGU Accomplishment Report Maker", tailored for Philippine local government units (Municipality of Boac, Province of Marinduque).

Include:

1. Authentication & Role Switcher:
   - Login (username, password, show/hide, validation) and Registration (username, password, full name, position/designation, office selector, default Noted by name & position)
   - Quick role toggle (Employee vs Administrator) and mock session switcher
2. Employee Dashboard:
   - "Create Report" primary action, list/table of saved reports (period, office, last updated, status: Draft/Finalized)
   - Search, status/month filters, duplicate, edit, mock download Word, and delete with confirmation dialog
   - Clean empty state
3. Accomplishment Report Editor (desktop split-pane editor + live document preview; responsive stacked on mobile):
   - Report title, employee info summary, reporting period selector
   - Quick presets: "1st Half: 1–15" and "2nd Half: 16–Month End", plus custom date pickers (warning when >31 days)
   - Auto-generated daily entries for every calendar date in the selected period, marking Saturdays, Sundays, and Philippine holidays (still allowing entries on those days)
   - Multiple accomplishment items per date: keyboard-friendly input (Enter to add next bullet), reorder, edit, delete
   - Status indicator (Saved / Saving / Save Failed) and unsaved changes preservation
4. Word Document Preview:
   - Official Philippine LGU styling: Republic of the Philippines, Province of Marinduque, Municipality of Boac, dynamic office header, official seals/placeholders, Accomplishment Report title, formatted period, date & descriptions table, Prepared By and Noted By signature blocks
   - "Download Word" action with realistic feedback toast and export trigger
5. Employee Profile:
   - Edit full name, position, office, default Noted By info, and change password
6. Administrator Area:
   - All Reports overview across all employees with filters and preview/download
   - Employees directory: view, search, deactivate/reactivate, issue temporary passwords
   - Offices directory: add, edit, deactivate, reactivate offices
   - Holidays management: add, edit, delete regular/special holidays with dates and names
7. Design & Polish:
   - Trustworthy, official Philippine government aesthetic (navy/deep slate, forest accents, clean typography, official document presentation, no marketing fluff or gratuitous dashboard widgets)
   - Accessible, keyboard-navigable, with rich Philippine mock data (Boac offices like MPDO, MEO, MHO, HRMO, realistic employee names and official tasks)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67ca5e95-8924-42dc-add6-90e19b18526e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
