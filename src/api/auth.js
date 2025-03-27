import axios from "axios";

export async function handler(event) {
  const WAKA_APP_ID = process.env.REACT_APP_WAKA_APP_ID;
  const WAKA_APP_SECRET = process.env.REACT_APP_WAKA_APP_SECRET;
  const redirectUri = "http://localhost:3000/api/auth/callback"; // Same as frontend

  if (event.httpMethod === "GET" && event.queryStringParameters.code) {
    const code = event.queryStringParameters.code;

    try {
      const response = await axios.post("https://wakatime.com/oauth/token", {
        client_id: WAKA_APP_ID,
        client_secret: WAKA_APP_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code,
      });

      const accessToken = response.data.access_token;

      // Save the token or send it back to the frontend (e.g., via session/cookie)
      return {
        statusCode: 200,
        body: JSON.stringify({ accessToken }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to authenticate" }),
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: "Bad Request" }),
  };
}
