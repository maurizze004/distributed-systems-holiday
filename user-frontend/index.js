document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  const userSpan = document.getElementById('current-user');
  const role = localStorage.getItem('role');
  const adminLink = document.getElementById('admin-link');
  if (username) {
    userSpan.textContent = username;
  } else {
    userSpan.textContent = 'Gast';
  }
  if (role === 'admin' && adminLink) {
    adminLink.style.display = 'inline';
  } else if (adminLink) {
    adminLink.style.display = 'none';
  }
});

