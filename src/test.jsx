import React from "react";

export default function Test() {

  const setCookie = async () => {
    const res = await fetch("http://localhost:5000/set_cookie", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    console.log(data);
  };

  const getCookie = async () => {
    const res = await fetch("http://localhost:5000/get_cookie", {
      method: "GET",
      credentials: "include"
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Flask Cookie Test</h1>

      <button onClick={setCookie}>
        Set Cookie
      </button>

      <br /><br />

      <button onClick={getCookie}>
        Get Cookie
      </button>
    </div>
  );
}
