// ============================================================
// UniFlow Sync — Content Script
// Injects a Shadow DOM floating widget into CourseWeb pages
// to scrape, bundle, and download academic resources as ZIP.
// ============================================================

'use strict';

const STORAGE_KEY = 'uniflow_synced_urls';
const WIDGET_HOST_ID = 'uniflow-widget-host';

// ============================================================
// SECTION A: PAGE DETECTION (3-layer guard)
// ============================================================

/**
 * Extracts the module code from the page title or H1.
 * Returns null if no SLIIT-style module code is found.
 * e.g. "IT3010", "SE3040", "CS2060"
 */
function extractModuleCode() {
  const h1 = document.querySelector('h1')?.innerText?.trim() || '';
  const title = document.title?.trim() || '';
  const source = h1 || title;
  const match = source.match(/\b([A-Z]{2,4}\d{4})\b/);
  return match ? match[1] : null;
}

/**
 * Scrapes all valid downloadable resource links from the page.
 * Targets only .modtype_resource and .modtype_folder containers.
 * Ignores .modtype_url, .modtype_forum, and anchor-only links.
 */
function scrapeResources() {
  const containers = document.querySelectorAll('.modtype_resource, .modtype_folder');
  const resources = [];
  const seen = new Set();

  containers.forEach(container => {
    container.querySelectorAll('a[href]').forEach(link => {
      const href = link.href;
      const rawName = (link.innerText || link.textContent || '').trim();
      if (!href || href.includes('#') || seen.has(href)) return;
      seen.add(href);
      resources.push({
        href,
        name: sanitizeFilename(rawName || 'Unnamed_File')
      });
    });
  });

  return resources;
}

/**
 * Removes filesystem-illegal characters from a filename.
 * Truncates to 200 chars to avoid OS path-length issues.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 200);
}

/**
 * Runs all 3 detection layers and returns a page state object.
 *
 * Possible states:
 *   'active'           — module page with downloadable resources
 *   'no-resources'     — valid module URL but no resources found
 *   'unknown-module'   — has resources but module code not extractable
 *   'not-a-module-page'— URL is not a course/view.php page
 */
function detectPageState() {
  // Layer 1: URL check
  if (window.location.pathname !== '/course/view.php') {
    return { state: 'not-a-module-page', moduleCode: null, resources: [] };
  }

  // Layer 2: Module code extraction
  const moduleCode = extractModuleCode();

  // Layer 3: Resource scraping
  const resources = scrapeResources();

  if (resources.length === 0) {
    return { state: 'no-resources', moduleCode, resources: [] };
  }

  return {
    state: moduleCode ? 'active' : 'unknown-module',
    moduleCode: moduleCode || 'Unknown Module',
    resources
  };
}

// ============================================================
// SECTION B: SHADOW DOM WIDGET INJECTION
// ============================================================

/**
 * Creates the shadow DOM host element and injects Tailwind CSS
 * by fetching the local extension stylesheet and inlining it.
 * Returns the shadow container div for rendering into.
 */
async function injectWidget() {
  if (document.getElementById(WIDGET_HOST_ID)) return null;

  const host = document.createElement('div');
  host.id = WIDGET_HOST_ID;
  // Host element must not interfere with page layout
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  // Fetch and inline Tailwind so it's scoped to the Shadow DOM
  try {
    const cssUrl = chrome.runtime.getURL('tailwind.css');
    const cssText = await fetch(cssUrl).then(r => r.text());
    const style = document.createElement('style');
    style.textContent = cssText;
    shadow.appendChild(style);
  } catch (err) {
    console.warn('[UniFlow] Could not load tailwind.css:', err);
  }

  const container = document.createElement('div');
  container.id = 'uniflow-root';
  shadow.appendChild(container);

  return container;
}

// ============================================================
// SECTION C: WIDGET UI & STATE MANAGEMENT
// ============================================================

