document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  const userSpan = document.getElementById('current-user');
  const role = localStorage.getItem('role');
  const adminLink = document.getElementById('admin-link');
  const loginNavItem = document.getElementById('login-nav-item');
  const logoutNavItem = document.getElementById('logout-nav-item');
  const logoutLink = document.getElementById('logout-link');

  if (username) {
    userSpan.textContent = username;
    if (loginNavItem) loginNavItem.style.display = 'none'; // Login-Button ausblenden
    if (logoutNavItem) logoutNavItem.style.display = 'block'; // Logout-Button einblenden
  } else {
    userSpan.textContent = 'Gast';
    if (loginNavItem) loginNavItem.style.display = 'block'; // Login-Button einblenden
    if (logoutNavItem) logoutNavItem.style.display = 'none'; // Logout-Button ausblenden
  }

  if (role === 'admin' && adminLink) {
    adminLink.style.display = 'inline';
  } else if (adminLink) {
    adminLink.style.display = 'none';
  }

  // Logout-Funktion
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      alert('Sie wurden abgemeldet.');
      window.location.href = 'index.html'; // Weiterleitung zur Login-Seite
    });
  }
});