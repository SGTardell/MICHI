// Unregister any active Service Worker to eliminate cache reload loops
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  try {
    navigator.serviceWorker.getRegistrations().then(regs => {
      for (let r of regs) r.unregister();
    }).catch(() => {});
  } catch(e) {}
}

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

window.openTutorialModalGlobal = function(e) {
  if (e && e.preventDefault) {
    try { e.preventDefault(); e.stopPropagation(); } catch(err) {}
  }
  if (window.app && window.app.openTutorialModal) {
    window.app.openTutorialModal();
  } else {
    var overlay = document.getElementById('tutorialModalOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.pointerEvents = 'auto';
      overlay.classList.add('active');
    }
  }
  return false;
};

window.openLaunchChoiceModalGlobal = function(id) {
  if (window.app && window.app.openLaunchChoiceModalById) {
    window.app.openLaunchChoiceModalById(id);
  } else if (window.app && window.app.openLaunchChoiceModal) {
    const item = (window.app.state.items || []).find(i => i.id === id);
    if (item) window.app.openLaunchChoiceModal(item);
  } else {
    const overlay = document.getElementById('launchChoiceModalOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.zIndex = '999999';
      overlay.classList.add('active');
    }
  }
};

window.openChangeVaultPassModalGlobal = function() {
  if (window.app && window.app.openChangeVaultPassModal) {
    window.app.openChangeVaultPassModal();
  } else {
    const overlay = document.getElementById('changeVaultPassModalOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';
      overlay.style.zIndex = '999999';
      overlay.classList.add('active');
    }
  }
};

const STORAGE_KEY = 'MICHI_APP_DATA_V3';
const VAULT_PASS_KEY = 'MICHI_VAULT_MASTER_PASS_V1';

const defaultState = {
  theme: 'soyokaze',
  customProjects: [],
  customWebCategories: ['Tech', 'Sports', 'Fashion', 'Design', 'Finance'],
  contacts: [],
  items: [],
  appts: [],
  dailyLogs: {},
  franklinData: {},
  vaultItems: [],
  quickNotes: []
};

class MichiApp {
  constructor() {
    localStorage.setItem('michi_logged_in', 'true');

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
    this.initCloudSync();
    this.render();
  }

