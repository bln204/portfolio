/**
 * ide.js - VS Code shell logic: tabs, explorer, command palette,
 * theme switcher, terminal panel, zen mode, mobile drawer.
 *
 * Each portfolio section lives in its own HTML file (index.html, about.html,
 * skill.html, project.html, education.html, contact.html). All of them share
 * the same shell markup + this script. "Opening a file" navigates to that
 * real page; the open-tabs list is kept in localStorage so it survives
 * navigation and feels like one continuous editor session.
 */

const FILES = {
  readme: { name: 'README.md', icon: 'md', lang: 'Markdown', path: 'portfolio › README.md', pos: 'Ln 1, Col 1', href: 'index.html' },
  about: { name: 'about.js', icon: 'js', lang: 'JavaScript', path: 'portfolio › src › about.js', pos: 'Ln 58, Col 3', href: 'about.html' },
  skills: { name: 'skills.js', icon: 'js', lang: 'JavaScript', path: 'portfolio › src › skills.js', pos: 'Ln 74, Col 5', href: 'skill.html' },
  projects: { name: 'projects.js', icon: 'js', lang: 'JavaScript', path: 'portfolio › src › projects.js', pos: 'Ln 96, Col 2', href: 'project.html' },
  education: { name: 'education.js', icon: 'js', lang: 'JavaScript', path: 'portfolio › src › education.js', pos: 'Ln 41, Col 4', href: 'education.html' },
  contact: { name: 'contact.js', icon: 'js', lang: 'JavaScript', path: 'portfolio › src › contact.js', pos: 'Ln 63, Col 1', href: 'contact.html' },
};

const THEME_NAMES = {
  'github-dark': 'GitHub Dark',
  'one-dark-pro': 'One Dark Pro',
  'dracula': 'Dracula',
  'nord': 'Nord',
  'light-plus': 'Light+',
};

const DEFAULT_OPEN_FILES = ['readme', 'about', 'projects', 'contact'];
const activeFile = document.body.dataset.page;

let paletteMatches = [];
let paletteIndex = 0;

/* ---------------------------------- Persisted open-tabs state ---------------------------------- */
function loadOpenFiles() {
  let files;
  try {
    files = JSON.parse(localStorage.getItem('vsc-open-files'));
  } catch (e) {
    files = null;
  }
  if (!Array.isArray(files) || !files.length) files = DEFAULT_OPEN_FILES.slice();
  files = files.filter((k) => FILES[k]);
  if (activeFile && FILES[activeFile] && !files.includes(activeFile)) files.push(activeFile);
  return files;
}

function saveOpenFiles(files) {
  localStorage.setItem('vsc-open-files', JSON.stringify(files));
}

let openFiles = loadOpenFiles();
saveOpenFiles(openFiles);

function fileIconHTML(icon) {
  if (icon === 'md') return '<span class="file-icon ic-md">M</span>';
  if (icon === 'json') return '<span class="file-icon ic-json">{ }</span>';
  return '<span class="file-icon ic-js">JS</span>';
}

function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ---------------------------------- Rendering ---------------------------------- */
function renderTabs() {
  const bar = document.getElementById('tabsbar');
  bar.innerHTML = openFiles.map((key) => {
    const f = FILES[key];
    const active = key === activeFile ? ' active' : '';
    return `<div class="tab${active}" data-file="${key}">
      ${fileIconHTML(f.icon)}
      <span class="tab-name">${f.name}</span>
      <span class="unsaved-dot"></span>
      <button class="tab-close" data-close="${key}" aria-label="Đóng ${f.name}"><i data-lucide="x"></i></button>
    </div>`;
  }).join('');
  refreshIcons();
}

function renderOpenEditors() {
  const ul = document.getElementById('openEditorsList');
  ul.innerHTML = openFiles.map((key) => {
    const f = FILES[key];
    const active = key === activeFile ? ' active' : '';
    return `<li class="tree-file${active}" data-file="${key}" role="treeitem">
      <div class="tree-row">
        <div class="tree-left">${fileIconHTML(f.icon)}<span class="tree-name">${f.name}</span></div>
        <button class="close-x" data-close="${key}" aria-label="Đóng"><i data-lucide="x" style="width:13px;height:13px;"></i></button>
      </div>
    </li>`;
  }).join('');
  refreshIcons();
}

