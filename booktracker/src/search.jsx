import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [agregados, setAgregados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    const { email } = JSON.parse(user);
    const guardados = JSON.parse(localStorage.getItem(`biblioteca_${email}`)) || [];
    setAgregados(guardados.map((l) => l.id));
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=10`;
      const response = await fetch(url);
      const data = await response.json();
      setResults(data.items || []);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      alert('Error al conectar con el servicio de búsqueda.');
    }
  };

  const agregarLibro = (item) => {
    const { email } = JSON.parse(localStorage.getItem('currentUser'));
    const guardados = JSON.parse(localStorage.getItem(`biblioteca_${email}`)) || [];

    const yaExiste = guardados.find((l) => l.id === item.id);
    if (yaExiste) return;

    const { volumeInfo } = item;
    const nuevoLibro = {
      id: item.id,
      titulo: volumeInfo.title,
      autores: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Anónimo',
      imagen: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=Sin+Portada',
    };

    const actualizados = [...guardados, nuevoLibro];
    localStorage.setItem(`biblioteca_${email}`, JSON.stringify(actualizados));
    setAgregados([...agregados, item.id]);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

  return (
    <div>
      <header>
        <nav className="nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>BookTracker</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/biblioteca">Mi Biblioteca</Link>
            <span>{currentUser.email}</span>
            <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#e74c3c' }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <h2>Buscar Libros</h2>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Escribe el nombre del libro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            className="search-bar"
          />
          <button type="submit" className="btn">Buscar</button>
        </form>

        {results.length > 0 && (
          <div className="search-results" style={{ marginTop: '20px' }}>
            {results.map((item) => {
              const { volumeInfo } = item;
              const imageUrl = volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=Sin+Portada';
              const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Anónimo';
              const yaAgregado = agregados.includes(item.id);

              return (
                <div key={item.id} className="result-item" style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                  <img
                    src={imageUrl}
                    alt="Portada"
                    style={{ width: '80px', height: 'auto', borderRadius: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <strong>{volumeInfo.title}</strong>
                    <br />
                    <span style={{ color: '#666' }}>{authors}</span>
                  </div>
                  <button
                    onClick={() => agregarLibro(item)}
                    disabled={yaAgregado}
                    className="btn-success"
                    style={{ flexShrink: 0, opacity: yaAgregado ? 0.5 : 1, cursor: yaAgregado ? 'default' : 'pointer' }}
                  >
                    {yaAgregado ? '✓ Agregado' : '+ Agregar'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