  signOut() {
    localStorage.removeItem('michi_logged_in');
    this.showToast('🔒 Signed Out. Returning to Sign In screen...');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 350);
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
    let savedTheme = localStorage.getItem('MICHI_COLOR_THEME') || 'soyokaze';
    if (savedTheme === 'tokyo') savedTheme = 'winter';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (this.themeSelector) {
      this.themeSelector.value = savedTheme;
      this.themeSelector.addEventListener('change', (e) => {
        const selected = e.target.value;
        document.documentElement.setAttribute('data-theme', selected);
        localStorage.setItem('MICHI_COLOR_THEME', selected);
        
        const names = {
          winter: 'MICHI Signature Dark',
          soyokaze: 'Gentle Breeze',
          summer: 'Lonely Beach'
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

        // Clean demo/phantom default names if present from old builds
        const legacyDemoNames = new Set(['spatial canvas architecture', 'personal', 'test', 'teswt']);
        parsed.customProjects = parsed.customProjects.filter(p => p && p.trim() && !legacyDemoNames.has(p.toLowerCase().trim()));
        parsed.items = parsed.items.filter(item => {
          const pLower = (item.project || '').toLowerCase().trim();
          return !legacyDemoNames.has(pLower);
        });

        // Strip generic laptop stock photos and legacy 'Password' tag
        parsed.items.forEach(item => {
          if (item.type !== 'vault' && Array.isArray(item.tags)) {
            item.tags = item.tags.filter(t => t && t.toLowerCase().trim() !== 'password');
          }
          if (item.imageUrl) {
            const lower = item.imageUrl.toLowerCase();
            if (lower.includes('photo-1498050108023') || lower.includes('photo-1486312338219') || lower.includes('photo-1517694712202') || (lower.includes('laptop') && lower.includes('unsplash'))) {
              delete item.imageUrl;
            }
          }
        });

        return parsed;
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  cleanStaleProjects() {
    const activeProjectItems = new Set((this.state.items || []).map(i => (i.project || '').trim().toLowerCase()));
    
    // Custom projects that have 0 items and are not General
    const staleProjects = (this.state.customProjects || []).filter(p => {
      const pLower = (p || '').trim().toLowerCase();
      return pLower !== 'general' && !activeProjectItems.has(pLower);
    });

    if (staleProjects.length === 0) {
      this.showToast('Project list is clean — no stale projects found!');
      return;
    }

    this.confirmDialog(
      `Found ${staleProjects.length} stale/empty project(s): "${staleProjects.join(', ')}". Purge them from project list?`,
      'Purge Stale Projects',
      () => {
        const staleSet = new Set(staleProjects.map(p => p.toLowerCase().trim()));
        this.state.customProjects = (this.state.customProjects || []).filter(p => !staleSet.has((p || '').toLowerCase().trim()));
        this.selectedProject = 'all';
        if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';

        this.saveState();
        this.renderProjectDropdowns();
        this.render();
        this.showToast(`Purged ${staleProjects.length} stale project(s).`);
      }
    );
  }

  getWorkspaceProjects() {
    if (!this.state.customProjects || !Array.isArray(this.state.customProjects)) {
      this.state.customProjects = [];
    }

    // Active project titles explicitly created in customProjects should NEVER be suppressed
    const activeCustomSet = new Set(this.state.customProjects.map(p => (p || '').trim().toLowerCase()));

    // Clean deletedProjects so active custom projects are never marked as deleted
    if (Array.isArray(this.state.deletedProjects)) {
      this.state.deletedProjects = this.state.deletedProjects.filter(p => !activeCustomSet.has((p || '').trim().toLowerCase()));
    }

    const deletedSet = new Set((this.state.deletedProjects || []).map(p => (p || '').trim().toLowerCase()));
    deletedSet.add('general');
    deletedSet.add('personal');
    deletedSet.add('spatial canvas architecture');

    // Auto-clean customProjects
    this.state.customProjects = this.state.customProjects.filter(p => p && p.trim() && !deletedSet.has(p.trim().toLowerCase()));

    const projects = new Set();

    // Include custom projects (excluding blacklisted/deleted ones)
    this.state.customProjects.forEach(p => {
      if (p && p.trim() && !deletedSet.has(p.trim().toLowerCase())) {
        projects.add(p.trim());
      }
    });

    // Also include project names from active items (excluding deleted ones)
    (this.state.items || []).forEach(i => {
      if (i.project && i.project.trim() && !deletedSet.has(i.project.trim().toLowerCase())) {
        const trimmed = i.project.trim();
        projects.add(trimmed);
      }
    });

    return Array.from(projects);
  }

  initCloudSync() {
    this.updateSyncBadge();
  }

  async pushToCloud() {
    this.updateSyncBadge();
  }

  async pullFromCloud(force = false) {
    this.updateSyncBadge();
  }

  async pullFromCloud(force = false) {
    try {
      let remoteData = null;
      const cb = 't=' + Date.now();

      // 1. Primary check: Vercel Cloud Sync API (supports 10MB payloads & full persistence)
      const syncEndpoints = [
        `https://public-five-red.vercel.app/api/sync?${cb}`,
        `/api/sync?${cb}`
      ];

      for (const endpoint of syncEndpoints) {
        try {
          const resp = await fetch(endpoint);
          if (resp.ok) {
            const result = await resp.json();
            const dataCandidate = (result && result.data && result.data.state) ? result.data : (result && result.state ? result : null);
            if (dataCandidate && dataCandidate.state) {
              remoteData = dataCandidate;
              break;
            }
          }
        } catch (e) {}
      }

      // 2. Fallback check: Real-time ntfy channel
      if (!remoteData || !remoteData.state) {
        try {
          const resp = await fetch(`https://ntfy.sh/michi_app_sync_channel_2026/json?poll=1&since=all&${cb}`);
          if (resp.ok) {
            const text = await resp.text();
            const lines = text.trim().split('\n');
            for (let i = lines.length - 1; i >= 0; i--) {
              try {
                const parsedLine = JSON.parse(lines[i]);
                if (parsedLine.event === 'attachment' && parsedLine.attachment && parsedLine.attachment.url) {
                  const attResp = await fetch(parsedLine.attachment.url);
                  if (attResp.ok) {
                    const payload = await attResp.json();
                    if (payload && payload.state) {
                      remoteData = payload;
                      break;
                    }
                  }
                } else if (parsedLine.event === 'message' && parsedLine.message) {
                  const payload = typeof parsedLine.message === 'string' ? JSON.parse(parsedLine.message) : parsedLine.message;
                  if (payload && payload.state) {
                    remoteData = payload;
                    break;
                  }
                }
              } catch (e) {}
            }
          }
        } catch (e) {}
      }

      if (!remoteData || !remoteData.state) return;

      const remoteUpdated = remoteData.lastUpdated || 0;
      const localUpdated = this.state.lastUpdated || 0;

      const remoteProjects = remoteData.state.customProjects || [];
      const remoteItems = remoteData.state.items || [];

      // MERGE remote custom projects into local state if not present
      if (!this.state.customProjects || !Array.isArray(this.state.customProjects)) {
        this.state.customProjects = [];
      }
      let mergedProjects = false;
      remoteProjects.forEach(p => {
        if (p && p.trim() && !this.state.customProjects.map(x => x.toLowerCase().trim()).includes(p.toLowerCase().trim())) {
          this.state.customProjects.push(p.trim());
          mergedProjects = true;
        }
      });

      // MERGE remote items into local state if missing
      if (!this.state.items || !Array.isArray(this.state.items)) {
        this.state.items = [];
      }
      const localItemIds = new Set(this.state.items.map(i => i.id));
      let mergedItems = false;
      remoteItems.forEach(item => {
        if (item && item.id && !localItemIds.has(item.id)) {
          this.state.items.unshift(item);
          mergedItems = true;
        }
      });

      // MERGE projectKinds map (Project vs Plan selections)
      if (remoteData.state.projectKinds) {
        if (!this.state.projectKinds) this.state.projectKinds = {};
        Object.assign(this.state.projectKinds, remoteData.state.projectKinds);
      }

      if (force || this.isFirstCloudCheck || remoteUpdated > localUpdated || mergedProjects || mergedItems) {
        this.isFirstCloudCheck = false;
        if (remoteUpdated >= localUpdated) {
          this.state = remoteData.state;
        } else {
          // If local state is newer, merge remote customProjects & items cleanly
          const remoteSet = new Set((remoteData.state.customProjects || []).map(p => p.trim().toLowerCase()));
          (this.state.customProjects || []).forEach(p => {
            if (p && p.trim() && !remoteSet.has(p.trim().toLowerCase())) {
              remoteData.state.customProjects = remoteData.state.customProjects || [];
              remoteData.state.customProjects.push(p.trim());
            }
          });
          this.state.customProjects = remoteData.state.customProjects;
        }

        // Clean out deleted projects so user deletions are strictly honored
        const deletedSet = new Set((this.state.deletedProjects || []).map(p => (p || '').trim().toLowerCase()));
        if (deletedSet.size > 0) {
          this.state.customProjects = (this.state.customProjects || []).filter(p => !deletedSet.has((p || '').trim().toLowerCase()));
          this.state.items = (this.state.items || []).filter(i => !deletedSet.has((i.project || '').trim().toLowerCase()));
        }

        this.state.lastUpdated = Math.max(remoteUpdated, localUpdated, Date.now());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.populateProjectDropdowns();
        this.render();
        this.updateSyncBadge();
      } else {
        this.isFirstCloudCheck = false;
        this.updateSyncBadge();
      }
    } catch (err) {
      console.warn('Background cloud pull skipped:', err);
    }
  }

  updateSyncBadge() {
    const badge = document.getElementById('statsCounter');
    if (badge) {
      const activeProjects = this.getWorkspaceProjects();
      const projCount = activeProjects.length;
      const totalItems = (this.state.items || []).length;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (projCount === 0) {
        badge.innerHTML = `<span style="color: var(--text-muted); font-weight: 700;">MICHI Workspace • ${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}</span>`;
      } else {
        badge.innerHTML = `<span style="color: var(--text-main); font-weight: 700;">Synced (${projCount} ${projCount === 1 ? 'Project/Plan' : 'Projects & Plans'}) at ${timeStr}</span>`;
      }
    }
  }

  saveState() {
    this.state.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.pushToCloud();
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
    this.btnHeaderAddResource = document.getElementById('btnHeaderAddResource');
    this.btnHeaderAddIssue = document.getElementById('btnHeaderAddIssue');
    this.btnHeaderAddTask = document.getElementById('btnHeaderAddTask');
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
    this.btnDeleteContactInModal = document.getElementById('btnDeleteContactInModal');

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
    this.webClipContactSelect = document.getElementById('webClipContactSelect');
    this.customWebClipContactWrapper = document.getElementById('customWebClipContactWrapper');
    this.customWebClipContactName = document.getElementById('customWebClipContactName');
    this.webCategoryPillsContainer = document.getElementById('webCategoryPills');

    // Issue Modal Elements
    this.issueModalOverlay = document.getElementById('issueModalOverlay');
    this.btnCloseIssueModal = document.getElementById('btnCloseIssueModal');
    this.btnCancelIssueModal = document.getElementById('btnCancelIssueModal');
    this.issueForm = document.getElementById('issueForm');
    this.issueProjectName = document.getElementById('issueProjectName');
    this.issueTitle = document.getElementById('issueTitle');
    this.issueContent = document.getElementById('issueContent');
    this.issueContactSelect = document.getElementById('issueContactSelect');
    this.customIssueContactWrapper = document.getElementById('customIssueContactWrapper');
    this.customIssueContactName = document.getElementById('customIssueContactName');

    // Task Modal Elements
    this.taskModalOverlay = document.getElementById('taskModalOverlay');
    this.btnCloseTaskModal = document.getElementById('btnCloseTaskModal');
    this.btnCancelTaskModal = document.getElementById('btnCancelTaskModal');
    this.taskForm = document.getElementById('taskForm');
    this.taskProjectName = document.getElementById('taskProjectName');
    this.taskTitle = document.getElementById('taskTitle');
    this.taskContent = document.getElementById('taskContent');
    this.taskContactSelect = document.getElementById('taskContactSelect');
    this.customTaskContactWrapper = document.getElementById('customTaskContactWrapper');
    this.customTaskContactName = document.getElementById('customTaskContactName');

    // Issue Step Modal Elements
    this.issueStepModalOverlay = document.getElementById('issueStepModalOverlay');
    this.btnCloseIssueStepModal = document.getElementById('btnCloseIssueStepModal');
    this.btnCancelIssueStepModal = document.getElementById('btnCancelIssueStepModal');
    this.issueStepForm = document.getElementById('issueStepForm');
    this.issueStepIssueId = document.getElementById('issueStepIssueId');
    this.issueStepModalHeaderTitle = document.getElementById('issueStepModalHeaderTitle');
    this.issueStepText = document.getElementById('issueStepText');
    this.issueStepContactSelect = document.getElementById('issueStepContactSelect');
    this.customIssueStepContactWrapper = document.getElementById('customIssueStepContactWrapper');
    this.customIssueStepContactName = document.getElementById('customIssueStepContactName');

    // Edit Issue Options Modal Elements
    this.editIssueModalOverlay = document.getElementById('editIssueModalOverlay');
    this.btnCloseEditIssueOptionsModal = document.getElementById('btnCloseEditIssueOptionsModal');
    this.btnCancelEditIssueModal = document.getElementById('btnCancelEditIssueModal');
    this.editIssueModalTitle = document.getElementById('editIssueModalTitle');
    this.editIssueModalIssueId = document.getElementById('editIssueModalIssueId');
    this.editIssueModalCurrentTech = document.getElementById('editIssueModalCurrentTech');
    this.btnEditIssueOptionAddStep = document.getElementById('btnEditIssueOptionAddStep');
    this.btnEditIssueOptionAssign = document.getElementById('btnEditIssueOptionAssign');
    this.btnEditIssueOptionEditDetails = document.getElementById('btnEditIssueOptionEditDetails');
    this.wrapperEditIssueFields = document.getElementById('wrapperEditIssueFields');
    this.inputEditIssueTitle = document.getElementById('inputEditIssueTitle');
    this.inputEditIssueContent = document.getElementById('inputEditIssueContent');
    this.btnSaveIssueDetails = document.getElementById('btnSaveIssueDetails');
    this.btnDeleteIssueFromModal = document.getElementById('btnDeleteIssueFromModal');

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

    this.navTabGuideBar = document.getElementById('navTabGuideBar');
    if (this.btnOpenTutorialHeader) {
      this.btnOpenTutorialHeader.addEventListener('click', () => this.openTutorialModal());
    }
    if (this.navTabGuideBar) {
      this.navTabGuideBar.addEventListener('click', () => this.openTutorialModal());
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
    this.editItemImageUrl = document.getElementById('editItemImageUrl');
    this.editItemCategory = document.getElementById('editItemCategory');
    this.customCategoryWrapper = document.getElementById('customCategoryWrapper');
    this.editItemCustomCategory = document.getElementById('editItemCustomCategory');
    this.editItemUsername = document.getElementById('editItemUsername');
    this.editItemSecret = document.getElementById('editItemSecret');
    this.btnGeneratePassword = document.getElementById('btnGeneratePassword');
    this.editItemTags = document.getElementById('editItemTags');
    this.editVaultGroup = document.getElementById('editVaultGroup');
    this.editItemContactSelect = document.getElementById('editItemContactSelect');
    this.customEditItemContactWrapper = document.getElementById('customEditItemContactWrapper');
    this.customEditItemContactName = document.getElementById('customEditItemContactName');

    // Note Modal Contact Elements
    this.noteContactSelect = document.getElementById('noteContactSelect');
    this.customNoteContactWrapper = document.getElementById('customNoteContactWrapper');
    this.customNoteContactName = document.getElementById('customNoteContactName');
  }

  confirmDialog(message, title = 'Delete Confirmation', actionCallback) {
    if (this.michiConfirmTitle) this.michiConfirmTitle.textContent = title;
    if (this.michiConfirmMessage) this.michiConfirmMessage.textContent = message;

    if (this.michiConfirmModalOverlay) {
      this.michiConfirmModalOverlay.style.display = 'flex';
      this.michiConfirmModalOverlay.style.zIndex = '999999';
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
      if (this.michiConfirmModalOverlay) {
        this.michiConfirmModalOverlay.style.display = 'none';
        this.michiConfirmModalOverlay.classList.remove('active');
      }
      if (this.btnMichiConfirmAction) this.btnMichiConfirmAction.removeEventListener('click', handleAction);
      if (this.btnMichiConfirmCancel) this.btnMichiConfirmCancel.removeEventListener('click', handleCancel);
    };

    if (this.btnMichiConfirmAction) this.btnMichiConfirmAction.addEventListener('click', handleAction);
    if (this.btnMichiConfirmCancel) this.btnMichiConfirmCancel.addEventListener('click', handleCancel);
  }

  openNewProjectModal() {
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
    if (this.newProjectModalOverlay) {
      this.newProjectModalOverlay.style.display = 'flex';
      this.newProjectModalOverlay.classList.add('active');
      if (this.newProjectTitle) this.newProjectTitle.focus();
    }
  }

  closeNewProjectModal() {
    if (this.newProjectModalOverlay) {
      this.newProjectModalOverlay.classList.remove('active');
      this.newProjectModalOverlay.style.display = 'none';
    }
    if (this.newProjectTitle) this.newProjectTitle.value = '';
    if (this.newProjectSpark) this.newProjectSpark.value = '';
    if (this.newProjectManualContact) this.newProjectManualContact.value = '';
    if (this.newProjectContactSelect) this.newProjectContactSelect.value = '';
  }

  handleCreateNewProject() {
    if (this._isCreatingProject) return;
    this._isCreatingProject = true;
    try {
      const titleEl = document.getElementById('newProjectTitle');
      const sparkEl = document.getElementById('newProjectSpark');
      const title = (titleEl ? titleEl.value : (this.newProjectTitle ? this.newProjectTitle.value : '')).trim();
      let sparkText = (sparkEl ? sparkEl.value : (this.newProjectSpark ? this.newProjectSpark.value : '')).trim();
      const now = new Date().toISOString().split('T')[0];

      if (!title) {
        alert('Please type a Title for your Plan or Project.');
        if (titleEl) titleEl.focus();
        return;
      }

      const selectedKindRadio = document.querySelector('input[name="newProjectType"]:checked');
      const kind = selectedKindRadio ? selectedKindRadio.value : 'project';

      if (!sparkText) {
        sparkText = `${kind === 'plan' ? 'Plan' : 'Work Project'} "${title}" initialized on MICHI Path.`;
      }

      if (!this.state) this.state = {};
      if (!this.state.items || !Array.isArray(this.state.items)) this.state.items = [];
      if (!this.state.customProjects || !Array.isArray(this.state.customProjects)) this.state.customProjects = [];
      if (!this.state.projectKinds) this.state.projectKinds = {};

      this.state.projectKinds[title] = kind;

      let leadContactName = '';
      const selectedContactId = this.newProjectContactSelect ? this.newProjectContactSelect.value : '';
      const manualContactName = this.newProjectManualContact ? this.newProjectManualContact.value.trim() : '';

      if (selectedContactId) {
        const contact = (this.state.contacts || []).find(c => c.id === selectedContactId);
        if (contact) {
          leadContactName = contact.name;
          if (!contact.projects) contact.projects = [];
          if (!contact.projects.includes(title)) contact.projects.push(title);
        }
      } else if (manualContactName) {
        leadContactName = manualContactName;
        let existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === manualContactName.toLowerCase());
        if (existing) {
          if (!existing.projects) existing.projects = [];
          if (!existing.projects.includes(title)) existing.projects.push(title);
        } else {
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push({
            id: 'contact-' + Date.now(),
            name: manualContactName,
            role: `${kind === 'plan' ? 'Plan' : 'Project'} Lead`,
            company: title,
            email: '',
            phone: '',
            projects: [title],
            notes: `Auto-created contact during creation of ${kind === 'plan' ? 'plan' : 'project'} "${title}".`,
            color: '#7CFEFE'
          });
        }
      }

      const isPlan = (kind === 'plan');
      const initialSpark = {
        id: 'item-spark-' + Date.now(),
        type: isPlan ? 'plan' : 'idea',
        stage: 'spark',
        project: title,
        title: `${title}: Vision & Objectives`,
        content: sparkText,
        isPlan: isPlan,
        category: isPlan ? 'Plan' : 'Project',
        assignedTo: leadContactName || '',
        notes: [
          { text: `${isPlan ? 'Plan' : 'Project'} "${title}" created and launched on MICHI Path.`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }
        ],
        tags: [title, isPlan ? 'Plan' : 'Project'],
        color: isPlan ? 'var(--stage-focus)' : 'var(--stage-spark)',
        date: now
      };

      if (!this.state.customProjects.includes(title)) {
        this.state.customProjects.push(title);
      }

      if (Array.isArray(this.state.deletedProjects)) {
        const targetLower = title.trim().toLowerCase();
        this.state.deletedProjects = this.state.deletedProjects.filter(p => (p || '').trim().toLowerCase() !== targetLower);
      }

      // Prevent duplicate initial spark cards for the same project title
      this.state.items = (this.state.items || []).filter(i => !(i.project === title && i.id && i.id.startsWith('item-spark-')));
      this.state.items.unshift(initialSpark);
      this.currentStageFilter = 'all';
      this.currentFilter = 'all';
      this.selectedProject = title;
      
      this.closeNewProjectModal();
      this.saveState();
      this.switchTab('all');
      this.renderProjectDropdowns();
      this.render();
      this.showToast(`🚀 Created ${isPlan ? 'Plan' : 'Project'} "${title}"!`);
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Error creating project: ' + err.message);
    } finally {
      setTimeout(() => { this._isCreatingProject = false; }, 400);
    }
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
        if (e) { e.preventDefault(); e.stopPropagation(); }
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

    if (this.btnHeaderAddResource) {
      this.btnHeaderAddResource.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.openWebClipModal();
      });
    }
    if (this.btnHeaderAddIssue) {
      this.btnHeaderAddIssue.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.openLogIssueModal();
      });
    }
    if (this.btnHeaderAddTask) {
      this.btnHeaderAddTask.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.openAddTaskModal();
      });
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
      this.btnAddWebClip.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.openWebClipModal();
      });
    }
    if (this.btnCloseWebClipModal) {
      this.btnCloseWebClipModal.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.closeWebClipModal();
      });
    }
    if (this.btnCancelWebClip) {
      this.btnCancelWebClip.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.closeWebClipModal();
      });
    }
    if (this.webClipForm) {
      this.webClipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.saveWebClip();
      });
    }

    // View Mode Switcher Handlers (Cards vs Compact List)
    const btnCards = document.getElementById('btnViewModeCards');
    const btnCompact = document.getElementById('btnViewModeCompact');
    if (btnCards) {
      btnCards.addEventListener('click', () => {
        this.brainDumpViewMode = 'cards';
        this.renderIdeasGrid();
      });
    }
    if (btnCompact) {
      btnCompact.addEventListener('click', () => {
        this.brainDumpViewMode = 'compact';
        this.renderIdeasGrid();
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

    if (this.webClipContactSelect) {
      this.webClipContactSelect.addEventListener('change', (e) => {
        if (e.target.value === '__NEW__') {
          if (this.customWebClipContactWrapper) this.customWebClipContactWrapper.style.display = 'block';
          if (this.customWebClipContactName) this.customWebClipContactName.focus();
        } else {
          if (this.customWebClipContactWrapper) this.customWebClipContactWrapper.style.display = 'none';
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
        if (!target) return;
        if (target === 'all') {
          this.switchTab('all', 'all');
        } else {
          this.switchTab(target);
        }
      });
    });

    // Vault Lock & Security Controls
    if (this.btnCloseVaultLockModal) {
      this.btnCloseVaultLockModal.addEventListener('click', () => this.closeVaultLockModal());
    }
    if (this.btnCancelVaultUnlock) {
      this.btnCancelVaultUnlock.addEventListener('click', () => this.closeVaultLockModal());
    }

    const btnChangeVaultPass = document.getElementById('btnChangeVaultPass');
    if (btnChangeVaultPass) {
      btnChangeVaultPass.addEventListener('click', () => this.openChangeVaultPassModal());
    }

    const btnCancelChangeVaultPass = document.getElementById('btnCancelChangeVaultPass');
    if (btnCancelChangeVaultPass) {
      btnCancelChangeVaultPass.addEventListener('click', () => this.closeChangeVaultPassModal());
    }

    const changeVaultPassForm = document.getElementById('changeVaultPassForm');
    if (changeVaultPassForm) {
      changeVaultPassForm.addEventListener('submit', (e) => this.handleChangeVaultPassSubmit(e));
    }

    // Project Selectors
    this.projectLineageSelect = document.getElementById('projectLineageSelect');
    this.dispatchProjectSelect = document.getElementById('dispatchProjectSelect');
    this.globalProjectFilter = document.getElementById('globalProjectFilter');

    if (this.projectLineageSelect) {
      this.projectLineageSelect.addEventListener('change', (e) => {
        const chosen = e.target.value;
        this.selectedProject = chosen;
        this.render();
        this.showToast(chosen === 'all' ? 'Showing all projects' : `Filtered to: ${chosen}`);
        e.target.value = 'all';
      });
    }

    const homeProjectFilterSelect = document.getElementById('homeProjectFilterSelect');
    if (homeProjectFilterSelect) {
      homeProjectFilterSelect.addEventListener('change', (e) => {
        const chosen = e.target.value;
        this.selectedProject = chosen;
        this.currentStageFilter = 'all';
        this.render();

        if (chosen === 'all') {
          this.showToast('Showing All Active Projects & Plans');
        } else if (chosen === 'projects') {
          this.showToast('Showing Active Work Projects');
        } else if (chosen === 'plans') {
          this.showToast('Showing Active Life Plans');
        } else {
          this.showToast(`Opened Board: "${chosen}"`);
        }
      });
    }

    if (this.globalProjectFilter) {
      this.globalProjectFilter.addEventListener('change', (e) => {
        const chosen = e.target.value;
        this.currentStageFilter = 'all';
        this.selectedProject = chosen;
        this.switchTab('all');
        this.render();

        if (chosen === 'all') {
          this.showToast('Showing All Active Projects & Plans');
        } else if (chosen === 'projects') {
          this.showToast('Showing Work Projects Only');
        } else if (chosen === 'plans') {
          this.showToast('Showing Life Plans Only');
        } else {
          this.showToast(`Opened Workspace Board: "${chosen}"`);
        }
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
      this.btnDeleteNote.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        const itemId = this.noteModalItemId.value;
        const index = parseInt(this.noteModalIndex.value, 10);
        if (!itemId || index < 0) return;

        const item = this.state.items.find(i => i.id === itemId);
        if (item && item.notes) {
          item.notes.splice(index, 1);
          this.saveState();
          this.closeNoteModal();
          this.render();
          this.showToast('Note line deleted!');
        }
      });
    }

    if (this.editItemContactSelect) {
      this.editItemContactSelect.addEventListener('change', () => {
        if (this.customEditItemContactWrapper) {
          this.customEditItemContactWrapper.style.display = this.editItemContactSelect.value === '__NEW__' ? 'block' : 'none';
        }
      });
    }

    if (this.noteContactSelect) {
      this.noteContactSelect.addEventListener('change', () => {
        if (this.customNoteContactWrapper) {
          this.customNoteContactWrapper.style.display = this.noteContactSelect.value === '__NEW__' ? 'block' : 'none';
        }
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
        if (this.issueModalOverlay && (this.issueModalOverlay.classList.contains('active') || this.issueModalOverlay.style.display !== 'none')) {
          this.closeIssueModal();
        }
        if (this.editIssueModalOverlay && (this.editIssueModalOverlay.classList.contains('active') || this.editIssueModalOverlay.style.display !== 'none')) {
          this.closeEditIssueModal();
        }
        if (this.issueStepModalOverlay && (this.issueStepModalOverlay.classList.contains('active') || this.issueStepModalOverlay.style.display !== 'none')) {
          this.closeAddIssueStepModal();
        }
        if (this.taskModalOverlay && (this.taskModalOverlay.classList.contains('active') || this.taskModalOverlay.style.display !== 'none')) {
          this.closeTaskModal();
        }
        if (this.webClipModalOverlay && (this.webClipModalOverlay.classList.contains('active') || this.webClipModalOverlay.style.display !== 'none')) {
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

    // Log Issue Modal
    if (this.btnCloseIssueModal) this.btnCloseIssueModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeIssueModal(); });
    if (this.btnCancelIssueModal) this.btnCancelIssueModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeIssueModal(); });
    if (this.issueContactSelect) {
      this.issueContactSelect.addEventListener('change', () => {
        if (this.customIssueContactWrapper) {
          this.customIssueContactWrapper.style.display = this.issueContactSelect.value === '__NEW__' ? 'block' : 'none';
        }
      });
    }
    if (this.issueForm) {
      this.issueForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.saveIssueModal();
      });
    }

    // Edit Issue Options Modal Listeners
    if (this.btnCloseEditIssueOptionsModal) this.btnCloseEditIssueOptionsModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeEditIssueModal(); });
    if (this.btnCancelEditIssueModal) this.btnCancelEditIssueModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeEditIssueModal(); });
    
    if (this.btnEditIssueOptionAddStep) {
      this.btnEditIssueOptionAddStep.addEventListener('click', () => {
        const iss = this.activeEditIssue;
        this.closeEditIssueModal();
        if (iss) this.openAddIssueStepModal(iss);
      });
    }

    if (this.btnEditIssueOptionAssign) {
      this.btnEditIssueOptionAssign.addEventListener('click', () => {
        const iss = this.activeEditIssue;
        this.closeEditIssueModal();
        if (iss) this.openAddIssueStepModal(iss);
      });
    }

    if (this.btnEditIssueOptionEditDetails) {
      this.btnEditIssueOptionEditDetails.addEventListener('click', () => {
        if (this.wrapperEditIssueFields) {
          const isHidden = this.wrapperEditIssueFields.style.display === 'none' || !this.wrapperEditIssueFields.style.display;
          this.wrapperEditIssueFields.style.display = isHidden ? 'flex' : 'none';
        }
      });
    }

    if (this.btnSaveIssueDetails) {
      this.btnSaveIssueDetails.addEventListener('click', () => {
        if (!this.activeEditIssue) return;
        const newTitle = this.inputEditIssueTitle ? this.inputEditIssueTitle.value.trim() : '';
        const newContent = this.inputEditIssueContent ? this.inputEditIssueContent.value.trim() : '';

        if (newTitle) this.activeEditIssue.title = newTitle;
        if (newContent !== undefined) this.activeEditIssue.content = newContent;

        this.saveState();
        this.closeEditIssueModal();
        this.render();
        this.showToast('Issue details updated!');
      });
    }

    if (this.btnDeleteIssueFromModal) {
      this.btnDeleteIssueFromModal.addEventListener('click', () => {
        if (!this.activeEditIssue) return;
        const iss = this.activeEditIssue;
        this.confirmDialog(`Are you sure you want to delete issue "${iss.title}"?`, 'Delete Issue', () => {
          this.state.items = (this.state.items || []).filter(i => i.id !== iss.id);
          this.saveState();
          this.closeEditIssueModal();
          this.render();
          this.showToast(`🗑️ Deleted issue "${iss.title}"`);
        });
      });
    }

    // Modal Backdrop Click Handlers to Close Modals
    if (this.editIssueModalOverlay) {
      this.editIssueModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.editIssueModalOverlay) this.closeEditIssueModal();
      });
    }

    // Add Issue Step Modal
    if (this.btnCloseIssueStepModal) this.btnCloseIssueStepModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeAddIssueStepModal(); });
    if (this.btnCancelIssueStepModal) this.btnCancelIssueStepModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeAddIssueStepModal(); });
    if (this.issueStepContactSelect) {
      this.issueStepContactSelect.addEventListener('change', () => {
        if (this.customIssueStepContactWrapper) {
          this.customIssueStepContactWrapper.style.display = this.issueStepContactSelect.value === '__NEW__' ? 'block' : 'none';
        }
      });
    }
    if (this.issueStepForm) {
      this.issueStepForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.saveIssueStepModal();
      });
    }

    // Add Task Modal
    if (this.btnCloseTaskModal) this.btnCloseTaskModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeTaskModal(); });
    if (this.btnCancelTaskModal) this.btnCancelTaskModal.addEventListener('click', (e) => { if (e) { e.stopPropagation(); e.preventDefault(); } this.closeTaskModal(); });
    if (this.taskContactSelect) {
      this.taskContactSelect.addEventListener('change', () => {
        if (this.customTaskContactWrapper) {
          this.customTaskContactWrapper.style.display = this.taskContactSelect.value === '__NEW__' ? 'block' : 'none';
        }
      });
    }
    if (this.taskForm) {
      this.taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.saveTaskModal();
      });
    }

    // Modal Backdrop Click Handlers to Close Modals
    if (this.webClipModalOverlay) {
      this.webClipModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.webClipModalOverlay) this.closeWebClipModal();
      });
    }
    if (this.issueModalOverlay) {
      this.issueModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.issueModalOverlay) this.closeIssueModal();
      });
    }
    if (this.taskModalOverlay) {
      this.taskModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.taskModalOverlay) this.closeTaskModal();
      });
    }
    if (this.issueStepModalOverlay) {
      this.issueStepModalOverlay.addEventListener('click', (e) => {
        if (e.target === this.issueStepModalOverlay) this.closeAddIssueStepModal();
      });
    }
  }

  openWebClipModal(targetProjectName) {
    this.currentUploadedImageDataUrl = '';
    if (this.webClipTitle) this.webClipTitle.value = '';
    if (this.webClipUrl) this.webClipUrl.value = '';
    if (this.customWebCategoryWrapper) this.customWebCategoryWrapper.style.display = 'none';
    if (this.webClipCustomCategory) this.webClipCustomCategory.value = '';
    if (this.webClipContent) this.webClipContent.value = '';

    // Populate Brain Dump Category Dropdown dynamically
    if (this.webClipCategory) {
      this.webClipCategory.innerHTML = '';
      const existingCats = new Set(['Tech', 'Sports', 'Fashion', 'Design', 'Finance', 'General']);
      (this.state.items || []).forEach(i => {
        if (i.category && i.category.trim()) existingCats.add(i.category.trim());
      });
      existingCats.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat === 'Finance' ? 'Business & Finance' : cat;
        this.webClipCategory.appendChild(opt);
      });
      const newOpt = document.createElement('option');
      newOpt.value = '__NEW__';
      newOpt.textContent = '+ Create Custom Category...';
      this.webClipCategory.appendChild(newOpt);

      if (targetProjectName && existingCats.has(targetProjectName)) {
        this.webClipCategory.value = targetProjectName;
      }
    }

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

    const activeProj = targetProjectName || this.selectedProject;

    if (projSelect) {
      projSelect.innerHTML = '';
      const projects = this.getWorkspaceProjects();
      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        if (p === activeProj) opt.selected = true;
        projSelect.appendChild(opt);
      });
    }

    if (targetTypeSelect) {
      if (activeProj && activeProj !== 'all' && activeProj !== 'General') {
        targetTypeSelect.value = 'project';
        if (wrapperCat) wrapperCat.style.display = 'none';
        if (wrapperProj) wrapperProj.style.display = 'block';
      }
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

    if (this.customWebClipContactName) this.customWebClipContactName.value = '';
    if (this.customWebClipContactWrapper) this.customWebClipContactWrapper.style.display = 'none';

    if (this.webClipContactSelect) {
      this.webClipContactSelect.innerHTML = '';
      const optUnassigned = document.createElement('option');
      optUnassigned.value = '';
      optUnassigned.textContent = 'Select Representative / Product Master (Optional)';
      this.webClipContactSelect.appendChild(optUnassigned);

      (this.state.contacts || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `👤 ${c.name} (${c.role || 'Representative / Contact'})`;
        this.webClipContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Assign New Representative / Contact...';
      this.webClipContactSelect.appendChild(optNew);
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
      this.webClipModalOverlay.style.display = 'flex';
      this.webClipModalOverlay.style.zIndex = '99999';
      this.webClipModalOverlay.classList.add('active');
      if (this.webClipTitle) this.webClipTitle.focus();
    }
  }

  closeWebClipModal() {
    if (this.webClipModalOverlay) {
      this.webClipModalOverlay.style.display = 'none';
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
    let content = this.webClipContent ? this.webClipContent.value.trim() : '';

    // Zero-Cost Hashtag Auto-Categorization (#Tech, #Travel, etc.)
    const fullTextToScan = `${title} ${content}`;
    const hashtagMatch = fullTextToScan.match(/#(\w+)/);
    if (hashtagMatch) {
      const tagText = hashtagMatch[1];
      const allKnownCats = [...(this.state.customWebCategories || []), 'Tech', 'Travel', 'Work', 'Personal', 'Health', 'General'];
      const matchedCat = allKnownCats.find(c => c.toLowerCase() === tagText.toLowerCase());

      if (matchedCat) {
        category = matchedCat;
      } else {
        const autoCat = tagText.charAt(0).toUpperCase() + tagText.slice(1);
        category = autoCat;
        if (!this.state.customWebCategories) this.state.customWebCategories = [];
        if (!this.state.customWebCategories.includes(autoCat)) {
          this.state.customWebCategories.push(autoCat);
        }
      }
      title = title.replace(new RegExp(`#${tagText}`, 'gi'), '').trim();
      content = content.replace(new RegExp(`#${tagText}`, 'gi'), '').trim();
    }
    
    if (category === '__NEW__') {
      const customVal = this.webClipCustomCategory ? this.webClipCustomCategory.value.trim() : '';
      category = customVal || 'General';
      if (!this.state.customWebCategories) this.state.customWebCategories = [];
      if (!this.state.customWebCategories.includes(category)) {
        this.state.customWebCategories.push(category);
      }
    }

    if (!title) {
      if (url) title = url;
      else if (imageUrl) title = 'Image Upload ' + new Date().toLocaleDateString();
      else return;
    }

    const targetProject = isProjectTarget ? (projSelect ? projSelect.value : 'General') : (this.selectedProject !== 'all' ? this.selectedProject : 'General');
    const targetStage = 'focus';
    const targetType = isProjectTarget ? 'resource' : 'web';

    let assignedName = this.webClipContactSelect ? this.webClipContactSelect.value : '';
    if (assignedName === '__NEW__') {
      const customName = this.customWebClipContactName ? this.customWebClipContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Product Master / MFG Rep',
            company: targetProject || 'General',
            email: '',
            phone: '',
            projects: [targetProject || 'General'],
            notes: `Auto-created contact during Tool/Resource addition.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
          this.showToast(`👤 Created new contact: "${assignedName}"!`);
        }
      }
    }

    const newClip = {
      id: 'item-web-' + Date.now(),
      type: targetType,
      stage: targetStage,
      project: targetProject,
      title: title,
      content: content,
      url: url,
      imageUrl: imageUrl,
      category: category,
      assignedTo: assignedName || '',
      tags: [category, isProjectTarget ? 'Project Resource' : 'Brain Dump'],
      color: isProjectTarget ? '#009967' : '#009967',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    if (!this.state.items) this.state.items = [];
    this.state.items.unshift(newClip);
    this.closeWebClipModal();
    this.saveState();

    if (url && !imageUrl) {
      fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.status === 'success' && data.data) {
            if (data.data.image && data.data.image.url) {
              const fetchedImg = data.data.image.url;
              const lower = fetchedImg.toLowerCase();
              const isGenericLaptopStock = lower.includes('photo-1522199755839') || lower.includes('photo-1498050108023') || lower.includes('photo-1486312338219') || lower.includes('photo-1517694712202') || (lower.includes('laptop') && lower.includes('unsplash'));
              if (!isGenericLaptopStock) {
                newClip.imageUrl = fetchedImg;
              }
            }
            if (!newClip.imageUrl) {
              try {
                const domain = new URL(url).hostname;
                newClip.imageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
              } catch (e) {}
            }
            if (data.data.title && (!newClip.title || newClip.title === url)) {
              newClip.title = data.data.title;
            }
            this.saveState();
            this.render();
          }
        })
        .catch(e => {
          try {
            const domain = new URL(url).hostname;
            newClip.imageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
            this.saveState();
            this.render();
          } catch (err) {}
        });
    }
    this.updateCategoryDropdowns();
    
    if (isProjectTarget) {
      this.showToast(`Saved Entry to Project "${targetProject}"!`);
    } else {
      this.showToast(`Saved to Brain Dump under "${category}"!`);
    }
  }

  switchTab(targetTab, overrideProject = undefined) {
    if (!targetTab) return;
    const targetEl = document.getElementById(`tab-${targetTab}`);
    if (!targetEl) return;

    if (overrideProject !== undefined) {
      this.selectedProject = overrideProject;
    }

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
    if (this.globalProjectFilter) {
      this.globalProjectFilter.value = this.selectedProject || 'all';
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
    const hour = document.getElementById('apptHourSelect') ? document.getElementById('apptHourSelect').value : '09';
    const min = document.getElementById('apptMinSelect') ? document.getElementById('apptMinSelect').value : ':00';
    const ampm = document.getElementById('apptAmPmSelect') ? document.getElementById('apptAmPmSelect').value : 'AM';
    const time = `${hour}${min} ${ampm}`;
    const text = this.apptTextInput ? this.apptTextInput.value.trim() : '';
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

    if (this.apptTextInput) this.apptTextInput.value = '';
    if (this.apptNoteInput) this.apptNoteInput.value = '';
    this.saveState();
    this.renderFranklinModalContent();
    this.renderCalendar();
    this.showToast(`Added appointment at ${time}`);
  }

  openNoteModal(itemId, noteIndex = -1) {
    const item = this.state.items.find(i => i.id === itemId);
    if (!item) return;

    this.noteModalItemId.value = itemId;
    this.noteModalIndex.value = noteIndex;

    if (this.customNoteContactName) this.customNoteContactName.value = '';
    if (this.customNoteContactWrapper) this.customNoteContactWrapper.style.display = 'none';

    if (this.noteContactSelect) {
      this.noteContactSelect.innerHTML = '';
      const optKeep = document.createElement('option');
      optKeep.value = '__KEEP__';
      optKeep.textContent = item.assignedTo ? `Current (${item.assignedTo})` : 'Unassigned (No Contact)';
      this.noteContactSelect.appendChild(optKeep);

      (this.state.contacts || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `👤 ${c.name} (${c.role || 'Contact'})`;
        if (c.name === item.assignedTo) opt.selected = true;
        this.noteContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Assign New Contact / Technician...';
      this.noteContactSelect.appendChild(optNew);
    }

    if (noteIndex >= 0 && item.notes && item.notes[noteIndex]) {
      const n = item.notes[noteIndex];
      if (this.noteModalTitle) this.noteModalTitle.textContent = `Edit Note Line (${n.date})`;
      this.noteInputText.value = n.text;
      if (this.btnDeleteNote) this.btnDeleteNote.style.display = 'block';
    } else {
      if (this.noteModalTitle) this.noteModalTitle.textContent = '➕ Add New Note Line';
      this.noteInputText.value = '';
      if (this.btnDeleteNote) this.btnDeleteNote.style.display = 'none';
    }

    if (this.noteModalOverlay) {
      this.noteModalOverlay.style.display = 'flex';
      this.noteModalOverlay.classList.add('active');
    }
    if (this.noteInputText) this.noteInputText.focus();
  }

  closeNoteModal() {
    if (this.noteModalOverlay) {
      this.noteModalOverlay.classList.remove('active');
      this.noteModalOverlay.style.display = 'none';
    }
    if (this.noteInputText) this.noteInputText.value = '';
    if (this.noteModalItemId) this.noteModalItemId.value = '';
    if (this.noteModalIndex) this.noteModalIndex.value = '-1';
    if (this.customNoteContactName) this.customNoteContactName.value = '';
  }

  saveQuickNote() {
    const id = this.noteModalItemId.value;
    const index = parseInt(this.noteModalIndex.value, 10);
    const text = this.noteInputText.value.trim();

    if (!id || !text) return;

    const item = this.state.items.find(i => i.id === id);
    if (!item) return;

    let assignedName = this.noteContactSelect ? this.noteContactSelect.value : '__KEEP__';
    if (assignedName === '__NEW__') {
      const customName = this.customNoteContactName ? this.customNoteContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Project Collaborator',
            company: item.project || 'General',
            email: '',
            phone: '',
            projects: [item.project || 'General'],
            notes: `Auto-created contact during note entry.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
          this.showToast(`👤 Created new contact: "${assignedName}"!`);
        }
        item.assignedTo = assignedName;
      }
    } else if (assignedName !== '__KEEP__' && assignedName) {
      item.assignedTo = assignedName;
    }

    if (!item.notes) item.notes = [];

    if (index >= 0 && item.notes[index]) {
      item.notes[index].text = text;
      this.showToast('Note line updated!');
    } else {
      const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      item.notes.unshift({ text, date: dateStr });
      this.showToast('New note line added!');
    }

    this.closeNoteModal();
    this.saveState();
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

  openChangeVaultPassModal() {
    const overlay = document.getElementById('changeVaultPassModalOverlay');
    const errDiv = document.getElementById('changeVaultPassError');
    if (errDiv) errDiv.style.display = 'none';
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      overlay.style.visibility = 'visible';
      overlay.style.zIndex = '99999';
      overlay.classList.add('active');
    }
  }

  closeChangeVaultPassModal() {
    const overlay = document.getElementById('changeVaultPassModalOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.visibility = 'hidden';
      overlay.classList.remove('active');
    }
  }

  handleChangeVaultPassSubmit(e) {
    if (e) e.preventDefault();
    const currentPass = document.getElementById('currentMasterPassInput')?.value.trim();
    const newPass = document.getElementById('newMasterPassInput')?.value.trim();
    const confirmPass = document.getElementById('confirmNewMasterPassInput')?.value.trim();
    const errDiv = document.getElementById('changeVaultPassError');

    const savedPass = localStorage.getItem(VAULT_PASS_KEY);

    if (savedPass && currentPass !== savedPass) {
      if (errDiv) {
        errDiv.textContent = 'Incorrect current master password. Please try again.';
        errDiv.style.display = 'block';
      }
      return;
    }

    if (!newPass || newPass.length < 3) {
      if (errDiv) {
        errDiv.textContent = 'New master password must be at least 3 characters.';
        errDiv.style.display = 'block';
      }
      return;
    }

    if (newPass !== confirmPass) {
      if (errDiv) {
        errDiv.textContent = 'New master passwords do not match. Please try again.';
        errDiv.style.display = 'block';
      }
      return;
    }

    localStorage.setItem(VAULT_PASS_KEY, newPass);
    this.closeChangeVaultPassModal();
    this.showToast('🔒 Master Password updated successfully!');
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
    this.editItemContent.value = '';
    this.editItemUrl.value = '';
    
    if (this.currentVaultCat !== 'all') {
      this.editItemCategory.value = this.currentVaultCat;
    } else {
      this.editItemCategory.value = 'API Keys';
    }

    const stageWrapper = document.getElementById('wrapperEditItemStage');
    if (stageWrapper) stageWrapper.style.display = 'none';

    this.customCategoryWrapper.style.display = 'none';
    this.editItemCustomCategory.value = '';
    this.editItemUsername.value = '';
    this.editItemSecret.value = '';
    this.editItemTags.value = 'Vault, Account';

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
    const stageNames = { spark: 'Overview', structure: 'Resources', focus: 'Development', product: 'Completed' };
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
    const stageNames = { spark: 'Overview', structure: 'Resources', focus: 'Development', product: 'Completed' };
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
      this.showToast('Item is already in initial Overview stage!');
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

    if (this.editItemImageUrl) {
      this.editItemImageUrl.value = item.imageUrl || '';
    }

    this.editItemUsername.value = item.username || '';
    this.editItemSecret.value = item.secret || '';
    this.editItemTags.value = (item.tags || []).join(', ');

    const stageWrapper = document.getElementById('wrapperEditItemStage');
    if (item.type === 'vault') {
      this.editVaultGroup.style.display = 'flex';
      if (stageWrapper) stageWrapper.style.display = 'none';
    } else {
      this.editVaultGroup.style.display = 'none';
      if (stageWrapper) stageWrapper.style.display = 'block';
    }

    // Populate Contact Dropdown in Edit Modal
    if (this.customEditItemContactName) this.customEditItemContactName.value = '';
    if (this.customEditItemContactWrapper) this.customEditItemContactWrapper.style.display = 'none';

    if (this.editItemContactSelect) {
      this.editItemContactSelect.innerHTML = '';
      const optUnassigned = document.createElement('option');
      optUnassigned.value = '';
      optUnassigned.textContent = 'Unassigned (No Contact)';
      this.editItemContactSelect.appendChild(optUnassigned);

      (this.state.contacts || []).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `👤 ${c.name} (${c.role || 'Contact'})`;
        if (c.name === item.assignedTo) opt.selected = true;
        this.editItemContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Assign New Contact / Technician...';
      this.editItemContactSelect.appendChild(optNew);
    }

    // Populate Appended Notes List in Edit Modal
    this.populateEditNotesList(item);

    if (this.editModalOverlay) {
      this.editModalOverlay.classList.add('active');
    }
  }

  populateEditNotesList(item) {
    const notesContainer = document.getElementById('editItemNotesList');
    if (!notesContainer) return;
    notesContainer.innerHTML = '';

    if (item.notes && item.notes.length > 0) {
      item.notes.forEach((n, idx) => {
        const noteRow = document.createElement('div');
        noteRow.style.display = 'flex';
        noteRow.style.alignItems = 'center';
        noteRow.style.justifyContent = 'space-between';
        noteRow.style.background = 'rgba(255,255,255,0.03)';
        noteRow.style.border = '1px solid var(--border)';
        noteRow.style.borderRadius = 'var(--radius-sm)';
        noteRow.style.padding = '0.4rem 0.6rem';
        noteRow.style.fontSize = '0.85rem';
        noteRow.style.gap = '8px';

        noteRow.innerHTML = `
          <input type="checkbox" class="btn-toggle-edit-note" data-index="${idx}" ${n.completed ? 'checked' : ''} style="accent-color: var(--stage-structure); cursor: pointer;" title="Toggle Complete" />
          <div style="flex: 1; min-width: 0;">
            <span style="font-size: 0.74rem; color: ${n.completed ? 'var(--text-dim)' : 'var(--text-main)'}; font-weight: 700;">${this.escapeHtml(n.date)}</span>
            <div style="color: ${n.completed ? 'var(--text-dim)' : 'var(--text-main)'}; font-size: 0.85rem; font-weight: 600; line-height: 1.35; text-decoration: ${n.completed ? 'line-through' : 'none'}; opacity: ${n.completed ? '0.7' : '1'}; overflow-wrap: break-word;">${this.escapeHtml(n.text)}</div>
          </div>
          <button type="button" class="btn-delete-item-note" data-index="${idx}" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.74rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; cursor: pointer;">Delete Note</button>
        `;

        noteRow.querySelector('.btn-toggle-edit-note').addEventListener('change', (e) => {
          n.completed = e.target.checked;
          this.saveState();
          this.populateEditNotesList(item);
          this.render();
        });

        noteRow.querySelector('.btn-delete-item-note').addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          item.notes.splice(idx, 1);
          this.saveState();
          this.populateEditNotesList(item);
          this.render();
          this.showToast('Note line deleted!');
        });

        notesContainer.appendChild(noteRow);
      });
    } else {
      notesContainer.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-dim); font-style: italic;">No appended notes on this item.</div>`;
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

    item.title = this.editItemTitle.value.trim() || 'Untitled Record';
    item.stage = this.editItemStage.value || 'focus';
    item.content = this.editItemContent.value.trim();
    item.url = this.editItemUrl.value.trim();
    item.imageUrl = this.editItemImageUrl ? this.editItemImageUrl.value.trim() : (item.imageUrl || '');

    let assignedName = this.editItemContactSelect ? this.editItemContactSelect.value : '';
    if (assignedName === '__NEW__') {
      const customName = this.customEditItemContactName ? this.customEditItemContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Project Collaborator',
            company: item.project || 'General',
            email: '',
            phone: '',
            projects: [item.project || 'General'],
            notes: `Auto-created contact during item edit.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
          this.showToast(`👤 Created new contact: "${assignedName}"!`);
        }
      }
    }
    item.assignedTo = assignedName || '';
    
    // Update category for ALL item types (web clips, vault items, ideas)
    let selectedCat = 'General';
    if (this.editItemCategory && this.editItemCategory.value === '__NEW__') {
      const customCat = this.editItemCustomCategory ? this.editItemCustomCategory.value.trim() : '';
      selectedCat = customCat || 'General';
      if (!this.state.customWebCategories) this.state.customWebCategories = [];
      if (!this.state.customWebCategories.includes(selectedCat)) {
        this.state.customWebCategories.push(selectedCat);
      }
    } else if (this.editItemCategory) {
      selectedCat = this.editItemCategory.value || 'General';
    }

    item.category = selectedCat;
    item.webCategory = selectedCat;

    const tagsRaw = this.editItemTags.value.trim();
    item.tags = tagsRaw 
      ? tagsRaw.split(',').map(t => t.trim()).filter(t => t && t.toLowerCase() !== 'password') 
      : [selectedCat, 'Brain Dump'];

    if (item.type === 'vault') {
      item.username = this.editItemUsername.value.trim() || 'user@michi';
      item.secret = this.editItemSecret.value.trim() || 'secret';
    }

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
    this.closeTutorialModal();
    this.selectedFranklinDate = dateStr || '2026-08-08';
    
    const savedFont = localStorage.getItem('MICHI_PLANNER_FONT') || 'cursive';
    if (this.plannerFontSelect) this.plannerFontSelect.value = savedFont;
    this.applyPlannerFontStyle(savedFont);

    this.renderFranklinModalContent();
    if (this.franklinModalOverlay) this.franklinModalOverlay.classList.add('active');
  }

  closeFranklinModal() {
    if (this.franklinModalOverlay) {
      this.franklinModalOverlay.classList.remove('active');
      this.franklinModalOverlay.style.display = 'none';
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
      dHead.style.color = 'var(--text-main)';
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
        dayCell.style.background = 'var(--bg-card)';
        dayCell.style.color = 'var(--text-main)';
        dayCell.style.border = '1px solid var(--border)';
        dayCell.style.fontWeight = '800';
      } else {
        dayCell.style.color = 'var(--text-muted)';
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
        tasks: [],
        appts: [],
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
      dayData.appts = [];
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
        itemEl.style.background = 'var(--bg-card)';
        itemEl.style.border = '1px solid var(--border)';
        itemEl.style.color = 'var(--text-main)';

        const prioHtml = prioOptions.map(p => `<option value="${p}" ${p === t.priority ? 'selected' : ''}>${p}</option>`).join('');

        itemEl.innerHTML = `
          <select class="task-prio-dropdown" title="Select Priority Tag" style="color: var(--text-main); font-weight: 800; font-size: 0.76rem; background: var(--bg-main); padding: 2px 4px; border-radius: 4px; border: 1px solid var(--border); cursor: pointer; outline: none;">
            ${prioHtml}
          </select>
          <input type="checkbox" ${t.done ? 'checked' : ''} style="-webkit-appearance: checkbox; appearance: checkbox; accent-color: var(--text-main); width: 16px; height: 16px;">
          <span class="edit-tasktext-btn" style="flex:1; font-size: 0.85rem; font-weight: 500; cursor: pointer; ${t.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}" title="Click to Edit Description">${this.escapeHtml(t.text)}</span>
          <button class="edit-tasktext-btn" style="background: transparent; border: none; color: var(--text-main); font-weight: 700; cursor: pointer; font-size: 0.76rem; padding: 2px 6px;" title="Edit Task Text">Edit</button>
          <button class="delete-task-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer;" title="Delete Task">✕</button>
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
      const timeOptions = [];
      const hrsAM = ['06','07','08','09','10','11'];
      const hrsPM = ['12','01','02','03','04','05','06','07','08','09','10','11'];
      hrsAM.forEach(h => {
        [':00', ':15', ':30', ':45'].forEach(m => timeOptions.push(`${h}${m} AM`));
      });
      hrsPM.forEach(h => {
        [':00', ':15', ':30', ':45'].forEach(m => timeOptions.push(`${h}${m} PM`));
      });

      dayData.appts.forEach(ap => {
        const apptRow = document.createElement('div');
        apptRow.style.display = 'flex';
        apptRow.style.flexDirection = 'column';
        apptRow.style.gap = '4px';
        apptRow.style.background = 'var(--bg-card)';
        apptRow.style.border = '1px solid var(--border)';
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
              <input type="checkbox" class="appt-done-checkbox" ${ap.done ? 'checked' : ''} style="-webkit-appearance: checkbox; appearance: checkbox; accent-color: var(--text-main); width: 16px; height: 16px; cursor: pointer;" title="Mark Appointment Completed / Closed">
              <select class="appt-time-dropdown" title="Select different appointment time" style="background-color: #D9DDDE !important; color: #616363 !important; -webkit-appearance: none !important; appearance: none !important; font-weight: 800; font-size: 0.78rem; padding: 3px 6px; border-radius: 4px; font-family: monospace; border: 1px solid #B2B7B9 !important; cursor: pointer; outline: none;">
                ${timeOptsHtml}
              </select>
              <span class="edit-title-only-btn" title="Click to Edit Title" style="font-size: 0.85rem; color: var(--text-main); font-weight: 700; cursor: pointer; flex: 1; ${ap.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}">
                ${this.escapeHtml(ap.text)}
              </span>
            </div>
            <div style="display: flex; align-items: center; gap: 4px;">
              <button class="edit-full-appt-btn" style="background: var(--bg-card); border: 1px solid var(--border); color: var(--text-main); font-weight: 700; cursor: pointer; font-size: 0.76rem; padding: 2px 7px; border-radius: 4px;" title="Edit Appointment Title & Details">Edit</button>
              <button class="delete-appt-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; padding: 2px 4px;" title="Delete Appointment">✕</button>
            </div>
          </div>
          ${ap.note ? `<div class="edit-note-only-btn" style="font-size: 0.76rem; color: var(--text-muted); padding-left: 24px; font-style: italic; cursor: pointer; ${ap.done ? 'text-decoration: line-through; opacity: 0.5;' : ''}" title="Click to Edit Note Only">Note: ${this.escapeHtml(ap.note)}</div>` : ''}
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

        apptRow.querySelectorAll('.edit-full-appt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const newText = prompt('Update Appointment Title / Client:', ap.text);
            if (newText === null || !newText.trim()) return;
            const newNote = prompt('Update Appointment Note / Details (optional):', ap.note || '');
            ap.text = newText.trim();
            if (newNote !== null) ap.note = newNote.trim();
            this.saveState();
            this.renderFranklinModalContent();
            this.showToast('Appointment updated!');
          });
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

  async refreshApp() {
    this.showToast('🔄 Hard Refreshing Cache & Unregistering SW...');
    try {
      await this.pullFromCloud(true);
    } catch (e) {}
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      } catch (e) {}
    }
    if ('serviceWorker' in navigator) {
      try {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
      } catch (e) {}
    }
    setTimeout(() => {
      window.location.reload(true);
    }, 300);
  }

  openTutorialModal() {
    this.closeFranklinModal();
    this.closeApptModal();
    this.currentTutorialSlide = 1;
    const overlay = document.getElementById('tutorialModalOverlay') || this.tutorialModalOverlay;
    if (overlay) {
      overlay.style.cssText = 'display: flex !important; opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; z-index: 99999999 !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: rgba(0, 0, 0, 0.85) !important; padding: 1rem; overflow-y: auto; align-items: center; justify-content: center;';
      overlay.classList.add('active');
    }

    this.updateTutorialSlideView();

    // Bind Guide side chapter tabs with reliable event delegation
    const tabs = document.querySelectorAll('.guide-tab-item');
    tabs.forEach(t => {
      t.addEventListener('click', (e) => {
        const item = e.currentTarget || e.target.closest('.guide-tab-item');
        if (!item) return;
        const chap = parseInt(item.dataset.chapter, 10);
        if (chap && chap >= 1 && chap <= 5) {
          this.currentTutorialSlide = chap;
          this.updateTutorialSlideView();
        }
      });
    });
  }

  goToTutorialSlide(chapNum) {
    const chap = parseInt(chapNum, 10);
    if (chap && chap >= 1 && chap <= 5) {
      this.currentTutorialSlide = chap;
      this.updateTutorialSlideView();
    }
  }

  closeTutorialModal() {
    const overlay = document.getElementById('tutorialModalOverlay') || this.tutorialModalOverlay;
    if (overlay) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }
  }

  prevTutorialSlide() {
    if (this.currentTutorialSlide > 1) {
      this.currentTutorialSlide--;
      this.updateTutorialSlideView();
    }
  }

  nextTutorialSlide() {
    const totalSlides = 5;
    if (this.currentTutorialSlide < totalSlides) {
      this.currentTutorialSlide++;
      this.updateTutorialSlideView();
    } else {
      this.closeTutorialModal();
      this.showToast('Guide walkthrough complete!');
    }
  }

  updateTutorialSlideView() {
    const totalSlides = 5;
    const chap = this.currentTutorialSlide;

    const leftBadge = document.getElementById('guideLeftChapterBadge');
    const leftTitle = document.getElementById('guideLeftTopicTitle');
    const leftContent = document.getElementById('guideLeftContent');
    const rightSubTitle = document.getElementById('guideRightSubTitle');
    const rightContent = document.getElementById('guideRightContent');
    const indicator = document.getElementById('tutorialStepIndicator');

    if (indicator) indicator.textContent = `Page ${chap} of ${totalSlides}`;

    // Highlight active side tab
    document.querySelectorAll('.guide-tab-item').forEach(t => {
      const active = parseInt(t.dataset.chapter, 10) === chap;
      t.style.background = active ? 'var(--bg-card-hover)' : 'var(--bg-card)';
      t.style.fontWeight = active ? '900' : '700';
    });

    const guideChapters = [
      {
        badge: 'Chapter 1',
        title: 'The MICHI (道) Philosophy & 2-Stage Pipeline',
        leftHtml: `
          <p>In Japanese culture, <strong>道 (Michi)</strong> represents a disciplined journey or path. MICHI organizes your life and work into a streamlined 2-stage creation pipeline:</p>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <div style="background: var(--bg-card); padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
              <strong style="color: var(--text-main); font-size: 0.88rem;">1. Development Board</strong>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Active project work, pending tasks, resource bookmarks, and in-process goals.</p>
            </div>
            <div style="background: var(--bg-card); padding: 10px; border-radius: 6px; border: 1px solid var(--border);">
              <strong style="color: var(--text-main); font-size: 0.88rem;">2. Completed Board</strong>
              <p style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">Finished deliverables, closed projects, archived benchmarks, and milestone records.</p>
            </div>
          </div>
        `,
        rightSubTitle: 'Global Header Controls & Color Schemes',
        rightHtml: `
          <p>Navigate and personalize your workspace effortlessly using top controls:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>Theme Selector:</strong> Switch between:
              <ul style="margin-top: 3px; padding-left: 1rem; font-size: 0.8rem;">
                <li><strong>🍃 そよ風 Soyokaze (Gentle Breeze):</strong> Crisp light mode with silver-gray card spreads & teal accents.</li>
                <li><strong>冬 Fuyu (MICHI Signature Dark):</strong> Deep midnight dark mode with dark navy card spreads & cyan glow accents.</li>
              </ul>
            </li>
            <li><strong>📁 All Projects Filter:</strong> Filter your entire dashboard to focus strictly on 1 active project container.</li>
            <li><strong>🔍 Workspace Search:</strong> Query all tasks, brain dump notes, and project cards instantly.</li>
          </ul>
        `
      },
      {
        badge: 'Chapter 2',
        title: 'Daily Planner & 2-Page Binder Spread',
        leftHtml: `
          <p>The <strong>Daily Planner</strong> provides an authentic 2-page digital binder spread layout:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>3 Mini-Calendars:</strong> Side-by-side view showing Previous Month, Active Month (Highlighted), and Next Month.</li>
            <li><strong>Prioritized ABC Task List:</strong> Assign A1, A2, B1, C1 tags to urgent daily objectives.</li>
            <li><strong>Daily Tracker Box:</strong> Log expenses, calls, mileage, or quick thoughts at the bottom left.</li>
          </ul>
        `,
        rightSubTitle: 'Appointment Schedule & 15-Min Selectors',
        rightHtml: `
          <p>Manage your client appointments with 15-minute precision:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>Dual Time Selectors:</strong> Pick exact hour (<code>06 AM</code>–<code>11 PM</code>) and minute increments (<code>:00</code>, <code>:15</code>, <code>:30</code>, <code>:45</code>).</li>
            <li><strong>✏️ Edit Button:</strong> Tap <strong>Edit</strong> on any appointment banner to quickly adjust the title, time, or sub-note.</li>
            <li><strong>Completed Checkbox:</strong> Check off finished appointments with a clean strikethrough.</li>
          </ul>
          <div style="margin-top: 8px;">
            <button type="button" onclick="if(window.app && window.app.closeTutorialModal && window.app.openFranklinModal) { window.app.closeTutorialModal(); window.app.openFranklinModal(); }" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 800; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;">📅 Try Daily Planner Now ➔</button>
          </div>
        `
      },
      {
        badge: 'Chapter 3',
        title: 'Brain Dump Repository, #Hashtags & Web Clipping',
        leftHtml: `
          <p>Never lose a fleeting thought, link, or inspiration with the <strong>Brain Dump Repository</strong>:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>🏷️ Zero-Cost #Hashtag Auto-Categorization:</strong> Include hashtags like <code>#Tech</code>, <code>#Travel</code>, <code>#Work</code>, or <code>#Personal</code> anywhere in your note or link. MICHI automatically cleans the title and routes the item directly to that topic category tab!</li>
            <li><strong>📲 iOS & Android Share Sheet:</strong> Share web articles, posts, or notes directly into MICHI from any browser or app.</li>
          </ul>
        `,
        rightSubTitle: 'Topic Filtering & Conversion Pipeline',
        rightHtml: `
          <p>Organize your topic notes with high-visibility controls:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>All Topics Dropdown:</strong> Filter your notes instantly by category (Tech, Travel, Work, etc.).</li>
            <li><strong>➕ Add Brain Dump / Clip:</strong> Attach URL web links, hashtags, and reference clips.</li>
            <li><strong>🚀 Convert to Project:</strong> Promote any brain dump idea directly into the Development Pipeline with 1 tap.</li>
          </ul>
        `
      },
      {
        badge: 'Chapter 4',
        title: 'Kanban Boards & Pipeline Advancement',
        leftHtml: `
          <p>Organize complex projects visual board style:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>Development Board:</strong> Active projects, progress bars, and item checklists.</li>
            <li><strong>Advance ➔ Button:</strong> Move finished projects seamlessly to the Completed Board with matching silver mist buttons.</li>
          </ul>
        `,
        rightSubTitle: 'Completed Board Archive & Lineage',
        rightHtml: `
          <p>Review past victories and project history:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>Completed Archive:</strong> Keep a permanent record of finished projects and deliverables.</li>
            <li><strong>Project Lineage:</strong> Track how ideas evolve from initial Spark to final Product.</li>
          </ul>
        `
      },
      {
        badge: 'Chapter 5',
        title: 'Cloud Sync, Password Vault & Backups',
        leftHtml: `
          <p>Keep your data secure and accessible across all devices:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>RESTful Cloud Sync:</strong> Real-time background sync keeps your iPhone, iPad, and desktop updated.</li>
            <li><strong>Password Vault:</strong> Secure master-password protected vault for server API keys and login credentials.</li>
          </ul>
        `,
        rightSubTitle: 'Disaster Recovery & PWA Offline Use',
        rightHtml: `
          <p>Total data ownership and offline resilience:</p>
          <ul style="padding-left: 1.1rem; line-height: 1.6; font-size: 0.84rem;">
            <li><strong>📥 Backup:</strong> Download full JSON workspace files to iCloud Drive or local disk.</li>
            <li><strong>📤 Restore:</strong> Restore 100% of your workspace instantly on any browser or mobile app.</li>
          </ul>
        `
      }
    ];

    const curData = guideChapters[chap - 1] || guideChapters[0];

    if (leftBadge) leftBadge.textContent = curData.badge;
    if (leftTitle) leftTitle.textContent = curData.title;
    if (leftContent) leftContent.innerHTML = curData.leftHtml;
    if (rightSubTitle) rightSubTitle.textContent = curData.rightSubTitle;
    if (rightContent) rightContent.innerHTML = curData.rightHtml;

    if (this.btnPrevTutorialStep) {
      this.btnPrevTutorialStep.style.display = chap > 1 ? 'inline-block' : 'none';
    }

    if (this.btnNextTutorialStep) {
      if (chap === totalSlides) {
        this.btnNextTutorialStep.textContent = 'Finish Guide ✓';
      } else {
        this.btnNextTutorialStep.textContent = 'Next Page ►';
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
      this.render();
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

      let matchesProject = true;
      if (!this.selectedProject || this.selectedProject === 'all') {
        matchesProject = true;
      } else if (this.selectedProject === 'projects') {
        matchesProject = (!item.isPlan && item.category !== 'Plan' && item.type !== 'plan' && item.boardType !== 'plan');
      } else if (this.selectedProject === 'plans') {
        matchesProject = (item.isPlan === true || item.category === 'Plan' || item.type === 'plan' || item.boardType === 'plan');
      } else {
        const itemProj = (item.project || item.title || 'Personal').trim().toLowerCase();
        const selProj = (this.selectedProject || '').trim().toLowerCase();
        matchesProject = itemProj === selProj || (item.title && item.title.trim().toLowerCase() === selProj);
      }

      let matchesWebCat = true;
      if (this.currentWebCat === 'inbox') {
        const itemCat = (item.category || item.webCategory || (item.tags && item.tags[0]) || 'General').toLowerCase();
        matchesWebCat = itemCat === 'general' || itemCat === 'unfiled' || itemCat === 'inbox';
      } else if (this.currentWebCat && this.currentWebCat !== 'all') {
        const itemCat = item.category || item.webCategory || (item.tags && item.tags[0]) || 'General';
        matchesWebCat = itemCat.toLowerCase() === this.currentWebCat.toLowerCase();
      }

      return matchesSearch && matchesFilter && matchesStage && matchesProject && matchesWebCat;
    });
  }

  renderWebCategoryPills() {
    if (!this.webCategoryPillsContainer) return;

    const categories = new Set(['inbox', 'all', 'Tech', 'Travel', 'Work', 'Personal', 'Health', 'Sports', 'Fashion', 'Design', 'Finance']);
    (this.state.items || []).forEach(i => {
      const cat = i.category || i.webCategory || (i.tags && i.tags[0]);
      if (cat && cat.trim()) categories.add(cat.trim());
    });
    if (this.state.customWebCategories) {
      this.state.customWebCategories.forEach(c => c && c.trim() && categories.add(c.trim()));
    }

    this.webCategoryPillsContainer.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `filter-pill ${this.currentWebCat.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`;
      btn.dataset.webCat = cat;

      const labels = {
        inbox: '📥 Inbox (Unfiled)',
        all: '🌐 All Master Notes',
        Tech: 'Tech',
        Travel: 'Travel ✈️',
        Work: 'Work 🛠️',
        Personal: 'Personal 🏠',
        Health: 'Health 🏃',
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

  updateViewModeButtons() {
    const btnCards = document.getElementById('btnViewModeCards');
    const btnCompact = document.getElementById('btnViewModeCompact');
    const isCards = (this.brainDumpViewMode || 'cards') === 'cards';

    if (btnCards) {
      btnCards.style.background = isCards ? 'var(--bg-card-hover)' : 'transparent';
      btnCards.style.color = isCards ? 'var(--text-main)' : 'var(--text-muted)';
      btnCards.style.borderColor = isCards ? 'var(--border)' : 'transparent';
    }
    if (btnCompact) {
      btnCompact.style.background = !isCards ? 'var(--bg-card-hover)' : 'transparent';
      btnCompact.style.color = !isCards ? 'var(--text-main)' : 'var(--text-muted)';
      btnCompact.style.borderColor = !isCards ? 'var(--border)' : 'transparent';
    }
  }

  renderIdeasGrid() {
    if (!this.ideasGrid) return;
    this.renderWebCategoryPills();
    this.updateViewModeButtons();
    this.ideasGrid.innerHTML = '';

    const isCompact = this.brainDumpViewMode === 'compact';
    if (isCompact) {
      this.ideasGrid.style.display = 'flex';
      this.ideasGrid.style.flexDirection = 'column';
      this.ideasGrid.style.gap = '6px';
    } else {
      this.ideasGrid.style.display = 'grid';
      this.ideasGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
      this.ideasGrid.style.gap = '1.25rem';
    }

    let webItems = this.state.items.filter(i => (i.type === 'web' || (i.type === 'idea' && (!i.project || i.project === 'General'))));

    if (this.currentWebCat === 'inbox') {
      webItems = webItems.filter(i => {
        const itemCat = (i.category || i.webCategory || (i.tags && i.tags[0]) || 'General').toLowerCase();
        return itemCat === 'general' || itemCat === 'unfiled' || itemCat === 'inbox';
      });
    } else if (this.currentWebCat !== 'all') {
      webItems = webItems.filter(i => {
        const itemCat = i.category || i.webCategory || (i.tags && i.tags[0]) || 'General';
        return itemCat.toLowerCase() === this.currentWebCat.toLowerCase();
      });
    }

    if (this.selectedProject !== 'all') {
      webItems = webItems.filter(i => (i.project || 'General') === this.selectedProject);
    }
    if (webItems.length === 0) {
      this.ideasGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;">No web clips or interest bookmarks found for this category or project.</p>
          <button type="button" onclick="document.getElementById('btnAddWebClip').click()" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); padding: 0.6rem 1.4rem; border-radius: var(--radius-sm); font-weight: 700; cursor: pointer;">➕ Add Web Bookmark</button>
        </div>
      `;
      return;
    }

    webItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      const notes = item.notes || [];
      const catBadge = item.category || item.webCategory || (item.tags && item.tags[0]) || 'Web Clip';

      // Only display image if item has an authentic image attached
      const displayImageUrl = (item.imageUrl || '').trim();

      if (isCompact) {
        card.style.margin = '0';
        card.style.padding = '8px 12px';
        card.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 220px; overflow: hidden;">
              <select class="card-category-quick-select" style="background: rgba(0, 153, 103, 0.15); color: var(--stage-structure); border: 1px solid rgba(0, 153, 103, 0.3); font-weight: 800; border-radius: 4px; padding: 2px 6px; font-size: 0.74rem; cursor: pointer;" title="Move item to Category">
                <option value="General" ${catBadge === 'General' || catBadge === 'Inbox' ? 'selected' : ''}>📥 Inbox (Unfiled)</option>
                <option value="Travel" ${catBadge.toLowerCase() === 'travel' ? 'selected' : ''}>✈️ Travel</option>
                <option value="Tech" ${catBadge.toLowerCase() === 'tech' ? 'selected' : ''}>💻 Tech</option>
                <option value="Work" ${catBadge.toLowerCase() === 'work' ? 'selected' : ''}>🛠️ Work</option>
                <option value="Personal" ${catBadge.toLowerCase() === 'personal' ? 'selected' : ''}>🏠 Personal</option>
                <option value="Health" ${catBadge.toLowerCase() === 'health' ? 'selected' : ''}>🏃 Health</option>
                ${(this.state.customWebCategories || []).map(c => `<option value="${c}" ${catBadge.toLowerCase() === c.toLowerCase() ? 'selected' : ''}>🏷️ ${c}</option>`).join('')}
                <option value="__NEW__">➕ New Category...</option>
              </select>
              <h4 style="color: var(--text-main); font-weight: 700; font-size: 0.88rem; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.escapeHtml(item.title)}</h4>
              ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" style="color: var(--stage-focus); font-size: 0.78rem; text-decoration: underline; white-space: nowrap;">🔗 Open Link</a>` : ''}
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <button type="button" class="btn-launch-project" onclick="openLaunchChoiceModalGlobal('${item.id}')" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.74rem; padding: 3px 8px; border-radius: 4px; cursor: pointer;" title="Launch as Project or Daily Plan Task">🚀 Launch</button>
              <button class="icon-btn edit-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.74rem; padding: 3px 8px;" title="Edit">Edit</button>
              <button class="icon-btn delete-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.74rem; padding: 3px 8px;" title="Delete">Delete</button>
            </div>
          </div>
        `;
      } else {
        card.innerHTML = `
          <div class="card-color-stripe" style="background: var(--stage-structure);"></div>
          <div class="card-header">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
              <select class="card-category-quick-select" style="background: rgba(0, 153, 103, 0.15); color: var(--stage-structure); border: 1px solid rgba(0, 153, 103, 0.3); font-weight: 800; border-radius: 4px; padding: 2px 6px; font-size: 0.76rem; cursor: pointer;" title="Move item to Category">
                <option value="General" ${catBadge === 'General' || catBadge === 'Inbox' ? 'selected' : ''}>📥 Inbox (Unfiled)</option>
                <option value="Travel" ${catBadge.toLowerCase() === 'travel' ? 'selected' : ''}>✈️ Travel</option>
                <option value="Tech" ${catBadge.toLowerCase() === 'tech' ? 'selected' : ''}>💻 Tech</option>
                <option value="Work" ${catBadge.toLowerCase() === 'work' ? 'selected' : ''}>🛠️ Work</option>
                <option value="Personal" ${catBadge.toLowerCase() === 'personal' ? 'selected' : ''}>🏠 Personal</option>
                <option value="Health" ${catBadge.toLowerCase() === 'health' ? 'selected' : ''}>🏃 Health</option>
                ${(this.state.customWebCategories || []).map(c => `<option value="${c}" ${catBadge.toLowerCase() === c.toLowerCase() ? 'selected' : ''}>🏷️ ${c}</option>`).join('')}
                <option value="__NEW__">➕ New Category...</option>
              </select>
              <h4 class="card-title" style="color: var(--text-main); font-weight: 700;">${this.escapeHtml(item.title)}</h4>
            </div>
            <div class="card-actions">
              <button type="button" class="btn-launch-project" onclick="openLaunchChoiceModalGlobal('${item.id}')" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.76rem; padding: 4px 10px; border-radius: 4px; cursor: pointer;" title="Launch as Project or Daily Plan Task">🚀 Launch</button>
              <button class="icon-btn edit-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700;" title="Edit Clip">Edit</button>
              <button class="icon-btn copy-btn" title="Copy URL Link">Copy Link</button>
              <button class="icon-btn delete-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700;" title="Delete Clip">Delete</button>
            </div>
          </div>
          ${(item.content && item.content.trim() && item.content.trim() !== item.url) ? `
            <div class="card-body" style="line-height: 1.45; color: var(--text-main); font-size: 0.88rem; margin: 4px 0;">
              ${this.escapeHtml(item.content)}
            </div>
          ` : ''}
          ${displayImageUrl ? `
            <div style="margin-top: 6px; text-align: center;">
              <img src="${displayImageUrl}" onerror="this.parentElement.style.display='none'" style="max-height: 180px; max-width: 100%; border-radius: 6px; border: 1px solid var(--border); object-fit: cover;" alt="Attached Image" />
            </div>
          ` : ''}
          ${item.url ? `
            <a href="${item.url}" target="_blank" rel="noopener" class="web-clip-preview" style="display: flex; align-items: center; gap: 6px; padding: 6px 10px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 6px; margin-top: 6px; color: var(--text-main); text-decoration: underline; font-size: 0.82rem; word-break: break-all;">
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
                    <span style="font-size: 0.72rem; color: var(--text-muted);" title="Edit Note Line">Edit</span>
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
      }

      const catQuickSelect = card.querySelector('.card-category-quick-select');
      if (catQuickSelect) {
        catQuickSelect.addEventListener('change', (e) => {
          e.stopPropagation();
          let val = e.target.value;
          if (val === '__NEW__') {
            const custom = prompt('Enter new category name:');
            if (custom && custom.trim()) {
              val = custom.trim();
              if (!this.state.customWebCategories) this.state.customWebCategories = [];
              if (!this.state.customWebCategories.includes(val)) {
                this.state.customWebCategories.push(val);
              }
            } else {
              e.target.value = item.category || 'General';
              return;
            }
          }
          item.category = val;
          item.webCategory = val;
          this.saveState();
          this.render();
          this.showToast(`Moved "${item.title}" to category "${val}"!`);
        });
      }

      card.querySelectorAll('.btn-launch-project').forEach(launchBtn => {
        const triggerLaunch = (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          this.openLaunchChoiceModal(item);
        };
        launchBtn.onclick = triggerLaunch;
        launchBtn.ontouchend = triggerLaunch;
      });

      const editBtn = card.querySelector('.edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          this.openEditModal(item.id);
        });
      }

      const copyBtn = card.querySelector('.copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          this.copyToClipboard(item.url || item.content, 'Web link');
        });
      }

      const deleteBtn = card.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          this.deleteItem(item.id);
        });
      }

      const addNoteBtn = card.querySelector('.add-note-line-btn');
      if (addNoteBtn) {
        addNoteBtn.addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          this.openNoteModal(item.id, -1);
        });
      }

      card.querySelectorAll('.note-line-row').forEach(row => {
        row.addEventListener('click', (e) => {
          if (e) { e.stopPropagation(); e.preventDefault(); }
          const noteIdx = parseInt(row.dataset.noteIdx, 10);
          this.openNoteModal(item.id, noteIdx);
        });
      });

      this.ideasGrid.appendChild(card);
    });
  }

  openLaunchChoiceModalById(id) {
    const item = (this.state.items || []).find(i => i.id === id);
    if (item) {
      this.openLaunchChoiceModal(item);
    }
  }

  openLaunchChoiceModal(item) {
    if (!item) return;
    const overlay = document.getElementById('launchChoiceModalOverlay');
    const titleEl = document.getElementById('launchChoiceItemTitle');
    const btnProject = document.getElementById('btnLaunchAsProject');
    const btnExistingProject = document.getElementById('btnLaunchAsExistingProject');
    const btnPlanTask = document.getElementById('btnLaunchAsPlanTask');
    const btnCancel = document.getElementById('btnCancelLaunchModal');

    if (titleEl) {
      titleEl.textContent = `Launch "${item.title}" into:`;
    }

    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
      overlay.style.visibility = 'visible';
      overlay.style.zIndex = '999999';
      overlay.classList.add('active');
    }

    const close = () => {
      if (overlay) {
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        overlay.style.visibility = 'hidden';
        overlay.classList.remove('active');
      }
    };

    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
    }

    if (btnCancel) btnCancel.onclick = close;

    if (btnProject) {
      btnProject.onclick = () => {
        close();
        item.project = item.title;
        item.type = 'idea';
        item.stage = 'focus';
        if (!this.state.customProjects) this.state.customProjects = [];
        if (!this.state.customProjects.includes(item.title)) {
          this.state.customProjects.push(item.title);
        }
        this.saveState();
        this.currentStageFilter = 'all';
        this.switchTab('project-path', item.title);
        this.showToast(`🚀 Launched Project Board "${item.title}"!`);
      };
    }

    if (btnExistingProject) {
      btnExistingProject.onclick = () => {
        close();
        const projects = this.getWorkspaceProjects();
        if (projects.length === 0) {
          alert('No existing projects found. Create a new project first!');
          return;
        }
        const chosen = prompt(`Select Existing Project for "${item.title}":\n\nAvailable Projects:\n- ${projects.join('\n- ')}`, projects[0]);
        if (chosen && chosen.trim()) {
          const targetProj = chosen.trim();
          item.project = targetProj;
          item.type = 'idea';
          item.stage = 'focus';
          if (!this.state.customProjects) this.state.customProjects = [];
          if (!this.state.customProjects.includes(targetProj)) {
            this.state.customProjects.push(targetProj);
          }
          this.saveState();
          this.switchTab('project-path', targetProj);
          this.showToast(`🚀 Assigned "${item.title}" to Project Board "${targetProj}"!`);
        }
      };
    }

    if (btnPlanTask) {
      btnPlanTask.onclick = () => {
        close();
        const prioInput = prompt(`Enter Priority for Daily Planner Task (e.g. A1, A2, B1, B2, C1):`, 'A1');
        if (prioInput !== null) {
          const prio = prioInput.trim().toUpperCase() || 'A1';
          const newTask = {
            id: 'task-' + Date.now(),
            prio: prio,
            text: item.title,
            completed: false,
            date: new Date().toISOString().split('T')[0]
          };
          if (!this.state.franklinTasks) this.state.franklinTasks = [];
          this.state.franklinTasks.unshift(newTask);
          this.saveState();
          this.openFranklinModal();
          this.showToast(`📋 Launched "${item.title}" as Daily Plan Task (${prio})!`);
        }
      };
    }
  }

  populateProjectDropdowns() {
    this.renderProjectDropdowns();
  }

  renderProjectDropdowns() {
    const projects = this.getWorkspaceProjects();

    const updateSelect = (selectEl, defaultOptionText, hasAllOption = true) => {
      if (!selectEl) return;
      const currentVal = selectEl.value;
      selectEl.innerHTML = '';

      if (hasAllOption) {
        const allOpt = document.createElement('option');
        allOpt.value = 'all';
        allOpt.textContent = defaultOptionText || 'All Projects';
        if (this.selectedProject === 'all') allOpt.selected = true;
        selectEl.appendChild(allOpt);
      }

      projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = `${p}`;
        if (p === this.selectedProject || p === currentVal) opt.selected = true;
        selectEl.appendChild(opt);
      });
    };

    if (this.globalProjectFilter) {
      const cur = this.selectedProject || '';
      let html = '';
      if (projects.length === 0) {
        html = `<option value="" disabled selected>-- No Active Projects or Plans --</option>`;
      } else {
        projects.forEach(p => {
          const kind = (this.state.projectKinds && this.state.projectKinds[p]) || 'project';
          const prefix = kind === 'plan' ? '✈️ ' : '🛠️ ';
          const isSelected = p === cur || (cur === 'all' && p === projects[0]);
          html += `<option value="${this.escapeHtml(p)}" ${isSelected ? 'selected' : ''}>${prefix}${this.escapeHtml(p)}</option>`;
        });
      }
      this.globalProjectFilter.innerHTML = html;
    }

    const homeSelect = document.getElementById('homeProjectFilterSelect');
    if (homeSelect) {
      const cur = this.selectedProject || 'all';
      homeSelect.innerHTML = `
        <option value="all" ${cur === 'all' ? 'selected' : ''} style="background: var(--bg-card); color: var(--text-main);">All Active Projects & Plans</option>
        <option value="projects" ${cur === 'projects' ? 'selected' : ''} style="background: var(--bg-card); color: var(--text-main);">Active Projects</option>
        <option value="plans" ${cur === 'plans' ? 'selected' : ''} style="background: var(--bg-card); color: var(--text-main);">Active Plans</option>
      `;
    }

    updateSelect(this.projectLineageSelect, '📁 All Projects/Plans Overview', true);
    if (this.projectLineageSelect) this.projectLineageSelect.value = this.selectedProject || 'all';
    
    if (this.dispatchProjectSelect) {
      updateSelect(this.dispatchProjectSelect, 'General', false);
      const newOpt = document.createElement('option');
      newOpt.value = '__NEW__';
      newOpt.textContent = '+ Start New Project...';
      this.dispatchProjectSelect.appendChild(newOpt);
    }

    updateSelect(document.getElementById('webClipProjectSelect'), 'General', false);
    updateSelect(document.getElementById('contactFormProjectSelect'), 'General', false);
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
          <span style="color: var(--stage-spark); display: flex; align-items: center; gap: 3px;" title="1. Spark (Overview)"><span style="width: 6px; height: 6px; border-radius: 50%; background: var(--stage-spark); display: inline-block;"></span> ${sparks}</span>
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

    if (this.projectLineageSelect) {
      this.projectLineageSelect.value = this.selectedProject;
    }

    const titleEl = document.getElementById('projectHeaderTitle');
    const descEl = document.getElementById('projectHeaderDesc');

    if (titleEl) {
      titleEl.textContent = this.selectedProject !== 'all' ? `📌 Project / Plan: ${this.selectedProject}` : '📁 All Active Projects & Plans';
    }
    if (descEl) {
      descEl.textContent = this.selectedProject !== 'all' 
        ? `Development pipeline timeline, resources, and tasks for "${this.selectedProject}".`
        : 'Overview of all active plans and projects evolving from Ideas into Completed Projects.';
    }

    this.projectLineageContainer.style.display = 'grid';
    let lineageItems = this.state.items;
    if (this.selectedProject !== 'all') {
      lineageItems = lineageItems.filter(i => (i.project || 'General') === this.selectedProject || i.title === this.selectedProject);
    }

    const stages = [
      { id: 'spark', name: '1. Overview', color: 'var(--stage-spark)' },
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
          const fullCard = this.createCardElement(item);
          stageCol.appendChild(fullCard);
        });
      }

      this.projectLineageContainer.appendChild(stageCol);
    });
  }

  createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('draggable', 'true');

    const stage = item.stage || 'focus';
    const isResourceCard = item.type === 'resource' || item.type === 'web' || item.stage === 'structure';

    const badgeLabel = isResourceCard ? 'RESOURCE / TOOL' : (stage === 'product' ? 'COMPLETED' : 'DEVELOPMENT');
    const badgeColor = isResourceCard ? 'var(--stage-structure)' : (stage === 'product' ? 'var(--text-main)' : 'var(--stage-focus)');

    const tagHtml = (item.tags || [])
      .filter(t => t !== 'Spark' && t !== 'Project Launch' && t !== 'Par Pilot' && t !== item.project)
      .map(t => `<span class="badge badge-idea">${t}</span>`).join(' ');
    const notes = item.notes || [];

    const isParentCard = item.type !== 'issue' && item.type !== 'web' && item.type !== 'resource' && item.type !== 'task';
    const rolePrefix = isParentCard ? 'Lead' : 'Tech';

      // Only display image if item has an authentic image attached
      const displayImageUrl = (item.imageUrl || '').trim();

      card.innerHTML = `
        <div class="card-color-stripe" style="background: ${item.color || (isResourceCard ? 'var(--stage-structure)' : 'var(--stage-spark)')};"></div>
        <div class="card-header">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="stage-path-badge ${stage}" style="display: inline-flex; align-items: center; gap: 5px; font-weight: 800; letter-spacing: 0.5px; color: ${badgeColor};">
              ${badgeLabel}
            </span>
            <h4 class="card-title" style="color: var(--text-main); font-weight: 700;">${this.escapeHtml(item.title)}</h4>
            ${item.assignedTo ? `<span class="badge" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 10px; white-space: nowrap;">👤 ${rolePrefix}: ${this.escapeHtml(item.assignedTo)}</span>` : ''}
          </div>
          <div class="card-actions" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
            ${(!isResourceCard && stage !== 'spark') ? `<button class="icon-btn btn-regress-pipeline" style="background: rgba(255, 255, 255, 0.08); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.72rem; padding: 2px 7px;" title="Step Back item to previous stage">⬅ Back</button>` : ''}
            ${(!isResourceCard && stage !== 'product') ? `<button class="btn-advance-pipeline" style="background: var(--bg-card); color: var(--text-main); font-weight: 800; border: 1px solid var(--border); font-size: 0.72rem; padding: 3px 8px; border-radius: 4px;" title="Advance & Create workable board in next stage">Advance ➔</button>` : ''}
            <button class="icon-btn print-btn" title="Full Reader & Print Mode">View / Print</button>
            <button class="icon-btn edit-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700;" title="Edit Item">Edit</button>
            <button class="icon-btn copy-btn" title="Copy Content">Copy</button>
            <button class="icon-btn delete-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 700;" title="Delete Item">Delete</button>
          </div>
        </div>
        ${(item.content && item.content.trim() && item.content.trim() !== item.url) ? `
          <div class="card-body" style="line-height: 1.5; color: var(--text-main); font-size: 0.9rem;">
            ${this.escapeHtml(item.content)}
          </div>
        ` : ''}
        ${displayImageUrl ? `
          <div style="margin-top: 6px; text-align: center;">
            <img src="${displayImageUrl}" onerror="this.parentElement.style.display='none'" style="max-height: 180px; max-width: 100%; border-radius: 6px; border: 1px solid var(--border); object-fit: cover;" alt="Attached Image" />
          </div>
        ` : ''}
      ${item.url ? `
        <a href="${item.url}" target="_blank" rel="noopener" class="web-clip-preview" style="color: var(--text-main);">
          ${this.escapeHtml(item.url)}
        </a>
      ` : ''}
      
      <!-- Interactive Line-by-Line Notes -->
      <div style="margin-top: 0.75rem; border-top: 1px dashed var(--border); padding-top: 0.6rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-size: 0.88rem; font-weight: 800; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.8px;">
            Appended Notes (${notes.length})
          </span>
          <button class="add-note-line-btn" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.78rem; font-weight: 700; padding: 3px 10px; border-radius: 4px; cursor: pointer;" title="Add new note line">+ Add Note</button>
        </div>
        ${notes.length > 0 ? `
          <div class="appended-notes-scrollable" style="display: flex; flex-direction: column; gap: 6px; max-height: 160px; overflow-y: auto; padding-right: 4px;">
            ${notes.map((n, idx) => `
              <div class="note-line-row" data-note-idx="${idx}" style="display: flex; align-items: flex-start; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); padding: 6px 10px; border-radius: 6px; font-size: 0.85rem; cursor: pointer;" title="Click to Edit Note Line">
                <input type="checkbox" class="note-item-checkbox" data-note-idx="${idx}" ${n.completed ? 'checked' : ''} style="margin-top: 2px; accent-color: var(--stage-structure); cursor: pointer;" title="Mark Note Complete" />
                <span style="font-size: 0.74rem; color: ${n.completed ? 'var(--text-dim)' : 'var(--text-main)'}; font-weight: 700; background: rgba(255,255,255,0.08); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; white-space: nowrap; font-family: monospace;">
                  ${this.escapeHtml(n.date)}
                </span>
                <span style="flex: 1; color: ${n.completed ? 'var(--text-dim)' : 'var(--text-main)'}; font-size: 0.85rem; font-weight: 600; line-height: 1.35; word-break: break-word; text-decoration: ${n.completed ? 'line-through' : 'none'}; opacity: ${n.completed ? '0.7' : '1'};">
                  ${this.escapeHtml(n.text)}
                </span>
                <span style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; white-space: nowrap; margin-top: 1px;" title="Edit Note Line">Edit</span>
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
        if (e.target && e.target.classList.contains('note-item-checkbox')) return;
        e.stopPropagation();
        const noteIdx = parseInt(row.dataset.noteIdx, 10);
        this.openNoteModal(item.id, noteIdx);
      });
    });

    card.querySelectorAll('.note-item-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        e.stopPropagation();
        const idx = parseInt(chk.getAttribute('data-note-idx'), 10);
        if (item.notes && item.notes[idx]) {
          item.notes[idx].completed = chk.checked;
          this.saveState();
          this.render();
        }
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

    const targetName = projectName.trim();

    this.confirmDialog(
      `Are you sure you want to delete project "${targetName}"? This will remove all items belonging to this project.`,
      `Delete Project: ${targetName}`,
      () => {
        const targetLower = targetName.toLowerCase();

        // 1. Remove ONLY items explicitly assigned to this exact project
        if (Array.isArray(this.state.items)) {
          this.state.items = this.state.items.filter(i => {
            if (!i.project) return true; // Keep items without explicit project
            return i.project.trim().toLowerCase() !== targetLower;
          });
        }

        // 2. Remove from customProjects list
        if (Array.isArray(this.state.customProjects)) {
          this.state.customProjects = this.state.customProjects.filter(p => (p || '').trim().toLowerCase() !== targetLower);
        }

        // 3. Remove from contact assignments
        if (Array.isArray(this.state.contacts)) {
          this.state.contacts.forEach(c => {
            if (Array.isArray(c.projects)) {
              c.projects = c.projects.filter(p => (p || '').trim().toLowerCase() !== targetLower);
            }
          });
        }

        // 4. Blacklist in deletedProjects
        if (!this.state.deletedProjects || !Array.isArray(this.state.deletedProjects)) {
          this.state.deletedProjects = [];
        }
        if (!this.state.deletedProjects.map(p => p.toLowerCase().trim()).includes(targetLower)) {
          this.state.deletedProjects.push(targetName);
        }

        this.selectedProject = 'all';
        if (this.globalProjectFilter) this.globalProjectFilter.value = 'all';
        if (this.projectLineageSelect) this.projectLineageSelect.value = 'all';

        this.saveState();
        this.populateProjectDropdowns();
        this.render();
        this.showToast(`Deleted project "${targetName}" & its boards.`);
      }
    );
  }

  createProjectBoardCard(projectName) {
    const card = document.createElement('div');
    card.className = 'card compact-project-board-card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'space-between';
    card.style.padding = '0.75rem 0.95rem';
    card.style.background = 'var(--bg-card)';
    card.style.border = `1px solid var(--border)`;
    card.style.borderRadius = 'var(--radius-md)';
    card.style.boxShadow = 'var(--shadow-sm)';
    card.style.minHeight = 'auto';
    card.style.height = 'auto';

    // Calculate current progress stage for this project
    const allProjItems = (this.state.items || []).filter(i => (i.project || 'General') === projectName);
    
    // Determine overall project progress (highest stage reached or spark default)
    let currentStage = 'spark';
    const stageOrder = { spark: 1, structure: 2, focus: 3, product: 4 };
    let maxRank = 0;
    allProjItems.forEach(item => {
      const rank = stageOrder[item.stage] || 1;
      if (rank > maxRank) {
        maxRank = rank;
        currentStage = item.stage || 'spark';
      }
    });

    const stageNames = { spark: 'Development', structure: 'Development', focus: 'Development', product: 'Completed' };
    const stageColors = { spark: 'var(--stage-focus)', structure: 'var(--stage-focus)', focus: 'var(--stage-focus)', product: '#ffffff' };
    const stageName = stageNames[currentStage] || 'Development';
    const stageColor = stageColors[currentStage] || 'var(--stage-focus)';

    // Find primary project item (parent card)
    let primaryItem = allProjItems.find(i => i.type !== 'issue' && i.type !== 'web' && i.type !== 'resource' && i.type !== 'task' && i.content && i.content.trim() && !i.content.includes('Password entry'));
    if (!primaryItem) {
      primaryItem = allProjItems.find(i => i.content && i.content.trim() && !i.content.includes('Password entry') && !i.content.toLowerCase().includes('web reference clip'));
    }

    let briefDesc = primaryItem && primaryItem.content ? primaryItem.content.trim() : '';

    if (!briefDesc || briefDesc === 'Password entry' || briefDesc.toLowerCase().includes('project workspace for')) {
      if (projectName.toLowerCase() === 'michi') {
        briefDesc = 'MICHI Vision and Direction — Organize Life and Work';
      } else {
        const itemCount = allProjItems.length;
        briefDesc = itemCount > 0 
          ? `Active workspace with ${itemCount} project ${itemCount === 1 ? 'record' : 'records'}.`
          : 'Project workspace and assets.';
      }
    }

    const leadContact = (primaryItem && primaryItem.assignedTo) || (allProjItems.find(i => i.assignedTo) ? allProjItems.find(i => i.assignedTo).assignedTo : '');
    const kind = (this.state.projectKinds && this.state.projectKinds[projectName]) || 'project';
    const isPlan = kind === 'plan';
    const kindBadge = isPlan ? '✈️ PLAN' : '🛠️ PROJECT';

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; flex: 1; min-width: 0;">
          <span style="background: ${isPlan ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 146, 60, 0.15)'}; color: ${isPlan ? 'var(--stage-focus)' : 'var(--stage-spark)'}; border: 1px solid ${isPlan ? 'rgba(56, 189, 248, 0.35)' : 'rgba(251, 146, 60, 0.35)'}; font-size: 0.68rem; font-weight: 800; padding: 1px 6px; border-radius: 8px; white-space: nowrap;">
            ${kindBadge}
          </span>
          <h4 style="font-size: 0.98rem; font-weight: 800; color: var(--text-main); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;">
            ${this.escapeHtml(projectName)}
          </h4>
        </div>
        <span style="background: var(--bg-main); color: var(--text-main); font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; white-space: nowrap; border: 1px solid var(--border);">
          ${stageName}
        </span>
      </div>

      ${leadContact ? `<div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">👤 Lead: <span style="color: var(--text-main); font-weight: 700;">${this.escapeHtml(leadContact)}</span></div>` : ''}

      <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 6px 0; word-break: break-word;">
        ${this.escapeHtml(briefDesc)}
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px; padding-top: 6px; border-top: 1px solid var(--border); font-size: 0.74rem; color: var(--text-dim);">
        <span>${allProjItems.length} records</span>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="btn-delete-project-action" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.76rem; font-weight: 700; padding: 4px 10px; border-radius: 4px; cursor: pointer;" title="Delete ${isPlan ? 'Plan' : 'Project'}">
            Delete
          </button>
          <button type="button" class="btn-view-project-action" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-size: 0.76rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; cursor: pointer;" title="View Board">
            View Board ➔
          </button>
        </div>
      </div>
    `;

    const openProj = (e) => {
      if (e) e.stopPropagation();
      this.selectedProject = projectName;
      if (this.globalProjectFilter) this.globalProjectFilter.value = projectName;
      this.render();
      this.showToast(`Opened ${projectName} ${isPlan ? 'Plan' : 'Project'}`);
    };

    const btnViewProj = card.querySelector('.btn-view-project-action');
    if (btnViewProj) {
      btnViewProj.addEventListener('click', openProj);
    }

    const btnDeleteProj = card.querySelector('.btn-delete-project-action');
    if (btnDeleteProj) {
      btnDeleteProj.addEventListener('click', (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        this.deleteProject(projectName);
      });
    }

    return card;
  }

  renderSpecificProjectView(projectName, gridItems) {
    const seenIds = new Set();
    const projItems = gridItems.filter(i => {
      const itemProj = (i.project || i.title || 'Personal').trim().toLowerCase();
      const targetProj = (projectName || '').trim().toLowerCase();
      if (itemProj !== targetProj && (i.title || '').trim().toLowerCase() !== targetProj) return false;
      const key = i.id || (i.title + '-' + i.type);
      if (seenIds.has(key)) return false;
      seenIds.add(key);
      return true;
    });

    const kind = (this.state.projectKinds && this.state.projectKinds[projectName]) || 'project';
    const isPlan = kind === 'plan';
    const kindLabel = isPlan ? 'Plan' : 'Project';
    const kindEmoji = isPlan ? '✈️' : '🛠️';
    const kindBadge = isPlan ? 'LIFE PLAN' : 'WORK PROJECT';
    const kindBadgeBg = isPlan ? 'rgba(56, 189, 248, 0.15)' : 'rgba(251, 146, 60, 0.15)';
    const kindBadgeColor = isPlan ? 'var(--stage-focus)' : 'var(--stage-spark)';
    const kindBadgeBorder = isPlan ? 'rgba(56, 189, 248, 0.35)' : 'rgba(251, 146, 60, 0.35)';

    // 1. Plan / Project Title Header Banner
    const banner = document.createElement('div');
    banner.style.background = 'var(--bg-card)';
    banner.style.border = '1px solid var(--border)';
    banner.style.borderRadius = 'var(--radius-md)';
    banner.style.padding = '1rem 1.4rem';
    banner.style.marginBottom = '1.4rem';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'space-between';
    banner.style.gap = '1rem';
    banner.style.flexWrap = 'wrap';

    banner.innerHTML = `
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="background: ${kindBadgeBg}; color: ${kindBadgeColor}; border: 1px solid ${kindBadgeBorder}; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 10px;">
            ${kindEmoji} ${kindBadge}
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Workspace Pipeline — ${projItems.length} Total ${projItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">
          ${kindLabel}: ${this.escapeHtml(projectName)}
        </h2>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <button type="button" class="btn-delete-current-proj" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
          Delete ${kindLabel}
        </button>
        <button type="button" class="btn-clear-proj-filter" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); padding: 6px 14px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; cursor: pointer;">
          Back to All Projects & Plans
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

    // 2. Main Workspace 2-Column Grid Layout
    const workspaceGrid = document.createElement('div');
    workspaceGrid.style.display = 'grid';
    workspaceGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(340px, 1fr))';
    workspaceGrid.style.gap = '1.4rem';
    workspaceGrid.style.width = '100%';
    workspaceGrid.style.alignItems = 'start';

    // LEFT COLUMN: Development (top) + Resources/Tools (below)
    const leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.gap = '1.4rem';
    leftColumn.style.width = '100%';

    // Development Section
    const devSection = document.createElement('div');
    devSection.style.background = 'var(--bg-card)';
    devSection.style.border = '1px solid var(--border)';
    devSection.style.borderRadius = 'var(--radius-md)';
    devSection.style.padding = '1.2rem';
    devSection.style.display = 'flex';
    devSection.style.flexDirection = 'column';
    devSection.style.gap = '1rem';

    const devItems = projItems.filter(i => i.stage !== 'product' && i.stage !== 'structure' && i.type !== 'web' && i.type !== 'resource' && i.type !== 'note');
    this.renderDevelopmentBoardSection(devSection, devItems, projectName);
    leftColumn.appendChild(devSection);

    // Resources/Tools Section (Stacked BELOW Development in Left Column)
    const resourceItems = projItems.filter(i => i.stage !== 'product' && (i.type === 'resource' || i.type === 'web' || i.stage === 'structure'));
    const resourcesSection = document.createElement('div');
    resourcesSection.style.background = 'var(--bg-card)';
    resourcesSection.style.border = '1px solid var(--border)';
    resourcesSection.style.borderRadius = 'var(--radius-md)';
    resourcesSection.style.padding = '1.2rem';
    resourcesSection.style.display = 'flex';
    resourcesSection.style.flexDirection = 'column';
    resourcesSection.style.gap = '1rem';

    const resHeader = document.createElement('div');
    resHeader.style.display = 'flex';
    resHeader.style.alignItems = 'center';
    resHeader.style.justifyContent = 'space-between';
    resHeader.style.borderBottom = '2px solid var(--border)';
    resHeader.style.paddingBottom = '0.6rem';
    resHeader.style.flexWrap = 'wrap';
    resHeader.style.gap = '8px';

    resHeader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">Resources/Tools</span>
        <span style="background: var(--bg-main); color: var(--text-main); font-size: 0.78rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--border);">${resourceItems.length}</span>
      </div>
      <button class="btn-add-res-item" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; cursor: pointer;">
        + Add Resource/Tool
      </button>
    `;

    resHeader.querySelector('.btn-add-res-item').addEventListener('click', () => {
      this.openWebClipModal(projectName);
    });

    resourcesSection.appendChild(resHeader);

    const resList = document.createElement('div');
    resList.style.display = 'flex';
    resList.style.flexDirection = 'column';
    resList.style.gap = '1rem';
    resList.style.width = '100%';

    if (resourceItems.length === 0) {
      resList.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 2rem 0; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); border-radius: var(--radius-sm);">
          No resources or tools added yet. Click "+ Add Resource/Tool" to attach web clips or documentation.
        </div>
      `;
    } else {
      resourceItems.forEach(item => {
        resList.appendChild(this.createCardElement(item));
      });
    }

    resourcesSection.appendChild(resList);
    leftColumn.appendChild(resourcesSection);
    workspaceGrid.appendChild(leftColumn);

    // RIGHT COLUMN: Completed (top) + Notes (below!)
    const rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.gap = '1.4rem';
    rightColumn.style.width = '100%';

    // Completed Section
    const completedItems = projItems.filter(i => i.stage === 'product');
    const completedSection = document.createElement('div');
    completedSection.style.background = 'var(--bg-card)';
    completedSection.style.border = '1px solid var(--border)';
    completedSection.style.borderRadius = 'var(--radius-md)';
    completedSection.style.padding = '1.2rem';
    completedSection.style.display = 'flex';
    completedSection.style.flexDirection = 'column';
    completedSection.style.gap = '1rem';

    const compHeader = document.createElement('div');
    compHeader.style.display = 'flex';
    compHeader.style.alignItems = 'center';
    compHeader.style.justifyContent = 'space-between';
    compHeader.style.borderBottom = '2px solid var(--border)';
    compHeader.style.paddingBottom = '0.6rem';
    compHeader.style.flexWrap = 'wrap';
    compHeader.style.gap = '8px';

    compHeader.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">Completed</span>
        <span style="background: var(--bg-main); color: var(--text-main); font-size: 0.78rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--border);">${completedItems.length}</span>
      </div>
      <button class="btn-add-comp-item" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; cursor: pointer;">
        + Add Completed Item
      </button>
    `;

    compHeader.querySelector('.btn-add-comp-item').addEventListener('click', () => {
      this.openWebClipModal(projectName);
    });

    completedSection.appendChild(compHeader);

    const compList = document.createElement('div');
    compList.style.display = 'flex';
    compList.style.flexDirection = 'column';
    compList.style.gap = '1rem';
    compList.style.width = '100%';

    if (completedItems.length === 0) {
      compList.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 2rem 0; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); border-radius: var(--radius-sm);">
          No items currently in Completed.
        </div>
      `;
    } else {
      completedItems.forEach(item => {
        compList.appendChild(this.createCardElement(item));
      });
    }

    completedSection.appendChild(compList);
    rightColumn.appendChild(completedSection);
    workspaceGrid.appendChild(rightColumn);

    this.cardsGrid.appendChild(workspaceGrid);
  }

  openAddTaskModal(targetProjectName) {
    if (this.taskTitle) this.taskTitle.value = '';
    if (this.taskContent) this.taskContent.value = '';
    if (this.customTaskContactName) this.customTaskContactName.value = '';
    if (this.customTaskContactWrapper) this.customTaskContactWrapper.style.display = 'none';

    const proj = (targetProjectName && targetProjectName !== 'all') ? targetProjectName : (this.selectedProject !== 'all' ? this.selectedProject : 'General');
    if (this.taskProjectName) this.taskProjectName.value = proj;

    if (this.taskContactSelect) {
      this.taskContactSelect.innerHTML = '';
      const optUnassigned = document.createElement('option');
      optUnassigned.value = '';
      optUnassigned.textContent = 'Unassigned (No contact)';
      this.taskContactSelect.appendChild(optUnassigned);

      const contacts = this.state.contacts || [];
      contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `👤 ${c.name} (${c.role || 'Contact'})`;
        this.taskContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Create New Contact / Technician...';
      this.taskContactSelect.appendChild(optNew);
      this.taskContactSelect.value = '';
    }

    if (this.taskModalOverlay) {
      this.taskModalOverlay.style.display = 'flex';
      this.taskModalOverlay.style.zIndex = '99999';
      this.taskModalOverlay.classList.add('active');
      if (this.taskTitle) this.taskTitle.focus();
    }
  }

  closeTaskModal() {
    if (this.taskModalOverlay) {
      this.taskModalOverlay.style.display = 'none';
      this.taskModalOverlay.classList.remove('active');
    }
  }

  saveTaskModal() {
    const projectName = (this.taskProjectName && this.taskProjectName.value) || this.selectedProject || 'General';
    const title = this.taskTitle ? this.taskTitle.value.trim() : '';
    if (!title) return;

    const content = this.taskContent ? this.taskContent.value.trim() : '';

    let assignedName = this.taskContactSelect ? this.taskContactSelect.value : '';
    if (assignedName === '__NEW__') {
      const customName = this.customTaskContactName ? this.customTaskContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Technician / Contact',
            company: projectName || 'General',
            email: '',
            phone: '',
            projects: [projectName || 'General'],
            notes: `Auto-created contact during Task creation.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
        }
      }
    }

    const newTask = {
      id: 'item-task-' + Date.now(),
      type: 'task',
      stage: 'focus',
      project: projectName,
      title: title,
      content: content,
      assignedTo: assignedName || '',
      notes: [],
      status: 'in-progress',
      tags: ['Task'],
      color: '#7CFEFE',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    if (!this.state.items) this.state.items = [];
    this.state.items.unshift(newTask);
    this.saveState();
    this.closeTaskModal();
    this.render();
    this.showToast(`📌 Added Task: "${title}"`);
  }

  openLogIssueModal(targetProjectName) {
    if (this.issueTitle) this.issueTitle.value = '';
    if (this.issueContent) this.issueContent.value = '';
    if (this.customIssueContactName) this.customIssueContactName.value = '';
    if (this.customIssueContactWrapper) this.customIssueContactWrapper.style.display = 'none';
    const proj = (targetProjectName && targetProjectName !== 'all') ? targetProjectName : (this.selectedProject !== 'all' ? this.selectedProject : 'General');
    if (this.issueProjectName) this.issueProjectName.value = proj;

    if (this.issueContactSelect) {
      this.issueContactSelect.innerHTML = '';
      const optUnassigned = document.createElement('option');
      optUnassigned.value = '';
      optUnassigned.textContent = 'Unassigned (No contact)';
      this.issueContactSelect.appendChild(optUnassigned);

      const contacts = this.state.contacts || [];
      contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `👤 ${c.name} (${c.role || 'Contact'})`;
        this.issueContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Create New Contact / Technician...';
      this.issueContactSelect.appendChild(optNew);
      this.issueContactSelect.value = '';
    }

    if (this.issueModalOverlay) {
      this.issueModalOverlay.style.display = 'flex';
      this.issueModalOverlay.style.zIndex = '99999';
      this.issueModalOverlay.classList.add('active');
      if (this.issueTitle) this.issueTitle.focus();
    }
  }

  closeIssueModal() {
    if (this.issueModalOverlay) {
      this.issueModalOverlay.style.display = 'none';
      this.issueModalOverlay.classList.remove('active');
    }
  }

  saveIssueModal() {
    const projectName = (this.issueProjectName && this.issueProjectName.value) || this.selectedProject || 'General';
    const title = this.issueTitle ? this.issueTitle.value.trim() : '';
    if (!title) return;

    const content = this.issueContent ? this.issueContent.value.trim() : '';
    let assignedName = this.issueContactSelect ? this.issueContactSelect.value : '';

    if (assignedName === '__NEW__') {
      const customName = this.customIssueContactName ? this.customIssueContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Assigned Technician / Lead',
            company: projectName,
            email: '',
            phone: '',
            projects: [projectName],
            notes: `Auto-created contact during issue log for ${projectName}.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
          this.showToast(`👤 Created new contact: "${assignedName}"!`);
        }
      } else {
        assignedName = '';
      }
    }

    const newIssue = {
      id: 'item-issue-' + Date.now(),
      type: 'issue',
      stage: 'focus',
      project: projectName,
      title: title,
      content: content,
      assignedTo: assignedName || '',
      resolved: false,
      tags: ['Issue'],
      color: '#f43f5e',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    if (!this.state.items) this.state.items = [];
    this.state.items.unshift(newIssue);
    this.saveState();
    this.closeIssueModal();
    this.render();
    this.showToast(`⚠️ Logged issue: "${title}"`);
  }

  openAddIssueStepModal(iss) {
    if (!iss) return;
    if (this.issueStepIssueId) this.issueStepIssueId.value = iss.id;
    if (this.issueStepText) this.issueStepText.value = '';
    if (this.customIssueStepContactName) this.customIssueStepContactName.value = '';
    if (this.customIssueStepContactWrapper) this.customIssueStepContactWrapper.style.display = 'none';

    if (this.issueStepModalHeaderTitle) {
      this.issueStepModalHeaderTitle.textContent = `💬 Add Step: "${iss.title}"`;
    }

    if (this.issueStepContactSelect) {
      this.issueStepContactSelect.innerHTML = '';
      const currentAssigned = iss.assignedTo ? `Current (${iss.assignedTo})` : 'Unassigned';
      const optKeep = document.createElement('option');
      optKeep.value = '__KEEP__';
      optKeep.textContent = `Keep ${currentAssigned}`;
      this.issueStepContactSelect.appendChild(optKeep);

      const contacts = this.state.contacts || [];
      contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = `${c.name} (${c.role || 'Technician'})`;
        if (c.name === iss.assignedTo) opt.selected = true;
        this.issueStepContactSelect.appendChild(opt);
      });

      const optNew = document.createElement('option');
      optNew.value = '__NEW__';
      optNew.textContent = '+ Assign New Contact / Technician...';
      this.issueStepContactSelect.appendChild(optNew);
      if (!iss.assignedTo) this.issueStepContactSelect.value = '__KEEP__';
    }

    if (this.issueStepModalOverlay) {
      this.issueStepModalOverlay.style.display = 'flex';
      this.issueStepModalOverlay.classList.add('active');
      if (this.issueStepText) this.issueStepText.focus();
    }
  }

  closeAddIssueStepModal() {
    if (this.issueStepModalOverlay) {
      this.issueStepModalOverlay.style.display = 'none';
      this.issueStepModalOverlay.classList.remove('active');
    }
  }

  saveIssueStepModal() {
    const issueId = this.issueStepIssueId ? this.issueStepIssueId.value : '';
    if (!issueId) return;

    const iss = (this.state.items || []).find(i => i.id === issueId);
    if (!iss) return;

    const stepText = this.issueStepText ? this.issueStepText.value.trim() : '';
    if (!stepText) return;

    let assignedName = this.issueStepContactSelect ? this.issueStepContactSelect.value : '__KEEP__';
    if (assignedName === '__NEW__') {
      const customName = this.customIssueStepContactName ? this.customIssueStepContactName.value.trim() : '';
      if (customName) {
        assignedName = customName;
        const existing = (this.state.contacts || []).find(c => c.name.toLowerCase() === assignedName.toLowerCase());
        if (!existing) {
          const newContact = {
            id: 'contact-' + Date.now(),
            name: assignedName,
            role: 'Assigned Technician / Lead',
            company: iss.project || 'General',
            email: '',
            phone: '',
            projects: [iss.project || 'General'],
            notes: `Auto-created contact during issue step log.`,
            color: '#7CFEFE'
          };
          if (!this.state.contacts) this.state.contacts = [];
          this.state.contacts.push(newContact);
          this.showToast(`👤 Created new contact: "${assignedName}"!`);
        }
        iss.assignedTo = assignedName;
      }
    } else if (assignedName !== '__KEEP__' && assignedName) {
      iss.assignedTo = assignedName;
    }

    if (!iss.notes) iss.notes = [];
    const stepNum = iss.notes.length + 1;
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    iss.notes.push({
      text: `Step ${stepNum}: ${stepText}`,
      date: timestamp
    });

    this.saveState();
    this.closeAddIssueStepModal();
    this.render();
    this.showToast(`💬 Added Step ${stepNum} to issue "${iss.title}"!`);
  }

  openEditIssueModal(iss) {
    if (!iss) return;
    this.activeEditIssue = iss;

    if (this.editIssueModalIssueId) this.editIssueModalIssueId.value = iss.id;
    if (this.editIssueModalTitle) this.editIssueModalTitle.textContent = `⚙️ Manage Issue: "${iss.title}"`;
    if (this.editIssueModalCurrentTech) {
      this.editIssueModalCurrentTech.textContent = iss.assignedTo ? `Current Tech: ${iss.assignedTo}` : 'Reassign to team lead or technician';
    }

    if (this.wrapperEditIssueFields) this.wrapperEditIssueFields.style.display = 'none';
    if (this.inputEditIssueTitle) this.inputEditIssueTitle.value = iss.title || '';
    if (this.inputEditIssueContent) this.inputEditIssueContent.value = iss.content || '';

    if (this.editIssueModalOverlay) {
      this.editIssueModalOverlay.style.display = 'flex';
      this.editIssueModalOverlay.classList.add('active');
    }
  }

  closeEditIssueModal() {
    if (this.editIssueModalOverlay) {
      this.editIssueModalOverlay.style.display = 'none';
      this.editIssueModalOverlay.classList.remove('active');
    }
  }

  renderDevelopmentBoardSection(section, colItems, projectName) {
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.borderBottom = '2px solid var(--border)';
    header.style.paddingBottom = '0.6rem';
    header.style.flexWrap = 'wrap';
    header.style.gap = '8px';

    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">Development</span>
        <span style="background: var(--bg-main); color: var(--text-main); font-size: 0.78rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; border: 1px solid var(--border);">${colItems.length}</span>
      </div>
    `;

    section.appendChild(header);

    const itemsList = document.createElement('div');
    itemsList.style.display = 'flex';
    itemsList.style.flexDirection = 'column';
    itemsList.style.gap = '1rem';
    itemsList.style.width = '100%';

    if (colItems.length === 0) {
      itemsList.innerHTML = `
        <div style="font-size: 0.82rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 2rem 0; background: rgba(255,255,255,0.01); border: 1px dashed var(--border); border-radius: var(--radius-sm);">
          No items currently in Development. Click "+ Add Item" to create a new board card.
        </div>
      `;
    } else {
      colItems.forEach(item => {
        const card = this.createCardElement(item);
        itemsList.appendChild(card);
      });
    }

    section.appendChild(itemsList);
  }

  renderCardsGrid(items) {
    if (!this.cardsGrid) return;
    this.cardsGrid.innerHTML = '';

    const gridItems = (items || []).filter(i => i.type !== 'vault');

    // IF SPECIFIC NAMED PROJECT IS OPENED: Render the Workspace Board View!
    if (this.selectedProject !== 'all' && this.selectedProject !== 'projects' && this.selectedProject !== 'plans') {
      this.renderSpecificProjectView(this.selectedProject, gridItems);
      return;
    }

    if (gridItems.length === 0 && (!this.state.customProjects || this.state.customProjects.length === 0)) {
      this.cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;">No items found in this workspace view on the MICHI Path.</p>
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

    // IF ALL PROJECTS/PLANS OVERVIEW IS ACTIVE: Gather all unique projects/plans created in workspace
    let projectList = this.getWorkspaceProjects();

    if (this.selectedProject === 'projects') {
      projectList = projectList.filter(p => {
        const kind = (this.state.projectKinds && this.state.projectKinds[p]) || 'project';
        return kind !== 'plan';
      });
    } else if (this.selectedProject === 'plans') {
      projectList = projectList.filter(p => {
        const kind = (this.state.projectKinds && this.state.projectKinds[p]) || 'project';
        return kind === 'plan';
      });
    }

    const section = document.createElement('div');
    section.style.width = '100%';

    const titleText = this.selectedProject === 'projects' 
      ? `Work Projects (${projectList.length})` 
      : (this.selectedProject === 'plans' ? `Life Plans (${projectList.length})` : `Plans & Projects (${projectList.length})`);

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '1rem';
    header.style.paddingBottom = '0.4rem';
    header.style.borderBottom = `1px solid var(--border)`;

    header.innerHTML = `
      <span style="font-weight: 800; font-size: 1.05rem; color: var(--text-main);">${titleText}</span>
      <button type="button" onclick="if(window.app && window.app.openNewProjectModal) window.app.openNewProjectModal()" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-weight: 800; padding: 5px 14px; border-radius: 4px; font-size: 0.78rem; cursor: pointer;">+ Plan / Project</button>
    `;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    grid.style.gap = '1rem';
    grid.style.width = '100%';

    projectList.forEach(projectName => {
      const boardCard = this.createProjectBoardCard(projectName);
      grid.appendChild(boardCard);
    });

    section.appendChild(grid);
    this.cardsGrid.appendChild(section);
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

  setApptFormTime(timeStr) {
    const hourEl = document.getElementById('apptFormHour');
    const minEl = document.getElementById('apptFormMin');
    const ampmEl = document.getElementById('apptFormAmPm');
    if (!hourEl || !minEl || !ampmEl) return;

    const parts = (timeStr || '09:00 AM').split(' ');
    const timeDigits = (parts[0] || '09:00').split(':');
    const ampm = parts[1] || 'AM';

    const hr = (timeDigits[0] || '09').padStart(2, '0');
    const min = ':' + (timeDigits[1] || '00').padStart(2, '0');

    if (hourEl) hourEl.value = hr;
    if (minEl) minEl.value = min;
    if (ampmEl) ampmEl.value = ampm;
  }

  openApptModal(dateStr, apptIdToEdit = null) {
    this.closeTutorialModal();
    this.closeFranklinModal();
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
          this.setApptFormTime(appt.time || '09:00 AM');
          if (this.apptFormTitle) this.apptFormTitle.value = appt.text || '';
          if (this.apptFormNotes) this.apptFormNotes.value = appt.note || '';
        }
      }
    } else {
      if (this.apptFormTitle) this.apptFormTitle.value = '';
      if (this.apptFormNotes) this.apptFormNotes.value = '';
      this.setApptFormTime('09:00 AM');
    }

    this.renderApptModalExistingList();
    if (this.apptModalOverlay) {
      this.apptModalOverlay.style.display = 'flex';
      this.apptModalOverlay.classList.add('active');
    }
  }

  closeApptModal() {
    if (this.apptModalOverlay) {
      this.apptModalOverlay.classList.remove('active');
      this.apptModalOverlay.style.display = 'none';
    }
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
      item.style.background = 'var(--bg-main)';
      item.style.border = '1px solid var(--border)';
      item.style.padding = '6px 10px';
      item.style.borderRadius = '6px';
      item.style.marginBottom = '6px';

      item.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.76rem; font-weight: 800; color: var(--text-main); background: var(--bg-card); padding: 2px 6px; border-radius: 4px;">${this.escapeHtml(a.time)}</span>
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-main);">${this.escapeHtml(a.text)}</span>
          ${a.note ? `<span style="font-size: 0.76rem; color: var(--text-muted);">(${this.escapeHtml(a.note)})</span>` : ''}
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" class="btn-edit-modal-appt" style="background: var(--bg-card); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer;">Edit</button>
          <button type="button" class="btn-del-modal-appt" style="background: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.4); font-size: 0.72rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer;">✕</button>
        </div>
      `;

      item.querySelector('.btn-edit-modal-appt').addEventListener('click', () => {
        this.openApptModal(this.selectedApptDate, a.id);
      });

      item.querySelector('.btn-del-modal-appt').addEventListener('click', () => {
        this.deleteFranklinAppt(a.id, normKey);
        this.renderApptModalExistingList();
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
      emptyCell.style.opacity = '0.35';
      emptyCell.style.background = 'var(--bg-main)';
      emptyCell.style.border = '1px dashed var(--border)';
      emptyCell.style.pointerEvents = 'none';
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
          <span class="day-number" style="font-weight: 800; font-size: 0.9rem; color: var(--text-main);">${day}</span>
          <span style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700;">+ Appt</span>
        </div>
      `;

      // Render scheduled appointments for this date
      const franklinDay = this.state.franklinData[fullDateStr];
      if (franklinDay && franklinDay.appts && franklinDay.appts.length > 0) {
        franklinDay.appts.forEach(ap => {
          const schedPill = document.createElement('div');
          schedPill.className = 'event-dot';
          schedPill.style.background = 'var(--bg-main)';
          schedPill.style.color = 'var(--text-main)';
          schedPill.style.border = '1px solid var(--border)';
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
        (c.company && c.company.toLowerCase().includes(query)) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.phone && c.phone.toLowerCase().includes(query)) ||
        (c.projects && c.projects.some(p => p.toLowerCase().includes(query)))
      );
    });
    filtered.sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }));

    if (filtered.length === 0) {
      this.contactsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted); background: var(--bg-card); border: 1px dashed var(--border); border-radius: var(--radius-md);">
          <p style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">No contacts found</p>
          <p style="font-size: 0.8rem; margin-top: 4px;">Click "+ Add Contact" above to add team members or collaborators.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(contact => {
      const initials = (contact.name || 'C').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.background = 'var(--bg-card)';
      card.style.color = 'var(--text-main)';
      card.style.border = '1px solid var(--border)';

      const isPersonal = contact.isPersonal || (contact.projects && contact.projects.includes('Personal'));
      
      const projectPills = isPersonal ?
        `<span class="badge" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 800; display: inline-block;">Personal</span>` :
        (contact.projects || []).map(p => 
          `<span class="badge" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-size: 0.72rem; font-weight: 800; display: inline-block;">${this.escapeHtml(p)}</span>`
        ).join('');

      card.innerHTML = `
        <div class="card-header" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 4px;">
          <div style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.88rem; flex-shrink: 0;">
              ${initials}
            </div>
            <div style="overflow: hidden;">
              <h4 class="card-title" style="font-size: 0.92rem; font-weight: 800; color: var(--text-main); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${this.escapeHtml(contact.name)}
              </h4>
              ${contact.company ? `<div style="font-size: 0.76rem; color: var(--text-muted); font-weight: 600;">${this.escapeHtml(contact.company)}</div>` : ''}
            </div>
          </div>
          <div class="card-actions" style="display: flex; gap: 4px; flex-shrink: 0;">
            <button class="icon-btn edit-btn" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.72rem; padding: 2px 6px;" title="Edit Contact">Edit</button>
            <button class="icon-btn delete delete-btn" style="background: var(--bg-main); color: var(--text-main); border: 1px solid var(--border); font-weight: 700; font-size: 0.72rem; padding: 2px 6px;" title="Delete Contact">Delete</button>
          </div>
        </div>

        <div class="card-body" style="font-size: 0.8rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          ${contact.email ? `<div style="display: flex; align-items: center; gap: 6px;"><a href="mailto:${contact.email}" style="color: var(--text-main); text-decoration: underline; word-break: break-all;">${this.escapeHtml(contact.email)}</a></div>` : ''}
          ${contact.phone ? `<div style="display: flex; align-items: center; gap: 6px;"><a href="tel:${contact.phone}" style="color: var(--text-main); text-decoration: none;">${this.escapeHtml(contact.phone)}</a></div>` : ''}
        </div>

        <div class="card-footer" style="margin-top: 6px; padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 4px; flex-wrap: wrap;">${projectPills}</div>
          <button class="icon-btn copy-btn" style="background: rgba(255,255,255,0.08); color: var(--text-main); border: 1px solid var(--border); font-size: 0.7rem; padding: 2px 6px; border-radius: 4px;" title="Copy Contact Details">Copy Details</button>
        </div>
      `;

      card.querySelector('.copy-btn').addEventListener('click', () => {
        const text = `${contact.name}\n${contact.company ? '(' + contact.company + ')' : ''}\nEmail: ${contact.email || 'N/A'}\nPhone: ${contact.phone || 'N/A'}`;
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

    const projSelect = document.getElementById('contactFormProjectSelect');
    const isPersonalCheck = document.getElementById('contactFormIsPersonal');
    const wrapperProj = document.getElementById('wrapperContactProjectSelect');

    if (projSelect) {
      projSelect.innerHTML = '';
      allProjects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        projSelect.appendChild(opt);
      });
    }

    if (isPersonalCheck) {
      isPersonalCheck.onchange = () => {
        if (wrapperProj) {
          wrapperProj.style.display = isPersonalCheck.checked ? 'none' : 'block';
        }
      };
    }

    if (contactId) {
      const contact = (this.state.contacts || []).find(c => c.id === contactId);
      if (!contact) return;
      if (this.contactModalTitle) this.contactModalTitle.textContent = 'Edit Contact';
      if (this.contactFormId) this.contactFormId.value = contact.id;
      if (this.contactFormName) this.contactFormName.value = contact.name || '';
      if (this.contactFormEmail) this.contactFormEmail.value = contact.email || '';
      if (this.contactFormPhone) this.contactFormPhone.value = contact.phone || '';
      if (this.contactFormCompany) this.contactFormCompany.value = contact.company || '';
      if (this.contactFormNotes) this.contactFormNotes.value = contact.notes || '';

      const isPers = contact.isPersonal || (contact.projects && contact.projects.includes('Personal'));
      if (isPersonalCheck) {
        isPersonalCheck.checked = isPers;
        isPersonalCheck.onchange();
      }
      if (projSelect && contact.projects && contact.projects[0] && !isPers) {
        projSelect.value = contact.projects[0];
      }
    } else {
      if (this.contactModalTitle) this.contactModalTitle.textContent = 'Add New Contact';
      if (this.contactFormId) this.contactFormId.value = '';
      if (this.contactFormName) this.contactFormName.value = '';
      if (this.contactFormEmail) this.contactFormEmail.value = '';
      if (this.contactFormPhone) this.contactFormPhone.value = '';
      if (this.contactFormCompany) this.contactFormCompany.value = '';
      if (this.contactFormNotes) this.contactFormNotes.value = '';
      if (isPersonalCheck) {
        isPersonalCheck.checked = false;
        isPersonalCheck.onchange();
      }
      if (projSelect && this.selectedProject !== 'all') {
        projSelect.value = this.selectedProject;
      }
    }

    if (this.btnDeleteContactInModal) {
      if (contactId) {
        this.btnDeleteContactInModal.style.display = 'block';
        this.btnDeleteContactInModal.onclick = (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          this.deleteContact(contactId);
        };
      } else {
        this.btnDeleteContactInModal.style.display = 'none';
        this.btnDeleteContactInModal.onclick = null;
      }
    }

    this.contactModalOverlay.classList.add('active');
    if (this.contactFormName) this.contactFormName.focus();
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

    const email = this.contactFormEmail ? this.contactFormEmail.value.trim() : '';
    const phone = this.contactFormPhone ? this.contactFormPhone.value.trim() : '';
    const company = this.contactFormCompany ? this.contactFormCompany.value.trim() : '';
    const notes = this.contactFormNotes ? this.contactFormNotes.value.trim() : '';

    const isPersonalCheck = document.getElementById('contactFormIsPersonal');
    const projSelect = document.getElementById('contactFormProjectSelect');

    const isPersonal = isPersonalCheck ? isPersonalCheck.checked : false;
    const assignedProject = (isPersonal || !projSelect) ? 'Personal' : (projSelect.value || 'Personal');

    if (!this.state.contacts) this.state.contacts = [];

    if (id) {
      const existing = this.state.contacts.find(c => c.id === id);
      if (existing) {
        existing.name = name;
        existing.email = email;
        existing.phone = phone;
        existing.company = company;
        existing.isPersonal = isPersonal;
        existing.projects = [assignedProject];
        existing.notes = notes;
      }
    } else {
      const colors = ['#7CFEFE', '#FBF582', '#009967', '#3b82f6', '#a855f7'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.state.contacts.push({
        id: 'contact-' + Date.now(),
        name,
        company,
        email,
        phone,
        isPersonal,
        projects: [assignedProject],
        notes,
        color
      });
    }

    this.saveState();
    this.closeContactModal();
    this.render();
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
        this.closeContactModal();
        this.render();
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
        this.render();
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
      this.render();
      this.showToast(`Added and attached ${manualName} to "${project}"`);
    }
  }

  openNewProjectModal() {
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
    if (this.newProjectModalOverlay) {
      this.newProjectModalOverlay.style.display = 'flex';
      this.newProjectModalOverlay.classList.add('active');
      if (this.newProjectTitle) this.newProjectTitle.focus();
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

function initMichiApp() {
  if (!window.app) {
    window.app = new MichiApp();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMichiApp);
} else {
  initMichiApp();
}
