/**
 * MICHI (道) — For Work and Life Engine
 * Authentic 2-Page Digital Planner (iPad Spread Replica) & Jellyfish Cultural Color Palette
 * Custom Japanese Palette:
 * - #FBF582: Soft Yellow (Idea / Spark - Stage 1)
 * - #009967: Lime Green (Start / Structure - Stage 2)
 * - #7CFEFE: Soft Cyan (In Progress / Focus - Stage 3)
 * - #3B82F6: Sapphire Blue (Finished / Product / Vault - Stage 4)
 * - #127DBB: Strong Blue (Digital Planner / Calendar)
 * 1-Click Project Launch, Dispatcher Project Selection, and Connected 4-Stage Timeline
 */

const STORAGE_KEY = 'MICHI_APP_DATA_V3';
const VAULT_PASS_KEY = 'MICHI_VAULT_MASTER_PASS_V1';

// Default state with Project associations, Notes arrays, and Calendar Appts
const defaultState = {
  theme: 'dark',
  customWebCategories: ['Travel', 'Real Estate', 'Recipes'],
  contacts: [
    {
      id: 'contact-1',
      name: 'Sarah Jenkins',
      role: 'UX Architect & Lead Designer',
      company: 'Nexus Studio',
      email: 'sarah.j@nexus.design',
      phone: '(555) 234-5678',
      projects: ['Spatial Canvas Architecture', 'Cloud Hosting & Infrastructure'],
      notes: 'Primary UX contact and design sign-off lead.',
      color: '#7CFEFE'
    },
    {
      id: 'contact-2',
      name: 'Marcus Vance',
      role: 'Senior iOS & Native Engineer',
      company: 'Michi Labs',
      email: 'marcus.vance@michi.io',
      phone: '(555) 876-5432',
      projects: ['Personal'],
      notes: 'Handles Capacitor native iOS plugins and App Store deployments.',
      color: '#FBF582'
    },
    {
      id: 'contact-3',
      name: 'Elena Rostova',
      role: 'Design Director',
      company: 'Studio Kaze',
      email: 'elena@kaze.design',
      phone: '(555) 345-6789',
      projects: ['Spatial Canvas Architecture'],
      notes: 'Consultant on Japanese cultural color palettes and minimal layout.',
      color: '#009967'
    }
  ],
  items: [
    {
      id: 'item-1',
      type: 'idea',
      stage: 'spark',
      project: 'General',
      title: 'Spatial Canvas Architecture for Brainstorming',
      content: 'Combine infinite non-linear visual nodes with structured document cards. Support macro views for big picture connections and micro views for rich text notes.',
      notes: [
        { text: 'Initial idea sparked during UX review session.', date: 'Aug 08, 2026' },
        { text: 'Added support for line-by-line note editing.', date: 'Aug 11, 2026' }
      ],
      tags: ['Ideas', 'Architecture'],
      color: '#FBF582',
      date: '2026-08-08',
      url: ''
    },
    {
      id: 'item-2',
      type: 'web',
      stage: 'structure',
      webCategory: 'Tech',
      project: 'General',
      title: 'AI & Web Assembly Runtime Architecture',
      content: 'Clipped clean documentation on rich snippet extraction, HTML DOM cleaner, and high-performance Wasm modules.',
      notes: [
        { text: 'Evaluated readability parser algorithm for clean Markdown output.', date: 'Aug 09, 2026' }
      ],
      tags: ['Tech', 'Wasm', 'Architecture'],
      color: '#009967',
      date: '2026-08-06',
      url: 'https://techcrunch.com'
    },
    {
      id: 'item-web-sports',
      type: 'web',
      stage: 'structure',
      webCategory: 'Sports',
      project: 'General',
      title: 'Premier League Tactical Analytics & Athlete Metrics',
      content: '',
      notes: [
        { text: 'Great reference for spatial tracking layout concepts.', date: 'Aug 10, 2026' }
      ],
      tags: ['Sports', 'Analytics', 'Performance'],
      color: '#009967',
      date: '2026-08-10',
      url: 'https://espn.com'
    },
    {
      id: 'item-web-fashion',
      type: 'web',
      stage: 'structure',
      webCategory: 'Fashion',
      project: 'General',
      title: 'Sustainable Minimalism & Japanese Textile Innovation 2026',
      content: '',
      notes: [],
      tags: ['Fashion', 'Minimalism', 'Craftsmanship'],
      color: '#009967',
      date: '2026-08-11',
      url: 'https://vogue.com'
    },
    {
      id: 'item-web-design',
      type: 'web',
      stage: 'structure',
      webCategory: 'Design',
      project: 'General',
      title: 'Spatial Canvas UI Guidelines & Micro-Interactions',
      content: '',
      notes: [
        { text: 'Incorporated custom Japanese color palette.', date: 'Aug 11, 2026' }
      ],
      tags: ['Design', 'UI/UX', 'Palette'],
      color: '#009967',
      date: '2026-08-11',
      url: 'https://dribbble.com'
    },
    {
      id: 'item-web-finance',
      type: 'web',
      stage: 'structure',
      webCategory: 'Finance',
      project: 'General',
      title: 'Fintech API Architecture & Global Payment Systems',
      content: '',
      notes: [],
      tags: ['Finance', 'API', 'Security'],
      color: '#009967',
      date: '2026-08-11',
      url: 'https://bloomberg.com'
    },
    {
      id: 'item-3',
      type: 'task',
      stage: 'focus',
      project: 'General',
      title: 'Build Mobile Responsive Touch Drag-and-Drop',
      content: 'Add TouchEvent listeners (touchstart, touchmove, touchend) so Kanban cards drag smoothly on mobile devices.',
      status: 'in-progress',
      notes: [],
      tags: ['Tasks', 'Mobile'],
      color: '#7CFEFE',
      date: '2026-08-09'
    },
    {
      id: 'item-4',
      type: 'task',
      stage: 'focus',
      project: 'Spatial Canvas Architecture',
      title: 'Implement 1-Click Clipboard Copy Buttons in MICHI',
      content: 'Add direct copy listeners for code blocks, URLs, and vault credentials using navigator.clipboard.',
      status: 'done',
      priority: 'normal',
      progress: 100,
      notes: [],
      tags: ['Tasks', 'Feature'],
      color: '#009967',
      date: '2026-08-07'
    },
    {
      id: 'item-5',
      type: 'vault',
      stage: 'product',
      project: 'Cloud Hosting & Infrastructure',
      title: 'Cloud Web Hosting Control Panel',
      category: 'Web Hosting',
      username: 'stardell@michi.app',
      secret: 'Hw#9938472910482910!',
      notes: [
        { text: 'Production server access key created.', date: 'Aug 05, 2026' }
      ],
      tags: ['Hosting', 'Web'],
      color: '#3B82F6',
      date: '2026-08-05'
    },
    {
      id: 'item-6',
      type: 'vault',
      stage: 'product',
      project: 'Spatial Canvas Architecture',
      title: 'GitHub Developer API Key',
      category: 'API Keys',
      username: 'stardell-dev',
      secret: 'ghp_xK9mQ2pL7vW4zA8bC1dE3fG5hI7jK9',
      notes: [],
      tags: ['API Key', 'Developer'],
      color: '#3B82F6',
      date: '2026-08-07'
    }
  ],
  franklinData: {
    '2026-08-08': {
      tasks: [
        { id: 'fp-1', priority: 'A1', text: 'Finalize MICHI Pipeline & 2-Page Digital Planner', done: false },
        { id: 'fp-2', priority: 'A2', text: 'Review Light & Dark Mode paper textures', done: true },
        { id: 'fp-3', priority: 'B1', text: 'Prepare Product Release Notes', done: false }
      ],
      appts: [
        { id: 'ap-1', time: '09:00 AM', text: 'Product Roadmap Sync with Team', note: 'Discuss Q3 deliverables & UX architecture', done: false },
        { id: 'ap-2', time: '11:30 AM', text: 'Digital Planner & Calendar Review', note: 'Review iPad 2-Page spread layout', done: true },
        { id: 'ap-3', time: '02:00 PM', text: 'MICHI AI Pipeline Architecture Review', note: 'Prepare staging build notes', done: false }
      ],
      trackerText: 'Expense: $45 office supplies. Voice mail: QA sync confirmed.'
    },
    '2026-08-10': {
      tasks: [
        { id: 'fp-10-1', priority: 'A1', text: 'Review Password Vault Master Lock', done: true },
        { id: 'fp-10-2', priority: 'A2', text: 'Audit 4-Stage Project Lineage Timeline', done: false }
      ],
      appts: [
        { id: 'ap-10-1', time: '10:00 AM', text: 'Executive Architecture Review', note: 'Review collapsible sidebar & fluid layout', done: true },
        { id: 'ap-10-2', time: '03:30 PM', text: 'Security Audit & Vault Encryption Sync', note: 'Confirm Master PIN lock logic', done: false }
      ],
      trackerText: 'Email: Security report sent. Expenses: $12 coffee.'
    },
    '2026-08-12': {
      tasks: [
        { id: 'fp-12-1', priority: 'A1', text: 'Deploy Staging Candidate Build', done: false }
      ],
      appts: [
        { id: 'ap-12-1', time: '01:00 PM', text: 'Cloud Web Hosting Configuration', note: 'Verify SSL certificates & domain DNS', done: false }
      ],
      trackerText: 'Domain DNS records updated.'
    }
  }
};

class MichiApp {
  constructor() {
    this.state = this.loadState();
    this.currentTab = 'all';
    this.currentFilter = 'all';
    this.currentStageFilter = 'all';
    this.currentVaultCat = 'all';
    this.currentWebCat = 'all';
    this.selectedProject = 'all';
    const now = new Date();
    this.currentCalYear = now.getFullYear();
    this.currentCalMonth = now.getMonth();
    this.selectedFranklinDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    this.vaultUnlocked = false;
    
    this.initElements();
    this.initSeasonalTheme();
    this.startHeaderClock();
    this.bindEvents();
    this.restoreSidebarState();
    this.checkIncomingShareTarget();
    this.render();
  }

  startHeaderClock() {
    const updateClock = () => {
      const dateEl = document.getElementById('headerClockDate');
      const timeEl = document.getElementById('headerClockTime');

      const now = new Date();
      const optionsDate = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };

      const dateStr = now.toLocaleDateString('en-US', optionsDate);
      const timeStr = now.toLocaleTimeString('en-US', optionsTime);

      if (dateEl) dateEl.textContent = dateStr;
      if (timeEl) timeEl.textContent = timeStr;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  initSeasonalTheme() {
    this.themeSelector = document.getElementById('themeSelector');
    const savedTheme = localStorage.getItem('MICHI_COLOR_THEME') || 'winter';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (this.themeSelector) {
      this.themeSelector.value = savedTheme;
      this.themeSelector.addEventListener('change', (e) => {
        const selected = e.target.value;
        document.documentElement.setAttribute('data-theme', selected);
        localStorage.setItem('MICHI_COLOR_THEME', selected);
        
        const names = {
          summer: '🌿 夏 Natsu (Summer - Lonely Beach)',
          tokyo: '🏮 東京 Tokyo Nights',
          winter: '🪼 冬 Fuyu (Winter - Jellyfish Night)',
          spring: '🌸 春 Haru (Spring - Sakura Blossom)',
          autumn: '🍁 秋 Aki (Autumn - Kyoto Maple)'
        };
        this.showToast(`Switched to ${names[selected] || selected}`);
      });
    }
  }

  loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.items || !Array.isArray(parsed.items)) {
          parsed.items = [];
        }
        if (!parsed.franklinData) parsed.franklinData = defaultState.franklinData;
        if (!parsed.customWebCategories) parsed.customWebCategories = defaultState.customWebCategories;
        if (!parsed.customProjects || !Array.isArray(parsed.customProjects)) {
          parsed.customProjects = [];
        }
        if (!parsed.contacts || !Array.isArray(parsed.contacts)) {
          parsed.contacts = JSON.parse(JSON.stringify(defaultState.contacts || []));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  getWorkspaceProjects() {
    if (!this.state.customProjects || !Array.isArray(this.state.customProjects)) {
      this.state.customProjects = [];
    }
    const deleted = new Set(this.state.deletedProjects || []);
    const projects = new Set();

    // Include explicitly added custom projects (not deleted)
    this.state.customProjects.forEach(p => {
      if (p && p.trim() && !deleted.has(p.trim())) {
        projects.add(p.trim());
      }
    });

    // Include projects that exist on active items
    (this.state.items || []).forEach(i => {
      if (i.project && i.project.trim() && i.project.trim() !== 'all' && !deleted.has(i.project.trim())) {
        projects.add(i.project.trim());
      }
    });

    // Include projects that exist on contacts
    (this.state.contacts || []).forEach(c => {
      (c.projects || []).forEach(p => {
        if (p && p.trim() && !deleted.has(p.trim())) {
          projects.add(p.trim());
        }
      });
    });

    // Default fallback if workspace has no projects yet
    if (projects.size === 0) {
      projects.add('General');
    }

    return Array.from(projects);
  }

  saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.render();
  }

