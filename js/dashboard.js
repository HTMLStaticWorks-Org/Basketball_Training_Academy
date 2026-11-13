/**
 * COURTLY Basketball Training Academy
 * Comprehensive Player Dashboard Engine (12 Full Modules + Chart.js + LocalStorage Persistence)
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

// Default State Seed
const DEFAULT_PLAYER = {
  name: 'Marcus Vance',
  id: 'CT-2026-88',
  email: 'marcus.vance@courtly.com',
  phone: '+1 (555) 234-8901',
  dob: '2005-08-14',
  ageGroup: 'U-21 Elite',
  experience: 'Advanced (4+ Years)',
  position: 'Point Guard / Shooting Guard',
  jerseyNumber: '07',
  height: `6'3" (191 cm)`,
  weight: '190 lbs (86 kg)',
  academyRank: 'Tier 1 Elite',
  attendanceRate: '94%',
  totalSessions: 48,
  hoursTrained: 96,
  skillRating: 88,
  coach: 'Coach Marcus Hayes',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
};

const DEFAULT_BOOKINGS = [
  {
    id: 'BK-101',
    program: 'Shooting & Scoring Mastery',
    coach: 'Coach Elena Rostova',
    date: '2026-11-16',
    time: '16:00 - 17:30',
    court: 'Main Court Alpha',
    status: 'Confirmed'
  },
  {
    id: 'BK-102',
    program: 'Speed, Agility & Footwork Drill',
    coach: 'Coach Dave "The Wall" Miller',
    date: '2026-11-18',
    time: '10:00 - 11:30',
    court: 'Fitness Zone & Court Beta',
    status: 'Confirmed'
  },
  {
    id: 'BK-103',
    program: '1-on-1 Pick & Roll Breakdown',
    coach: 'Head Coach Marcus Hayes',
    date: '2026-11-21',
    time: '18:00 - 19:30',
    court: 'Practice Court Gamma',
    status: 'Pending'
  }
];

const DEFAULT_LEAGUES = [
  {
    id: 'LG-01',
    title: 'Metro Winter Championship 2026',
    category: 'Elite Under-21',
    startDate: 'Dec 05, 2026',
    teams: '16 Teams',
    status: 'Registered',
    fee: '$180'
  },
  {
    id: 'LG-02',
    title: 'Courtly 3x3 All-Star Showcase',
    category: 'Open Division',
    startDate: 'Jan 12, 2027',
    teams: '24 Teams',
    status: 'Open',
    fee: '$120'
  },
  {
    id: 'LG-03',
    title: 'Regional Youth Invitational Cup',
    category: 'Junior U-18',
    startDate: 'Feb 02, 2027',
    teams: '12 Teams',
    status: 'Open',
    fee: '$150'
  }
];

function initDashboard() {
  // Load data or seed
  if (!localStorage.getItem('courtly_player')) {
    localStorage.setItem('courtly_player', JSON.stringify(DEFAULT_PLAYER));
  }
  if (!localStorage.getItem('courtly_bookings')) {
    localStorage.setItem('courtly_bookings', JSON.stringify(DEFAULT_BOOKINGS));
  }
  if (!localStorage.getItem('courtly_leagues')) {
    localStorage.setItem('courtly_leagues', JSON.stringify(DEFAULT_LEAGUES));
  }

  setupSidebarNav();
  setupProfileData();
  renderBookingsTable();
  renderLeaguesList();
  setupBookingForm();
  setupProfileForm();
  setupSettingsForm();
  initDashboardCharts();
}

/* ==========================================================================
   1. Sidebar Navigation (12 Modules Switcher)
   ========================================================================== */
function setupSidebarNav() {
  const navBtns = document.querySelectorAll('.dashboard-nav-item');
  const sections = document.querySelectorAll('.dashboard-section');
  const pageTitle = document.getElementById('dashboardPageTitle');

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');

      // Handle Logout
      if (targetId === 'logout') {
        if (confirm('Are you sure you want to log out of your Courtly Player account?')) {
          window.location.href = 'index.html';
        }
        return;
      }

      // Update Nav active style
      navBtns.forEach(b => {
        b.classList.remove('bg-orange-500', 'text-white', 'shadow-lg');
        b.classList.add('text-slate-400', 'hover:bg-slate-800/60');
      });
      btn.classList.add('bg-orange-500', 'text-white', 'shadow-lg');
      btn.classList.remove('text-slate-400', 'hover:bg-slate-800/60');

      // Update Section visibility
      sections.forEach(sec => sec.classList.add('hidden'));
      const activeSection = document.getElementById(targetId);
      if (activeSection) {
        activeSection.classList.remove('hidden');
        if (pageTitle) {
          pageTitle.textContent = btn.getAttribute('data-title') || 'Dashboard';
        }
      }

      // Close mobile sidebar if open
      const sidebar = document.getElementById('dashboardSidebar');
      if (sidebar && window.innerWidth < 1280) {
        sidebar.classList.add('-translate-x-full');
      }
    });
  });

  // Mobile sidebar toggler & close button
  const sidebarToggle = document.getElementById('dashboardSidebarToggle');
  const sidebarClose = document.getElementById('dashboardSidebarClose');
  const sidebar = document.getElementById('dashboardSidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
    });
  }
  if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
    });
  }
}

