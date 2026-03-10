import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  handleTokenFromUrl,
  exchangeCodeForToken,
  fetchUserDataIfNeeded,
  sendLoginApiRequest,
  sendLogOutRequest,
  getUserData,
} from "./api/loginApi.jsx"; // Adjust the path as needed
import { toast } from "react-toastify";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [cookie, setCookie, removeCookie] = useCookies(["token", "userData"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = cookie["token"];
  const userData = cookie["userData"];

  useEffect(() => {
    const handled = handleTokenFromUrl(setCookie);
    if (!handled) {
      exchangeCodeForToken(searchParams);
    }
  }, [searchParams, setCookie]);

  useEffect(() => {
    fetchUserDataIfNeeded(
      userData,
      setCookie,
      setIsLoggedIn,
      getUserData,
    );
  }, [token, userData, setCookie]);

  return (
    <>
      <h1>Login Page</h1>
      <div>
        {isLoggedIn ? (
          <button
            onClick={() =>
              sendLogOutRequest(userData, removeCookie, setIsLoggedIn)
            }
          >
            Logout
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                await sendLoginApiRequest();
              } catch (e) {
                toast.error("Login failed", e);
              }
            }}
          >
            Login
          </button>
        )}
      </div>
      <a href="/">Go back</a>
    </>
  );
};

export default Login;
