import { useState } from 'react';

const initialForm = { name: '', email: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future this can call a backend endpoint or email service.
    setStatus('Thanks! Kannan will reply soon.');
    setForm(initialForm);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-card lg:grid-cols-2">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-blue">Get in touch</p>
          <h1 className="mt-2 text-4xl font-bold text-brand-black">Send Kannan a message</h1>
          <p className="mt-3 text-slate-600">
            Have a question, custom idea, or want to collaborate on a school project? Fill out the form and Kannan will
            email you back with next steps.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="text-sm font-semibold text-brand-black">
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="Your name"
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="you@email.com"
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="mt-2 min-h-[140px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                placeholder="Tell us about your idea..."
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-navy"
            >
              Send message
            </button>
            {status && <p className="text-sm font-semibold text-green-600">{status}</p>}
          </form>
        </section>

        <section className="space-y-5 rounded-3xl border border-slate-100 bg-brand-light/60 p-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500">Email</p>
            <p className="text-lg font-semibold text-brand-black">contact@k3dprints.com</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500">Phone</p>
            <p className="text-lg font-semibold text-brand-black">+1 (555) 123-4567</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-500">Location</p>
            <p className="text-lg font-semibold text-brand-black">Kannan’s Home Workshop</p>
            <p className="text-sm text-slate-500">Serving custom 3D printing projects worldwide.</p>
          </div>
          <div className="rounded-2xl bg-brand-blue/10 p-4">
            <p className="text-sm font-semibold text-brand-blue">Custom orders welcome!</p>
            <p className="text-sm text-brand-navy">
              Send reference photos or sketches and Kannan can quote painting, assembly, and shipping.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

