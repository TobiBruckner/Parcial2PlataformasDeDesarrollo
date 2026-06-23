import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Biblioteca() {
  const [libros, setLibros] = useState([]);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoComentario, setTextoComentario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
      return;
    }
    const { email } = JSON.parse(user);
    const guardados = JSON.parse(localStorage.getItem(`biblioteca_${email}`)) || [];
    setLibros(guardados);
  }, [navigate]);

  const guardarEnStorage = (actualizados) => {
    const { email } = JSON.parse(localStorage.getItem('currentUser'));
    localStorage.setItem(`biblioteca_${email}`, JSON.stringify(actualizados));
    setLibros(actualizados);
  };

  const eliminarLibro = (id) => {
    const actualizados = libros.filter((libro) => libro.id !== id);
    guardarEnStorage(actualizados);
  };

  const abrirComentario = (libro) => {
    setComentarioEditando(libro.id);
    setTextoComentario(libro.comentario || '');
  };

  const guardarComentario = (id) => {
    const actualizados = libros.map((libro) =>
      libro.id === id ? { ...libro, comentario: textoComentario } : libro
    );
    guardarEnStorage(actualizados);
    setComentarioEditando(null);
    setTextoComentario('');
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
            <Link to="/search">Buscar libros</Link>
            <span>{currentUser.email}</span>
            <button onClick={handleLogout} className="btn" style={{ backgroundColor: '#e74c3c' }}>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <h2>Mi Biblioteca</h2>

        {libros.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
            <p>Todavía no agregaste ningún libro.</p>
            <Link to="/search">
              <button className="btn">Buscar libros</button>
            </Link>
          </div>
        ) : (
          <div className="book-grid">
            {libros.map((libro) => (
              <div key={libro.id} className="book-card">
                <img
                  src={libro.imagen}
                  alt="Portada"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', marginBottom: '10px' }}
                />
                <strong style={{ display: 'block', marginBottom: '5px' }}>{libro.titulo}</strong>
                <span style={{ color: '#666', fontSize: '14px' }}>{libro.autores}</span>

                {/* Sección de comentario */}
                <div className="comment-box" style={{ marginTop: '12px' }}>
                  {comentarioEditando === libro.id ? (
                    <>
                      <textarea
                        value={textoComentario}
                        onChange={(e) => setTextoComentario(e.target.value)}
                        placeholder="Escribí tu comentario..."
                        style={{ width: '100%', height: '80px', boxSizing: 'border-box', marginBottom: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-success" onClick={() => guardarComentario(libro.id)}>
                          Guardar
                        </button>
                        <button onClick={() => setComentarioEditando(null)} style={{ backgroundColor: '#95a5a6' }}>
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {libro.comentario ? (
                        <p style={{ fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                          💬 {libro.comentario}
                        </p>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '8px' }}>Sin comentario</p>
                      )}
                      <button className="btn" onClick={() => abrirComentario(libro)} style={{ width: '100%' }}>
                        {libro.comentario ? 'Editar comentario' : 'Agregar comentario'}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={() => eliminarLibro(libro.id)}
                  style={{ marginTop: '8px', width: '100%', backgroundColor: '#e74c3c' }}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
