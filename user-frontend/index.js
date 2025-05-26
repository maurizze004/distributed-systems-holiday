document.addEventListener('DOMContentLoaded', function() {
  const username = localStorage.getItem('username');
  const userSpan = document.getElementById('current-user');
  if (username) {
    userSpan.textContent = username;
  } else {
    userSpan.textContent = 'Gast';
  }
});

