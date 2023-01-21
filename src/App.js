import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [libs, setLibs] = useState([]);
  
  useEffect(() => {
    fetch('https://api.cdnjs.com/libraries')
    .then((response) =>response.json())
    .then((data) =>setLibs(data.results));

  }, []);

  return (<>
  <input type="search" />
  <ul>
    {
      libs.map((lib) =><li key={lib.name}>{lib.name}</li>)
    }
  </ul>
  </>);
}

export default App;
