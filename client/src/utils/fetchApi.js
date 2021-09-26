const API_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

export default async function fetchApi(method, endpoint, data = {}, headers = {}) {
  const isGet = method === 'GET';
  const url = new URL(`${API_URL}/api/${endpoint}`);
  if (isGet) {
    url.search = new URLSearchParams(data).toString();
  }

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...!isGet && {
      body: JSON.stringify(data)
    }
  });

  if (!response.ok) {
    throw new Error('response not ok');
  }

  try {
    return await response.json();
  } catch {
    // swallow
  }
}