function renderSidebarActive() {
  document.querySelectorAll('#sectionFolder .tree-file').forEach((li) => {
    li.classList.toggle('active', li.dataset.file === activeFile);
  });
}

function renderBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  if (!activeFile || !FILES[activeFile]) { bc.innerHTML = ''; return; }
  const parts = FILES[activeFile].path.split(' › ');
  bc.innerHTML = parts.map((p, i) => (i > 0 ? '<i data-lucide="chevron-right"></i>' : '') + `<span>${p}</span>`).join('');
  refreshIcons();
}

function renderStatus() {
  const langEl = document.getElementById('langMode');
  const posEl = document.getElementById('cursorPos');
  if (!activeFile || !FILES[activeFile]) { langEl.textContent = 'Plain Text'; posEl.textContent = 'Ln 1, Col 1'; return; }
  langEl.textContent = FILES[activeFile].lang;
  posEl.textContent = FILES[activeFile].pos;
}

function renderAll() {
  renderTabs();
  renderOpenEditors();
  renderSidebarActive();
  renderBreadcrumb();
  renderStatus();
}

/* ---------------------------------- File open/close (real navigation) ---------------------------------- */
function openFile(key) {
  if (!FILES[key]) return;
  if (!openFiles.includes(key)) {
    openFiles.push(key);
    saveOpenFiles(openFiles);
  }
  if (key === activeFile) {
    renderAll();
    return;
  }
  window.location.href = FILES[key].href;
}

function closeFile(key) {
  const idx = openFiles.indexOf(key);
  if (idx === -1) return;
  openFiles.splice(idx, 1);
  saveOpenFiles(openFiles);
  if (key === activeFile) {
    const nextKey = openFiles[Math.max(0, idx - 1)] || 'readme';
    window.location.href = FILES[nextKey].href;
    return;
  }
  renderAll();
}

/* ---------------------------------- Mobile sidebar ---------------------------------- */
function isMobile() { return window.innerWidth <= 720; }

function toggleExplorer() {
  if (isMobile()) {
    const sb = document.getElementById('sidebar');
    const scrim = document.getElementById('sidebarScrim');
    const open = sb.classList.toggle('open');
    scrim.classList.toggle('show', open);
  } else {
    document.body.classList.toggle('sidebar-collapsed');
  }
}

function closeSidebarDrawer() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarScrim').classList.remove('show');
}

/* ---------------------------------- Theme switcher ---------------------------------- */
function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value);
  localStorage.setItem('vsc-theme', value);
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = THEME_NAMES[value] || value;
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeValue === value);
  });
}

function toggleThemePopover() {
  const pop = document.getElementById('themePopover');
  pop.hidden = !pop.hidden;
}

/* ---------------------------------- Command palette ---------------------------------- */
function openCommandPalette() {
  const cp = document.getElementById('commandPalette');
  cp.hidden = false;
  const input = document.getElementById('paletteInput');
  input.value = '';
  renderPaletteList('');
  setTimeout(() => input.focus(), 30);
}

function closeCommandPalette() {
  document.getElementById('commandPalette').hidden = true;
}

function renderPaletteList(query) {
  const list = document.getElementById('paletteList');
  const q = query.trim().toLowerCase();
  paletteMatches = Object.keys(FILES).filter((k) => FILES[k].name.toLowerCase().includes(q));
  paletteIndex = 0;
  if (!paletteMatches.length) {
    list.innerHTML = '<li class="palette-empty">Không tìm thấy tệp phù hợp</li>';
    return;
  }
  list.innerHTML = paletteMatches.map((k, i) => {
    const f = FILES[k];
    return `<li class="palette-item${i === 0 ? ' active-item' : ''}" data-file="${k}">${fileIconHTML(f.icon)}<span>${f.name}</span><span class="path">${f.path}</span></li>`;
  }).join('');
  refreshIcons();
}

function movePaletteSelection(delta) {
  if (!paletteMatches.length) return;
  paletteIndex = (paletteIndex + delta + paletteMatches.length) % paletteMatches.length;
  document.querySelectorAll('.palette-item').forEach((li, i) => li.classList.toggle('active-item', i === paletteIndex));
}

