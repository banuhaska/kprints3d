import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', email: '', password: '' };

export default function SignInPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, skip, error, setError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate('/catalog');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    skip();
    navigate('/catalog');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light/60 px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 rounded-3xl bg-white p-8 shadow-card lg:grid-cols-2">
        <section className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-blue">Account</p>
          <h1 className="text-4xl font-bold text-brand-black">Sign in to unlock orders & tracking.</h1>
          <p className="text-slate-600">
            Create an account to save your address, check order statuses, and get price updates instantly.
          </p>
          <div className="rounded-2xl border border-brand-blue/30 bg-brand-light/80 p-4 text-sm text-slate-600">
            {location.state?.message || 'You can also “Skip for now” to browse as a guest.'}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 backdrop-blur">
          <div className="flex gap-2 rounded-full bg-slate-100 p-1 text-sm font-semibold text-slate-500">
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-2 ${mode === 'login' ? 'bg-brand-blue text-white' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Log in
            </button>
            <button
              type="button"
              className={`flex-1 rounded-full px-4 py-2 ${mode === 'signup' ? 'bg-brand-blue text-white' : ''}`}
              onClick={() => {
                setMode('signup');
                setError('');
              }}
            >
              Sign up
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="text-sm font-semibold text-brand-black">
                Name
                <input
                  type="text"
                  name="name"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>
            )}
            <label className="text-sm font-semibold text-brand-black">
              Email
              <input
                type="email"
                name="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Password
              <input
                type="password"
                name="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </label>

            {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-navy disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleSkip}
            className="mt-4 block w-full text-center text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            Skip for now
          </button>
        </section>
      </div>
    </div>
  );
}