// Module-level state
let isExpanded = false;
let pageInfo = null;
let syncedUrls = [];

/**
 * Top-level render function. Switches between collapsed pill
 * and expanded panel based on `isExpanded`.
 */
function renderWidget(container) {
  if (!container) return;
  container.innerHTML = isExpanded ? buildPanel() : buildPill();
  attachEvents(container);
}

function buildPill() {
  const { state } = pageInfo;
  const isActive = state === 'active' || state === 'unknown-module';
  const dimClass = isActive ? '' : 'opacity-60';

  return `
    <div class="fixed bottom-4 right-4 z-[99999] font-sans select-none">
      <button id="uf-pill"
        class="flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold
               px-4 py-2 rounded-full shadow-2xl cursor-pointer hover:bg-zinc-800
               transition-all duration-200 border border-zinc-700 ${dimClass}">
        <span>⚡</span><span>UniFlow</span>
      </button>
    </div>
  `;
}

function buildPanel() {
  return `
    <div class="fixed bottom-4 right-4 z-[99999] font-sans select-none">
      <div class="flex flex-col bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-80 overflow-hidden">
        ${buildPanelHeader()}
        ${buildPanelBody()}
      </div>
    </div>
  `;
}

function buildPanelHeader() {
  return `
    <div class="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
      <span class="text-white text-sm font-semibold">⚡ UniFlow</span>
      <button id="uf-close"
        class="text-zinc-400 hover:text-white transition-colors duration-150
               text-lg leading-none cursor-pointer">✕</button>
    </div>
  `;
}

function buildPanelBody() {
  const { state, moduleCode, resources } = pageInfo;

  if (state === 'not-a-module-page') {
    return `
      <div class="px-4 py-6 text-center">
        <p class="text-zinc-400 text-sm">This page is not a CourseWeb module.</p>
        <p class="text-zinc-500 text-xs mt-1">Navigate to a module page to sync files.</p>
      </div>
    `;
  }

  const moduleBadge = `
    <div class="px-4 pt-3 pb-1">
      <span class="text-xs font-medium text-zinc-400 uppercase tracking-widest">Module</span>
      <p class="text-white text-sm font-semibold mt-0.5 truncate">${escapeHtml(moduleCode || 'Unknown')}</p>
    </div>
  `;

  if (state === 'no-resources') {
    return `
      ${moduleBadge}
      <div class="px-4 py-6 text-center">
        <p class="text-zinc-400 text-sm">No downloadable resources found on this page.</p>
      </div>
    `;
  }

  // Active or unknown-module: render the full checklist
  const newFiles = resources.filter(r => !syncedUrls.includes(r.href));
  const syncedFiles = resources.filter(r => syncedUrls.includes(r.href));
  const newCount = newFiles.length;

  const fileListHtml = [
    ...newFiles.map(r => `
      <label class="flex items-center gap-3 py-1.5 cursor-pointer group">
        <input type="checkbox" checked
          data-href="${escapeAttr(r.href)}"
          data-name="${escapeAttr(r.name)}"
          class="uf-file-check w-4 h-4 rounded accent-violet-500 cursor-pointer flex-shrink-0">
        <span class="text-zinc-100 text-sm truncate group-hover:text-white transition-colors"
              title="${escapeAttr(r.name)}">${escapeHtml(r.name)}</span>
      </label>
    `),
    ...syncedFiles.map(r => `
      <label class="flex items-center gap-3 py-1.5 cursor-not-allowed opacity-50">
        <input type="checkbox" checked disabled
          class="w-4 h-4 rounded accent-violet-500 flex-shrink-0">
        <span class="text-zinc-400 text-sm truncate line-through"
              title="${escapeAttr(r.name)}">${escapeHtml(r.name)}</span>
      </label>
    `)
  ].join('');

  const countLabel = newCount === 0
    ? 'All files already synced'
    : `${newCount} new file${newCount !== 1 ? 's' : ''} · ${resources.length} total`;

  return `
    ${moduleBadge}
    <div class="flex-1 overflow-y-auto px-4 py-2 space-y-1 max-h-60">
      ${fileListHtml || '<p class="text-zinc-500 text-xs py-2 text-center">No files found.</p>'}
    </div>
    <div class="flex items-center justify-between px-4 py-2 border-t border-zinc-700">
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" id="uf-select-all" ${newCount > 0 ? 'checked' : ''}
          class="w-4 h-4 rounded accent-violet-500 cursor-pointer">
        <span class="text-zinc-300 text-xs font-medium">Select all</span>
      </label>
      <span class="text-zinc-500 text-xs">${countLabel}</span>
    </div>
    <div class="px-4 pb-4 pt-2">
      <button id="uf-sync-btn"
        ${newCount === 0 ? 'disabled' : ''}
        class="w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white
               text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150
               cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
        Sync to UniFlow ↓
      </button>
    </div>
    <div id="uf-progress" class="hidden px-4 pb-3">
      <div class="w-full bg-zinc-700 rounded-full h-1.5">
        <div id="uf-progress-bar" class="bg-violet-500 h-1.5 rounded-full transition-all duration-300" style="width:0%"></div>
      </div>
      <p id="uf-progress-text" class="text-zinc-400 text-xs mt-1.5 text-center"></p>
    </div>
    <div id="uf-status" class="hidden px-4 pb-3">
      <p id="uf-status-text" class="text-xs text-center"></p>
    </div>
  `;
}

