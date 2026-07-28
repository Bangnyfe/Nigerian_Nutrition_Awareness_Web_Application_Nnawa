import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // An already-authenticated administrator has no reason to see the login
  // form.
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (email.trim() === '' || password === '') {
      setError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <h1>Administrator Login</h1>

      <form className="login-form card" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        )}

        <label className="form-field">
          <span className="form-field__label">Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-field__label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="button button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
