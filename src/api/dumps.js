import axios from "axios";

export async function handler(event) {
  const { accessToken } = JSON.parse(event.body);

  if (!accessToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No access token provided" }),
    };
  }

  try {
    const response = await axios.get(
      "https://wakatime.com/api/v1/users/current/summaries",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch WakaTime data" }),
    };
  }
}