/** Wires up all interactive elements after each render. */
function attachEvents(container) {
  container.querySelector('#uf-pill')?.addEventListener('click', () => {
    isExpanded = true;
    chrome.storage.local.get([STORAGE_KEY], result => {
      syncedUrls = result[STORAGE_KEY] || [];
      renderWidget(container);
    });
  });

  container.querySelector('#uf-close')?.addEventListener('click', () => {
    isExpanded = false;
    renderWidget(container);
  });

  const allChecks = () => [...container.querySelectorAll('.uf-file-check')];
  const selectAll = container.querySelector('#uf-select-all');

  selectAll?.addEventListener('change', () => {
    allChecks().forEach(cb => { cb.checked = selectAll.checked; });
  });

  allChecks().forEach(cb => {
    cb.addEventListener('change', () => {
      if (selectAll) {
        selectAll.checked = allChecks().every(c => c.checked);
      }
    });
  });

  container.querySelector('#uf-sync-btn')?.addEventListener('click', () => {
    const selected = allChecks()
      .filter(cb => cb.checked)
      .map(cb => ({ href: cb.dataset.href, name: cb.dataset.name }));
    if (selected.length > 0) {
      runZipPipeline(container, selected, pageInfo.moduleCode);
    }
  });
}

// ============================================================
// SECTION D: FETCH + ZIP PIPELINE
// ============================================================

const MIME_TO_EXT = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'text/plain': '.txt',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'application/zip': '.zip',
};

/**
 * Determines the best filename for a fetched resource.
 * Priority: Content-Disposition header > original name + Content-Type extension.
 * Ensures the filename always has an extension so the OS can identify it.
 */
function resolveFilename(originalName, response) {
  // 1. Try Content-Disposition: attachment; filename="Lecture01.pdf"
  const cd = response.headers.get('Content-Disposition') || '';
  const cdMatch = cd.match(/filename\*?=(?:UTF-8'')?["']?([^;"'\r\n]+)["']?/i);
  if (cdMatch && cdMatch[1]) {
    const cdName = sanitizeFilename(decodeURIComponent(cdMatch[1].trim()));
    if (cdName) return cdName;
  }

  // 2. If the scraped name already has an extension, keep it
  if (/\.[a-z0-9]{2,5}$/i.test(originalName)) return originalName;

  // 3. Infer extension from Content-Type
  const contentType = (response.headers.get('Content-Type') || '').split(';')[0].trim();
  const ext = MIME_TO_EXT[contentType] || '';
  return originalName + ext;
}

