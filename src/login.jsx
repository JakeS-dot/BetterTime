import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

const CheckParams = () => {
  const [searchParams] = useSearchParams();
  const [, setCookie] = useCookies(["token"]);

  useEffect(() => {
    // Handle fragment-based token (#access_token)
    const fragment = window.location.hash.substring(1);
    const fragmentParams = new URLSearchParams(fragment);
    const accessToken = fragmentParams.get("access_token");

    if (accessToken) {
      setCookie("token", accessToken, {
        path: "/",
        maxAge: 43200,
        secure: true,
      });
      console.log("Access Token Saved:", accessToken);
      return;
    }

    // Handle query-based token (?code)
    const code = searchParams.get("code");
    if (code) {
      fetch("http://127.0.0.1:5000/get_access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: code }),
      }).catch((err) => console.error("Token exchange failed:", err));

      window.close();
    }
  }, [searchParams, setCookie]);

  return null; // No UI, just a side-effect
};

const CheckLogin = () => {
  const [cookie] = useCookies(["token"]);
  const token = cookie["token"];
  return token !== undefined;
};

const Login = () => {
  const [cookie, setCookie] = useCookies(["token", "userData"]);
  const token = cookie["token"];
  const userData = cookie["userData"];

  const sendLoginApiRequest = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_login_link");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      // Redirect user to the URL
      window.open(result["url"], "_blank", "width=500,height=600");
    } catch (error) {
      toast.error(error.message);
      console.error("Error during login request:", error);
    }
  };

  const sendLogOutRequest = async () => {
    // Send a request to https://wakatime.com/oauth/revoke to revoke the token if needed
    try {
      const response = await fetch("http://127.0.0.1:5000/revoke_token");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during logging out and token revoke:", error);
    }
  };

  const getUserData = () => {
    if (userData === undefined && token) {
      fetch("http://127.0.0.1:5000/get_user_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          // Set user data as a cookie
          setCookie("userData", data, {
            path: "/",
            maxAge: 43200,
            secure: true,
          });
        })
        .catch((error) => {
          console.error("Error during getting user data:", error);
        });
    }
  };

  // Call getUserData if the user is logged in
  if (CheckLogin()) {
    getUserData();
  }

  return (
    <div>
      <h1>Login Page</h1>
      {CheckLogin() ? (
        <>
          <p>Your Logged In!</p>
          <button onClick={sendLogOutRequest}>Logout</button>
        </>
      ) : (
        <button onClick={sendLoginApiRequest}>Login with WakaTime</button>
      )}

      <CheckParams />
    </div>
  );
};

export default Login;
