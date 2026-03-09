export async function getUserData(token) {
  if (token) {
    return fetch("http://127.0.0.1:5000/get_user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error during getting user data:", error);
      });
  } else {
    console.error("Error, no token given");
    return Promise.reject("No token provided");
  }
}

export const handleTokenFromUrl = (setCookie) => {
  const fragment = window.location.hash.substring(1);
  const fragmentParams = new URLSearchParams(fragment);
  const accessToken = fragmentParams.get("access_token");

  if (accessToken) {
    setCookie("token", accessToken, {
      path: "/",
      secure: true,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    return true;
  }

  return false;
};

export const exchangeCodeForToken = async (searchParams) => {
  const code = searchParams.get("code");
  if (code) {
    try {
      await fetch("http://127.0.0.1:5000/get_access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: code }),
      });

      window.history.replaceState(null, "", window.location.pathname);
    } catch (err) {
      console.error("Token exchange failed:", err);
    }
  }
};

export const fetchUserDataIfNeeded = (
  token,
  userData,
  setCookie,
  setIsLoggedIn,
  getUserData,
) => {
  if (token && !userData) {
    getUserData(token).then((data) => {
      setCookie("userData", data, {
        path: "/",
        secure: true,
      });
      setIsLoggedIn(true);
    });
  } else if (token && userData) {
    setIsLoggedIn(true);
  } else {
    setIsLoggedIn(false);
  }
};

export const sendLoginApiRequest = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/get_login_link");
    if (!response.ok) throw new Error("Login failed");
    const result = await response.json();
    window.open(result["url"], "_self");
  } catch (error) {
    console.error("Error during login request:", error);
    throw error;
  }
};

export const sendLogOutRequest = async (
  userData,
  removeCookie,
  setIsLoggedIn,
) => {
  try {
    const uid = userData?.data?.id;
    const response = await fetch("http://127.0.0.1:5000/revoke_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (!response.ok) throw new Error("Logout failed");

    removeCookie("token");
    removeCookie("userData");
    setIsLoggedIn(false);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
