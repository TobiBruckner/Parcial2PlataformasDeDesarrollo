import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Leer usuarios existentes o crear un arreglo vacío
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el correo ya existe
    if (users.find(u => u.email === email)) {
      setError('El correo ya se encuentra registrado.');
      return;
    }

    // Guardar nuevo usuario
    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registro exitoso. Por favor inicia sesión.');
    navigate('/login');
  };

  return (
    <div className="main-content">
      <div className="auth-box">
        <h2>Crear Cuenta</h2>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleRegister}>
          <label>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn">Registrarme</button>
        </form>
        <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}