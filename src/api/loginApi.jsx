import { toast } from "react-toastify";

export async function getUserData(setErrorToast) {
  try {
    let response = await fetch("http://localhost:5000/get_user_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.status === 401) {
      const refreshRes = await fetch("http://localhost:5000/refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!refreshRes.ok) {
        setErrorToast?.("Session expired. Please log in again.");
        return null;
      }

      response = await fetch("http://localhost:5000/get_user_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    }

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error during getting user data:", error);
    return null;
  }
}

export const exchangeCodeForToken = async (searchParams, setErrorToast) => {
  const code = searchParams.get("code");
  if (code) {
    try {
      await fetch("http://localhost:5000/get_access_token", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: code }),
      });
      window.history.replaceState(null, "", window.location.pathname);
    } catch (err) {
      console.error("Token exchange failed:", err);
      setErrorToast?.("Authentication failed");
    }
  }
};

export const fetchUserDataIfNeeded = async (
  userData,
  setCookie,
  setErrorToast,
) => {
  if (!userData) {
    const data = await getUserData(setErrorToast);
    if (data) {
      setCookie("userData", data, { path: "/", secure: true });
    }
  }
};

export const sendLoginApiRequest = async () => {
  try {
    const response = await fetch("http://localhost:5000/get_login_link");
    if (!response.ok) throw new Error("Login failed");
    const result = await response.json();
    window.open(result.url, "_self");
  } catch (error) {
    console.error("Error during login request:", error);
    toast.error("Login failed");
    throw error;
  }
};

export const sendLogOutRequest = async (userData, removeCookie) => {
  try {
    const uid = userData?.data?.id;
    const response = await fetch("http://localhost:5000/revoke_token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (!response.ok) throw new Error("Logout failed");

    removeCookie("userData");
  } catch (error) {
    console.error("Error during logout:", error);
    toast.error("Logout failed");
  }
};

export const fetchWithAutoRefresh = async (
  url,
  options = {},
  setErrorToast,
) => {
  try {
    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status === 401) {
      const refreshRes = await fetch("http://localhost:5000/refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });

      if (!refreshRes.ok) {
        setErrorToast?.("Session expired. Please log in again.");
        return null;
      }

      res = await fetch(url, { ...options, credentials: "include" });
    }

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