/* ---------------------------------- Terminal panel ---------------------------------- */
function toggleTerminalPanel(forceOpen) {
  const panel = document.getElementById('bottomPanel');
  const shouldOpen = forceOpen !== undefined ? forceOpen : panel.hasAttribute('hidden');
  if (shouldOpen) {
    panel.removeAttribute('hidden');
    const input = document.getElementById('terminal-input');
    if (input) input.focus();
  } else {
    panel.setAttribute('hidden', '');
  }
  localStorage.setItem('vsc-terminal-open', shouldOpen ? '1' : '0');
}

/* ---------------------------------- Zen mode ---------------------------------- */
function toggleZenMode(force) {
  document.body.classList.toggle('zen-mode', force);
}

/* ---------------------------------- Image modal (QR / preview) ---------------------------------- */
function openImageModal(src, caption) {
  document.getElementById('imageModalImg').src = src;
  document.getElementById('imageModalImg').alt = caption || '';
  document.getElementById('imageModalCaption').textContent = caption || '';
  document.getElementById('imageModal').hidden = false;
}

function closeImageModal() {
  document.getElementById('imageModal').hidden = true;
}

/* ---------------------------------- Wiring ---------------------------------- */
document.getElementById('tabsbar').addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { e.stopPropagation(); closeFile(closeBtn.dataset.close); return; }
  const tab = e.target.closest('.tab');
  if (tab) openFile(tab.dataset.file);
});

document.getElementById('openEditorsList').addEventListener('click', (e) => {
  const closeBtn = e.target.closest('[data-close]');
  if (closeBtn) { e.stopPropagation(); closeFile(closeBtn.dataset.close); return; }
  const li = e.target.closest('[data-file]');
  if (li) openFile(li.dataset.file);
});

document.getElementById('sectionFolder').addEventListener('click', (e) => {
  const folderRow = e.target.closest('.folder-row');
  if (folderRow) { folderRow.closest('.tree-folder').classList.toggle('open'); return; }
  const fileLi = e.target.closest('.tree-file[data-file]');
  if (fileLi) {
    const key = fileLi.dataset.file;
    if (key === 'package-easter-egg') {
      showToast('📦 package.json chỉ để vui thôi — xem đầy đủ kỹ năng tại skills.js!', 'info');
      return;
    }
    openFile(key);
  }
});

document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('[data-toggle-section]');
  if (toggleBtn) document.getElementById(toggleBtn.dataset.toggleSection).classList.toggle('collapsed');

  const openBtn = e.target.closest('[data-open]');
  if (openBtn) openFile(openBtn.dataset.open);

  const modalTrigger = e.target.closest('[data-modal-image]');
  if (modalTrigger) {
    e.preventDefault();
    openImageModal(modalTrigger.dataset.modalImage, modalTrigger.dataset.modalCaption);
  }

  const pop = document.getElementById('themePopover');
  if (!pop.hidden && !pop.contains(e.target) && !e.target.closest('#themeTriggerBtn') && !e.target.closest('#settingsGearBtn')) {
    pop.hidden = true;
  }
});

document.getElementById('menubar').addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action="toggle-terminal"]');
  if (actionEl) { toggleTerminalPanel(); return; }
  const menuEl = e.target.closest('[data-menu]');
  if (menuEl) showToast(`Menu "${menuEl.textContent}" chỉ mang tính minh họa giao diện VS Code 🙂`, 'info');
});

document.querySelectorAll('.activity-icon').forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    if (view === 'explorer') toggleExplorer();
    else if (view === 'search') openCommandPalette();
    else if (view === 'account') showToast('👋 Bạn đang xem với vai trò Visitor.', 'info');
    else showToast('🚧 Tính năng này chỉ mang tính minh họa trong bản demo giao diện VS Code.', 'info');
  });
});
document.getElementById('settingsGearBtn').addEventListener('click', toggleThemePopover);

