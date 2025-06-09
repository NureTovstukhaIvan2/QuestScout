import { jwtDecode as decode } from "jwt-decode";

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem("id_token");
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    const profile = this.getProfile();

    if (profile.data && profile.data.isAdmin) {
      window.location.assign("/admin");
    } else {
      window.location.assign("/home");
    }
  }

  isAdmin() {
    const profile = this.getProfile();
    return profile.data && profile.data.isAdmin;
  }

  logout() {
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }

  initGoogleAuth() {
    return new Promise((resolve) => {
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client?hl=en";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const interval = setInterval(() => {
          if (window.google && window.google.accounts) {
            clearInterval(interval);
            resolve();
          }
        }, 50);
      };
      document.body.appendChild(script);
    });
  }

  renderGoogleButton(containerId, callback, isSignUp = false) {
    if (!window.google || !document.getElementById(containerId)) {
      setTimeout(
        () => this.renderGoogleButton(containerId, callback, isSignUp),
        100
      );
      return;
    }

    window.google.accounts.id.initialize({
      client_id: "",
      callback: callback,
    });

    window.google.accounts.id.renderButton(
      document.getElementById(containerId),
      {
        theme: "outline",
        size: "large",
        text: isSignUp ? "signup_with" : "signin_with",
        shape: "pill",
        locale: "en",
      }
    );
  }
}

export default new AuthService();
