import { useState } from 'react';

const API_LINK = "http://localhost:4242";

function useKey() {
  const [key, setKey] = useState(null);

  async function checkValid() {
    if (key === null) {
      const res = await fetch(`${API_LINK}/key/new`);
      const data = await res.json();
      setKey(data.key);
      return false;
    } else {
      const res = await fetch(`${API_LINK}/key/${key}`);
      const data = await res.json();
      if (!data.expired) {
        return true;
      }
      const res2 = await fetch(`${API_LINK}/key/new`);
      const data2 = await res2.json();
      setKey(data2.key);
      return false;
    }
  }

  return [key, checkValid];
}

export default useKey;