import './App.css';
import { useState } from 'react';
import useKeyState from './hooks/useKeyState';

const API_LINK = "http://localhost:4242";

function App() {
  const [state, setState] = useState(
    "Click the buttons!"
  );
  const [key, checkValid] = useKeyState();

  const checkValidity = async () => {
    try {
      const valid = await checkValid(key);
      setState(valid ?
        "Key is still valid!" :
        "Key expired, refreshing key..."
      );
    } catch (e) {
      setState("Network error");
    }
  }

  const getNumpy = async () => {
    try {
      const valid = await checkValid();
      if (valid) {
        const res = await fetch(
          `${API_LINK}/key/${key}/data`
        );
        const data = await res.json();
        if (data.status === 200) {
          setState(data.data);
        } else {
          setState(data.error);
        }
      } else {
        setState("Key expired, refreshing key...");
      }
    } catch (e) {
      setState("Network error");
    }
  }

  const readFile = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsBinaryString(file);
    reader.onload = async () => {
      try {
        const valid = await checkValid();
        if (valid) {
          const res = await fetch(
            `${API_LINK}/key/${key}/image`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                image: window.btoa(reader.result),
                name: file.name
              })
            });
          const data = await res.json();
          if (data.status === 200) {
            setState("Image uploaded!");
          } else {
            setState(data.error);
          }
        } else {
          setState("Key expired, refreshing key...");
        }
      } catch (e) {
        setState("Network error\n" + e);
      }
    }
  }

  return (
    <div className="App">
      <h1>
        KeyState Demo
      </h1>
      <div className="App__buttons">
        <button className="App__button" onClick={checkValidity}>
          Check validity
        </button>
        <button className="App__button" onClick={getNumpy}>
          Get Python Array
        </button>
        <input type="file" onChange={readFile} />
      </div>
      <p className="App__state">
        {state}
      </p>
    </div>
  );
}

export default App;