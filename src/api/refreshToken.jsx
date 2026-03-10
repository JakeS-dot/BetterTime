export default async function refreshToken(refreshToken, setErrorToast) {
  try {
    const response = await fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh", data.refresh_token);

    return data.access_token;
  } catch (error) {
    setErrorToast(error.message);
    return null;
  }
}