  initElements() {
    this.navTabs = document.querySelectorAll('.nav-tab');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.searchInput = document.getElementById('searchInput');
    this.filterPills = document.querySelectorAll('.filter-pill');
    this.cardsGrid = document.getElementById('cardsGrid');
    this.ideasGrid = document.getElementById('ideasGrid');
    this.brainDumpCatSelect = document.getElementById('brainDumpCatSelect');
    this.brainDumpCatFilterAll = document.getElementById('brainDumpCatFilterAll');
    this.btnCreateNewProjectHeader = document.getElementById('btnCreateNewProjectHeader');
    this.btnCreateNewProjectControls = document.getElementById('btnCreateNewProjectControls');
    
    // Sidebar Elements
    this.appSidebar = document.getElementById('appSidebar');
    this.btnToggleSidebar = document.getElementById('btnToggleSidebar');
    this.sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');
    // Home Screen Daily Reminder
    this.homeDailyReminderInput = document.getElementById('homeDailyReminderInput');
    this.reminderLastSaved = document.getElementById('reminderLastSaved');

    // MICHI Dispatcher Elements
    this.dispatchProjectSelect = document.getElementById('dispatchProjectSelect');
    this.dispatchType = document.getElementById('dispatchType');
    this.dispatchInput = document.getElementById('dispatchInput');
    this.btnSend = document.getElementById('btnSend');

    // Pipeline Stage Buttons
    this.pipelineStages = document.querySelectorAll('.pipeline-stage');

    // Kanban Lists
    this.taskListTodo = document.getElementById('taskListTodo');
    this.taskListInProgress = document.getElementById('taskListInProgress');
    this.taskListDone = document.getElementById('taskListDone');

    // Counts & Grid Containers
    this.countTodo = document.getElementById('countTodo');
    this.countInProgress = document.getElementById('countInProgress');
    this.countDone = document.getElementById('countDone');
    
    // Custom Confirmation Modal
    this.michiConfirmModalOverlay = document.getElementById('michiConfirmModalOverlay');
    this.michiConfirmTitle = document.getElementById('michiConfirmTitle');
    this.michiConfirmMessage = document.getElementById('michiConfirmMessage');
    this.btnMichiConfirmCancel = document.getElementById('btnMichiConfirmCancel');
    this.btnMichiConfirmAction = document.getElementById('btnMichiConfirmAction');

    // Start New Project Modal Elements
    this.btnStartNewProject = document.getElementById('btnStartNewProject');
    this.newProjectModalOverlay = document.getElementById('newProjectModalOverlay');
    this.btnCloseNewProjectModal = document.getElementById('btnCloseNewProjectModal');
    this.btnCancelNewProject = document.getElementById('btnCancelNewProject');
    this.newProjectContactSelect = document.getElementById('newProjectContactSelect');
    this.newProjectManualContact = document.getElementById('newProjectManualContact');

    // Contacts Container & Modal Elements
    this.contactsGrid = document.getElementById('contactsGrid');
    this.contactsSearchInput = document.getElementById('contactsSearchInput');
    this.btnCreateNewContact = document.getElementById('btnCreateNewContact');
    this.contactModalOverlay = document.getElementById('contactModalOverlay');
    this.contactModalTitle = document.getElementById('contactModalTitle');
    this.btnCloseContactModal = document.getElementById('btnCloseContactModal');
    this.btnCancelContactModal = document.getElementById('btnCancelContactModal');
    this.contactForm = document.getElementById('contactForm');
    this.contactFormId = document.getElementById('contactFormId');
    this.contactFormName = document.getElementById('contactFormName');
    this.contactFormRole = document.getElementById('contactFormRole');
    this.contactFormEmail = document.getElementById('contactFormEmail');
    this.contactFormPhone = document.getElementById('contactFormPhone');
    this.contactFormCompany = document.getElementById('contactFormCompany');
    this.contactFormProjectsList = document.getElementById('contactFormProjectsList');
    this.contactFormNotes = document.getElementById('contactFormNotes');

    // Quick Assign Contact to Project Elements
    this.assignContactModalOverlay = document.getElementById('assignContactModalOverlay');
    this.btnCloseAssignContactModal = document.getElementById('btnCloseAssignContactModal');
    this.btnCancelAssignContact = document.getElementById('btnCancelAssignContact');
    this.assignContactForm = document.getElementById('assignContactForm');
    this.assignContactProjectSelect = document.getElementById('assignContactProjectSelect');
    this.assignContactExistingSelect = document.getElementById('assignContactExistingSelect');
    this.assignContactManualName = document.getElementById('assignContactManualName');
    this.assignContactManualEmail = document.getElementById('assignContactManualEmail');
    this.assignContactManualPhone = document.getElementById('assignContactManualPhone');
    this.newProjectForm = document.getElementById('newProjectForm');
    this.newProjectTitle = document.getElementById('newProjectTitle');
    this.newProjectSpark = document.getElementById('newProjectSpark');

    // Vault Elements & Popup Lock Modal
    this.vaultLockModalOverlay = document.getElementById('vaultLockModalOverlay');
    this.btnCloseVaultLockModal = document.getElementById('btnCloseVaultLockModal');
    this.btnCancelVaultUnlock = document.getElementById('btnCancelVaultUnlock');
    this.vaultUnlockedContent = document.getElementById('vaultUnlockedContent');
    this.vaultLockTitle = document.getElementById('vaultLockTitle');
    this.vaultLockSubtitle = document.getElementById('vaultLockSubtitle');
    this.vaultUnlockForm = document.getElementById('vaultUnlockForm');
    this.vaultMasterPassInput = document.getElementById('vaultMasterPassInput');
    this.vaultConfirmPassGroup = document.getElementById('vaultConfirmPassGroup');
    this.vaultMasterPassConfirmInput = document.getElementById('vaultMasterPassConfirmInput');
    this.vaultLockError = document.getElementById('vaultLockError');
    this.btnSubmitVaultUnlock = document.getElementById('btnSubmitVaultUnlock');
    this.btnLockVault = document.getElementById('btnLockVault');
    this.vaultTableBody = document.getElementById('vaultTableBody');
    this.btnAddPasswordRow = document.getElementById('btnAddPasswordRow');
    this.vaultSearchInput = document.getElementById('vaultSearchInput');
    this.vaultCategoryPillsContainer = document.getElementById('vaultCategoryPills');

    // Web Repository Elements
    this.btnAddWebClip = document.getElementById('btnAddWebClip');
    this.webClipModalOverlay = document.getElementById('webClipModalOverlay');
    this.btnCloseWebClipModal = document.getElementById('btnCloseWebClipModal');
    this.btnCancelWebClip = document.getElementById('btnCancelWebClip');
    this.webClipForm = document.getElementById('webClipForm');
    this.webClipTitle = document.getElementById('webClipTitle');
    this.webClipUrl = document.getElementById('webClipUrl');
    this.webClipCategory = document.getElementById('webClipCategory');
    this.customWebCategoryWrapper = document.getElementById('customWebCategoryWrapper');
    this.webClipCustomCategory = document.getElementById('webClipCustomCategory');
    this.webClipContent = document.getElementById('webClipContent');
    this.webCategoryPillsContainer = document.getElementById('webCategoryPills');

    // Project Lineage Elements
    this.projectLineageSelect = document.getElementById('projectLineageSelect');
    this.projectLineageContainer = document.getElementById('projectLineageContainer');

    // Line-by-Line Quick Note Modal Elements
    this.noteModalOverlay = document.getElementById('noteModalOverlay');
    this.noteModalTitle = document.getElementById('noteModalTitle');
    this.btnCloseNoteModal = document.getElementById('btnCloseNoteModal');
    this.btnCancelNote = document.getElementById('btnCancelNote');
    this.btnDeleteNote = document.getElementById('btnDeleteNote');
    this.addNoteForm = document.getElementById('addNoteForm');
    this.noteModalItemId = document.getElementById('noteModalItemId');
    this.noteModalIndex = document.getElementById('noteModalIndex');
    this.noteInputText = document.getElementById('noteInputText');

    // Full Reader Print Modal
    this.printModalOverlay = document.getElementById('printModalOverlay');
    this.btnClosePrintModal = document.getElementById('btnClosePrintModal');
    this.printModalTitle = document.getElementById('printModalTitle');
    this.printModalStageBadge = document.getElementById('printModalStageBadge');
    this.printModalBody = document.getElementById('printModalBody');
    this.printModalNotesList = document.getElementById('printModalNotesList');
    this.printModalDateTags = document.getElementById('printModalDateTags');
    this.btnPrintModalCopy = document.getElementById('btnPrintModalCopy');
    this.btnPrintModalPrint = document.getElementById('btnPrintModalPrint');
    this.activePrintItem = null;

    this.calendarGrid = document.getElementById('calendarGrid');
    this.toast = document.getElementById('toast');

    // Calendar Appt Modal Elements
    this.apptModalOverlay = document.getElementById('apptModalOverlay');
    this.btnCloseApptModal = document.getElementById('btnCloseApptModal');
    this.btnCancelApptForm = document.getElementById('btnCancelApptForm');
    this.calendarApptForm = document.getElementById('calendarApptForm');
    this.apptModalDateTitle = document.getElementById('apptModalDateTitle');
    this.apptModalSubTitle = document.getElementById('apptModalSubTitle');
    this.apptFormDate = document.getElementById('apptFormDate');
    this.apptFormId = document.getElementById('apptFormId');
    this.apptFormTime = document.getElementById('apptFormTime');
    this.apptFormTitle = document.getElementById('apptFormTitle');
    this.apptFormNotes = document.getElementById('apptFormNotes');
    this.apptModalExistingList = document.getElementById('apptModalExistingList');

    this.btnQuickAddApptTab = document.getElementById('btnQuickAddApptTab');
    if (this.btnQuickAddApptTab) {
      this.btnQuickAddApptTab.addEventListener('click', () => {
        const todayStr = this.getTodayLocalDateStr();
        this.openApptModal(todayStr);
      });
    }

    if (this.brainDumpCatSelect) {
      this.brainDumpCatSelect.addEventListener('change', (e) => {
        this.currentWebCat = e.target.value;
        if (this.brainDumpCatFilterAll) this.brainDumpCatFilterAll.value = e.target.value;
        this.render();
      });
    }

    if (this.brainDumpCatFilterAll) {
      this.brainDumpCatFilterAll.addEventListener('change', (e) => {
        this.currentWebCat = e.target.value;
        if (this.brainDumpCatSelect) this.brainDumpCatSelect.value = e.target.value;
        this.render();
      });
    }

    if (this.apptFormDate) {
      this.apptFormDate.addEventListener('change', (e) => {
        const selectedDate = e.target.value;
        if (selectedDate) {
          this.selectedApptDate = this.normalizeDateStr(selectedDate);
          const formattedDate = this.formatFullDate(this.selectedApptDate);
          if (this.apptModalDateTitle) this.apptModalDateTitle.textContent = `Schedule Appointment — ${formattedDate}`;
          this.renderApptModalExistingList();
        }
      });
    }

    // Calendar Month Navigation Buttons
    this.btnCalPrevMonth = document.getElementById('btnCalPrevMonth');
    this.btnCalNextMonth = document.getElementById('btnCalNextMonth');
    this.btnCalToday = document.getElementById('btnCalToday');
    this.calendarMonthTitle = document.getElementById('calendarMonthTitle');

    if (this.btnCalPrevMonth) {
      this.btnCalPrevMonth.addEventListener('click', () => {
        this.currentCalMonth--;
        if (this.currentCalMonth < 0) {
          this.currentCalMonth = 11;
          this.currentCalYear--;
        }
        this.renderCalendar();
      });
    }

    if (this.btnCalNextMonth) {
      this.btnCalNextMonth.addEventListener('click', () => {
        this.currentCalMonth++;
        if (this.currentCalMonth > 11) {
          this.currentCalMonth = 0;
          this.currentCalYear++;
        }
        this.renderCalendar();
      });
    }

    if (this.btnCalToday) {
      this.btnCalToday.addEventListener('click', () => {
        const today = new Date();
        this.currentCalYear = today.getFullYear();
        this.currentCalMonth = today.getMonth();
        this.renderCalendar();
      });
    }

    // Backup & Restore Triggers
    this.btnExportBackup = document.getElementById('btnExportBackup');
    this.btnImportBackup = document.getElementById('btnImportBackup');
    this.importFileInput = document.getElementById('importFileInput');

    if (this.btnExportBackup) {
      this.btnExportBackup.onclick = (e) => {
        e.preventDefault();
        this.exportWorkspaceBackup();
      };
    }

    if (this.btnImportBackup && this.importFileInput) {
      this.btnImportBackup.onclick = (e) => {
        e.preventDefault();
        this.importFileInput.click();
      };
      this.importFileInput.onchange = (e) => {
        this.importWorkspaceBackup(e);
      };
    }

    // Tutorial Guide Elements
    this.tutorialModalOverlay = document.getElementById('tutorialModalOverlay');
    this.btnOpenTutorialHeader = document.getElementById('btnOpenTutorialHeader');
    this.btnCloseTutorialModal = document.getElementById('btnCloseTutorialModal');
    this.btnPrevTutorialStep = document.getElementById('btnPrevTutorialStep');
    this.btnNextTutorialStep = document.getElementById('btnNextTutorialStep');
    this.tutorialStepIndicator = document.getElementById('tutorialStepIndicator');
    this.tutorialSlides = document.querySelectorAll('.tutorial-slide');
    this.currentTutorialSlide = 1;

    if (this.btnOpenTutorialHeader) {
      this.btnOpenTutorialHeader.addEventListener('click', () => this.openTutorialModal());
    }
    if (this.btnCloseTutorialModal) {
      this.btnCloseTutorialModal.addEventListener('click', () => this.closeTutorialModal());
    }
    if (this.btnPrevTutorialStep) {
      this.btnPrevTutorialStep.addEventListener('click', () => this.prevTutorialSlide());
    }
    if (this.btnNextTutorialStep) {
      this.btnNextTutorialStep.addEventListener('click', () => this.nextTutorialSlide());
    }

    if (this.btnCloseApptModal) this.btnCloseApptModal.addEventListener('click', () => this.closeApptModal());
    if (this.btnCancelApptForm) this.btnCancelApptForm.addEventListener('click', () => this.closeApptModal());
    if (this.calendarApptForm) {
      this.calendarApptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleApptFormSubmit();
      });
    }

    // Planner Modal Elements
    this.franklinModalOverlay = document.getElementById('franklinModalOverlay');
    this.binderBookSpread = document.getElementById('binderBookSpread');
    this.btnCloseFranklinModal = document.getElementById('btnCloseFranklinModal');
    this.btnSaveFranklinPlanner = document.getElementById('btnSaveFranklinPlanner');
    this.franklinDateTitle = document.getElementById('franklinDateTitle');
    this.franklinPrioSelect = document.getElementById('franklinPrioSelect');
    this.franklinTaskText = document.getElementById('franklinTaskText');
    this.btnAddFranklinTask = document.getElementById('btnAddFranklinTask');
    this.franklinTaskList = document.getElementById('franklinTaskList');
    this.plannerFontSelect = document.getElementById('plannerFontSelect');
    this.franklinDailyTrackerInput = document.getElementById('franklinDailyTrackerInput');

    // Flexible Appointment Builder Elements
    this.apptTimeSelect = document.getElementById('apptTimeSelect');
    this.apptTextInput = document.getElementById('apptTextInput');
    this.apptNoteInput = document.getElementById('apptNoteInput');
    this.btnAddAppt = document.getElementById('btnAddAppt');
    this.franklinTimeline = document.getElementById('franklinTimeline');

    this.btnPrevPage = document.getElementById('btnPrevPage');
    this.btnNextPage = document.getElementById('btnNextPage');
    this.monthTabs = document.querySelectorAll('.month-tab-item');

    // Edit Item Modal Elements
    this.editModalOverlay = document.getElementById('editModalOverlay');
    this.btnCloseEditModal = document.getElementById('btnCloseEditModal');
    this.btnCancelEdit = document.getElementById('btnCancelEdit');
    this.editItemForm = document.getElementById('editItemForm');
    this.editItemId = document.getElementById('editItemId');
    this.editItemTitle = document.getElementById('editItemTitle');
    this.editItemStage = document.getElementById('editItemStage');
    this.editItemContent = document.getElementById('editItemContent');
    this.editItemUrl = document.getElementById('editItemUrl');
    this.editItemCategory = document.getElementById('editItemCategory');
    this.customCategoryWrapper = document.getElementById('customCategoryWrapper');
    this.editItemCustomCategory = document.getElementById('editItemCustomCategory');
    this.editItemUsername = document.getElementById('editItemUsername');
    this.editItemSecret = document.getElementById('editItemSecret');
    this.btnGeneratePassword = document.getElementById('btnGeneratePassword');
    this.editItemTags = document.getElementById('editItemTags');
    this.editVaultGroup = document.getElementById('editVaultGroup');
  }

  confirmDialog(message, title = 'Delete Confirmation', actionCallback) {
    if (this.michiConfirmTitle) this.michiConfirmTitle.textContent = title;
    if (this.michiConfirmMessage) this.michiConfirmMessage.textContent = message;

    if (this.michiConfirmModalOverlay) {
      this.michiConfirmModalOverlay.classList.add('active');
    }

    const handleAction = () => {
      cleanup();
      if (actionCallback) actionCallback();
    };

    const handleCancel = () => {
      cleanup();
    };

    const cleanup = () => {
      if (this.michiConfirmModalOverlay) this.michiConfirmModalOverlay.classList.remove('active');
      if (this.btnMichiConfirmAction) this.btnMichiConfirmAction.removeEventListener('click', handleAction);
      if (this.btnMichiConfirmCancel) this.btnMichiConfirmCancel.removeEventListener('click', handleCancel);
    };

    if (this.btnMichiConfirmAction) this.btnMichiConfirmAction.addEventListener('click', handleAction);
    if (this.btnMichiConfirmCancel) this.btnMichiConfirmCancel.addEventListener('click', handleCancel);
  }

  openNewProjectModal() {
    if (this.newProjectTitle) this.newProjectTitle.value = '';
    if (this.newProjectSpark) this.newProjectSpark.value = '';
    if (this.newProjectModalOverlay) {
      this.newProjectModalOverlay.classList.add('active');
      if (this.newProjectTitle) this.newProjectTitle.focus();
    }
  }

  closeNewProjectModal() {
    if (this.newProjectModalOverlay) {
      this.newProjectModalOverlay.classList.remove('active');
    }
  }

  handleCreateNewProject() {
    const title = this.newProjectTitle.value.trim();
    const sparkText = this.newProjectSpark.value.trim();

    if (!title || !sparkText) return;

    if (!this.state.items) this.state.items = [];

    const now = new Date().toISOString().split('T')[0];

    const initialSpark = {
      id: 'item-spark-' + Date.now(),
      type: 'idea',
      stage: 'spark',
      project: title,
      title: `${title}: Initial Vision & Objectives`,
      content: sparkText,
      notes: [
        { text: `Project "${title}" created and launched on Michi Path.`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }
      ],
      tags: [title, 'Project Launch', 'Spark'],
      color: '#FBF582',
      date: now
    };

    if (!this.state.customProjects || !Array.isArray(this.state.customProjects)) {
      this.state.customProjects = [];
    }
    if (!this.state.customProjects.includes(title)) {
      this.state.customProjects.push(title);
    }

    // Handle attached contact during project launch
    const selectedContactId = this.newProjectContactSelect ? this.newProjectContactSelect.value : '';
    const manualContactName = this.newProjectManualContact ? this.newProjectManualContact.value.trim() : '';

    if (selectedContactId) {
      const contact = (this.state.contacts || []).find(c => c.id === selectedContactId);
      if (contact) {
        if (!contact.projects) contact.projects = [];
        if (!contact.projects.includes(title)) contact.projects.push(title);
      }
    } else if (manualContactName) {
      let existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === manualContactName.toLowerCase());
      if (existing) {
        if (!existing.projects) existing.projects = [];
        if (!existing.projects.includes(title)) existing.projects.push(title);
      } else {
        if (!this.state.contacts) this.state.contacts = [];
        this.state.contacts.push({
          id: 'contact-' + Date.now(),
          name: manualContactName,
          role: 'Project Collaborator',
          company: '',
          email: '',
          phone: '',
          projects: [title],
          notes: `Added during project launch for "${title}".`,
          color: '#7CFEFE'
        });
      }
    }

    this.state.items.unshift(initialSpark);
    this.selectedProject = title;
    this.saveState();
    this.closeNewProjectModal();

    this.switchTab('project-path');
    this.showToast(`🚀 Launched Project "${title}" with Stage 1 Spark!`);
  }

  restoreSidebarState() {
    if (localStorage.getItem('MICHI_SIDEBAR_COLLAPSED') === 'true' && this.appSidebar) {
      this.appSidebar.classList.add('collapsed');
    }
  }

  checkIncomingShareTarget() {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('url') || params.get('text');
    const sharedTitle = params.get('title');

    if (sharedUrl) {
      const cleanUrlMatch = sharedUrl.match(/(https?:\/\/[^\s]+)/g);
      const targetUrl = cleanUrlMatch ? cleanUrlMatch[0] : sharedUrl;

      this.switchTab('ideas');
      this.openWebClipModal();
      
      if (this.webClipUrl) this.webClipUrl.value = targetUrl;
      if (this.webClipTitle) this.webClipTitle.value = sharedTitle || 'Shared Web Capture';
      if (this.webClipContent) this.webClipContent.value = `Shared from iPhone via Share Sheet: ${sharedUrl}`;

      this.showToast('📲 Received web link from iPhone Share Sheet!');
    }
  }

  bindEvents() {
    // Start New Project Triggers
    if (this.btnStartNewProject) {
      this.btnStartNewProject.addEventListener('click', () => this.openNewProjectModal());
    }
    if (this.btnCloseNewProjectModal) {
      this.btnCloseNewProjectModal.addEventListener('click', () => this.closeNewProjectModal());
    }
    if (this.btnCancelNewProject) {
      this.btnCancelNewProject.addEventListener('click', () => this.closeNewProjectModal());
    }
    if (this.newProjectForm) {
      this.newProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateNewProject();
      });
    }

    // Contacts & Contact Assignment Listeners
    if (this.btnCreateNewContact) {
      this.btnCreateNewContact.addEventListener('click', () => this.openContactModal());
    }
    if (this.btnCloseContactModal) {
      this.btnCloseContactModal.addEventListener('click', () => this.closeContactModal());
    }
    if (this.btnCancelContactModal) {
      this.btnCancelContactModal.addEventListener('click', () => this.closeContactModal());
    }
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveContact();
      });
    }
    if (this.contactsSearchInput) {
      this.contactsSearchInput.addEventListener('input', () => this.renderContacts());
    }
    if (this.btnCloseAssignContactModal) {
      this.btnCloseAssignContactModal.addEventListener('click', () => this.closeAssignContactModal());
    }
    if (this.btnCancelAssignContact) {
      this.btnCancelAssignContact.addEventListener('click', () => this.closeAssignContactModal());
    }
    if (this.assignContactForm) {
      this.assignContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAssignContactSubmit();
      });
    }

    if (this.dispatchProjectSelect) {
      this.dispatchProjectSelect.addEventListener('change', (e) => {
        if (e.target.value === '__NEW__') {
          this.openNewProjectModal();
        }
      });
    }

    // + New Project Triggers
    if (this.btnCreateNewProjectHeader) {
      this.btnCreateNewProjectHeader.addEventListener('click', () => this.openNewProjectModal());
    }
    if (this.btnCreateNewProjectControls) {
      this.btnCreateNewProjectControls.addEventListener('click', () => this.openNewProjectModal());
    }

    // Sidebar Toggle
    if (this.btnToggleSidebar && this.appSidebar) {
      this.btnToggleSidebar.addEventListener('click', () => {
        this.appSidebar.classList.toggle('collapsed');
        const isCollapsed = this.appSidebar.classList.contains('collapsed');
        localStorage.setItem('MICHI_SIDEBAR_COLLAPSED', isCollapsed ? 'true' : 'false');
      });
    }

    // Sidebar Navigation Click Listeners
    this.sidebarNavItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetTab = item.dataset.sidebarTab;
        const targetStage = item.dataset.sidebarStage;

        if (targetTab === 'planner') {
          const now = new Date();
          const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
          this.openFranklinModal(this.selectedFranklinDate || todayStr);
          return;
        }

        if (targetStage === 'product' || targetTab === 'vault') {
          this.switchTab('vault');
          return;
        }

        this.sidebarNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (targetStage) {
          this.currentStageFilter = targetStage;
          this.pipelineStages.forEach(s => s.classList.toggle('active', s.dataset.stage === targetStage));
          this.render();
        } else if (targetTab) {
          this.switchTab(targetTab);
        }
      });
    });

    // Web Repository Add Bookmark Triggers
    if (this.btnAddWebClip) {
      this.btnAddWebClip.addEventListener('click', () => this.openWebClipModal());
    }
    if (this.btnCloseWebClipModal) {
      this.btnCloseWebClipModal.addEventListener('click', () => this.closeWebClipModal());
    }
    if (this.btnCancelWebClip) {
      this.btnCancelWebClip.addEventListener('click', () => this.closeWebClipModal());
    }
    if (this.webClipForm) {
      this.webClipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveWebClip();
      });
    }

    // Custom Category Dropdown Handler in Web Clip Modal
    if (this.webClipCategory) {
      this.webClipCategory.addEventListener('change', (e) => {
        if (e.target.value === '__NEW__') {
          if (this.customWebCategoryWrapper) this.customWebCategoryWrapper.style.display = 'block';
          if (this.webClipCustomCategory) this.webClipCustomCategory.focus();
        } else {
          if (this.customWebCategoryWrapper) this.customWebCategoryWrapper.style.display = 'none';
        }
      });
    }

    // Planner Font Selector Event
    if (this.plannerFontSelect) {
      this.plannerFontSelect.addEventListener('change', (e) => {
        const fontStyle = e.target.value;
        localStorage.setItem('MICHI_PLANNER_FONT', fontStyle);
        this.applyPlannerFontStyle(fontStyle);
      });
    }

    // Home Screen Daily Reminder Input
    if (this.homeDailyReminderInput) {
      this.homeDailyReminderInput.addEventListener('input', () => {
        this.state.dailyReminderText = this.homeDailyReminderInput.value;
        this.saveState();
        if (this.reminderLastSaved) {
          this.reminderLastSaved.textContent = 'Saved!';
          setTimeout(() => {
            if (this.reminderLastSaved) this.reminderLastSaved.textContent = 'Auto-saves to MICHI';
          }, 1500);
        }
      });
    }

    // Daily Tracker input handler
    if (this.franklinDailyTrackerInput) {
      this.franklinDailyTrackerInput.addEventListener('input', () => {
        if (!this.state.franklinData[this.selectedFranklinDate]) {
          this.state.franklinData[this.selectedFranklinDate] = { tasks: [], appts: [] };
        }
        this.state.franklinData[this.selectedFranklinDate].trackerText = this.franklinDailyTrackerInput.value;
      });
    }

    // Header Navigation Tabs
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });

    // Vault Lock Modal Controls
    if (this.btnCloseVaultLockModal) {
      this.btnCloseVaultLockModal.addEventListener('click', () => this.closeVaultLockModal());
    }
    if (this.btnCancelVaultUnlock) {
      this.btnCancelVaultUnlock.addEventListener('click', () => this.closeVaultLockModal());
    }

    // Project Selectors
    this.projectLineageSelect = document.getElementById('projectLineageSelect');
    this.dispatchProjectSelect = document.getElementById('dispatchProjectSelect');
    this.globalProjectFilter = document.getElementById('globalProjectFilter');

    if (this.projectLineageSelect) {
      this.projectLineageSelect.addEventListener('change', (e) => {
        this.selectedProject = e.target.value;
        this.render();
        this.showToast(this.selectedProject === 'all' ? 'Showing all projects' : `Filtered to: ${this.selectedProject}`);
      });
    }

    if (this.globalProjectFilter) {
      this.globalProjectFilter.addEventListener('change', (e) => {
        this.selectedProject = e.target.value;
        if (this.currentTab !== 'all') {
          this.switchTab('all');
        } else {
          this.render();
        }
        this.showToast(this.selectedProject === 'all' ? 'Showing all projects' : `Filtered to: ${this.selectedProject}`);
      });
    }

    // Add Flexible Appointment Button Event
    if (this.btnAddAppt) {
      this.btnAddAppt.addEventListener('click', () => this.addAppointment());
    }

    // Line-by-Line Quick Note Modal Events
    if (this.btnCloseNoteModal) this.btnCloseNoteModal.addEventListener('click', () => this.closeNoteModal());
    if (this.btnCancelNote) this.btnCancelNote.addEventListener('click', () => this.closeNoteModal());
    if (this.addNoteForm) {
      this.addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveQuickNote();
      });
    }
    if (this.btnDeleteNote) {
      this.btnDeleteNote.addEventListener('click', () => {
        const itemId = this.noteModalItemId.value;
        const index = parseInt(this.noteModalIndex.value, 10);
        if (!itemId || index < 0) return;

        this.confirmDialog('Are you sure you want to delete this note line?', 'Delete Note Line', () => {
          const item = this.state.items.find(i => i.id === itemId);
          if (item && item.notes) {
            item.notes.splice(index, 1);
            this.saveState();
            this.closeNoteModal();
            this.showToast('Note deleted!');
          }
        });
      });
    }

    // Full Reader Print Modal Events
    if (this.btnClosePrintModal) this.btnClosePrintModal.addEventListener('click', () => this.closePrintModal());
    if (this.btnPrintModalCopy) {
      this.btnPrintModalCopy.addEventListener('click', () => {
        if (!this.activePrintItem) return;
        const notesStr = (this.activePrintItem.notes || []).map(n => `• [${n.date}] ${n.text}`).join('\n');
        const fullText = `[${this.activePrintItem.stage.toUpperCase()}] ${this.activePrintItem.title}\n\n${this.activePrintItem.content}\n\nAppended Notes:\n${notesStr || 'None'}`;
        this.copyToClipboard(fullText, 'Full Record');
      });
    }
    if (this.btnPrintModalPrint) {
      this.btnPrintModalPrint.addEventListener('click', () => window.print());
    }

    // Search Inputs
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }
    if (this.vaultSearchInput) {
      this.vaultSearchInput.addEventListener('input', (e) => {
        this.vaultSearchQuery = e.target.value.toLowerCase().trim();
        this.renderVault();
      });
    }

    // Filter Pills
    this.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        this.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentFilter = pill.dataset.filter;
        this.render();
      });
    });

    // Vault Unlock Form
    if (this.vaultUnlockForm) {
      this.vaultUnlockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleVaultUnlockSubmit();
      });
    }
    if (this.btnLockVault) {
      this.btnLockVault.addEventListener('click', () => this.lockVault());
    }

    // Add New Password Trigger
    if (this.btnAddPasswordRow) {
      this.btnAddPasswordRow.addEventListener('click', () => this.openAddPasswordModal());
    }

    // Category Dropdown
    if (this.editItemCategory) {
      this.editItemCategory.addEventListener('change', (e) => {
        if (e.target.value === '__NEW__') {
          this.customCategoryWrapper.style.display = 'block';
          this.editItemCustomCategory.focus();
        } else {
          this.customCategoryWrapper.style.display = 'none';
        }
      });
    }

    // Generate Password
    if (this.btnGeneratePassword) {
      this.btnGeneratePassword.addEventListener('click', () => {
        const strongPass = this.generateStrongPassword();
        this.editItemSecret.value = strongPass;
        this.showToast('Generated strong password!');
      });
    }

    // Pipeline Stages
    this.pipelineStages.forEach(stage => {
      stage.addEventListener('click', () => {
        const targetStage = stage.dataset.stage;
        if (targetStage === 'product') {
          this.switchTab('vault');
          return;
        }

        this.pipelineStages.forEach(s => s.classList.remove('active'));
        stage.classList.add('active');
        this.currentStageFilter = targetStage;

        this.sidebarNavItems.forEach(i => {
          if (i.dataset.sidebarStage) {
            i.classList.toggle('active', i.dataset.sidebarStage === targetStage);
          }
        });

        this.render();
      });
    });

    // MICHI Dispatcher
    if (this.btnSend) this.btnSend.addEventListener('click', () => this.handleDispatch());
    if (this.dispatchInput) {
      this.dispatchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleDispatch();
      });
    }

    // Planner Modal Events & Overlay Backdrop Click
    if (this.btnCloseFranklinModal) this.btnCloseFranklinModal.addEventListener('click', () => this.closeFranklinModal());
    if (this.btnSaveFranklinPlanner) this.btnSaveFranklinPlanner.addEventListener('click', () => this.saveFranklinModal());
    if (this.btnAddFranklinTask) this.btnAddFranklinTask.addEventListener('click', () => this.addFranklinTask());
    if (this.btnPrevPage) this.btnPrevPage.addEventListener('click', () => this.turnPage(-1));
    if (this.btnNextPage) this.btnNextPage.addEventListener('click', () => this.turnPage(1));

    if (this.franklinModalOverlay) {
      this.franklinModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.franklinModalOverlay) {
          this.closeFranklinModal();
        }
      });
    }

    // Escape Key Handler to Close Any Active Modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.newProjectModalOverlay && this.newProjectModalOverlay.classList.contains('active')) {
          this.closeNewProjectModal();
        }
        if (this.michiConfirmModalOverlay && this.michiConfirmModalOverlay.classList.contains('active')) {
          this.michiConfirmModalOverlay.classList.remove('active');
        }
        if (this.franklinModalOverlay && this.franklinModalOverlay.classList.contains('active')) {
          this.closeFranklinModal();
        }
        if (this.vaultLockModalOverlay && this.vaultLockModalOverlay.classList.contains('active')) {
          this.closeVaultLockModal();
        }
        if (this.noteModalOverlay && this.noteModalOverlay.classList.contains('active')) {
          this.closeNoteModal();
        }
        if (this.webClipModalOverlay && this.webClipModalOverlay.classList.contains('active')) {
          this.closeWebClipModal();
        }
        if (this.printModalOverlay && this.printModalOverlay.classList.contains('active')) {
          this.closePrintModal();
        }
        if (this.editModalOverlay && this.editModalOverlay.classList.contains('active')) {
          this.closeEditModal();
        }
      }
    });

    this.monthTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const month = tab.dataset.month;
        this.monthTabs.forEach(m => m.classList.remove('active'));
        tab.classList.add('active');
        this.selectedFranklinDate = `2026-${month}-08`;
        this.renderFranklinModalContent();
      });
    });

    // Edit Item Modal
    if (this.btnCloseEditModal) this.btnCloseEditModal.addEventListener('click', () => this.closeEditModal());
    if (this.btnCancelEdit) this.btnCancelEdit.addEventListener('click', () => this.closeEditModal());
    if (this.editItemForm) {
      this.editItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveEditItem();
      });
    }
  }

  openWebClipModal() {
    this.currentUploadedImageDataUrl = '';
    if (this.webClipTitle) this.webClipTitle.value = '';
    if (this.webClipUrl) this.webClipUrl.value = '';
    if (this.webClipCategory) this.webClipCategory.value = 'Tech';
    if (this.customWebCategoryWrapper) this.customWebCategoryWrapper.style.display = 'none';
    if (this.webClipCustomCategory) this.webClipCustomCategory.value = '';
    if (this.webClipContent) this.webClipContent.value = '';

    const imgFile = document.getElementById('webClipImageFile');
    const imgPreviewContainer = document.getElementById('imagePreviewContainer');
    const imgPreviewEl = document.getElementById('imagePreviewElement');
    if (imgFile) imgFile.value = '';
    if (imgPreviewContainer) imgPreviewContainer.style.display = 'none';
    if (imgPreviewEl) imgPreviewEl.src = '';

    // Target Selection Toggle Setup
    const targetTypeSelect = document.getElementById('webClipTargetType');
    const wrapperCat = document.getElementById('wrapperTargetCategory');
    const wrapperProj = document.getElementById('wrapperTargetProject');
    const projSelect = document.getElementById('webClipProjectSelect');

    if (projSelect) {
      projSelect.innerHTML = '';
      const projects = this.getWorkspaceProjects();
      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        if (p === this.selectedProject) opt.selected = true;
        projSelect.appendChild(opt);
      });
    }

    if (targetTypeSelect) {
      targetTypeSelect.onchange = () => {
        if (targetTypeSelect.value === 'project') {
          if (wrapperCat) wrapperCat.style.display = 'none';
          if (wrapperProj) wrapperProj.style.display = 'block';
        } else {
          if (wrapperCat) wrapperCat.style.display = 'block';
          if (wrapperProj) wrapperProj.style.display = 'none';
        }
      };
      targetTypeSelect.onchange();
    }

    // Clipboard Paste Button Listener
    const btnPaste = document.getElementById('btnPasteClipboard');
    if (btnPaste) {
      btnPaste.onclick = async () => {
        try {
          if (navigator.clipboard && navigator.clipboard.readText) {
            const text = await navigator.clipboard.readText();
            if (text && this.webClipUrl) {
              this.webClipUrl.value = text.trim();
              this.webClipUrl.dispatchEvent(new Event('input'));
              this.showToast('Pasted link from clipboard!');
            }
          }
        } catch (err) {
          this.showToast('Tap & hold to paste link in input field.');
        }
      };
    }

    // Live URL / Image detection listener
    if (this.webClipUrl && !this.webClipUrl.dataset.bound) {
      this.webClipUrl.dataset.bound = 'true';
      const handleUrlInput = () => {
        const val = this.webClipUrl.value.trim();
        const isImg = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(val);
        if (isImg && val) {
          this.currentUploadedImageDataUrl = val;
          if (imgPreviewEl) imgPreviewEl.src = val;
          if (imgPreviewContainer) imgPreviewContainer.style.display = 'block';
        }
        if (val && this.webClipTitle && !this.webClipTitle.value.trim()) {
          try {
            const domain = new URL(val).hostname.replace('www.', '');
            this.webClipTitle.value = domain.charAt(0).toUpperCase() + domain.slice(1);
          } catch(e) {}
        }
      };
      this.webClipUrl.addEventListener('input', handleUrlInput);
      this.webClipUrl.addEventListener('paste', () => setTimeout(handleUrlInput, 50));
    }

    // Image File Reader Listener
    if (imgFile && !imgFile.dataset.bound) {
      imgFile.dataset.bound = 'true';
      imgFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.currentUploadedImageDataUrl = event.target.result;
            if (imgPreviewEl) imgPreviewEl.src = this.currentUploadedImageDataUrl;
            if (imgPreviewContainer) imgPreviewContainer.style.display = 'block';
            if (this.webClipTitle && !this.webClipTitle.value.trim()) {
              this.webClipTitle.value = file.name.replace(/\.[^/.]+$/, '');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const btnRemoveImg = document.getElementById('btnRemoveImagePreview');
    if (btnRemoveImg) {
      btnRemoveImg.onclick = () => {
        this.currentUploadedImageDataUrl = '';
        if (imgFile) imgFile.value = '';
        if (imgPreviewContainer) imgPreviewContainer.style.display = 'none';
        if (imgPreviewEl) imgPreviewEl.src = '';
      };
    }

    if (this.webClipModalOverlay) {
      this.webClipModalOverlay.classList.add('active');
      if (this.webClipTitle) this.webClipTitle.focus();
    }
  }

  closeWebClipModal() {
    if (this.webClipModalOverlay) {
      this.webClipModalOverlay.classList.remove('active');
    }
  }

  saveWebClip() {
    const targetTypeSelect = document.getElementById('webClipTargetType');
    const projSelect = document.getElementById('webClipProjectSelect');
    const isProjectTarget = targetTypeSelect && targetTypeSelect.value === 'project';

    let title = this.webClipTitle ? this.webClipTitle.value.trim() : '';
    const url = this.webClipUrl ? this.webClipUrl.value.trim() : '';
    const imageUrl = this.currentUploadedImageDataUrl || '';
    let category = this.webClipCategory ? this.webClipCategory.value : 'General';
    
    if (category === '__NEW__') {
      const customVal = this.webClipCustomCategory ? this.webClipCustomCategory.value.trim() : '';
      category = customVal || 'General';
      if (!this.state.customWebCategories) this.state.customWebCategories = [];
      if (!this.state.customWebCategories.includes(category)) {
        this.state.customWebCategories.push(category);
      }
    }

    const content = this.webClipContent ? this.webClipContent.value.trim() : '';

    if (!title) {
      if (url) title = url;
      else if (imageUrl) title = 'Image Upload ' + new Date().toLocaleDateString();
      else return;
    }

    const targetProject = isProjectTarget ? (projSelect ? projSelect.value : 'General') : (this.selectedProject !== 'all' ? this.selectedProject : 'General');
    const targetStage = isProjectTarget ? 'spark' : 'structure';
    const targetType = isProjectTarget ? 'idea' : 'web';

    const newClip = {
      id: 'item-web-' + Date.now(),
      type: targetType,
      stage: targetStage,
      webCategory: category,
      project: targetProject,
      title: title,
      content: content,
      url: url,
      imageUrl: imageUrl,
      notes: [],
      tags: [isProjectTarget ? targetProject : category, 'Upload'],
      color: isProjectTarget ? 'var(--stage-spark)' : 'var(--stage-structure)',
      date: new Date().toISOString().split('T')[0]
    };

    if (!this.state.items) this.state.items = [];
    this.state.items.unshift(newClip);
    this.saveState();
    this.updateCategoryDropdowns();
    this.closeWebClipModal();
    
    if (isProjectTarget) {
      this.showToast(`Saved Entry to Project "${targetProject}"!`);
    } else {
      this.showToast(`Saved to Brain Dump under "${category}"!`);
    }
  }

  switchTab(targetTab) {
    if (!targetTab) return;
    const targetEl = document.getElementById(`tab-${targetTab}`);
    if (!targetEl) return;

    if (targetTab === 'vault' && !this.vaultUnlocked) {
      this.openVaultLockModal();
      return;
    }

    this.navTabs.forEach(t => {
      if (t.dataset && t.dataset.tab) {
        t.classList.toggle('active', t.dataset.tab === targetTab);
      }
    });

    if (this.sidebarNavItems) {
      this.sidebarNavItems.forEach(i => {
        if (i.dataset && i.dataset.sidebarTab) {
          i.classList.toggle('active', i.dataset.sidebarTab === targetTab);
        } else if (i.dataset && i.dataset.sidebarStage) {
          i.classList.toggle('active', i.dataset.sidebarStage === 'all');
        }
      });
    }
    
    this.tabContents.forEach(c => c.classList.remove('active'));
    targetEl.classList.add('active');
    
    this.currentTab = targetTab;
    this.currentStageFilter = 'all'; // Clear stage filter when switching tabs so pristine tab view is shown!
    if (targetTab === 'all') {
      this.selectedProject = 'all';
      if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';
    }
    this.currentFilter = targetTab === 'ideas' ? 'ideas' : (targetTab === 'tasks' ? 'task' : (targetTab === 'vault' ? 'vault' : 'all'));
    
    this.render();

    // Snap viewport to top of page immediately on tab switch
    window.scrollTo(0, 0);
    if (this.mainWorkspace) this.mainWorkspace.scrollTop = 0;
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  openVaultLockModal() {
    this.checkVaultMasterPasswordState();
    if (this.vaultLockModalOverlay) {
      this.vaultLockModalOverlay.classList.add('active');
      if (this.vaultMasterPassInput) this.vaultMasterPassInput.focus();
    }
  }

  closeVaultLockModal() {
    if (this.vaultLockModalOverlay) {
      this.vaultLockModalOverlay.classList.remove('active');
    }
  }

  applyPlannerFontStyle(fontStyle) {
    if (!this.binderBookSpread) return;
    if (fontStyle === 'cursive') {
      this.binderBookSpread.classList.add('planner-font-cursive');
    } else {
      this.binderBookSpread.classList.remove('planner-font-cursive');
    }
  }

  addAppointment() {
    const time = this.apptTimeSelect.value;
    const text = this.apptTextInput.value.trim();
    const note = this.apptNoteInput ? this.apptNoteInput.value.trim() : '';
    if (!text) return;

    if (!this.state.franklinData[this.selectedFranklinDate]) {
      this.state.franklinData[this.selectedFranklinDate] = { tasks: [], appts: [] };
    }

    const dayData = this.state.franklinData[this.selectedFranklinDate];
    if (!dayData.appts) dayData.appts = [];

    dayData.appts.push({
      id: 'ap-' + Date.now(),
      time: time,
      text: text,
      note: note,
      done: false
    });

    this.apptTextInput.value = '';
    if (this.apptNoteInput) this.apptNoteInput.value = '';
    this.renderFranklinModalContent();
    this.showToast(`Added appointment at ${time}`);
  }

  openNoteModal(itemId, noteIndex = -1) {
    const item = this.state.items.find(i => i.id === itemId);
    if (!item) return;

    this.noteModalItemId.value = itemId;
    this.noteModalIndex.value = noteIndex;

    if (noteIndex >= 0 && item.notes && item.notes[noteIndex]) {
      const n = item.notes[noteIndex];
      if (this.noteModalTitle) this.noteModalTitle.textContent = `✏️ Edit Note Line (${n.date})`;
      this.noteInputText.value = n.text;
      if (this.btnDeleteNote) this.btnDeleteNote.style.display = 'block';
    } else {
      if (this.noteModalTitle) this.noteModalTitle.textContent = '➕ Add New Note Line';
      this.noteInputText.value = '';
      if (this.btnDeleteNote) this.btnDeleteNote.style.display = 'none';
    }

    if (this.noteModalOverlay) this.noteModalOverlay.classList.add('active');
    if (this.noteInputText) this.noteInputText.focus();
  }

  closeNoteModal() {
    if (this.noteModalOverlay) this.noteModalOverlay.classList.remove('active');
  }

  saveQuickNote() {
    const id = this.noteModalItemId.value;
    const index = parseInt(this.noteModalIndex.value, 10);
    const text = this.noteInputText.value.trim();
    if (!id || !text) return;

    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    if (!item.notes) item.notes = [];

    if (index >= 0 && item.notes[index]) {
      item.notes[index].text = text;
      this.showToast('Note line updated!');
    } else {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      item.notes.unshift({ text, date: dateStr });
      this.showToast('New note line added!');
    }

    this.saveState();
    this.closeNoteModal();
  }

  openPrintModal(itemId) {
    const item = this.state.items.find(i => i.id === itemId);
    if (!item) return;

    this.activePrintItem = item;
    this.printModalTitle.textContent = item.title;
    this.printModalStageBadge.textContent = `${item.stage.toUpperCase()}`;
    this.printModalBody.textContent = item.content;

    this.printModalNotesList.innerHTML = '';
    if (item.notes && item.notes.length > 0) {
      item.notes.forEach(n => {
        const noteDiv = document.createElement('div');
        noteDiv.style.background = 'rgba(255,255,255,0.04)';
        noteDiv.style.border = '1px solid var(--border)';
        noteDiv.style.padding = '0.6rem 0.8rem';
        noteDiv.style.borderRadius = 'var(--radius-sm)';
        noteDiv.style.fontSize = '0.85rem';
        noteDiv.innerHTML = `<span style="font-size: 0.72rem; color: var(--stage-structure); font-weight: 700;">${this.escapeHtml(n.date)}</span><br>${this.escapeHtml(n.text)}`;
        this.printModalNotesList.appendChild(noteDiv);
      });
    } else {
      this.printModalNotesList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-dim); font-style: italic;">No appended notes.</div>`;
    }

    this.printModalDateTags.textContent = `Date: ${item.date || ''} | Project: ${item.project || 'General'} | Tags: ${(item.tags || []).join(', ')}`;
    if (this.printModalOverlay) this.printModalOverlay.classList.add('active');
  }

  closePrintModal() {
    if (this.printModalOverlay) this.printModalOverlay.classList.remove('active');
  }

  checkVaultMasterPasswordState() {
    const savedPass = localStorage.getItem(VAULT_PASS_KEY);
    if (!savedPass) {
      this.vaultLockTitle.textContent = 'Set Up Vault Master Password';
      this.vaultLockSubtitle.textContent = 'Create a secure Master Password to protect your accounts and password vault.';
      this.vaultConfirmPassGroup.style.display = 'block';
      this.vaultMasterPassInput.placeholder = 'Create Master Password...';
      this.btnSubmitVaultUnlock.textContent = 'Save Master Password & Unlock';
    } else {
      this.vaultLockTitle.textContent = 'MICHI Vault is Locked';
      this.vaultLockSubtitle.textContent = 'Enter your Vault Master Password to access your accounts and secrets.';
      this.vaultConfirmPassGroup.style.display = 'none';
      this.vaultMasterPassInput.placeholder = 'Master Password...';
      this.btnSubmitVaultUnlock.textContent = 'Unlock Vault';
    }
    this.vaultLockError.style.display = 'none';
  }

  handleVaultUnlockSubmit() {
    const savedPass = localStorage.getItem(VAULT_PASS_KEY);
    const passVal = this.vaultMasterPassInput.value.trim();

    if (!savedPass) {
      const confirmVal = this.vaultMasterPassConfirmInput.value.trim();
      if (passVal.length < 3) {
        this.vaultLockError.textContent = 'Master password must be at least 3 characters.';
        this.vaultLockError.style.display = 'block';
        return;
      }
      if (passVal !== confirmVal) {
        this.vaultLockError.textContent = 'Master passwords do not match. Please try again.';
        this.vaultLockError.style.display = 'block';
        return;
      }

      localStorage.setItem(VAULT_PASS_KEY, passVal);
      this.vaultUnlocked = true;
      this.vaultMasterPassInput.value = '';
      this.vaultMasterPassConfirmInput.value = '';
      this.closeVaultLockModal();
      this.switchTab('vault');
      this.showToast('Vault Master Password set! Vault unlocked.');
    } else {
      if (passVal === savedPass) {
        this.vaultUnlocked = true;
        this.vaultMasterPassInput.value = '';
        this.closeVaultLockModal();
        this.switchTab('vault');
        this.showToast('Vault unlocked.');
      } else {
        this.vaultLockError.textContent = 'Incorrect master password. Please try again.';
        this.vaultLockError.style.display = 'block';
      }
    }
  }

  lockVault() {
    this.vaultUnlocked = false;
    this.vaultMasterPassInput.value = '';
    this.switchTab('all');
    this.showToast('Vault locked & closed');
  }

  generateStrongPassword(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let res = '';
    for (let i = 0; i < length; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  }

  updateCategoryDropdownOptions() {
    if (!this.editItemCategory) return;
    const categories = new Set(['Web Hosting', 'API Keys', 'Email & Login', 'General']);
    this.state.items.filter(i => i.type === 'vault').forEach(i => {
      if (i.category) categories.add(i.category);
    });

    this.editItemCategory.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      this.editItemCategory.appendChild(opt);
    });

    const newOpt = document.createElement('option');
    newOpt.value = '__NEW__';
    newOpt.textContent = 'Create Custom Category...';
    this.editItemCategory.appendChild(newOpt);
  }

  openAddPasswordModal() {
    if (!this.vaultUnlocked) {
      this.openVaultLockModal();
      return;
    }

    this.updateCategoryDropdownOptions();

    this.editItemId.value = '';
    this.editItemTitle.value = '';
    this.editItemStage.value = 'product';
    this.editItemContent.value = 'Account password entry';
    this.editItemUrl.value = '';
    
    if (this.currentVaultCat !== 'all') {
      this.editItemCategory.value = this.currentVaultCat;
    } else {
      this.editItemCategory.value = 'API Keys';
    }

    this.customCategoryWrapper.style.display = 'none';
    this.editItemCustomCategory.value = '';
    this.editItemUsername.value = '';
    this.editItemSecret.value = '';
    this.editItemTags.value = 'Password, Account';

    this.editVaultGroup.style.display = 'flex';
    if (this.editModalOverlay) {
      this.editModalOverlay.classList.add('active');
    }
  }

  moveItemToStage(id, targetStage) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    if (targetStage === 'all') return;

    item.stage = targetStage;
    const colors = { spark: '#FBF582', structure: '#009967', focus: '#7CFEFE', product: '#3B82F6' };
    item.color = colors[targetStage] || '#FBF582';
    this.saveState();
    this.showToast(`Moved card to Stage: ${targetStage.toUpperCase()}`);
  }

  moveTaskStatus(id, newStatus, progress) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    item.status = newStatus;
    item.progress = progress;
    if (newStatus === 'done') {
      item.stage = 'product';
    } else {
      item.stage = 'focus';
    }
    this.saveState();
    this.showToast(`Task moved to ${newStatus.toUpperCase()}`);
  }

  handleDispatch() {
    const text = this.dispatchInput.value.trim();
    if (!text) return;

    if (!this.state.items) this.state.items = [];

    const type = this.dispatchType.value;
    const project = (this.dispatchProjectSelect && this.dispatchProjectSelect.value !== '__NEW__') ? this.dispatchProjectSelect.value : 'General';
    const now = new Date().toISOString().split('T')[0];

    const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
    const hasUrl = urlMatch && urlMatch.length > 0;

    let newItem = {
      id: 'item-' + Date.now(),
      type: type === 'auto' ? (hasUrl ? 'web' : 'idea') : type,
      stage: 'spark',
      project: project,
      title: text.length > 45 ? text.substring(0, 45) + '...' : text,
      content: text,
      notes: [],
      tags: [project, 'Spark'],
      date: now,
      color: '#FBF582'
    };

    if (newItem.type === 'web') {
      newItem.stage = 'structure';
      newItem.webCategory = 'Tech';
      newItem.url = hasUrl ? urlMatch[0] : '';
      newItem.color = '#009967';
      newItem.tags = [project, 'Web Capture'];
    } else if (newItem.type === 'task') {
      newItem.stage = 'focus';
      newItem.status = 'todo';
      newItem.priority = 'normal';
      newItem.progress = 0;
      newItem.color = '#7CFEFE';
      newItem.tags = [project, 'Tasks'];
    } else if (newItem.type === 'vault') {
      newItem.stage = 'product';
      const parts = text.split(':');
      newItem.title = parts[0] || 'Saved Password';
      newItem.category = 'General';
      newItem.username = 'user@michi';
      newItem.secret = parts[1] || text;
      newItem.color = '#3B82F6';
      newItem.tags = [project, 'Vault'];
    }

    this.state.items.unshift(newItem);
    this.dispatchInput.value = '';

    // Switch tab to all and reset stage filter so new item appears instantly!
    this.currentStageFilter = 'all';
    this.currentFilter = 'all';
    this.pipelineStages.forEach(s => s.classList.toggle('active', s.dataset.stage === 'all'));
    this.switchTab('all');

    this.saveState();
    this.showToast(`Spark added to ${project}: ${newItem.type.toUpperCase()}`);
  }

  advanceItemStage(id) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    const stages = ['spark', 'structure', 'focus', 'product'];
    const stageNames = { spark: 'Ideas', structure: 'Resources', focus: 'Development', product: 'Completed' };
    const currentIndex = stages.indexOf(item.stage || 'spark');

    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1];
      const colors = { spark: '#FBF582', structure: '#009967', focus: '#7CFEFE', product: '#3B82F6' };

      // Create a new workable copy in the next stage while preserving the original item intact!
      const advancedCopy = JSON.parse(JSON.stringify(item));
      advancedCopy.id = 'item-' + nextStage + '-' + Date.now();
      advancedCopy.stage = nextStage;
      advancedCopy.color = colors[nextStage];
      advancedCopy.date = new Date().toISOString().split('T')[0];

      if (!this.state.items) this.state.items = [];
      this.state.items.unshift(advancedCopy);
      this.saveState();
      this.render();
      this.showToast(`Original preserved! Created workable ${stageNames[nextStage]} board.`);
    } else {
      this.showToast('Item is already in final Completed stage!');
    }
  }

  regressItemStage(id) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    const stages = ['spark', 'structure', 'focus', 'product'];
    const stageNames = { spark: 'Ideas', structure: 'Resources', focus: 'Development', product: 'Completed' };
    const currentIndex = stages.indexOf(item.stage || 'spark');

    if (currentIndex > 0) {
      const prevStage = stages[currentIndex - 1];
      const colors = { spark: '#FBF582', structure: '#009967', focus: '#7CFEFE', product: '#3B82F6' };
      item.stage = prevStage;
      item.color = colors[prevStage];
      this.saveState();
      this.render();
      this.showToast(`Stepped back item to ${stageNames[prevStage]} board.`);
    } else {
      this.showToast('Item is already in initial Ideas stage!');
    }
  }

  openEditModal(id) {
    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    this.updateCategoryDropdownOptions();

    this.editItemId.value = item.id;
    this.editItemTitle.value = item.title || '';
    this.editItemStage.value = item.stage || 'spark';
    this.editItemContent.value = item.content || '';
    this.editItemUrl.value = item.url || '';
    
    if (item.category) {
      this.editItemCategory.value = item.category;
    } else {
      this.editItemCategory.value = 'General';
    }
    
    this.customCategoryWrapper.style.display = 'none';
    this.editItemCustomCategory.value = '';

    this.editItemUsername.value = item.username || '';
    this.editItemSecret.value = item.secret || '';
    this.editItemTags.value = (item.tags || []).join(', ');

    if (item.type === 'vault') {
      this.editVaultGroup.style.display = 'flex';
    } else {
      this.editVaultGroup.style.display = 'none';
    }

    if (this.editModalOverlay) {
      this.editModalOverlay.classList.add('active');
    }
  }

  closeEditModal() {
    if (this.editModalOverlay) {
      this.editModalOverlay.classList.remove('active');
    }
  }

  saveEditItem() {
    const id = this.editItemId.value;
    let item = this.state.items.find(i => i.id === id);
    
    if (!item) {
      item = {
        id: 'item-' + Date.now(),
        type: 'vault',
        stage: 'product',
        date: new Date().toISOString().split('T')[0],
        color: '#3B82F6'
      };
      this.state.items.unshift(item);
    }

    item.title = this.editItemTitle.value.trim() || 'Password Account';
    item.stage = this.editItemStage.value || 'product';
    item.content = this.editItemContent.value.trim() || 'Password entry';
    item.url = this.editItemUrl.value.trim();
    
    if (item.type === 'vault') {
      if (this.editItemCategory.value === '__NEW__') {
        const customCat = this.editItemCustomCategory.value.trim();
        item.category = customCat || 'Custom';
      } else {
        item.category = this.editItemCategory.value || 'General';
      }

      item.username = this.editItemUsername.value.trim() || 'user@michi';
      item.secret = this.editItemSecret.value.trim() || 'secret';
    }

    const tagsRaw = this.editItemTags.value.trim();
    item.tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Password'];

    const colors = { spark: '#FBF582', structure: '#009967', focus: '#7CFEFE', product: '#3B82F6' };
    item.color = colors[item.stage] || '#3B82F6';

    this.saveState();
    this.closeEditModal();
    this.showToast('Record saved!');
  }

  getUserName() {
    const username = localStorage.getItem('rememberedUsername');
    if (username && username.trim()) {
      return username.trim();
    }
    return 'My';
  }

  formatFullDate(dateStr) {
    if (!dateStr) return 'Saturday, August 8, 2026';
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const dateObj = new Date(year, month - 1, day);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  }

  turnPage(deltaDays) {
    if (!this.selectedFranklinDate) return;
    const parts = this.selectedFranklinDate.split('-').map(Number);
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2] + deltaDays);
    const y = dateObj.getFullYear();
    const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const d = dateObj.getDate().toString().padStart(2, '0');
    
    this.selectedFranklinDate = `${y}-${m}-${d}`;

    if (this.binderBookSpread) {
      const animClass = deltaDays > 0 ? 'page-turn-next' : 'page-turn-prev';
      this.binderBookSpread.classList.add(animClass);
      setTimeout(() => {
        this.binderBookSpread.classList.remove(animClass);
      }, 450);
    }

    this.renderFranklinModalContent();
  }

  openFranklinModal(dateStr) {
    this.selectedFranklinDate = dateStr || '2026-08-08';
    
    const savedFont = localStorage.getItem('MICHI_PLANNER_FONT') || 'cursive';
    if (this.plannerFontSelect) this.plannerFontSelect.value = savedFont;
    this.applyPlannerFontStyle(savedFont);

    this.renderFranklinModalContent();
    this.franklinModalOverlay.classList.add('active');
  }

  closeFranklinModal() {
    if (this.franklinModalOverlay) {
      this.franklinModalOverlay.classList.remove('active');
    }
  }

  addFranklinTask() {
    const priority = this.franklinPrioSelect.value;
    const text = this.franklinTaskText.value.trim();
    if (!text) return;

    if (!this.state.franklinData[this.selectedFranklinDate]) {
      this.state.franklinData[this.selectedFranklinDate] = { tasks: [], appts: [] };
    }

    const dayData = this.state.franklinData[this.selectedFranklinDate];
    if (!dayData.tasks) dayData.tasks = [];
    
    dayData.tasks.push({
      id: 'fp-' + Date.now(),
      priority: priority,
      text: text,
      done: false
    });

    this.franklinTaskText.value = '';
    this.renderFranklinModalContent();
  }

  renderSingleMiniCalGrid(gridEl, titleEl, year, month, highlightDay = null) {
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const dateObj = new Date(year, month - 1, 1);
    const monthNameStr = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (titleEl) titleEl.textContent = monthNameStr;

    const daysHeader = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    daysHeader.forEach(dh => {
      const dHead = document.createElement('div');
      dHead.style.fontWeight = '800';
      dHead.style.color = '#0f766e';
      dHead.textContent = dh;
      gridEl.appendChild(dHead);
    });

    const firstDayIndex = new Date(year, month - 1, 1).getDay();
    const totalDaysInMonth = new Date(year, month, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.textContent = '';
      gridEl.appendChild(emptyCell);
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dayCell = document.createElement('div');
      dayCell.textContent = d;
      dayCell.style.cursor = 'pointer';
      dayCell.style.borderRadius = '2px';
      dayCell.style.padding = '1px 0';
      
      if (highlightDay && d === highlightDay) {
        dayCell.style.background = '#0f766e';
        dayCell.style.color = '#ffffff';
        dayCell.style.fontWeight = '800';
      } else {
        dayCell.style.color = '#475569';
      }

      const mStr = month.toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      const cellDateStr = `${year}-${mStr}-${dStr}`;
      dayCell.addEventListener('click', () => {
        this.selectedFranklinDate = cellDateStr;
        this.renderFranklinModalContent();
      });

      gridEl.appendChild(dayCell);
    }
  }

  renderFranklinModalContent() {
    const userName = this.getUserName();
    const formattedDate = this.formatFullDate(this.selectedFranklinDate);

    const badgeEl = document.getElementById('plannerUserBadge');
    if (badgeEl) badgeEl.textContent = `${userName}'s Planner`;
    if (this.franklinDateTitle) this.franklinDateTitle.textContent = formattedDate;

    if (!this.state.franklinData[this.selectedFranklinDate]) {
      this.state.franklinData[this.selectedFranklinDate] = {
        tasks: [
          { id: 'fp-auto-1', priority: 'A1', text: 'Review Daily MICHI Path Objectives', done: false }
        ],
        appts: [
          { id: 'ap-auto-1', time: '09:00 AM', text: 'Morning Focus & Planning Session', note: 'Scheduled via MICHI Digital Planner', done: false },
          { id: 'ap-auto-2', time: '02:00 PM', text: 'Project Progress Sync', note: 'Review active cards & pipeline deliverables', done: false }
        ],
        trackerText: ''
      };
    }

    const dayData = this.state.franklinData[this.selectedFranklinDate];
    if (!dayData.appts && dayData.schedule) {
      dayData.appts = Object.keys(dayData.schedule).map((h, idx) => ({
        id: 'ap-leg-' + idx,
        time: h,
        text: dayData.schedule[h],
        note: '',
        done: false
      }));
    } else if (!dayData.appts) {
      dayData.appts = [
        { id: 'ap-def-1', time: '09:00 AM', text: 'Morning Focus & Planning Session', note: 'Scheduled via MICHI Digital Planner', done: false },
        { id: 'ap-def-2', time: '02:00 PM', text: 'Project Progress Sync', note: 'Review active cards & pipeline deliverables', done: false }
      ];
    }

    const parts = this.selectedFranklinDate.split('-').map(Number);
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayNum = dateObj.getDate();
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const monthYearStr = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const leftNumEl = document.getElementById('leftPageNum');
    const leftDayEl = document.getElementById('leftPageDay');
    const leftMonthEl = document.getElementById('leftPageMonthYear');
    const leftMiniCalMonthEl = document.getElementById('leftPageMiniCalMonth');

    if (leftNumEl) leftNumEl.textContent = dayNum;
    if (leftDayEl) leftDayEl.textContent = dayName;
    if (leftMonthEl) leftMonthEl.textContent = monthYearStr;
    if (leftMiniCalMonthEl) leftMiniCalMonthEl.textContent = monthYearStr;

    // Calculate Previous, Current, and Next Month dates
    const year = parts[0];
    const month = parts[1]; // 1-indexed

    let prevYear = year;
    let prevMonth = month - 1;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear--;
    }

    let nextYear = year;
    let nextMonth = month + 1;
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear++;
    }

    // Render 3 Side-by-Side Mini Calendars (Prev | Current | Next)
    this.renderSingleMiniCalGrid(
      document.getElementById('miniCalPrevGrid'),
      document.getElementById('miniCalPrevMonthTitle'),
      prevYear,
      prevMonth,
      null
    );

    this.renderSingleMiniCalGrid(
      document.getElementById('miniCalCurrGrid'),
      document.getElementById('miniCalCurrMonthTitle'),
      year,
      month,
      dayNum
    );

    this.renderSingleMiniCalGrid(
      document.getElementById('miniCalNextGrid'),
      document.getElementById('miniCalNextMonthTitle'),
      nextYear,
      nextMonth,
      null
    );

    if (this.franklinDailyTrackerInput) {
      this.franklinDailyTrackerInput.value = dayData.trackerText || '';
    }

    const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    this.monthTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.month === monthStr);
    });

    // Render Left Page Priority Tasks with Direct Priority Select Dropdown
    this.franklinTaskList.innerHTML = '';
    if (!dayData.tasks || dayData.tasks.length === 0) {
      this.franklinTaskList.innerHTML = `<div style="font-size: 0.8rem; color: #64748b; font-style: italic;">No priority tasks added for this day.</div>`;
    } else {
      dayData.tasks.sort((a, b) => a.priority.localeCompare(b.priority));
      const prioOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

      dayData.tasks.forEach(t => {
        const itemEl = document.createElement('div');
        itemEl.className = 'franklin-task-item';
        itemEl.style.background = '#ffffff';
        itemEl.style.border = '1px solid #cbd5e1';
        itemEl.style.color = '#1e293b';

        const prioHtml = prioOptions.map(p => `<option value="${p}" ${p === t.priority ? 'selected' : ''}>${p}</option>`).join('');

        itemEl.innerHTML = `
          <select class="task-prio-dropdown" title="Select Priority Tag" style="color: #3B82F6; font-weight: 800; font-size: 0.76rem; background: #e0f2fe; padding: 2px 4px; border-radius: 4px; border: 1px solid #bae6fd; cursor: pointer; outline: none;">
            ${prioHtml}
          </select>
          <input type="checkbox" ${t.done ? 'checked' : ''} style="-webkit-appearance: checkbox; appearance: checkbox; accent-color: #127DBB; width: 16px; height: 16px;">
          <span class="edit-tasktext-btn" style="flex:1; font-size: 0.85rem; font-weight: 500; cursor: pointer; ${t.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}" title="Click to Edit Description">${this.escapeHtml(t.text)}</span>
          <button class="edit-tasktext-btn" style="background: transparent; border: none; color: #127DBB; font-weight: 700; cursor: pointer; font-size: 0.76rem; padding: 2px 6px;" title="Edit Task Text">Edit</button>
          <button class="delete-task-btn" style="background: transparent; border: none; color: #94a3b8; cursor: pointer;" title="Delete Task">✕</button>
        `;

        itemEl.querySelector('input').addEventListener('change', (e) => {
          t.done = e.target.checked;
          this.renderFranklinModalContent();
        });

        itemEl.querySelector('.task-prio-dropdown').addEventListener('change', (e) => {
          t.priority = e.target.value;
          this.saveState();
          this.renderFranklinModalContent();
          this.showToast(`Task priority set to ${t.priority}`);
        });

        itemEl.querySelectorAll('.edit-tasktext-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const newText = prompt('Update Task Text Description:', t.text);
            if (newText === null || !newText.trim()) return;
            t.text = newText.trim();
            this.saveState();
            this.renderFranklinModalContent();
            this.showToast('Task description updated!');
          });
        });

        itemEl.querySelector('.delete-task-btn').addEventListener('click', () => {
          this.confirmDialog(`Are you sure you want to delete task "${t.text}"?`, 'Delete Planner Task', () => {
            dayData.tasks = dayData.tasks.filter(x => x.id !== t.id);
            this.renderFranklinModalContent();
            this.showToast('Planner task deleted');
          });
        });

        this.franklinTaskList.appendChild(itemEl);
      });
    }

    // Render Right Page Flexible Appointments with Direct Inline Time Dropdown Selection
    this.franklinTimeline.innerHTML = '';
    if (!dayData.appts || dayData.appts.length === 0) {
      this.franklinTimeline.innerHTML = `<div style="font-size: 0.8rem; color: #64748b; font-style: italic; text-align: center; padding: 1.5rem 0;">No appointments scheduled. Use the builder above to add custom time slots & notes!</div>`;
    } else {
      const timeOptions = [
        '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
        '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
        '07:00 PM', '07:30 PM', '08:00 PM'
      ];

      dayData.appts.forEach(ap => {
        const apptRow = document.createElement('div');
        apptRow.style.display = 'flex';
        apptRow.style.flexDirection = 'column';
        apptRow.style.gap = '4px';
        apptRow.style.background = '#ffffff';
        apptRow.style.border = '1px solid #cbd5e1';
        apptRow.style.borderRadius = '6px';
        apptRow.style.padding = '8px 10px';

        const curTimeOpts = [...timeOptions];
        if (!curTimeOpts.includes(ap.time)) {
          curTimeOpts.unshift(ap.time);
        }

        const timeOptsHtml = curTimeOpts.map(t => `<option value="${t}" ${t === ap.time ? 'selected' : ''}>${t}</option>`).join('');

        apptRow.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <input type="checkbox" class="appt-done-checkbox" ${ap.done ? 'checked' : ''} style="-webkit-appearance: checkbox; appearance: checkbox; accent-color: #127DBB; width: 16px; height: 16px; cursor: pointer;" title="Mark Appointment Completed / Closed">
              <select class="appt-time-dropdown" title="Select different appointment time" style="background: #e0f2fe; color: #3B82F6; font-weight: 800; font-size: 0.78rem; padding: 3px 6px; border-radius: 4px; font-family: monospace; border: 1px solid #bae6fd; cursor: pointer; outline: none;">
                ${timeOptsHtml}
              </select>
              <span class="edit-title-only-btn" title="Click to Edit Title" style="font-size: 0.85rem; color: #0f172a; font-weight: 700; cursor: pointer; flex: 1; ${ap.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}">
                ${this.escapeHtml(ap.text)}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <button class="edit-title-only-btn" style="background: transparent; border: none; color: #127DBB; font-weight: 700; cursor: pointer; font-size: 0.76rem; padding: 2px 6px;" title="Edit Title Only">Title</button>
              <button class="edit-note-only-btn" style="background: transparent; border: none; color: #127DBB; font-weight: 700; cursor: pointer; font-size: 0.76rem; padding: 2px 6px;" title="Edit Sub-Note Only">Note</button>
              <button class="delete-appt-btn" style="background: transparent; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem;" title="Delete Appointment">✕</button>
            </div>
          </div>
          ${ap.note ? `<div class="edit-note-only-btn" style="font-size: 0.76rem; color: #475569; padding-left: 24px; font-style: italic; cursor: pointer; ${ap.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}" title="Click to Edit Note Only">Note: ${this.escapeHtml(ap.note)}</div>` : ''}
        `;

        apptRow.querySelector('.appt-done-checkbox').addEventListener('change', (e) => {
          ap.done = e.target.checked;
          this.saveState();
          this.renderFranklinModalContent();
          this.showToast(ap.done ? 'Appointment closed / completed!' : 'Appointment reopened');
        });

        apptRow.querySelector('.appt-time-dropdown').addEventListener('change', (e) => {
          const selectedTime = e.target.value;
          ap.time = selectedTime;
          this.saveState();
          this.renderFranklinModalContent();
          this.showToast(`Appointment time changed to ${selectedTime}`);
        });

        apptRow.querySelectorAll('.edit-title-only-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const newText = prompt('Update Appointment Title / Client:', ap.text);
            if (newText === null || !newText.trim()) return;
            ap.text = newText.trim();
            this.saveState();
            this.renderFranklinModalContent();
            this.showToast('Appointment title updated!');
          });
        });

        apptRow.querySelectorAll('.edit-note-only-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const newNote = prompt('Update Appointment Note / Details:', ap.note || '');
            if (newNote === null) return;
            ap.note = newNote.trim();
            this.saveState();
            this.renderFranklinModalContent();
            this.showToast('Appointment note updated!');
          });
        });

        apptRow.querySelector('.delete-appt-btn').addEventListener('click', () => {
          this.confirmDialog(`Are you sure you want to delete appointment "${ap.text}"?`, 'Delete Appointment', () => {
            dayData.appts = dayData.appts.filter(x => x.id !== ap.id);
            this.renderFranklinModalContent();
            this.showToast('Appointment deleted');
          });
        });

        this.franklinTimeline.appendChild(apptRow);
      });
    }
  }

  exportWorkspaceBackup() {
    try {
      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        state: this.state
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `MICHI_Workspace_Backup_${dateStr}.json`;

      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        if (document.body && document.body.contains(a)) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      }, 300);

      this.showToast(`📥 Backup file created: ${filename}`);
    } catch (err) {
      console.error('Export backup error:', err);
      alert('Could not generate backup file.');
    }
  }

  importWorkspaceBackup(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const importedState = parsed.state || parsed;

        if (importedState && Array.isArray(importedState.items)) {
          this.confirmDialog(
            'Are you sure you want to restore this backup? It will replace all current workspace items and projects.',
            'Restore Workspace Backup',
            () => {
              this.state = importedState;
              this.saveState();
              this.render();
              this.showToast('📤 Workspace successfully restored from MICHI Backup file!');
            }
          );
        } else {
          alert('Invalid backup file format. Please select a valid MICHI .json backup file.');
        }
      } catch (err) {
        console.error('Backup import error:', err);
        alert('Could not parse backup file. Please select a valid MICHI .json backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  readAndRestoreBackupFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const importedState = parsed.state || parsed;

        if (importedState && Array.isArray(importedState.items)) {
          this.confirmDialog(
            'Are you sure you want to restore this backup? It will replace all current workspace items and projects.',
            'Restore Workspace Backup',
            () => {
              this.state = importedState;
              this.saveState();
              this.render();
              this.showToast('📤 Workspace successfully restored from MICHI Backup file!');
            }
          );
        } else {
          alert('Invalid backup file format. Please select a valid MICHI .json backup file.');
        }
      } catch (err) {
        console.error('Backup import error:', err);
        alert('Could not parse backup file. Please select a valid MICHI .json backup file.');
      }
    };
    reader.readAsText(file);
  }

  openTutorialModal(slideNum = 1) {
    this.currentTutorialSlide = slideNum;
    this.updateTutorialSlideView();
    if (this.tutorialModalOverlay) this.tutorialModalOverlay.classList.add('active');
  }

  closeTutorialModal() {
    if (this.tutorialModalOverlay) this.tutorialModalOverlay.classList.remove('active');
  }

  prevTutorialSlide() {
    if (this.currentTutorialSlide > 1) {
      this.currentTutorialSlide--;
      this.updateTutorialSlideView();
    }
  }

  nextTutorialSlide() {
    const totalSlides = this.tutorialSlides ? this.tutorialSlides.length : 5;
    if (this.currentTutorialSlide < totalSlides) {
      this.currentTutorialSlide++;
      this.updateTutorialSlideView();
    } else {
      this.closeTutorialModal();
      this.showToast('Tutorial complete! Enjoy using MICHI.');
    }
  }

  updateTutorialSlideView() {
    const totalSlides = this.tutorialSlides ? this.tutorialSlides.length : 5;
    if (this.tutorialSlides) {
      this.tutorialSlides.forEach((slide, idx) => {
        const isCurrent = (idx + 1) === this.currentTutorialSlide;
        slide.style.display = isCurrent ? 'flex' : 'none';
      });
    }

    if (this.tutorialStepIndicator) {
      this.tutorialStepIndicator.textContent = `Step ${this.currentTutorialSlide} of ${totalSlides}`;
    }

    if (this.btnPrevTutorialStep) {
      this.btnPrevTutorialStep.style.display = this.currentTutorialSlide > 1 ? 'inline-block' : 'none';
    }

    if (this.btnNextTutorialStep) {
      if (this.currentTutorialSlide === totalSlides) {
        this.btnNextTutorialStep.textContent = 'Finish Guide ✓';
        this.btnNextTutorialStep.style.background = 'var(--stage-structure)';
        this.btnNextTutorialStep.style.color = '#ffffff';
      } else {
        this.btnNextTutorialStep.textContent = 'Next Step ➔';
        this.btnNextTutorialStep.style.background = 'var(--stage-focus)';
        this.btnNextTutorialStep.style.color = '#000000';
      }
    }
  }

  saveFranklinModal() {
    const dayData = this.state.franklinData[this.selectedFranklinDate];
    if (dayData && this.franklinDailyTrackerInput) {
      dayData.trackerText = this.franklinDailyTrackerInput.value;
    }
    this.saveState();
    this.closeFranklinModal();
    const formattedDate = this.formatFullDate(this.selectedFranklinDate);
    this.showToast(`Daily Planner saved for ${formattedDate}`);
  }

  copyToClipboard(text, label = 'Content') {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast(`Copied ${label} to clipboard!`);
      }).catch(err => {
        console.error('Clipboard error:', err);
        this.fallbackCopy(text, label);
      });
    } else {
      this.fallbackCopy(text, label);
    }
  }

  fallbackCopy(text, label) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.showToast(`Copied ${label} to clipboard!`);
  }

  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add('show');
    setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2400);
  }

  deleteItem(id) {
    const item = this.state.items.find(i => i.id === id);
    const itemTitle = item && item.title ? item.title : 'this record';

    this.confirmDialog(`Are you sure you want to delete "${itemTitle}"?`, 'Delete Record', () => {
      this.state.items = this.state.items.filter(i => i.id !== id);
      this.saveState();
      this.showToast('Item deleted');
    });
  }

  toggleTaskStatus(id) {
    const item = this.state.items.find(i => i.id === id);
    if (item && item.type === 'task') {
      if (item.status === 'done') {
        item.status = 'todo';
        item.progress = 0;
      } else {
        item.status = 'done';
        item.progress = 100;
      }
      this.saveState();
    }
  }

  getFilteredItems() {
    return this.state.items.filter(item => {
      const matchesSearch = !this.searchQuery || 
        (item.title && item.title.toLowerCase().includes(this.searchQuery)) ||
        (item.content && item.content.toLowerCase().includes(this.searchQuery)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(this.searchQuery)));

      let matchesFilter = true;
      if (this.currentFilter !== 'all') {
        if (this.currentFilter === 'ideas' || this.currentFilter === 'idea') {
          matchesFilter = (item.type === 'idea' || item.type === 'web');
        } else if (this.currentFilter === 'tasks' || this.currentFilter === 'task') {
          matchesFilter = (item.type === 'task');
        } else {
          matchesFilter = (item.type === this.currentFilter);
        }
      }

      const matchesStage = this.currentStageFilter === 'all' || (item.stage || 'spark') === this.currentStageFilter;
      const matchesProject = (this.selectedProject === 'all') || (item.project || 'Personal') === this.selectedProject;

      return matchesSearch && matchesFilter && matchesStage && matchesProject;
    });
  }

  renderWebCategoryPills() {
    if (!this.webCategoryPillsContainer) return;

    const categories = new Set(['all', 'Tech', 'Sports', 'Fashion', 'Design', 'Finance']);
    this.state.items.filter(i => i.type === 'web').forEach(i => {
      if (i.webCategory) categories.add(i.webCategory);
    });
    if (this.state.customWebCategories) {
      this.state.customWebCategories.forEach(c => categories.add(c));
    }

    this.webCategoryPillsContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-pill ${this.currentWebCat === cat ? 'active' : ''}`;
      btn.dataset.webCat = cat;

      const labels = {
        all: 'All Topics',
        Tech: 'Tech',
        Sports: 'Sports',
        Fashion: 'Fashion',
        Design: 'Design',
        Finance: 'Business & Finance',
        General: 'General'
      };

      btn.textContent = labels[cat] || cat;

      btn.addEventListener('click', () => {
        this.currentWebCat = cat;
        this.renderIdeasGrid();
      });

      this.webCategoryPillsContainer.appendChild(btn);
    });

    const addCatBtn = document.createElement('button');
    addCatBtn.className = 'filter-pill';
    addCatBtn.style.background = 'rgba(0, 153, 103, 0.15)';
    addCatBtn.style.color = 'var(--stage-structure)';
    addCatBtn.style.borderColor = 'rgba(0, 153, 103, 0.4)';
    addCatBtn.style.fontWeight = '700';
    addCatBtn.textContent = '+ Add Category';

    addCatBtn.addEventListener('click', () => {
      const newCat = prompt('Enter new Category Name (e.g. Travel, Real Estate, Recipes):');
      if (newCat && newCat.trim()) {
        const catName = newCat.trim();
        if (!this.state.customWebCategories) this.state.customWebCategories = [];
        if (!this.state.customWebCategories.includes(catName)) {
          this.state.customWebCategories.push(catName);
          this.saveState();
          this.currentWebCat = catName;
          this.renderIdeasGrid();
          this.showToast(`Added custom category: ${catName}`);
        }
      }
    });

    this.webCategoryPillsContainer.appendChild(addCatBtn);
  }

  renderIdeasGrid() {
    if (!this.ideasGrid) return;
    this.renderWebCategoryPills();
    this.ideasGrid.innerHTML = '';

    let webItems = this.state.items.filter(i => i.type === 'web' || i.type === 'idea');

    if (this.currentWebCat !== 'all') {
      webItems = webItems.filter(i => {
        const itemCat = i.webCategory || (i.tags && i.tags[0]) || 'General';
        return itemCat.toLowerCase() === this.currentWebCat.toLowerCase();
      });
    }

    if (this.selectedProject !== 'all') {
      webItems = webItems.filter(i => (i.project || 'Personal') === this.selectedProject);
    }

    if (webItems.length === 0) {
      this.ideasGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;">No web clips or interest bookmarks found for this category or project.</p>
          <button type="button" onclick="document.getElementById('btnAddWebClip').click()" style="background: var(--stage-structure); color: #ffffff; border: none; padding: 0.6rem 1.4rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">➕ Add Web Bookmark</button>
        </div>
      `;
      return;
    }

    webItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      const notes = item.notes || [];
      const catBadge = item.webCategory || (item.tags && item.tags[0]) || 'Web Clip';

      card.innerHTML = `
        <div class="card-color-stripe" style="background: var(--stage-structure);"></div>
        <div class="card-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="badge" style="background: rgba(0, 153, 103, 0.15); color: var(--stage-structure); border: 1px solid rgba(0, 153, 103, 0.3); font-weight: 800;">${this.escapeHtml(catBadge)}</span>
            <h4 class="card-title" style="color: #ffffff; font-weight: 700;">${this.escapeHtml(item.title)}</h4>
          </div>
          <div class="card-actions">
            <button class="btn-advance-pipeline" title="Advance clip on Michi Path">Advance</button>
            <button class="icon-btn edit-btn" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); font-weight: 700;" title="Edit Clip">✏️ Edit</button>
            <button class="icon-btn copy-btn" title="Copy URL Link">Copy Link</button>
            <button class="icon-btn delete-btn" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); font-weight: 700;" title="Delete Clip">Delete</button>
          </div>
        </div>
        ${(item.content && item.content.trim() && item.content.trim() !== item.url && !item.content.toLowerCase().includes('web reference clip saved under')) ? `
          <div class="card-body" style="line-height: 1.45; color: var(--text-main); font-size: 0.88rem; margin: 4px 0;">
            ${this.escapeHtml(item.content)}
          </div>
        ` : ''}
        ${item.imageUrl ? `
          <div style="margin-top: 6px; text-align: center;">
            <img src="${item.imageUrl}" style="max-height: 180px; max-width: 100%; border-radius: 6px; border: 1px solid var(--border); object-fit: contain;" alt="Clip Image" />
          </div>
        ` : ''}
        ${item.url ? `
          <a href="${item.url}" target="_blank" rel="noopener" class="web-clip-preview" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 6px; margin-top: 6px; color: #ffffff; text-decoration: underline; font-size: 0.82rem; word-break: break-all;">
            ${this.escapeHtml(item.url)}
          </a>
        ` : ''}
        
        <!-- Interactive Line-by-Line Notes -->
        <div style="margin-top: 0.75rem; border-top: 1px dashed var(--border); padding-top: 0.6rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.8px;">
              Appended Notes (${notes.length})
            </span>
            <button class="add-note-line-btn" style="background: rgba(124, 254, 254, 0.12); color: var(--stage-focus); border: 1px solid rgba(124, 254, 254, 0.3); font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; cursor: pointer;" title="Add new note line">+ Add Note</button>
          </div>
          ${notes.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${notes.map((n, idx) => `
                <div class="note-line-row" data-note-idx="${idx}" style="display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 6px 10px; border-radius: 6px; font-size: 0.82rem; cursor: pointer;" title="Click to Edit Note Line">
                  <span style="font-size: 0.7rem; color: var(--stage-structure); font-weight: 700; background: rgba(0,153,103,0.15); padding: 2px 6px; border-radius: 3px; white-space: nowrap; font-family: monospace;">
                    ${this.escapeHtml(n.date)}
                  </span>
                  <span style="flex: 1; color: var(--text-main); line-height: 1.35; word-break: break-word;">
                    ${this.escapeHtml(n.text)}
                  </span>
                  <span style="font-size: 0.72rem; color: var(--text-muted);" title="Edit Note Line">✏️</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="font-size: 0.76rem; color: var(--text-dim); font-style: italic;">No notes appended yet. Click "+ Add Note" to add one!</div>
          `}
        </div>

        <div class="card-footer">
          <div class="card-tags">${(item.tags || []).map(t => `<span class="badge badge-idea">${t}</span>`).join(' ')}</div>
          <span class="card-date">${item.date || ''}</span>
        </div>
      `;

      card.querySelector('.btn-advance-pipeline').addEventListener('click', () => this.advanceItemStage(item.id));
      card.querySelector('.edit-btn').addEventListener('click', () => this.openEditModal(item.id));
      card.querySelector('.copy-btn').addEventListener('click', () => this.copyToClipboard(item.url || item.content, 'Web link'));
      card.querySelector('.delete-btn').addEventListener('click', () => this.deleteItem(item.id));

      card.querySelector('.add-note-line-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openNoteModal(item.id, -1);
      });

      card.querySelectorAll('.note-line-row').forEach(row => {
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          const noteIdx = parseInt(row.dataset.noteIdx, 10);
          this.openNoteModal(item.id, noteIdx);
        });
      });

      this.ideasGrid.appendChild(card);
    });
  }

  renderProjectDropdowns() {
    const projects = this.getWorkspaceProjects();

    if (this.globalProjectFilter) {
      this.globalProjectFilter.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = 'all';
      allOpt.textContent = 'All Projects';
      if (this.selectedProject === 'all') allOpt.selected = true;
      this.globalProjectFilter.appendChild(allOpt);

      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `${p}`;
        if (p === this.selectedProject) opt.selected = true;
        this.globalProjectFilter.appendChild(opt);
      });
    }

    if (this.projectLineageSelect) {
      this.projectLineageSelect.innerHTML = '';
      const allOpt = document.createElement('option');
      allOpt.value = 'all';
      allOpt.textContent = 'All Projects Overview';
      if (this.selectedProject === 'all') allOpt.selected = true;
      this.projectLineageSelect.appendChild(allOpt);

      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `${p}`;
        if (p === this.selectedProject) opt.selected = true;
        this.projectLineageSelect.appendChild(opt);
      });
    }

    if (this.dispatchProjectSelect) {
      this.dispatchProjectSelect.innerHTML = '';

      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `${p}`;
        if (p === this.selectedProject) opt.selected = true;
        this.dispatchProjectSelect.appendChild(opt);
      });

      const newOpt = document.createElement('option');
      newOpt.value = '__NEW__';
      newOpt.textContent = '+ Start New Project...';
      this.dispatchProjectSelect.appendChild(newOpt);
    }
  }

  updateCategoryDropdowns() {
    const defaultCategories = ['Tech', 'Sports', 'Fashion', 'Design', 'Finance'];
    const excluded = new Set(['API Keys', 'Vault', 'Ideas', 'Account', 'Password', 'Task', 'Todo', 'Completed', 'Web Clip', 'General', 'spark', 'structure', 'focus', 'product', 'all']);

    const categorySet = new Set();

    (this.state && this.state.items ? this.state.items : []).forEach(item => {
      if (item.type === 'web' || item.type === 'idea') {
        const cat = item.webCategory || item.category;
        if (cat && !excluded.has(cat)) categorySet.add(cat);
      }
    });

    if (this.state && Array.isArray(this.state.customWebCategories)) {
      this.state.customWebCategories.forEach(c => {
        if (c && !excluded.has(c)) categorySet.add(c);
      });
    }

    defaultCategories.forEach(c => categorySet.add(c));

    const categoryList = Array.from(categorySet);

    const dropdowns = [
      { el: this.brainDumpCatSelect, isModal: false },
      { el: this.brainDumpCatFilterAll, isModal: false },
      { el: this.webClipCategory, isModal: true }
    ];

    dropdowns.forEach(({ el, isModal }) => {
      if (!el) return;
      const currentVal = el.value;
      el.innerHTML = '';

      if (!isModal) {
        const allOpt = document.createElement('option');
        allOpt.value = 'all';
        allOpt.textContent = '🌐 All Topics';
        el.appendChild(allOpt);
      }

      const icons = { Tech: '💻', Sports: '⚽', Fashion: '👗', Design: '🎨', Finance: '📈' };

      categoryList.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        const icon = icons[cat] || '🏷️';
        opt.textContent = `${icon} ${cat}`;
        el.appendChild(opt);
      });

      if (isModal) {
        const customOpt = document.createElement('option');
        customOpt.value = '__NEW__';
        customOpt.textContent = '➕ Add Custom Topic...';
        el.appendChild(customOpt);
      }

      if (currentVal && Array.from(el.options).some(o => o.value === currentVal)) {
        el.value = currentVal;
      } else {
        el.value = isModal ? (categoryList[0] || 'Tech') : (this.currentWebCat || 'all');
      }
    });

    const webCategoryPills = document.getElementById('webCategoryPills');
    if (webCategoryPills) {
      webCategoryPills.innerHTML = '';
      const allPill = document.createElement('button');
      allPill.className = `filter-pill ${this.currentWebCat === 'all' ? 'active' : ''}`;
      allPill.dataset.webCat = 'all';
      allPill.textContent = 'All Topics';
      allPill.addEventListener('click', () => {
        this.currentWebCat = 'all';
        if (this.brainDumpCatSelect) this.brainDumpCatSelect.value = 'all';
        if (this.brainDumpCatFilterAll) this.brainDumpCatFilterAll.value = 'all';
        this.render();
      });
      webCategoryPills.appendChild(allPill);

      const icons = { Tech: '💻', Sports: '⚽', Fashion: '👗', Design: '🎨', Finance: '📈' };
      categoryList.forEach(cat => {
        const icon = icons[cat] || '🏷️';
        const pillBtn = document.createElement('button');
        pillBtn.className = `filter-pill ${this.currentWebCat === cat ? 'active' : ''}`;
        pillBtn.dataset.webCat = cat;
        pillBtn.textContent = `${icon} ${cat}`;
        pillBtn.addEventListener('click', () => {
          this.currentWebCat = cat;
          if (this.brainDumpCatSelect) this.brainDumpCatSelect.value = cat;
          if (this.brainDumpCatFilterAll) this.brainDumpCatFilterAll.value = cat;
          this.render();
        });
        webCategoryPills.appendChild(pillBtn);
      });
    }
  }

  renderDailyReminderBanner() {
    const bannerContainer = document.getElementById('homeDailyReminderContainer');
    if (!bannerContainer) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const dayData = (this.state.franklinData && this.state.franklinData[todayStr]) || {};
    const appts = dayData.appts || [];
    const focusText = dayData.focusText || '';
    const openAppts = appts.filter(a => !a.done);

    let html = '';

    if (openAppts.length > 0 || focusText) {
      html += `<div style="display: flex; flex-direction: column; gap: 8px;">`;
      if (focusText) {
        html += `
          <div style="font-size: 0.88rem; font-weight: 700; color: var(--stage-spark); display: flex; align-items: center; gap: 6px;">
            <span>Priority Focus:</span> <span style="color: var(--text-main); font-weight: 600;">${this.escapeHtml(focusText)}</span>
          </div>
        `;
      }
      if (openAppts.length > 0) {
        html += `
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
            ${openAppts.map(a => `
              <span style="background: rgba(124, 254, 254, 0.12); color: var(--stage-focus); border: 1px solid rgba(124, 254, 254, 0.3); font-size: 0.82rem; font-weight: 800; padding: 4px 11px; border-radius: 12px; display: inline-flex; align-items: center; gap: 6px;">
                <strong>${this.escapeHtml(a.time)}</strong> ${this.escapeHtml(a.text)}
              </span>
            `).join('')}
          </div>
        `;
      }
      html += `</div>`;
    } else {
      html = `
        <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
          No scheduled appointments or spotlights for today — Open Calendar & Planner to schedule your day.
        </div>
      `;
    }

    bannerContainer.innerHTML = html;
  }

  render() {
    const items = this.getFilteredItems();
    this.renderDailyReminderBanner();
    this.updateCategoryDropdowns();
    this.renderProjectDropdowns();
    this.renderCardsGrid(items);
    this.renderIdeasGrid();
    this.renderTasks();
    this.renderVault();
    this.renderCalendar();
    this.renderSidebarStats();
    this.renderProjectLineage();
    this.renderContacts();
  }

  renderSidebarStats() {
    if (!this.sidebarStatItems) return;
    
    const items = this.state.items;
    const totalCount = items.length;
    const sparks = items.filter(i => (i.stage || 'spark') === 'spark').length;
    const structure = items.filter(i => i.stage === 'structure').length;
    const focus = items.filter(i => i.stage === 'focus').length;
    const product = items.filter(i => i.stage === 'product').length;

    const tasks = items.filter(i => i.type === 'task');
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const percent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    this.sidebarStatItems.innerHTML = `
      <div style="font-size: 0.72rem; color: var(--text-dim); display: flex; flex-direction: column; gap: 4px; text-align: left;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-main);">
          <span>Creation Path</span>
          <span>${totalCount} Items</span>
        </div>
        <div style="display: flex; gap: 4px; margin-top: 4px; font-size: 0.68rem; justify-content: space-between;">
          <span style="color: var(--stage-spark); display: flex; align-items: center; gap: 3px;" title="1. Spark (Ideas)"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--stage-spark); display: inline-block;"></span> ${sparks}</span>
          <span style="color: var(--stage-structure); display: flex; align-items: center; gap: 3px;" title="2. Structure (Notes)"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--stage-structure); display: inline-block;"></span> ${structure}</span>
          <span style="color: var(--stage-focus); display: flex; align-items: center; gap: 3px;" title="3. Focus (Tasks)"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--stage-focus); display: inline-block;"></span> ${focus}</span>
          <span style="color: var(--stage-product); display: flex; align-items: center; gap: 3px;" title="4. Product (Vault)"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--stage-product); display: inline-block;"></span> ${product}</span>
        </div>
        <div style="margin-top: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.68rem; margin-bottom: 2px;">
            <span>Task Completion</span>
            <span style="color: var(--stage-focus); font-weight: 700;">${percent}%</span>
          </div>
          <div style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
            <div style="height: 100%; width: ${percent}%; background: var(--stage-focus); transition: width 0.3s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }

  renderProjectLineage() {
    if (!this.projectLineageContainer || !this.projectLineageSelect) return;

    let lineageItems = this.state.items;
    if (this.selectedProject !== 'all') {
      lineageItems = lineageItems.filter(i => (i.project || 'General') === this.selectedProject);
    }

    const stages = [
      { id: 'spark', name: '1. Ideas', color: 'var(--stage-spark)' },
      { id: 'structure', name: '2. Resources', color: 'var(--stage-structure)' },
      { id: 'focus', name: '3. Development', color: 'var(--stage-focus)' },
      { id: 'product', name: '4. Completed', color: 'var(--stage-product)' }
    ];

    this.projectLineageContainer.innerHTML = '';

    stages.forEach(st => {
      const stageCol = document.createElement('div');
      stageCol.style.background = 'var(--bg-card)';
      stageCol.style.border = `1px solid var(--border)`;
      stageCol.style.borderRadius = 'var(--radius-md)';
      stageCol.style.padding = '1rem';
      stageCol.style.display = 'flex';
      stageCol.style.flexDirection = 'column';
      stageCol.style.gap = '10px';

      const colHeader = document.createElement('div');
      colHeader.style.paddingBottom = '0.6rem';
      colHeader.style.borderBottom = `2px solid ${st.color}`;
      colHeader.style.fontWeight = '800';
      colHeader.style.fontSize = '0.88rem';
      colHeader.style.color = st.color;
      colHeader.style.display = 'flex';
      colHeader.style.alignItems = 'center';
      colHeader.style.gap = '8px';
      colHeader.innerHTML = `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${st.color}; display: inline-block;"></span> ${st.name}`;
      stageCol.appendChild(colHeader);

      const stageItems = lineageItems.filter(i => (i.stage || 'spark') === st.id);

      if (stageItems.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.style.fontSize = '0.78rem';
        emptyDiv.style.color = 'var(--text-dim)';
        emptyDiv.style.fontStyle = 'italic';
        emptyDiv.style.padding = '0.5rem 0';
        emptyDiv.textContent = 'No items in this stage yet.';
        stageCol.appendChild(emptyDiv);
      } else {
        stageItems.forEach(item => {
          const itemCard = document.createElement('div');
          itemCard.style.background = 'var(--bg-main)';
          itemCard.style.border = '1px solid var(--border)';
          itemCard.style.borderRadius = 'var(--radius-sm)';
          itemCard.style.padding = '0.75rem';
          itemCard.style.fontSize = '0.85rem';

          const notesCount = (item.notes || []).length;

          itemCard.innerHTML = `
            <div style="font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${this.escapeHtml(item.title)}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 6px;">${this.escapeHtml(item.content)}</div>
            ${notesCount > 0 ? `<div style="font-size: 0.72rem; color: var(--stage-structure); font-weight: 600;">${notesCount} Appended Note(s)</div>` : ''}
          `;

          stageCol.appendChild(itemCard);
        });
      }

      this.projectLineageContainer.appendChild(stageCol);
    });
  }

  createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('draggable', 'true');

    const stage = item.stage || 'spark';
    const stageBadgeNames = { spark: 'IDEAS', structure: 'RESOURCES', focus: 'DEVELOPMENT', product: 'PRODUCT' };
    const stageColors = { spark: 'var(--stage-spark)', structure: 'var(--stage-structure)', focus: 'var(--stage-focus)', product: 'var(--stage-product)' };

    const tagHtml = (item.tags || []).map(t => `<span class="badge badge-idea">${t}</span>`).join(' ');
    const notes = item.notes || [];

    card.innerHTML = `
      <div class="card-color-stripe" style="background: ${item.color || 'var(--stage-spark)'};"></div>
      <div class="card-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <span class="stage-path-badge ${stage}" style="display: inline-flex; align-items: center; gap: 5px; font-weight: 800; letter-spacing: 0.5px; color: ${stageColors[stage]};">
            ${stageBadgeNames[stage]}
          </span>
          <h4 class="card-title">${this.escapeHtml(item.title)}</h4>
        </div>
        <div class="card-actions" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
          ${(stage !== 'spark') ? `<button class="icon-btn btn-regress-pipeline" style="background: rgba(255, 255, 255, 0.08); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.72rem; padding: 2px 7px;" title="Step Back item to previous stage">⬅ Back</button>` : ''}
          ${(stage !== 'product') ? `<button class="btn-advance-pipeline" style="background: var(--stage-spark); color: #000; font-weight: 800; border: none; font-size: 0.72rem; padding: 3px 8px; border-radius: 4px;" title="Advance & Create workable board in next stage">Advance ➔</button>` : ''}
          <button class="icon-btn print-btn" title="Full Reader & Print Mode">View / Print</button>
          <button class="icon-btn edit-btn" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); font-weight: 700;" title="Edit Item">✏️ Edit</button>
          <button class="icon-btn copy-btn" title="Copy Content">Copy</button>
          <button class="icon-btn delete-btn" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); font-weight: 700;" title="Delete Item">🗑️ Delete</button>
        </div>
      </div>
      ${(item.content && item.content.trim() && item.content.trim() !== item.url) ? `
        <div class="card-body" style="line-height: 1.5; color: var(--text-main); font-size: 0.9rem;">
          ${this.escapeHtml(item.content)}
        </div>
      ` : ''}
      ${item.imageUrl ? `
        <div style="margin-top: 6px; text-align: center;">
          <img src="${item.imageUrl}" style="max-height: 180px; max-width: 100%; border-radius: 6px; border: 1px solid var(--border); object-fit: contain;" alt="Attached Image" />
        </div>
      ` : ''}
      ${item.url ? `
        <a href="${item.url}" target="_blank" rel="noopener" class="web-clip-preview" style="color: #ffffff;">
          ${this.escapeHtml(item.url)}
        </a>
      ` : ''}
      
      <!-- Interactive Line-by-Line Notes -->
      <div style="margin-top: 0.75rem; border-top: 1px dashed var(--border); padding-top: 0.6rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.8px;">
            Appended Notes (${notes.length})
          </span>
          <button class="add-note-line-btn" style="background: rgba(124, 254, 254, 0.12); color: var(--stage-focus); border: 1px solid rgba(124, 254, 254, 0.3); font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; cursor: pointer;" title="Add new note line">+ Add Note</button>
        </div>
        ${notes.length > 0 ? `
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${notes.map((n, idx) => `
              <div class="note-line-row" data-note-idx="${idx}" style="display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 6px 10px; border-radius: 6px; font-size: 0.82rem; cursor: pointer;" title="Click to Edit Note Line">
                <span style="font-size: 0.7rem; color: var(--stage-structure); font-weight: 700; background: rgba(0,153,103,0.15); padding: 2px 6px; border-radius: 3px; white-space: nowrap; font-family: monospace;">
                  ${this.escapeHtml(n.date)}
                </span>
                <span style="flex: 1; color: var(--text-main); line-height: 1.35; word-break: break-word;">
                  ${this.escapeHtml(n.text)}
                </span>
                <span style="font-size: 0.72rem; color: var(--text-muted);" title="Edit Note Line">✏️</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div style="font-size: 0.76rem; color: var(--text-dim); font-style: italic;">No notes appended yet. Click "+ Add Note" to add one!</div>
        `}
      </div>

      <div class="card-footer">
        <div class="card-tags">${tagHtml}</div>
        <span class="card-date">${item.date || ''}</span>
      </div>
    `;

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    const advanceBtn = card.querySelector('.btn-advance-pipeline');
    if (advanceBtn) {
      advanceBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.advanceItemStage(item.id);
      });
    }

    const regressBtn = card.querySelector('.btn-regress-pipeline');
    if (regressBtn) {
      regressBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.regressItemStage(item.id);
      });
    }

    card.querySelector('.print-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openPrintModal(item.id);
    });

    card.querySelector('.edit-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openEditModal(item.id);
    });

    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const copyText = `${item.title}\n${item.content}${item.url ? '\n' + item.url : ''}`;
      this.copyToClipboard(copyText, 'Card text');
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.deleteItem(item.id);
    });

    card.querySelector('.add-note-line-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openNoteModal(item.id, -1);
    });

    card.querySelectorAll('.note-line-row').forEach(row => {
      row.addEventListener('click', (e) => {
        e.stopPropagation();
        const noteIdx = parseInt(row.dataset.noteIdx, 10);
        this.openNoteModal(item.id, noteIdx);
      });
    });

    return card;
  }

  createCompactCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card compact-card';
    card.setAttribute('draggable', 'true');
    card.style.minWidth = '270px';
    card.style.maxWidth = '310px';
    card.style.height = '145px';
    card.style.flexShrink = '0';
    card.style.scrollSnapAlign = 'start';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.padding = '0.85rem 1rem';
    card.style.cursor = 'pointer';

    const stage = item.stage || 'spark';
    const stageBadgeNames = { spark: 'IDEAS', structure: 'RESOURCES', focus: 'DEVELOPMENT', product: 'COMPLETED' };
    const stageColors = { spark: 'var(--stage-spark)', structure: 'var(--stage-structure)', focus: 'var(--stage-focus)', product: 'var(--stage-product)' };
    const notesCount = (item.notes || []).length;

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px;">
        <span style="font-weight: 800; font-size: 0.68rem; letter-spacing: 0.5px; color: ${stageColors[stage]}; background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px;">
          ${stageBadgeNames[stage]}
        </span>
        <button class="btn-advance-pipeline" style="padding: 2px 7px; font-size: 0.72rem; border-radius: 4px;" title="Advance item to next stage">Advance ➔</button>
      </div>

      <h4 style="font-size: 0.92rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${this.escapeHtml(item.title)}
      </h4>

      <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1;">
        ${this.escapeHtml(item.content)}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; font-size: 0.73rem; color: var(--text-dim); border-top: 1px solid rgba(255,255,255,0.08); padding-top: 5px;">
        <span>📝 ${notesCount} note${notesCount === 1 ? '' : 's'}</span>
        <span style="font-weight: 700; color: var(--accent);">Tap to Open 🔍</span>
      </div>
    `;

    card.addEventListener('click', () => {
      this.openPrintModal(item.id);
    });

    card.querySelector('.btn-advance-pipeline').addEventListener('click', (e) => {
      e.stopPropagation();
      this.advanceItemStage(item.id);
    });

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
    });

    return card;
  }

  deleteProject(projectName) {
    if (!projectName || projectName === 'all') return;

    this.confirmDialog(
      `Are you sure you want to delete project "${projectName}"? This will remove all items and cards belonging to this project.`,
      `Delete Project: ${projectName}`,
      () => {
        if (Array.isArray(this.state.items)) {
          this.state.items = this.state.items.filter(i => (i.project || 'General') !== projectName && i.project !== projectName);
        }

        if (Array.isArray(this.state.customProjects)) {
          this.state.customProjects = this.state.customProjects.filter(p => p !== projectName);
        }

        if (!this.state.deletedProjects || !Array.isArray(this.state.deletedProjects)) {
          this.state.deletedProjects = [];
        }
        if (!this.state.deletedProjects.includes(projectName)) {
          this.state.deletedProjects.push(projectName);
        }

        this.selectedProject = 'all';
        if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';

        this.saveState();
        this.render();
        this.showToast(`Deleted project "${projectName}" & its items.`);
      }
    );
  }

  createProjectBoardCard(projectName, stageObj, projectItems) {
    const card = document.createElement('div');
    card.className = 'card compact-project-board-card';
    card.style.minWidth = '295px';
    card.style.maxWidth = '340px';
    card.style.minHeight = '155px';
    card.style.flexShrink = '0';
    card.style.scrollSnapAlign = 'start';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.padding = '0.9rem 1.1rem';
    card.style.background = 'var(--bg-card)';
    card.style.border = `1px solid var(--border)`;
    card.style.borderRadius = 'var(--radius-md)';
    card.style.boxShadow = 'var(--shadow-sm)';
    card.style.cursor = 'pointer';

    const stageNames = { spark: 'Ideas', structure: 'Resources', focus: 'Development', product: 'Completed' };
    const stageName = stageNames[stageObj.id] || 'Ideas';

    const snippetHtml = projectItems.length > 0
      ? projectItems.slice(0, 2).map(i => `
          <div style="font-size: 0.8rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 5px;">
            <span style="color: ${stageObj.color}; font-weight: 900;">•</span> ${this.escapeHtml(i.title)}
          </div>
        `).join('')
      : `<div style="font-size: 0.76rem; color: var(--text-dim); font-style: italic;">No ${stageName.toLowerCase()} cards added yet.</div>`;

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 5px;">
        <div style="display: flex; align-items: center; gap: 6px; overflow: hidden;">
          <h4 style="font-size: 0.92rem; font-weight: 800; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${this.escapeHtml(projectName)}
          </h4>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="background: rgba(255,255,255,0.1); color: #ffffff; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; white-space: nowrap;">
            ${projectItems.length} ${projectItems.length === 1 ? 'Item' : 'Items'}
          </span>
          <button type="button" class="btn-delete-project-card" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); font-size: 0.72rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; cursor: pointer;" title="Delete this project & its cards">Delete</button>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 4px; margin: 4px 0; flex: 1;">
        ${snippetHtml}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
        <button class="btn-add-item-board" style="background: rgba(255,255,255,0.08); color: var(--text-main); border: 1px solid var(--border); font-size: 0.74rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
          + Add ${stageName}
        </button>
        <span style="font-size: 0.74rem; font-weight: 800; color: #ffffff;">View Board</span>
      </div>
    `;

    card.addEventListener('click', () => {
      this.selectedProject = projectName;
      if (this.globalProjectFilter) this.globalProjectFilter.value = projectName;
      this.render();
      this.showToast(`Showing ${projectName} — ${stageName} Board`);
    });

    const delCardBtn = card.querySelector('.btn-delete-project-card');
    if (delCardBtn) {
      delCardBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteProject(projectName);
      });
    }

    card.querySelector('.btn-add-item-board').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openNoteModal(null, -1);
    });

    return card;
  }

  renderSpecificProjectView(projectName, gridItems) {
    const projItems = gridItems.filter(i => (i.project || 'Personal') === projectName);

    // 1. Project Title Header Banner (placed at the top above the boards)
    const banner = document.createElement('div');
    banner.style.background = 'var(--bg-card)';
    banner.style.border = '1px solid var(--border)';
    banner.style.borderRadius = 'var(--radius-md)';
    banner.style.padding = '1rem 1.4rem';
    banner.style.marginBottom = '1.2rem';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.gap = '1rem';
    banner.style.flexWrap = 'wrap';
    banner.style.boxShadow = 'var(--shadow-sm)';

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--stage-spark); margin-bottom: 2px;">
            Project: ${this.escapeHtml(projectName)}
          </h2>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            4 Stage Progress — ${projItems.length} Total ${projItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button type="button" class="btn-delete-current-proj" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px;">
          🗑️ Delete Project
        </button>
        <button type="button" class="btn-clear-proj-filter" style="background: rgba(255,255,255,0.08); color: var(--text-main); border: 1px solid var(--border); padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 5px;">
          ✖ Back to All Projects Overview
        </button>
      </div>
    `;

    banner.querySelector('.btn-delete-current-proj').addEventListener('click', () => {
      this.deleteProject(projectName);
    });

    banner.querySelector('.btn-clear-proj-filter').addEventListener('click', () => {
      this.selectedProject = 'all';
      if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';
      this.render();
    });

    this.cardsGrid.appendChild(banner);

    // 2. 4 Horizontal Side-by-Side Columns/Boards Container
    const boardContainer = document.createElement('div');
    boardContainer.style.display = 'grid';
    boardContainer.style.gridTemplateColumns = 'repeat(4, minmax(270px, 1fr))';
    boardContainer.style.gap = '1.2rem';
    boardContainer.style.width = '100%';
    boardContainer.style.overflowX = 'auto';
    boardContainer.style.paddingBottom = '1rem';

    const stages = [
      { id: 'spark', name: '💡 1. Ideas', color: 'var(--stage-spark)' },
      { id: 'structure', name: '📂 2. Resources', color: 'var(--stage-structure)' },
      { id: 'focus', name: '⚡ 3. Development', color: 'var(--stage-focus)' },
      { id: 'product', name: '🚀 4. Completed', color: 'var(--stage-product)' }
    ];

    stages.forEach(st => {
      const colItems = projItems.filter(i => (i.stage || 'spark') === st.id);

      const col = document.createElement('div');
      col.style.background = 'rgba(255,255,255,0.02)';
      col.style.border = '1px solid var(--border)';
      col.style.borderRadius = 'var(--radius-md)';
      col.style.padding = '1rem';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.gap = '1rem';
      col.style.minHeight = '420px';

      // Column Header
      const colHeader = document.createElement('div');
      colHeader.style.display = 'flex';
      colHeader.style.alignItems = 'center';
      colHeader.style.justifyContent = 'space-between';
      colHeader.style.borderBottom = '1px solid var(--border)';
      colHeader.style.paddingBottom = '0.5rem';

      colHeader.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-weight: 800; font-size: 0.95rem; color: ${st.color};">${st.name}</span>
          <span style="background: rgba(255,255,255,0.1); color: var(--text-main); font-size: 0.76rem; font-weight: 800; padding: 2px 7px; border-radius: 10px;">${colItems.length}</span>
        </div>
        <button class="btn-add-col-item" style="background: rgba(255,255,255,0.08); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer;">
          + Add
        </button>
      `;

      colHeader.querySelector('.btn-add-col-item').addEventListener('click', () => {
        this.openNoteModal(null, -1);
      });

      col.appendChild(colHeader);

      // Column Items List
      const itemsList = document.createElement('div');
      itemsList.style.display = 'flex';
      itemsList.style.flexDirection = 'column';
      itemsList.style.gap = '0.85rem';
      itemsList.style.flex = '1';

      if (colItems.length === 0) {
        itemsList.innerHTML = `
          <div style="font-size: 0.78rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 2rem 0;">
            No ${st.name.replace(/^[^\s]+\s*/, '')} items yet.
          </div>
        `;
      } else {
        colItems.forEach(item => {
          const card = this.createCardElement(item);
          itemsList.appendChild(card);
        });
      }

      col.appendChild(itemsList);
      boardContainer.appendChild(col);
    });

    this.cardsGrid.appendChild(boardContainer);
  }

  renderCardsGrid(items) {
    if (!this.cardsGrid) return;
    this.cardsGrid.innerHTML = '';

    const gridItems = items.filter(i => i.type !== 'vault');

    if (gridItems.length === 0) {
      this.cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;">No items found in this stage or view on the MICHI Path.</p>
          <button type="button" onclick="window.app.restoreDefaultItems()" style="background: var(--stage-structure); color: #ffffff; border: none; padding: 0.6rem 1.4rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">↻ Restore All Sample Cards & Data</button>
        </div>
      `;
      return;
    }

    if (this.currentStageFilter !== 'all') {
      const wrapper = document.createElement('div');
      wrapper.style.display = 'grid';
      wrapper.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
      wrapper.style.gap = '1.25rem';
      wrapper.style.width = '100%';

      gridItems.forEach(item => {
        const card = this.createCardElement(item);
        wrapper.appendChild(card);
      });
      this.cardsGrid.appendChild(wrapper);
      return;
    }

    // IF SPECIFIC PROJECT IS OPENED: Render Project Title Header & 4 Horizontal Side-by-Side Boards!
    if (this.selectedProject !== 'all') {
      this.renderSpecificProjectView(this.selectedProject, gridItems);
      return;
    }

    // IF ALL PROJECTS OVERVIEW IS ACTIVE: Gather all unique projects created in workspace
    const projectList = this.getWorkspaceProjects();

    const stages = [
      { id: 'spark', name: 'Ideas', color: 'var(--stage-spark)' },
      { id: 'structure', name: 'Resources', color: 'var(--stage-structure)' },
      { id: 'focus', name: 'Development', color: 'var(--stage-focus)' },
      { id: 'product', name: 'Completed', color: 'var(--stage-product)' }
    ];

    stages.forEach(st => {
      const section = document.createElement('div');
      section.style.marginBottom = '1.6rem';
      section.style.width = '100%';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      header.style.marginBottom = '0.6rem';
      header.style.paddingBottom = '0.35rem';
      header.style.borderBottom = `1px solid var(--border)`;

      header.innerHTML = `
        <span style="font-weight: 800; font-size: 0.98rem; color: #ffffff;">${st.name} (${projectList.length} ${projectList.length === 1 ? 'Project' : 'Projects'})</span>
        <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">Scroll ➔</span>
      `;
      section.appendChild(header);

      const scrollRow = document.createElement('div');
      scrollRow.className = 'scrollable-stage-row';
      scrollRow.style.display = 'flex';
      scrollRow.style.gap = '1.1rem';
      scrollRow.style.overflowX = 'auto';
      scrollRow.style.webkitOverflowScrolling = 'touch';
      scrollRow.style.paddingBottom = '0.6rem';
      scrollRow.style.scrollSnapType = 'x mandatory';
      scrollRow.style.width = '100%';

      projectList.forEach(projectName => {
        const projStageItems = gridItems.filter(i => (i.project || 'Personal') === projectName && (i.stage || 'spark') === st.id);
        const boardCard = this.createProjectBoardCard(projectName, st, projStageItems);
        scrollRow.appendChild(boardCard);
      });

      section.appendChild(scrollRow);
      this.cardsGrid.appendChild(section);
    });
  }

  clearProjectFilter() {
    this.selectedProject = 'all';
    if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';
    this.render();
  }

  restoreDefaultItems() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.currentStageFilter = 'all';
    this.currentFilter = 'all';
    this.pipelineStages.forEach(s => s.classList.toggle('active', s.dataset.stage === 'all'));
    this.saveState();
    this.showToast('Restored all sample cards and data!');
  }

  renderTasks() {
    if (!this.taskListTodo) return;

    const tasks = this.state.items.filter(i => i.type === 'task');

    const todo = tasks.filter(t => t.status === 'todo');
    const inProgress = tasks.filter(t => t.status === 'in-progress');
    const done = tasks.filter(t => t.status === 'done');

    this.countTodo.textContent = todo.length;
    this.countInProgress.textContent = inProgress.length;
    this.countDone.textContent = done.length;

    this.renderTaskList(this.taskListTodo, todo);
    this.renderTaskList(this.taskListInProgress, inProgress);
    this.renderTaskList(this.taskListDone, done);
  }

  renderTaskList(container, tasks) {
    container.innerHTML = '';
    if (tasks.length === 0) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-dim); text-align: center; padding: 1rem;">Empty</div>`;
      return;
    }

    tasks.forEach(task => {
      const el = document.createElement('div');
      el.className = 'task-item';
      el.setAttribute('draggable', 'true');
      const isDone = task.status === 'done';

      el.innerHTML = `
        <div class="task-item-header">
          <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} style="-webkit-appearance: checkbox; appearance: checkbox; accent-color: var(--stage-focus); width: 16px; height: 16px;">
          <span class="task-text ${isDone ? 'completed' : ''}">${this.escapeHtml(task.title)}</span>
          <button class="icon-btn edit-btn" title="Edit Task">Edit</button>
          <button class="icon-btn copy-btn" title="Copy Task">Copy</button>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${task.progress || (isDone ? 100 : 0)}%;"></div>
        </div>
      `;

      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', task.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });

      el.querySelector('.task-checkbox').addEventListener('change', () => {
        this.toggleTaskStatus(task.id);
      });

      el.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.openEditModal(task.id);
      });

      el.querySelector('.copy-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.copyToClipboard(`[Task] ${task.title}\nStatus: ${task.status}`, 'Task');
      });

      container.appendChild(el);
    });
  }

  renderVaultCategoryPills() {
    if (!this.vaultCategoryPillsContainer) return;
    
    const categories = new Set(['all']);
    this.state.items.filter(i => i.type === 'vault').forEach(i => {
      if (i.category) categories.add(i.category);
    });

    this.vaultCategoryPillsContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-pill ${this.currentVaultCat === cat ? 'active' : ''}`;
      btn.dataset.vaultCat = cat;
      btn.textContent = cat === 'all' ? 'All Accounts' : cat;

      btn.addEventListener('click', () => {
        this.currentVaultCat = cat;
        this.renderVault();
      });

      this.vaultCategoryPillsContainer.appendChild(btn);
    });
  }

  renderVault() {
    if (!this.vaultUnlockedContent) return;

    if (!this.vaultUnlocked) {
      this.vaultUnlockedContent.style.display = 'none';
      return;
    }

    this.vaultUnlockedContent.style.display = 'block';

    if (!this.vaultTableBody) return;
    this.renderVaultCategoryPills();
    this.vaultTableBody.innerHTML = '';

    let vaultItems = this.state.items.filter(i => i.type === 'vault');

    if (this.currentVaultCat !== 'all') {
      vaultItems = vaultItems.filter(i => (i.category || 'General').toLowerCase() === this.currentVaultCat.toLowerCase());
    }

    if (this.vaultSearchQuery) {
      vaultItems = vaultItems.filter(i => 
        i.title.toLowerCase().includes(this.vaultSearchQuery) ||
        (i.username && i.username.toLowerCase().includes(this.vaultSearchQuery)) ||
        (i.secret && i.secret.toLowerCase().includes(this.vaultSearchQuery)) ||
        (i.category && i.category.toLowerCase().includes(this.vaultSearchQuery))
      );
    }

    if (vaultItems.length === 0) {
      this.vaultTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No password records found in this view. Click <strong>"+ Add New Password"</strong> to add an account record!
          </td>
        </tr>
      `;
      return;
    }

    vaultItems.forEach(item => {
      const row = document.createElement('tr');
      row.style.borderBottom = '1px solid var(--border)';
      row.style.transition = 'background 0.2s ease';

      row.addEventListener('mouseenter', () => {
        row.style.background = 'rgba(255, 255, 255, 0.03)';
      });
      row.addEventListener('mouseleave', () => {
        row.style.background = 'transparent';
      });

      const catBadge = item.category || 'General';

      row.innerHTML = `
        <td style="padding: 0.85rem 1rem; font-weight: 700; color: var(--text-main);">
          ${this.escapeHtml(item.title)}
        </td>
        <td style="padding: 0.85rem 1rem; color: var(--text-muted); font-family: monospace;">
          ${this.escapeHtml(item.username || 'user')}
        </td>
        <td style="padding: 0.85rem 1rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="secret-text" data-secret="${this.escapeHtml(item.secret || '')}" style="font-family: monospace; font-size: 0.88rem; color: var(--stage-focus); letter-spacing: 2px;">••••••••••••</span>
            <button class="icon-btn eye-toggle-btn" title="Show Password" style="font-size: 0.78rem; font-weight: 600; padding: 2px 8px; width: auto; background: rgba(255,255,255,0.08); color: var(--text-main);">Show</button>
            <button class="icon-btn copy-secret-btn" title="Copy Password" style="font-size: 0.78rem; font-weight: 600;">Copy</button>
          </div>
        </td>
        <td style="padding: 0.85rem 1rem;">
          <span class="badge badge-vault">${this.escapeHtml(catBadge)}</span>
        </td>
        <td style="padding: 0.85rem 1rem; text-align: right;">
          <div style="display: inline-flex; gap: 6px;">
            <button class="icon-btn edit-btn" title="Edit Password Record">Edit</button>
            <button class="icon-btn delete-btn" title="Delete Entry">Delete</button>
          </div>
        </td>
      `;

      const secretTextEl = row.querySelector('.secret-text');
      const eyeBtn = row.querySelector('.eye-toggle-btn');
      let isVisible = false;

      eyeBtn.addEventListener('click', () => {
        isVisible = !isVisible;
        if (isVisible) {
          secretTextEl.textContent = item.secret || '';
          secretTextEl.style.letterSpacing = 'normal';
          eyeBtn.textContent = 'Hide';
          eyeBtn.setAttribute('title', 'Hide Password');
        } else {
          secretTextEl.textContent = '••••••••••••';
          secretTextEl.style.letterSpacing = '2px';
          eyeBtn.textContent = 'Show';
          eyeBtn.setAttribute('title', 'Show Password');
        }
      });

      row.querySelector('.copy-secret-btn').addEventListener('click', () => {
        this.copyToClipboard(item.secret || '', 'Password');
      });

      row.querySelector('.edit-btn').addEventListener('click', () => {
        this.openEditModal(item.id);
      });

      row.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteItem(item.id);
      });

      this.vaultTableBody.appendChild(row);
    });
  }

  getTodayLocalDateStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const d = now.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  normalizeDateStr(str) {
    if (!str) return '2026-08-12';
    const parts = str.split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return str;
    const y = parts[0];
    const m = parts[1].toString().padStart(2, '0');
    const d = parts[2].toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  openApptModal(dateStr, apptIdToEdit = null) {
    this.selectedApptDate = this.normalizeDateStr(dateStr || '2026-08-12');
    if (this.apptFormDate) this.apptFormDate.value = this.selectedApptDate;
    if (this.apptFormId) this.apptFormId.value = apptIdToEdit || '';

    const formattedDate = this.formatFullDate(this.selectedApptDate);
    if (this.apptModalDateTitle) this.apptModalDateTitle.textContent = `Schedule Appointment — ${formattedDate}`;

    if (apptIdToEdit) {
      const dayData = this.state.franklinData[this.selectedApptDate];
      if (dayData && dayData.appts) {
        const appt = dayData.appts.find(a => a.id === apptIdToEdit);
        if (appt) {
          if (this.apptFormTime) this.apptFormTime.value = appt.time || '09:00 AM';
          if (this.apptFormTitle) this.apptFormTitle.value = appt.text || '';
          if (this.apptFormNotes) this.apptFormNotes.value = appt.note || '';
        }
      }
    } else {
      if (this.apptFormTitle) this.apptFormTitle.value = '';
      if (this.apptFormNotes) this.apptFormNotes.value = '';
      if (this.apptFormTime) this.apptFormTime.value = '09:00 AM';
    }

    this.renderApptModalExistingList();
    if (this.apptModalOverlay) this.apptModalOverlay.classList.add('active');
  }

  closeApptModal() {
    if (this.apptModalOverlay) this.apptModalOverlay.classList.remove('active');
  }

  renderApptModalExistingList() {
    if (!this.apptModalExistingList) return;
    this.apptModalExistingList.innerHTML = '';

    const normKey = this.normalizeDateStr(this.selectedApptDate);
    const dayData = this.state.franklinData[normKey];
    const appts = (dayData && dayData.appts) ? dayData.appts : [];

    if (appts.length === 0) {
      this.apptModalExistingList.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-dim); font-style: italic; padding: 4px;">No appointments scheduled for this date yet. Fill form above to add one!</div>`;
      return;
    }

    appts.forEach(a => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.alignItems = 'center';
      item.style.justifyContent = 'space-between';
      item.style.background = 'rgba(255,255,255,0.04)';
      item.style.padding = '6px 8px';
      item.style.borderRadius = '4px';
      item.style.fontSize = '0.82rem';

      item.innerHTML = `
        <div style="flex: 1;">
          <span style="font-weight: 800; color: var(--stage-planner); margin-right: 8px;">${this.escapeHtml(a.time)}</span>
          <span style="font-weight: 600; color: var(--text-main);">${this.escapeHtml(a.text)}</span>
          ${a.note ? `<div style="font-size: 0.75rem; color: var(--text-muted); font-style: italic;">${this.escapeHtml(a.note)}</div>` : ''}
        </div>
        <div style="display: flex; gap: 6px; margin-left: 8px;">
          <button type="button" class="icon-btn edit-appt-btn" title="Edit Appointment" style="font-size: 0.72rem; padding: 2px 6px;">Edit</button>
          <button type="button" class="icon-btn delete-appt-btn" title="Delete Appointment" style="font-size: 0.72rem; padding: 2px 6px; color: #fb7185;">Delete</button>
        </div>
      `;

      item.querySelector('.edit-appt-btn').addEventListener('click', () => {
        this.openApptModal(this.selectedApptDate, a.id);
      });

      item.querySelector('.delete-appt-btn').addEventListener('click', () => {
        dayData.appts = dayData.appts.filter(x => x.id !== a.id);
        this.saveState();
        this.renderCalendar();
        this.renderApptModalExistingList();
        this.showToast('Appointment deleted');
      });

      this.apptModalExistingList.appendChild(item);
    });
  }

  handleApptFormSubmit() {
    const dateStr = this.normalizeDateStr(this.apptFormDate.value || this.selectedApptDate);
    const apptId = this.apptFormId.value;
    const time = this.apptFormTime.value;
    const title = this.apptFormTitle.value.trim();
    const note = this.apptFormNotes.value.trim();

    if (!title) return;

    if (!this.state.franklinData[dateStr]) {
      this.state.franklinData[dateStr] = { tasks: [], appts: [] };
    }
    const dayData = this.state.franklinData[dateStr];
    if (!dayData.appts) dayData.appts = [];

    if (apptId) {
      const existing = dayData.appts.find(a => a.id === apptId);
      if (existing) {
        existing.time = time;
        existing.text = title;
        existing.note = note;
      }
    } else {
      dayData.appts.push({
        id: 'ap-' + Date.now(),
        time: time,
        text: title,
        note: note,
        done: false
      });
    }

    this.saveState();
    this.renderCalendar();
    this.closeApptModal();
    this.showToast(`Appointment saved for ${this.formatFullDate(dateStr)}`);
  }

  renderCalendar() {
    if (!this.calendarGrid) return;
    this.calendarGrid.innerHTML = '';

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (this.calendarMonthTitle) {
      this.calendarMonthTitle.textContent = `${monthNames[this.currentCalMonth]} ${this.currentCalYear}`;
    }

    // Render Weekday Header (Sun - Sat)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
      const head = document.createElement('div');
      head.className = 'calendar-day-head';
      head.textContent = d;
      this.calendarGrid.appendChild(head);
    });

    const year = this.currentCalYear;
    const month = this.currentCalMonth; // 0-indexed
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const now = new Date();
    const isCurrentRealMonth = now.getFullYear() === year && now.getMonth() === month;
    const realTodayDate = now.getDate();

    // Fill leading empty padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-cell empty-cell';
      emptyCell.style.opacity = '0.25';
      emptyCell.style.background = 'transparent';
      emptyCell.style.border = '1px dashed rgba(255,255,255,0.05)';
      this.calendarGrid.appendChild(emptyCell);
    }

    // Render each day of the selected month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const cell = document.createElement('div');
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const fullDateStr = `${year}-${monthStr}-${dayStr}`;

      const isToday = isCurrentRealMonth && day === realTodayDate;
      cell.className = `calendar-cell ${isToday ? 'today' : ''}`;
      cell.style.cursor = 'pointer';
      cell.setAttribute('title', `Click to schedule/view appointments for ${fullDateStr}`);

      cell.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 4px;">
          <span class="day-number" style="font-weight: 800; font-size: 0.9rem;">${day}</span>
          <span style="font-size: 0.65rem; color: var(--stage-planner); font-weight: 700;">+ Appt</span>
        </div>
      `;

      // Render scheduled appointments for this date
      const franklinDay = this.state.franklinData[fullDateStr];
      if (franklinDay && franklinDay.appts && franklinDay.appts.length > 0) {
        franklinDay.appts.forEach(ap => {
          const schedPill = document.createElement('div');
          schedPill.className = 'event-dot';
          schedPill.style.background = '#127DBB';
          schedPill.style.color = '#ffffff';
          schedPill.style.fontWeight = '700';
          schedPill.textContent = `⏰ ${ap.time} ${ap.text}`;
          cell.appendChild(schedPill);
        });
      }

      cell.addEventListener('click', () => {
        this.openApptModal(fullDateStr);
      });

      this.calendarGrid.appendChild(cell);
    }
  }

  renderContacts() {
    if (!this.contactsGrid) return;
    this.contactsGrid.innerHTML = '';

    if (!this.state.contacts) this.state.contacts = [];
    const query = this.contactsSearchInput ? this.contactsSearchInput.value.toLowerCase().trim() : '';

    const filtered = this.state.contacts.filter(c => {
      if (!query) return true;
      return (
        (c.name && c.name.toLowerCase().includes(query)) ||
        (c.role && c.role.toLowerCase().includes(query)) ||
        (c.company && c.company.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.projects && c.projects.some(p => p.toLowerCase().includes(query)))
      );
    });

    if (filtered.length === 0) {
      this.contactsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted); background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-md);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📇</div>
          <p style="font-weight: 600; font-size: 1rem; color: var(--text-main);">No contacts found matching "${this.escapeHtml(query)}"</p>
          <p style="font-size: 0.85rem; margin-top: 4px;">Click "+ Add Contact" above to add team members or collaborators.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(contact => {
      const initials = (contact.name || 'C').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.borderLeft = `4px solid ${contact.color || '#7CFEFE'}`;

      const projectPills = (contact.projects || []).map(p => 
        `<span class="badge" style="background: rgba(124, 254, 254, 0.15); color: #7CFEFE; border: 1px solid rgba(124, 254, 254, 0.3); font-size: 0.72rem; margin-right: 4px; display: inline-block;">📁 ${this.escapeHtml(p)}</span>`
      ).join('');

      card.innerHTML = `
        <div class="card-header" style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, ${contact.color || '#7CFEFE'}, #3b82f6); color: #000; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(124, 254, 254, 0.3);">
              ${initials}
            </div>
            <div>
              <h4 class="card-title" style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px;">
                ${this.escapeHtml(contact.name)}
              </h4>
              <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">
                ${this.escapeHtml(contact.role || 'Collaborator')}${contact.company ? ' • ' + this.escapeHtml(contact.company) : ''}
              </div>
            </div>
          </div>
          <div class="card-actions" style="display: flex; gap: 4px;">
            <button class="icon-btn copy-btn" title="Copy Contact Details">📋</button>
            <button class="icon-btn edit-btn" title="Edit Contact">✏️</button>
            <button class="icon-btn delete delete-btn" title="Delete Contact">🗑️</button>
          </div>
        </div>

        <div class="card-body" style="font-size: 0.85rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px; margin-top: 0.6rem;">
          ${contact.email ? `<div style="display: flex; align-items: center; gap: 6px;"><span style="color: #7CFEFE;">✉️</span> <a href="mailto:${contact.email}" style="color: var(--text-main); text-decoration: none;">${this.escapeHtml(contact.email)}</a></div>` : ''}
          ${contact.phone ? `<div style="display: flex; align-items: center; gap: 6px;"><span style="color: #7CFEFE;">📞</span> <a href="tel:${contact.phone}" style="color: var(--text-main); text-decoration: none;">${this.escapeHtml(contact.phone)}</a></div>` : ''}
          ${contact.notes ? `<div style="font-size: 0.8rem; background: var(--bg-main); padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--border); font-style: italic; margin-top: 4px;">"${this.escapeHtml(contact.notes)}"</div>` : ''}
        </div>

        <div class="card-footer" style="margin-top: 0.75rem; padding-top: 0.6rem; border-top: 1px solid var(--border);">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px;">Assigned Projects:</div>
          <div>${projectPills || '<span style="font-size: 0.75rem; color: var(--text-dim);">No assigned projects</span>'}</div>
        </div>
      `;

      card.querySelector('.copy-btn').addEventListener('click', () => {
        const text = `${contact.name}\n${contact.role || ''} ${contact.company ? '(' + contact.company + ')' : ''}\nEmail: ${contact.email || 'N/A'}\nPhone: ${contact.phone || 'N/A'}\nProjects: ${(contact.projects || []).join(', ')}`;
        this.copyToClipboard(text, `Contact details for ${contact.name}`);
      });

      card.querySelector('.edit-btn').addEventListener('click', () => {
        this.openContactModal(contact.id);
      });

      card.querySelector('.delete-btn').addEventListener('click', () => {
        this.deleteContact(contact.id);
      });

      this.contactsGrid.appendChild(card);
    });
  }

  openContactModal(contactId = null) {
    if (!this.contactModalOverlay) return;
    const allProjects = this.getWorkspaceProjects();

    if (contactId) {
      const contact = (this.state.contacts || []).find(c => c.id === contactId);
      if (!contact) return;
      if (this.contactModalTitle) this.contactModalTitle.textContent = '✏️ Edit Contact';
      if (this.contactFormId) this.contactFormId.value = contact.id;
      if (this.contactFormName) this.contactFormName.value = contact.name || '';
      if (this.contactFormRole) this.contactFormRole.value = contact.role || '';
      if (this.contactFormEmail) this.contactFormEmail.value = contact.email || '';
      if (this.contactFormPhone) this.contactFormPhone.value = contact.phone || '';
      if (this.contactFormCompany) this.contactFormCompany.value = contact.company || '';
      if (this.contactFormNotes) this.contactFormNotes.value = contact.notes || '';

      if (this.contactFormProjectsList) {
        this.contactFormProjectsList.innerHTML = '';
        allProjects.forEach(p => {
          const isChecked = (contact.projects || []).includes(p);
          const lbl = document.createElement('label');
          lbl.style.fontSize = '0.82rem';
          lbl.style.display = 'flex';
          lbl.style.alignItems = 'center';
          lbl.style.gap = '8px';
          lbl.style.color = 'var(--text-main)';
          lbl.innerHTML = `<input type="checkbox" name="contactProjects" value="${this.escapeHtml(p)}" ${isChecked ? 'checked' : ''} /> 📁 ${this.escapeHtml(p)}`;
          this.contactFormProjectsList.appendChild(lbl);
        });
      }
    } else {
      if (this.contactModalTitle) this.contactModalTitle.textContent = '📇 Add New Contact';
      if (this.contactFormId) this.contactFormId.value = '';
      if (this.contactFormName) this.contactFormName.value = '';
      if (this.contactFormRole) this.contactFormRole.value = '';
      if (this.contactFormEmail) this.contactFormEmail.value = '';
      if (this.contactFormPhone) this.contactFormPhone.value = '';
      if (this.contactFormCompany) this.contactFormCompany.value = '';
      if (this.contactFormNotes) this.contactFormNotes.value = '';

      if (this.contactFormProjectsList) {
        this.contactFormProjectsList.innerHTML = '';
        allProjects.forEach(p => {
          const lbl = document.createElement('label');
          lbl.style.fontSize = '0.82rem';
          lbl.style.display = 'flex';
          lbl.style.alignItems = 'center';
          lbl.style.gap = '8px';
          lbl.style.color = 'var(--text-main)';
          lbl.innerHTML = `<input type="checkbox" name="contactProjects" value="${this.escapeHtml(p)}" /> 📁 ${this.escapeHtml(p)}`;
          this.contactFormProjectsList.appendChild(lbl);
        });
      }
    }

    this.contactModalOverlay.classList.add('active');
  }

  closeContactModal() {
    if (this.contactModalOverlay) {
      this.contactModalOverlay.classList.remove('active');
    }
  }

  handleSaveContact() {
    const id = this.contactFormId ? this.contactFormId.value : '';
    const name = this.contactFormName ? this.contactFormName.value.trim() : '';
    if (!name) return;

    const role = this.contactFormRole ? this.contactFormRole.value.trim() : '';
    const email = this.contactFormEmail ? this.contactFormEmail.value.trim() : '';
    const phone = this.contactFormPhone ? this.contactFormPhone.value.trim() : '';
    const company = this.contactFormCompany ? this.contactFormCompany.value.trim() : '';
    const notes = this.contactFormNotes ? this.contactFormNotes.value.trim() : '';

    const selectedProjects = [];
    if (this.contactFormProjectsList) {
      const boxes = this.contactFormProjectsList.querySelectorAll('input[name="contactProjects"]:checked');
      boxes.forEach(b => selectedProjects.push(b.value));
    }

    if (!this.state.contacts) this.state.contacts = [];

    if (id) {
      const existing = this.state.contacts.find(c => c.id === id);
      if (existing) {
        existing.name = name;
        existing.role = role;
        existing.email = email;
        existing.phone = phone;
        existing.company = company;
        existing.projects = selectedProjects;
        existing.notes = notes;
      }
    } else {
      const colors = ['#7CFEFE', '#FBF582', '#009967', '#3b82f6', '#a855f7'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.state.contacts.push({
        id: 'contact-' + Date.now(),
        name,
        role,
        company,
        email,
        phone,
        projects: selectedProjects,
        notes,
        color
      });
    }

    this.saveState();
    this.closeContactModal();
    this.showToast(`Saved contact "${name}"`);
  }

  deleteContact(contactId) {
    if (!contactId) return;
    const contact = (this.state.contacts || []).find(c => c.id === contactId);
    const name = contact ? contact.name : 'Contact';

    this.openMichiConfirmModal(
      'Delete Contact',
      `Are you sure you want to remove "${name}" from your contacts directory?`,
      () => {
        this.state.contacts = (this.state.contacts || []).filter(c => c.id !== contactId);
        this.saveState();
        this.showToast(`Deleted contact "${name}"`);
      }
    );
  }

  openAssignContactModal(projectName = '') {
    if (!this.assignContactModalOverlay) return;
    const allProjects = this.getWorkspaceProjects();

    if (this.assignContactProjectSelect) {
      this.assignContactProjectSelect.innerHTML = '';
      allProjects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `📁 ${p}`;
        if (p === projectName) opt.selected = true;
        this.assignContactProjectSelect.appendChild(opt);
      });
    }

    if (this.assignContactExistingSelect) {
      this.assignContactExistingSelect.innerHTML = '<option value="">-- Pick from Existing Contacts --</option>';
      (this.state.contacts || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `👤 ${c.name} (${c.role || 'Collaborator'})`;
        this.assignContactExistingSelect.appendChild(opt);
      });
    }

    if (this.assignContactManualName) this.assignContactManualName.value = '';
    if (this.assignContactManualEmail) this.assignContactManualEmail.value = '';
    if (this.assignContactManualPhone) this.assignContactManualPhone.value = '';

    this.assignContactModalOverlay.classList.add('active');
  }

  closeAssignContactModal() {
    if (this.assignContactModalOverlay) {
      this.assignContactModalOverlay.classList.remove('active');
    }
  }

  handleAssignContactSubmit() {
    const project = this.assignContactProjectSelect ? this.assignContactProjectSelect.value : '';
    if (!project) return;

    const existingId = this.assignContactExistingSelect ? this.assignContactExistingSelect.value : '';
    const manualName = this.assignContactManualName ? this.assignContactManualName.value.trim() : '';

    if (existingId) {
      const contact = (this.state.contacts || []).find(c => c.id === existingId);
      if (contact) {
        if (!contact.projects) contact.projects = [];
        if (!contact.projects.includes(project)) contact.projects.push(project);
        this.saveState();
        this.closeAssignContactModal();
        this.showToast(`Attached ${contact.name} to "${project}"`);
      }
    } else if (manualName) {
      const manualEmail = this.assignContactManualEmail ? this.assignContactManualEmail.value.trim() : '';
      const manualPhone = this.assignContactManualPhone ? this.assignContactManualPhone.value.trim() : '';

      let existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === manualName.toLowerCase());
      if (existing) {
        if (!existing.projects) existing.projects = [];
        if (!existing.projects.includes(project)) existing.projects.push(project);
      } else {
        if (!this.state.contacts) this.state.contacts = [];
        this.state.contacts.push({
          id: 'contact-' + Date.now(),
          name: manualName,
          role: 'Project Collaborator',
          company: '',
          email: manualEmail,
          phone: manualPhone,
          projects: [project],
          notes: `Attached to project "${project}".`,
          color: '#7CFEFE'
        });
      }

      this.saveState();
      this.closeAssignContactModal();
      this.showToast(`Added and attached ${manualName} to "${project}"`);
    }
  }

  openNewProjectModal() {
    if (this.newProjectModalOverlay) {
      if (this.newProjectTitle) this.newProjectTitle.value = '';
      if (this.newProjectSpark) this.newProjectSpark.value = '';
      if (this.newProjectManualContact) this.newProjectManualContact.value = '';
      if (this.newProjectContactSelect) {
        this.newProjectContactSelect.innerHTML = '<option value="">-- Select Existing Contact (Optional) --</option>';
        (this.state.contacts || []).forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = `👤 ${c.name} (${c.role || 'Collaborator'})`;
          this.newProjectContactSelect.appendChild(opt);
        });
      }
      this.newProjectModalOverlay.classList.add('active');
    }
  }

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new MichiApp();
});
