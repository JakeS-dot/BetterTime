import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import {
  exchangeCodeForToken,
  fetchUserDataIfNeeded,
  sendLoginApiRequest,
  sendLogOutRequest,
  getUserData,
} from "./api/loginApi.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const [searchParams] = useSearchParams();
  const [cookie, setCookie, removeCookie] = useCookies(["userData"]);
  const userData = cookie.userData;
  const isLoggedIn = !!userData;

  useEffect(() => {
    const initAuth = async () => {
      const code = searchParams.get("code");

      if (code) {
        try {
          await exchangeCodeForToken(searchParams);
          fetchUserDataIfNeeded(userData, setCookie, getUserData);
        } catch (e) {
          toast.error("Authentication failed", e);
        }
      } else {
        fetchUserDataIfNeeded(userData, setCookie, getUserData);
      }
    };

    initAuth();
  }, [searchParams, userData, setCookie]);

  return (
    <>
      <h1>Login Page</h1>
      <div>
        {isLoggedIn ? (
          <button onClick={() => sendLogOutRequest(userData, removeCookie)}>
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
