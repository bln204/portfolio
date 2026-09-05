/**
 * layout.js - Khung giao diện VS Code dùng chung cho mọi trang (titlebar,
 * menubar, activity bar, sidebar, terminal panel, status bar, theme popover,
 * command palette...). Mỗi trang HTML chỉ cần khai báo:
 *   <div id="app-shell"></div>
 *   <template id="page-content">...nội dung riêng của trang...</template>
 * rồi nạp script này TRƯỚC ide.js (nhưng có thể sau/trước typing.js, main.js,
 * contact.js vì các script đó chỉ chạy trong DOMContentLoaded).
 */
(function () {
  const SHELL = `
  <!-- ============================== TITLE BAR ============================== -->
  <div class="vsc-titlebar">
    <div class="vsc-titlebar__brand">
      <i data-lucide="code-2" style="width:16px;height:16px;"></i>
      <span class="brand-text">Portfolio</span>
    </div>
    <div class="vsc-titlebar__center">
      <button class="vsc-search-pill" id="openPaletteBtn" type="button">
        <i data-lucide="search" style="width:13px;height:13px;"></i>
        <span>Bùi Lê Nam — Portfolio</span>
        <kbd>Ctrl+P</kbd>
      </button>
    </div>
    <div class="vsc-titlebar__controls">
      <button class="win-btn" id="btnMinimize" title="Thu nhỏ" type="button"><i data-lucide="minus" style="width:14px;height:14px;"></i></button>
      <button class="win-btn" id="btnMaximize" title="Zen Mode" type="button"><i data-lucide="square" style="width:12px;height:12px;"></i></button>
      <button class="win-btn close" id="btnClose" title="Đóng" type="button"><i data-lucide="x" style="width:15px;height:15px;"></i></button>
    </div>
  </div>

  <!-- ============================== MENU BAR ============================== -->
  <div class="vsc-menubar" id="menubar">
    <span class="menu-item" data-menu="file">File</span>
    <span class="menu-item" data-menu="edit">Edit</span>
    <span class="menu-item" data-menu="selection">Selection</span>
    <span class="menu-item" data-menu="view">View</span>
    <span class="menu-item" data-menu="go">Go</span>
    <span class="menu-item" data-menu="run">Run</span>
    <span class="menu-item" data-action="toggle-terminal">Terminal</span>
    <span class="menu-item" data-menu="help">Help</span>
  </div>

  <!-- ============================== WORKBENCH ============================== -->
  <div class="vsc-workbench">

    <!-- Activity Bar -->
    <div class="vsc-activitybar">
      <div class="activitybar-top">
        <button class="activity-icon active" data-view="explorer" title="Explorer" type="button">
          <i data-lucide="folder"></i>
        </button>
        <button class="activity-icon" data-view="search" title="Search (Ctrl+P)" type="button">
          <i data-lucide="search"></i>
        </button>
        <button class="activity-icon" data-view="scm" title="Source Control" type="button">
          <i data-lucide="git-branch"></i>
          <span class="badge">3</span>
        </button>
        <button class="activity-icon" data-view="debug" title="Run and Debug" type="button">
          <i data-lucide="bug"></i>
        </button>
        <button class="activity-icon" data-view="extensions" title="Extensions" type="button">
          <i data-lucide="box"></i>
        </button>
      </div>
      <div class="activitybar-bottom">
        <button class="activity-icon" data-view="account" title="Account" type="button">
          <i data-lucide="user"></i>
        </button>
        <button class="activity-icon" id="settingsGearBtn" title="Settings / Theme" type="button">
          <i data-lucide="settings"></i>
        </button>
      </div>
    </div>

    <!-- Sidebar -->
    <aside class="vsc-sidebar" id="sidebar">
      <div class="sidebar-header">
        <span>Explorer</span>
        <div class="sidebar-header__actions">
          <button title="New File" type="button"><i data-lucide="file-plus"></i></button>
          <button title="Collapse All" type="button"><i data-lucide="more-horizontal"></i></button>
        </div>
      </div>

      <div class="sidebar-section" id="sectionFolder">
        <button class="sidebar-section__title" data-toggle-section="sectionFolder" type="button">
          <i data-lucide="chevron-right" class="chevron"></i>
          <span>Portfolio</span>
        </button>
        <div class="tree-body">
          <ul class="file-tree">
            <li class="tree-folder open" role="treeitem">
              <div class="tree-row folder-row">
                <i data-lucide="chevron-right" class="chevron"></i>
                <span class="file-icon"><i data-lucide="folder"></i></span>
                <span class="tree-name">src</span>
              </div>
              <ul>
                <li class="tree-file" data-file="about" role="treeitem">
                  <div class="tree-row"><span class="indent" style="width:14px;"></span><span class="file-icon ic-js">JS</span><span class="tree-name">about.js</span></div>
                </li>
                <li class="tree-file" data-file="skills" role="treeitem">
                  <div class="tree-row"><span class="indent" style="width:14px;"></span><span class="file-icon ic-js">JS</span><span class="tree-name">skills.js</span></div>
                </li>
                <li class="tree-file" data-file="projects" role="treeitem">
                  <div class="tree-row"><span class="indent" style="width:14px;"></span><span class="file-icon ic-js">JS</span><span class="tree-name">projects.js</span></div>
                </li>
                <li class="tree-file" data-file="education" role="treeitem">
                  <div class="tree-row"><span class="indent" style="width:14px;"></span><span class="file-icon ic-js">JS</span><span class="tree-name">education.js</span></div>
                </li>
                <li class="tree-file" data-file="contact" role="treeitem">
                  <div class="tree-row"><span class="indent" style="width:14px;"></span><span class="file-icon ic-js">JS</span><span class="tree-name">contact.js</span></div>
                </li>
              </ul>
            </li>
            <li class="tree-file" data-file="readme" role="treeitem">
              <div class="tree-row"><span class="file-icon ic-md">M</span><span class="tree-name">README.md</span></div>
            </li>
            <li class="tree-file" data-file="package-easter-egg" role="treeitem">
              <div class="tree-row"><span class="file-icon ic-json">{ }</span><span class="tree-name muted">package.json</span></div>
            </li>
          </ul>
        </div>
      </div>

      <div class="sidebar-section collapsed" id="sectionOpenEditors">
        <button class="sidebar-section__title" data-toggle-section="sectionOpenEditors" type="button">
          <i data-lucide="chevron-right" class="chevron"></i>
          <span>Open Editors</span>
        </button>
        <div class="tree-body">
          <ul class="file-tree open-editors-list" id="openEditorsList"></ul>
        </div>
      </div>
    </aside>

    <div class="sidebar-scrim" id="sidebarScrim"></div>

    <!-- Editor Area -->
    <div class="vsc-editor-area">
      <div class="vsc-tabsbar" id="tabsbar"></div>
      <div class="vsc-breadcrumb" id="breadcrumb"></div>

      <div class="vsc-editor-scroll" id="editorScroll">
        <div class="editor-minimap"></div>
        <div id="page-content-slot"></div>
      </div>

      <!-- Bottom Panel: Terminal -->
      <div class="vsc-panel" id="bottomPanel" hidden>
        <div class="panel-tabs">
          <span class="panel-tab active">TERMINAL</span>
          <span class="panel-tab" style="opacity:.5;">PROBLEMS</span>
          <span class="panel-tab" style="opacity:.5;">OUTPUT</span>
          <button class="panel-close" id="panelCloseBtn" title="Đóng Terminal" type="button"><i data-lucide="x" style="width:15px;height:15px;"></i></button>
        </div>
        <div class="panel-body">
          <div id="terminalBody">
            <div class="term-line">Portfolio Interactive Shell v2.4.0 (x86_64-pc-linux)<br>Gõ <strong style="color:var(--success)">help</strong> để xem danh sách câu lệnh hoặc <strong style="color:var(--syn-tag)">sudo hire</strong> để gửi lời mời làm việc!</div>
            <div id="terminal-output"></div>
          </div>
          <div class="term-input-row">
            <span class="prompt">visitor@dev:~$</span>
            <input type="text" id="terminal-input" placeholder="help, skills, projects, contact, sudo hire..." autocomplete="off" spellcheck="false">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ============================== STATUS BAR ============================== -->
  <div class="vsc-statusbar">
    <div class="status-left">
      <button class="status-item" id="branchBtn" type="button"><i data-lucide="git-branch"></i> main</button>
      <button class="status-item" id="syncBtn" type="button"><i data-lucide="refresh-cw"></i></button>
      <button class="status-item" id="problemsBtn" type="button"><i data-lucide="check-circle-2"></i> 0</button>
    </div>
    <div class="status-right">
      <span class="status-item hide-mobile" id="cursorPos">Ln 1, Col 1</span>
      <span class="status-item hide-mobile">Spaces: 2</span>
      <span class="status-item hide-mobile">UTF-8</span>
      <span class="status-item" id="langMode">Plain Text</span>
      <button class="status-item" id="themeTriggerBtn" type="button"><i data-lucide="palette"></i> <span id="themeLabel" class="hide-mobile">GitHub Dark</span></button>
      <button class="status-item" id="terminalToggleBtn" type="button"><i data-lucide="terminal"></i></button>
      <button class="status-item" id="feedbackBtn" title="Liên hệ" type="button"><i data-lucide="smile"></i></button>
    </div>
  </div>

  <!-- Zen mode exit hint -->
  <div class="zen-exit" id="zenExit">
    <span>Zen Mode</span>
    <kbd>Esc</kbd>
    <span>để thoát</span>
  </div>

  <!-- ============================== THEME POPOVER ============================== -->
  <div class="theme-popover" id="themePopover" hidden>
    <button class="theme-option active" data-theme-value="github-dark" type="button"><span class="swatch" style="background:#0d1117"></span>GitHub Dark<i data-lucide="check" class="check"></i></button>
    <button class="theme-option" data-theme-value="one-dark-pro" type="button"><span class="swatch" style="background:#282c34"></span>One Dark Pro<i data-lucide="check" class="check"></i></button>
    <button class="theme-option" data-theme-value="dracula" type="button"><span class="swatch" style="background:#282a36"></span>Dracula<i data-lucide="check" class="check"></i></button>
    <button class="theme-option" data-theme-value="nord" type="button"><span class="swatch" style="background:#2e3440"></span>Nord<i data-lucide="check" class="check"></i></button>
    <button class="theme-option" data-theme-value="light-plus" type="button"><span class="swatch" style="background:#ffffff;border-color:#ccc"></span>Light+<i data-lucide="check" class="check"></i></button>
  </div>

  <!-- ============================== COMMAND PALETTE ============================== -->
  <div class="command-palette" id="commandPalette" hidden>
    <div class="command-palette__box">
      <div class="command-palette__input-row">
        <i data-lucide="search"></i>
        <input type="text" id="paletteInput" placeholder="Nhập tên tệp để mở… (about, skills, projects, contact)">
      </div>
      <ul id="paletteList"></ul>
    </div>
  </div>

  <!-- ============================== IMAGE MODAL (QR / preview) ============================== -->
  <div class="image-modal" id="imageModal" hidden>
    <div class="image-modal__box">
      <button class="image-modal__close" id="imageModalClose" title="Đóng" type="button"><i data-lucide="x"></i></button>
      <img class="image-modal__img" id="imageModalImg" src="" alt="">
      <p class="image-modal__caption" id="imageModalCaption"></p>
    </div>
  </div>

  <div id="toast-container"></div>
  `;

  const mount = document.getElementById('app-shell');
  if (mount) mount.outerHTML = SHELL;

  const slot = document.getElementById('page-content-slot');
  const template = document.getElementById('page-content');
  if (slot && template) slot.replaceWith(template.content.cloneNode(true));
  if (template) template.remove();
})();