/**
 * Fetches each selected file, bundles them into a ZIP using JSZip,
 * triggers a download via chrome.downloads, and updates storage.
 * Shows live progress inside the panel during the operation.
 */
async function runZipPipeline(container, files, moduleCode) {
  const syncBtn = container.querySelector('#uf-sync-btn');
  const progressEl = container.querySelector('#uf-progress');
  const progressBar = container.querySelector('#uf-progress-bar');
  const progressText = container.querySelector('#uf-progress-text');
  const statusEl = container.querySelector('#uf-status');
  const statusText = container.querySelector('#uf-status-text');

  // Lock UI and show progress
  if (syncBtn) syncBtn.disabled = true;
  if (progressEl) progressEl.classList.remove('hidden');
  if (statusEl) statusEl.classList.add('hidden');

  const zip = new JSZip();
  const successUrls = [];
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const { href, name } = files[i];
    const pct = Math.round((i / files.length) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.textContent = `Fetching ${i + 1} / ${files.length} files...`;

    try {
      const response = await fetch(href, { credentials: 'include' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      zip.file(resolveFilename(name, response), blob);
      successUrls.push(href);
    } catch (err) {
      console.warn(`[UniFlow] Failed: ${name}`, err);
      failCount++;
    }
  }

  if (successUrls.length === 0) {
    if (progressEl) progressEl.classList.add('hidden');
    showStatus(statusEl, statusText, 'All files failed to download. Is your session still active?', 'error');
    if (syncBtn) syncBtn.disabled = false;
    return;
  }

  if (progressBar) progressBar.style.width = '95%';
  if (progressText) progressText.textContent = 'Building ZIP...';

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipName = `${moduleCode}_UniFlow_Sync.zip`;
  const objectUrl = URL.createObjectURL(zipBlob);

  // chrome.downloads is not available in content scripts (MV3).
  // Trigger the download via a temporary anchor element instead.
  const anchor = document.createElement('a');
  anchor.style.display = 'none';
  anchor.href = objectUrl;
  anchor.download = zipName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

  // Persist newly synced URLs to storage
  chrome.storage.local.get([STORAGE_KEY], result => {
    const existing = result[STORAGE_KEY] || [];
    const updated = [...new Set([...existing, ...successUrls])];
    chrome.storage.local.set({ [STORAGE_KEY]: updated }, () => {
      syncedUrls = updated;
    });
  });

  // Final progress and status
  if (progressBar) progressBar.style.width = '100%';
  if (progressEl) progressEl.classList.add('hidden');

  if (failCount > 0) {
    showStatus(statusEl, statusText,
      `${successUrls.length} file${successUrls.length !== 1 ? 's' : ''} synced · ${failCount} failed.`, 'error');
  } else {
    showStatus(statusEl, statusText,
      `All ${successUrls.length} file${successUrls.length !== 1 ? 's' : ''} synced successfully!`, 'success');
  }

  if (syncBtn) syncBtn.disabled = false;

  // Re-render the checklist to grey out newly synced files
  // Small delay so the user sees the success message briefly
  setTimeout(() => renderWidget(container), 2000);
}

/** Reveals the status strip with appropriate colour. */
function showStatus(statusEl, statusText, message, type) {
  if (!statusEl || !statusText) return;
  statusEl.classList.remove('hidden');
  statusText.textContent = message;
  statusText.className = type === 'success'
    ? 'text-emerald-400 text-xs text-center font-medium'
    : 'text-red-400 text-xs text-center';
}

// ============================================================
// HELPERS
// ============================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ============================================================
// INIT — runs once on page load
// ============================================================

(async function init() {
  pageInfo = detectPageState();
  const container = await injectWidget();
  if (!container) return;
  renderWidget(container);
})();
