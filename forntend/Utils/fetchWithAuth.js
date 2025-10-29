
export async function fetchWithAuth(url, options = {}) {
    const BASEURI=process.env.NEXT_PUBLIC_API_URI
  let accessToken = localStorage.getItem('token')

  let response = await fetch(url, {
    ...options,
    credentials: "include", 
    headers: {
      ...(options.headers || {}),
      "Authorization": `Bearer ${accessToken}`,
      ...(options.body instanceof FormData ? {}: {"Content-Type": "application/json"})
    }
  });

  if (response.status === 401 || response.status === 403) {
 
    const refreshRes = await fetch(`${BASEURI}/api/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });

    if (!refreshRes.ok && !window.location.pathname.includes('/')) {
      localStorage.removeItem("token");
      window.location.replace('/');
      throw new Error("Session expired, please login again");
      
    }

    const refreshData = await refreshRes.json();
    accessToken = refreshData.accessToken;
    localStorage.setItem("token", accessToken);

    // Retry main API
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.headers || {}),
        "Authorization": `Bearer ${accessToken}`,
       ...(options.body instanceof FormData ? {}: {"Content-Type": "application/json"})
      }
    });
  }

 let data;
  try {
    data = await response.json();
  } catch (err) {
    const text = await response.text();
    console.error("Response is not valid JSON:", text);
    throw new Error("Response is not valid JSON");
  }

  return data;
}