/* ==========================================================================
   2. Player Profile Display
   ========================================================================== */
function setupProfileData() {
  const player = JSON.parse(localStorage.getItem('courtly_player')) || DEFAULT_PLAYER;
  
  document.querySelectorAll('.player-name-text').forEach(el => el.textContent = player.name);
  document.querySelectorAll('.player-id-text').forEach(el => el.textContent = player.id);
  document.querySelectorAll('.player-pos-text').forEach(el => el.textContent = player.position);
  document.querySelectorAll('.player-rank-text').forEach(el => el.textContent = player.academyRank);
  document.querySelectorAll('.player-jersey-text').forEach(el => el.textContent = '#' + player.jerseyNumber);
}

/* ==========================================================================
   3. Session Booking & Management
   ========================================================================== */
function setupBookingForm() {
  const bookingForm = document.getElementById('dashboardBookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const program = document.getElementById('bookProgram').value;
    const coach = document.getElementById('bookCoach').value;
    const date = document.getElementById('bookDate').value;
    const time = document.getElementById('bookTime').value;
    const court = document.getElementById('bookCourt').value;

    if (!program || !coach || !date || !time) {
      window.showCourtlyToast('Incomplete Booking', 'Please select program, coach, date and time.', 'error');
      return;
    }

    const bookings = JSON.parse(localStorage.getItem('courtly_bookings')) || [];
    const newBooking = {
      id: 'BK-' + Math.floor(100 + Math.random() * 900),
      program,
      coach,
      date,
      time,
      court,
      status: 'Confirmed'
    };

    bookings.unshift(newBooking);
    localStorage.setItem('courtly_bookings', JSON.stringify(bookings));
    renderBookingsTable();

    window.showCourtlyToast('Booking Confirmed!', `Session for ${program} successfully reserved on ${date}.`, 'success');
    bookingForm.reset();

    // Switch to My Bookings tab automatically
    const myBookingsBtn = document.querySelector('[data-target="my-bookings"]');
    if (myBookingsBtn) myBookingsBtn.click();
  });
}

