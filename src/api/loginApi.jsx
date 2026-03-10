export async function getUserData() {
  return fetch("http://localhost:5000/get_user_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.status == 401) {
        return
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      else {
        return response.json();
      }
    })
    .catch((error) => {
      console.error("Error during getting user data:", error);
    });
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
    }
  }
};

export const fetchUserDataIfNeeded = (
  userData,
  setCookie,
  setIsLoggedIn,
  getUserData,
) => {
  if (!userData) {
    getUserData()
      .then((data) => {
        if (data) {
          setCookie("userData", data, {
            path: "/",
            secure: true,
          });
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
  } else {
    setIsLoggedIn(true);
  }
};

export const sendLoginApiRequest = async () => {
  try {
    const response = await fetch("http://localhost:5000/get_login_link");
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
    const response = await fetch("http://localhost:5000/revoke_token", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });
    if (!response.ok) throw new Error("Logout failed");

    removeCookie("userData");
    setIsLoggedIn(false);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
