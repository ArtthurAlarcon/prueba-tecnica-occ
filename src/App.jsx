import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const END_POINT = "https://hp-api.onrender.com/api/characters";

  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [filterHouse, setFilterHouse] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchCharacters();
  }, []);

  useEffect(() => {
    filterCharacters();
  }, [characters, filterHouse, filterName]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(END_POINT);
      const data = await response.json();
      const modifiedData = data.map(item => ({ ...item, hidden: false }));
      setCharacters(modifiedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching characters:", error);
      setLoading(false);
    }
  };

  const filterCharacters = () => {
    let filtered = characters;

    if (filterHouse !== "") {
      filtered = filtered.filter((character) =>
        character.house.toLowerCase().includes(filterHouse.toLowerCase()) &&
        !character.hidden
      );
    }

    if (filterName !== "") {
      filtered = filtered.filter((character) =>
        character.name.toLowerCase().includes(filterName.toLowerCase()) &&
        !character.hidden
      );
    }

    setFilteredCharacters(filtered);
  };

  const handleClearList = () => {
    setCharacters([]);
    setFilteredCharacters([]);
  };

  const handleShowAll = () => {
    setLoading(true);
    setFilterHouse("");
    setFilterName("");
    fetchCharacters();
  };

  const handleFilterByHouse = (event) => {
    setFilterHouse(event.target.value);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleHideCharacter = (id) => {
    const updatedCharacters = characters.map((character) =>
      character.id === id ? { ...character, hidden: true } : character, 
    );

    setCharacters(updatedCharacters);
    setFilteredCharacters(updatedCharacters);
  };

  return (
    <div className="page">
      <header>
        <h1>Lista de aspirantes a Hogwarts</h1>
        <div className="button-container">
          <button onClick={handleClearList}>Limpiar lista</button>
          <button onClick={handleShowAll}>Lista completa</button>
          <select value={filterHouse} onChange={handleFilterByHouse}>
            <option value="">Todas las casas</option>
            <option value="Gryffindor">Gryffindor</option>
            <option value="Hufflepuff">Hufflepuff</option>
            <option value="Ravenclaw">Ravenclaw</option>
            <option value="Slytherin">Slytherin</option>
          </select>
          <input
            type="text"
            value={filterName}
            onChange={handleFilterByName}
            placeholder="Filtrar por nombre"
          />
        </div>
      </header>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : filteredCharacters.length === 0 ? (
          <p>No hay información por mostrar...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fotografía</th>
                <th>Nombre</th>
                <th>Especie</th>
                <th>Casa</th>
                <th>Patronus</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredCharacters.map((character) => (
                !character.hidden &&
                    <tr key={character.id}>
                      <td>
                        <img
                          src={character.image || "https://via.placeholder.com/100"}
                          alt="Character"
                          width="100"
                          height="100"
                        />
                      </td>
                      <td>{character.name || "-----"}</td>
                      <td>{character.species || "-----"}</td>
                      <td>{character.house || "-----"}</td>
                      <td>{character.patronus || "-----"}</td>
                      <td>
                        <button
                          onClick={() => handleHideCharacter(character.id)}
                        >
                          Ocultar
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;