function renderBookingsTable() {
  const container = document.getElementById('bookingsTableBody');
  const recentContainer = document.getElementById('overviewRecentSessions');
  const bookings = JSON.parse(localStorage.getItem('courtly_bookings')) || [];

  if (container) {
    if (bookings.length === 0) {
      container.innerHTML = `<tr><td colspan="6" class="p-6 text-center text-slate-400">No sessions booked yet. Schedule one above!</td></tr>`;
    } else {
      container.innerHTML = bookings.map((b, i) => `
        <tr class="border-b border-theme/40 hover:bg-slate-800/20 transition-colors">
          <td class="py-4 px-4 font-mono text-xs text-orange-500 font-bold">${b.id}</td>
          <td class="py-4 px-4 font-semibold text-sm">${b.program}</td>
          <td class="py-4 px-4 text-sm text-slate-300">${b.coach}</td>
          <td class="py-4 px-4 text-xs text-slate-400">${b.date}<br><span class="text-orange-400">${b.time}</span></td>
          <td class="py-4 px-4">
            <span class="inline-flex px-2.5 py-1 text-xs rounded-full font-bold ${
              b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }">${b.status}</span>
          </td>
          <td class="py-4 px-4 text-right">
            <button onclick="cancelBooking('${b.id}')" class="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 mr-1">Cancel</button>
            <button onclick="rescheduleBooking('${b.id}')" class="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20">Reschedule</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // Update Overview card with next upcoming sessions
  if (recentContainer) {
    if (bookings.length === 0) {
      recentContainer.innerHTML = `<p class="text-sm text-slate-400 p-4">No upcoming sessions. Book a workout to get started!</p>`;
    } else {
      recentContainer.innerHTML = bookings.slice(0, 3).map(b => `
        <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/40 border border-theme/30 hover:border-orange-500/40 transition-all">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold text-xs">
              ${b.time.split(':')[0]}H
            </div>
            <div>
              <h5 class="text-sm font-bold">${b.program}</h5>
              <p class="text-xs text-slate-400">${b.coach} • ${b.court}</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-mono text-orange-400 block">${b.date}</span>
            <span class="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">${b.status}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

window.cancelBooking = function(id) {
  if (confirm(`Cancel training session ${id}?`)) {
    let bookings = JSON.parse(localStorage.getItem('courtly_bookings')) || [];
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('courtly_bookings', JSON.stringify(bookings));
    renderBookingsTable();
    window.showCourtlyToast('Session Cancelled', `Session ${id} has been removed.`, 'info');
  }
};

window.rescheduleBooking = function(id) {
  const newDate = prompt(`Enter new date (YYYY-MM-DD):`, '2026-11-25');
  if (newDate) {
    let bookings = JSON.parse(localStorage.getItem('courtly_bookings')) || [];
    bookings = bookings.map(b => b.id === id ? { ...b, date: newDate, status: 'Confirmed' } : b);
    localStorage.setItem('courtly_bookings', JSON.stringify(bookings));
    renderBookingsTable();
    window.showCourtlyToast('Rescheduled', `Session ${id} moved to ${newDate}.`, 'success');
  }
};

/* ==========================================================================
   4. Leagues Registration
   ========================================================================== */
function renderLeaguesList() {
  const container = document.getElementById('leaguesListContainer');
  if (!container) return;

  const leagues = JSON.parse(localStorage.getItem('courtly_leagues')) || DEFAULT_LEAGUES;

  container.innerHTML = leagues.map(lg => `
    <div class="p-6 rounded-2xl bg-surface border border-theme/60 flex flex-col justify-between hover:border-orange-500/50 transition-all card-hover-fx">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
            lg.status === 'Registered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
          }">
            ${lg.status}
          </span>
          <span class="text-xs font-mono text-slate-400">${lg.teams}</span>
        </div>
        <h4 class="text-xl font-bold font-display uppercase tracking-wider mb-1">${lg.title}</h4>
        <p class="text-sm text-slate-400 mb-4">${lg.category} • Kickoff: <strong class="text-orange-400">${lg.startDate}</strong></p>
        
        <div class="grid grid-cols-2 gap-2 text-xs py-3 border-t border-b border-theme/40 mb-4">
          <div><span class="text-slate-400">Entry Fee:</span> <strong class="text-slate-200">${lg.fee}</strong></div>
          <div><span class="text-slate-400">Venue:</span> <strong class="text-slate-200">Main Arena</strong></div>
        </div>
      </div>

      <div>
        ${lg.status === 'Registered' 
          ? `<button disabled class="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm cursor-default flex items-center justify-center gap-2">✓ Roster Confirmed</button>`
          : `<button onclick="registerForLeague('${lg.id}')" class="w-full btn-court-primary py-2.5 rounded-xl font-bold text-sm">Register Team / Player</button>`
        }
      </div>
    </div>
  `).join('');
}

window.registerForLeague = function(leagueId) {
  let leagues = JSON.parse(localStorage.getItem('courtly_leagues')) || DEFAULT_LEAGUES;
  leagues = leagues.map(l => l.id === leagueId ? { ...l, status: 'Registered' } : l);
  localStorage.setItem('courtly_leagues', JSON.stringify(leagues));
  renderLeaguesList();
  window.showCourtlyToast('Tournament Registered!', `You are now on the official roster. Welcome to the tournament.`, 'success');
};

/* ==========================================================================
   5. Profile Edit Form
   ========================================================================== */
function setupProfileForm() {
  const form = document.getElementById('profileEditForm');
  if (!form) return;

  const player = JSON.parse(localStorage.getItem('courtly_player')) || DEFAULT_PLAYER;

  // Pre-fill
  if (document.getElementById('profileFullName')) document.getElementById('profileFullName').value = player.name;
  if (document.getElementById('profileEmail')) document.getElementById('profileEmail').value = player.email;
  if (document.getElementById('profilePhone')) document.getElementById('profilePhone').value = player.phone;
  if (document.getElementById('profilePosition')) document.getElementById('profilePosition').value = player.position;
  if (document.getElementById('profileJersey')) document.getElementById('profileJersey').value = player.jerseyNumber;
  if (document.getElementById('profileHeight')) document.getElementById('profileHeight').value = player.height;
  if (document.getElementById('profileWeight')) document.getElementById('profileWeight').value = player.weight;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      ...player,
      name: document.getElementById('profileFullName').value,
      email: document.getElementById('profileEmail').value,
      phone: document.getElementById('profilePhone').value,
      position: document.getElementById('profilePosition').value,
      jerseyNumber: document.getElementById('profileJersey').value,
      height: document.getElementById('profileHeight').value,
      weight: document.getElementById('profileWeight').value,
    };
    localStorage.setItem('courtly_player', JSON.stringify(updated));
    setupProfileData();
    window.showCourtlyToast('Profile Updated', 'Your athlete metrics were saved successfully.', 'success');
  });
}

/* ==========================================================================
   6. Settings Form
   ========================================================================== */
function setupSettingsForm() {
  const form = document.getElementById('dashboardSettingsForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    window.showCourtlyToast('Settings Saved', 'Notification & privacy preferences updated.', 'success');
  });
}

