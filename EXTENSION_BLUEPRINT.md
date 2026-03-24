COURSEWEB EXTENSION: SYSTEM ARCHITECTURE & REQUIREMENTS
1. Project Overview & Strict Constraints
We are building a Google Chrome Extension to extract, bundle, and download academic files from a Moodle-based Learning Management System (CourseWeb).

Framework: Strictly Vanilla HTML, CSS, and JavaScript.

Manifest Version: Manifest V3.

Build Tools: NONE. Do not use React, Webpack, Node.js, or NPM. All code must run natively in the browser.

External Libraries: The only allowed external library is jszip (must be included as a local .js file, not via CDN, to comply with Manifest V3 security policies).

2. Core Feature Requirements
A. Targeted DOM Scraping (The Content Script)
The extension must inject a script into the active CourseWeb tab to find downloadable resources.

Targeting Rules: CourseWeb uses specific class names. The script must ONLY target <a> tags nested inside containers with the class .modtype_resource or .modtype_folder.

Exclusion Rules: Strictly ignore any links inside .modtype_url (video links), .modtype_forum, or generic navigation links.

Data Extraction: For every valid resource, extract the href (the direct file URL) and the innerText (the name of the file). Sanitize the filename to remove illegal characters before creating the ZIP.

B. Dynamic Module Identification
The extension must know which module page the user is currently viewing.

Logic: Scrape the <title> tag or the primary <h1> tag of the page.

Formatting: Extract the module code. (e.g., If the title is "Course: IT3010 - Network Design and Management", extract just "IT3010"). This will be used to name the final ZIP file (e.g., IT3010_UniFlow_Sync.zip).

C. State Management & Diffing (The "Already Synced" Feature)
The user should not accidentally download the same file twice.

Logic: Use chrome.storage.local to maintain a persistent array of URLs that have been successfully zipped and downloaded in the past.

UI Feedback: When the popup opens and displays the checklist of scraped files, compare the scraped URLs against the local storage array. If a URL already exists in storage, render its HTML checkbox as checked, disabled, and visually greyed out.

D. The Fetch & ZIP Pipeline
When the user clicks the "Sync to UniFlow" button in the popup:

Iterate through only the checked and enabled items in the UI list.

Use the native fetch() API to request each file URL. (Rely on the browser's active session cookies to bypass the LMS authentication—do not implement custom auth headers).

Convert the fetch responses to Blob objects.

Add each Blob to a new JSZip instance, using the sanitized file names extracted earlier.

Generate the final .zip file asynchronously.

E. The Download Trigger
Use the chrome.downloads.download API to save the generated ZIP file to the user's local machine.

Update chrome.storage.local with the URLs of the newly downloaded files so they are greyed out next time.

3. Required File Structure
Generate the extension using exactly this file structure:

manifest.json (Must include permissions: activeTab, storage, downloads, scripting, and host permissions for *://courseweb.sliit.lk/*).

popup.html (The UI checklist interface).

popup.css (Clean, modern styling. Use Zinc/slate colors to match the UniFlow web app).

popup.js (Handles UI logic, checkbox state, triggering the content script, and the JSZip pipeline).

content.js (The scraper that reads the DOM and passes the data array back to the popup).

jszip.min.js (Placeholder file for the JSZip library).

icons/ (Folder for 16x16, 48x48, 128x128 png icons).

4. Execution Order
Do not attempt to write the entire application in one response. Follow this strict execution order:

Generate the manifest.json and popup.html / popup.css skeleton.

Generate the content.js DOM scraping logic.

Generate the popup.js logic (handling messages, state management, and the JSZip integration).


---------------------------------------------------------------


🚨 ARCHITECTURE UPDATE: TAILWIND & FLOATING WIDGET UI
Ignore the previous instruction to build a popup.html. We are building an In-Page Floating Widget using Tailwind CSS.

1. The UI Injection (Shadow DOM)

Do not use the browser action popup.

The content.js must inject a custom HTML element directly into the CourseWeb page (document.body).

Critical: You MUST wrap the injected UI inside a Shadow DOM (attachShadow({mode: 'open'})). This ensures our Tailwind classes do not leak out and break CourseWeb, and CourseWeb's CSS does not leak in and ruin our widget.

2. The Styling (Tailwind CSS)

We are strictly using Tailwind CSS for styling the widget.

Since this is a Manifest V3 extension, you cannot easily use the Tailwind CDN due to Content Security Policy (CSP) restrictions.

Action for Cursor: Provide a lightweight, pre-compiled Tailwind CSS file (or guide me to generate one via a quick npx tailwindcss command) that I can inject directly into the Shadow DOM as a <style> tag or linked stylesheet.

3. The Widget Behavior (Expand on Demand)

Collapsed State: By default, the widget should be a small, unobtrusive floating button fixed to the top-right or bottom-right of the screen (e.g., a small dark Zinc pill that says "⚡ UniFlow"). It must not distract the user while they read the page.

Expanded State: When clicked, it expands into the full UI panel (the checklist of scraped files, the greyed-out previously synced files, and the "Sync to UniFlow" download button).

Include a simple "X" or "Collapse" button to shrink it back down.

4. Execution Adjustment

Move all UI logic, JSZip bundling, and state management out of popup.js and into content.js (or a module imported by content.js), as the entire interface now lives directly inside the CourseWeb tab.