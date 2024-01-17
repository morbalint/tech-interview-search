import React, {useState} from 'react';
import './App.css';

type ResponseData = {
    data: string[]
    next?: string
    prev?: string
}

function App() {

  const [searchTerm, setSearchTerm] = useState("")

  const [searchResults, setSearchResults] = useState({data: ["asd"]} as ResponseData)

  const [page, setPage] = useState(1) // sorry for the super basic page number tracking

  const submitSearch = async () => {
      const response = await fetch(`http://localhost:3001/search?q=${searchTerm}`)
      const results = await response.json() as ResponseData // TODO: error handling
      setSearchResults(results)
      setPage(1)
  }

  const goToPrev = async () => {
      if (searchResults.prev == null) {
          return;
      }
      const response = await fetch(`http://localhost:3001${searchResults.prev}`)
      const results = await response.json() as ResponseData
      setSearchResults(results)
      setPage(page - 1)
  }

    const goToNext = async () => {
        if (searchResults.next == null) {
            return;
        }
        const response = await fetch(`http://localhost:3001${searchResults.next}`)
        const results = await response.json() as ResponseData
        setSearchResults(results)
        setPage(page + 1)
    }


  return (
    <div className="App">
      <div>
          <form onSubmit={ async (e) => { e.preventDefault(); await submitSearch(); }}>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <button type={"submit"}> Search </button>
          </form>
      </div>
      <div>
          <ul>
          {searchResults.data.map(r =>
            <li key={r}>{r}</li>)
          }
          </ul>
      </div>
      <div>
          {searchResults.prev && <button onClick={goToPrev}>
              Previous Page
          </button>}
          <span>Page #{page}</span>
          {searchResults.next && <button onClick={goToNext}>
              Next Page
          </button>}
      </div>
    </div>
  );
}

export default App;