document.getElementById('openPaletteBtn').addEventListener('click', openCommandPalette);
document.getElementById('btnMinimize').addEventListener('click', () => showToast('🔽 Đã "thu nhỏ" (nhưng bạn vẫn đang thấy trang này 😄).', 'info'));
document.getElementById('btnMaximize').addEventListener('click', () => toggleZenMode());
document.getElementById('btnClose').addEventListener('click', () => showToast('👋 Cảm ơn bạn đã ghé thăm! Nhấn F5 để "mở lại" portfolio.', 'info'));
document.getElementById('zenExit').addEventListener('click', () => toggleZenMode(false));

document.getElementById('branchBtn').addEventListener('click', () => showToast('🌿 Nhánh "main" — không có thay đổi nào chưa commit.', 'info'));
document.getElementById('syncBtn').addEventListener('click', () => showToast('✅ Đã đồng bộ (giả lập).', 'success'));
document.getElementById('problemsBtn').addEventListener('click', () => showToast('✨ Không có lỗi nào — code sạch 100%!', 'success'));
document.getElementById('themeTriggerBtn').addEventListener('click', toggleThemePopover);
document.getElementById('terminalToggleBtn').addEventListener('click', () => toggleTerminalPanel());
document.getElementById('feedbackBtn').addEventListener('click', () => openFile('contact'));
document.getElementById('panelCloseBtn').addEventListener('click', () => toggleTerminalPanel(false));
document.getElementById('sidebarScrim').addEventListener('click', closeSidebarDrawer);

document.getElementById('imageModalClose').addEventListener('click', closeImageModal);
document.getElementById('imageModal').addEventListener('click', (e) => {
  if (e.target.id === 'imageModal') closeImageModal();
});

document.querySelectorAll('.theme-option').forEach((btn) => {
  btn.addEventListener('click', () => {
    applyTheme(btn.dataset.themeValue);
    document.getElementById('themePopover').hidden = true;
  });
});

document.getElementById('paletteInput').addEventListener('input', (e) => renderPaletteList(e.target.value));
document.getElementById('paletteList').addEventListener('click', (e) => {
  const li = e.target.closest('.palette-item[data-file]');
  if (li) { openFile(li.dataset.file); closeCommandPalette(); }
});
document.getElementById('commandPalette').addEventListener('click', (e) => {
  if (e.target.id === 'commandPalette') closeCommandPalette();
});
document.getElementById('paletteInput').addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { e.preventDefault(); movePaletteSelection(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); movePaletteSelection(-1); }
  else if (e.key === 'Enter') {
    e.preventDefault();
    if (paletteMatches[paletteIndex]) { openFile(paletteMatches[paletteIndex]); closeCommandPalette(); }
  }
});

document.addEventListener('keydown', (e) => {
  const ctrlOrCmd = e.ctrlKey || e.metaKey;
  if (ctrlOrCmd && (e.key === 'p' || e.key === 'k')) { e.preventDefault(); openCommandPalette(); return; }
  if (ctrlOrCmd && e.key === '`') { e.preventDefault(); toggleTerminalPanel(); return; }
  if (e.key === 'Escape') {
    const cp = document.getElementById('commandPalette');
    const pop = document.getElementById('themePopover');
    const imgModal = document.getElementById('imageModal');
    if (!imgModal.hidden) { closeImageModal(); return; }
    if (!cp.hidden) { closeCommandPalette(); return; }
    if (!pop.hidden) { pop.hidden = true; return; }
    if (document.body.classList.contains('zen-mode')) { toggleZenMode(false); return; }
    if (document.getElementById('sidebar').classList.contains('open')) { closeSidebarDrawer(); return; }
  }
});

window.addEventListener('resize', () => {
  if (!isMobile()) closeSidebarDrawer();
});

/* ---------------------------------- Init ---------------------------------- */
const themeParam = new URLSearchParams(location.search).get('theme');
applyTheme(THEME_NAMES[themeParam] ? themeParam : (localStorage.getItem('vsc-theme') || 'github-dark'));

if (localStorage.getItem('vsc-terminal-open') === '1') toggleTerminalPanel(true);

// Backward-compat: old bookmarks used index.html#skills style deep links.
if (activeFile === 'readme' && location.hash) {
  const hashKey = location.hash.replace('#', '');
  if (FILES[hashKey] && hashKey !== 'readme') {
    window.location.replace(FILES[hashKey].href);
  }
}

renderAll();
