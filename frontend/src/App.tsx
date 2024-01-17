import React, {useState} from 'react';
import './App.css';

function App() {

  const [searchTerm, setSearchTerm] = useState("")

  const [searchResults, setSearchResults] = useState(["asd"] as string[])

  const submitSearch = async () => {
      const response = await fetch(`http://localhost:3001/search?q=${searchTerm}`)
      const results = await response.json() as { data: string[]}
      setSearchResults(results.data)
  }

  return (
    <div className="App">
      <div>
        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <button type={"button"} onClick={submitSearch}> Search </button>
      </div>
      <div>
          <ul>
          {searchResults.map(r =>
            <li key={r}>{r}</li>)
          }
          </ul>
      </div>
    </div>
  );
}

export default App;