/* ==========================================================================
   7. Chart.js Dashboard Visualizations (Theme-Adaptive)
   ========================================================================== */
let activeDashboardCharts = [];

function initDashboardCharts() {
  if (typeof Chart === 'undefined') return;

  // Clean up any existing chart instances before re-instantiating
  activeDashboardCharts.forEach(c => {
    try { c.destroy(); } catch (e) {}
  });
  activeDashboardCharts = [];

  const isLight = document.body.classList.contains('light');
  const tickColor = isLight ? '#475569' : '#94A3B8';
  const labelColor = isLight ? '#0F172A' : '#E2E8F0';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(255, 255, 255, 0.05)';
  const radarGridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  const radarAngleColor = isLight ? 'rgba(184, 134, 11, 0.25)' : 'rgba(212, 175, 55, 0.15)';
  const radarPointColor = isLight ? '#334155' : '#CBD5E1';
  const primaryGold = isLight ? '#B8860B' : '#D4AF37';

  // 1. Skill Radar Chart
  const skillCtx = document.getElementById('skillRadarChart');
  if (skillCtx) {
    const chart1 = new Chart(skillCtx, {
      type: 'radar',
      data: {
        labels: ['Shooting %', 'Ball Handling', 'Court Vision', 'Perimeter Def', 'Agility & Speed', 'Game IQ'],
        datasets: [{
          label: 'Current Metrics',
          data: [86, 92, 84, 88, 90, 89],
          backgroundColor: isLight ? 'rgba(184, 134, 11, 0.2)' : 'rgba(212, 175, 55, 0.28)',
          borderColor: primaryGold,
          borderWidth: 2.5,
          pointBackgroundColor: primaryGold,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: primaryGold
        }, {
          label: 'Academy Benchmark (Tier 1)',
          data: [80, 85, 78, 82, 85, 80],
          backgroundColor: isLight ? 'rgba(100, 116, 139, 0.12)' : 'rgba(142, 149, 158, 0.15)',
          borderColor: isLight ? '#64748B' : '#8E959E',
          borderWidth: 1.5,
          borderDash: [5, 5],
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: radarAngleColor },
            grid: { color: radarGridColor },
            pointLabels: {
              color: radarPointColor,
              font: { family: 'Inter', size: 11, weight: '600' }
            },
            ticks: { display: false, max: 100, min: 20 }
          }
        },
        plugins: {
          legend: {
            labels: { color: labelColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
    activeDashboardCharts.push(chart1);
  }

  // 2. Performance & Attendance Line Chart
  const perfCtx = document.getElementById('performanceTrendChart');
  if (perfCtx) {
    const chart2 = new Chart(perfCtx, {
      type: 'line',
      data: {
        labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        datasets: [{
          label: 'Field Goal %',
          data: [44.2, 46.8, 48.5, 51.0, 52.4, 55.1],
          borderColor: primaryGold,
          backgroundColor: isLight ? 'rgba(184, 134, 11, 0.12)' : 'rgba(212, 175, 55, 0.14)',
          tension: 0.35,
          fill: true,
          borderWidth: 3
        }, {
          label: 'Three-Point %',
          data: [35.0, 36.5, 38.0, 39.2, 41.5, 43.8],
          borderColor: isLight ? '#D97706' : '#F3C04A',
          backgroundColor: 'transparent',
          tension: 0.35,
          borderWidth: 2,
          borderDash: [4, 4]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: tickColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: tickColor, callback: v => v + '%' },
            min: 30,
            max: 60
          }
        },
        plugins: {
          legend: {
            labels: { color: labelColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
    activeDashboardCharts.push(chart2);
  }

  // 3. Weekly Training Volume Bar Chart
  const volumeCtx = document.getElementById('trainingVolumeChart');
  if (volumeCtx) {
    const chart3 = new Chart(volumeCtx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Minutes on Court',
          data: [90, 120, 60, 105, 90, 150, 45],
          backgroundColor: primaryGold,
          hoverBackgroundColor: isLight ? '#9A6700' : '#F3C04A',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: tickColor }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: tickColor }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
    activeDashboardCharts.push(chart3);
  }
}

// Re-render dashboard charts on theme change
window.addEventListener('courtly_theme_changed', () => {
  initDashboardCharts();
});

