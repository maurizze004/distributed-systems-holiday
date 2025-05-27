// Umschalten zwischen Login und Registrierung per Link
document.addEventListener("DOMContentLoaded", function () {
  const switchToRegister = document.getElementById("switch-to-register");
  const switchToLogin = document.getElementById("switch-to-login");
  const loginTab = document.getElementById("login-tab");
  const registerTab = document.getElementById("register-tab");

  if (switchToRegister) {
    switchToRegister.addEventListener("click", function (e) {
      e.preventDefault();
      registerTab.click();
    });
  }
  if (switchToLogin) {
    switchToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      loginTab.click();
    });
  }
});

// Login
document
  .querySelector("#login form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:3004/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Token speichern, z.B. im localStorage
        localStorage.setItem("token", data.token); // Token speichern
        localStorage.setItem('username', username); // Username speichern
        localStorage.setItem('role', data.role); // Rolle speichern
        // alert("Login erfolgreich!");
        // Weiterleitung auf die Startseite
        window.location.href = "../../index.html";
      } else {
        alert(data.message || "Login fehlgeschlagen");
      }
    } catch (err) {
      alert("Netzwerkfehler");
    }
  });

// Registrierung
document
  .querySelector("#register form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const passwordRepeat = document.getElementById(
      "registerRepeatPassword"
    ).value;

    if (password !== passwordRepeat) {
      alert("Passwörter stimmen nicht überein!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3004/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role: "user" }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registrierung erfolgreich! Jetzt einloggen.");
        document.getElementById("login-tab").click();
      } else {
        alert(data.message || "Fehler bei der Registrierung");
      }
    } catch (err) {
      alert("Netzwerkfehler");
    }
  });
