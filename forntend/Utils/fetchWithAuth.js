
export async function fetchWithAuth(url, options = {}) {
    const BASEURI=process.env.NEXT_PUBLIC_API_URI
  let accessToken = localStorage.getItem('token')

  let response = await fetch(url, {
    ...options,
    credentials: "include", 
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status === 401 || response.status === 403) {
 
    const refreshRes = await fetch(`${BASEURI}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok) {
      localStorage.removeItem("token");
      throw new Error("Session expired, please login again");
    }

    const refreshData = await refreshRes.json();
    accessToken = refreshData.accessToken;
    localStorage.setItem("accessToken", accessToken);

    // Retry main API
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
  }

  return response.json();
}
