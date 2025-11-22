import { Link } from 'react-router-dom';
import { sampleItems } from '../data/sampleItems';

const steps = [
  { title: 'Dream', text: 'Pick a design or send Kannan your own idea.' },
  { title: 'Chat', text: 'We confirm colors, size, and timing with you.' },
  { title: 'Print', text: 'Kannan hand-finishes every piece and ships it.' },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="grid gap-10 rounded-3xl bg-white p-8 shadow-card lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-light px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue">
            <span>Made by Kannan</span>
            <span className="text-[10px] text-slate-500">Kid inventor • 3D Lab</span>
          </div>
          <h1 className="text-4xl font-extrabold text-brand-black sm:text-5xl">
            Welcome to Kannan’s 3D Lab—where dragons, robots, and wild ideas come to life.
          </h1>
          <p className="text-lg text-slate-600">
            Every print is designed, painted, and shipped by 11-year-old maker Kannan. Choose from vibrant ready-to-ship
            toys or team up with him on a custom build for birthdays, cosplay, classrooms, and more.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="rounded-full border border-slate-200 px-4 py-1 font-semibold text-brand-blue">200+ prints crafted</span>
            <span className="rounded-full border border-slate-200 px-4 py-1">STEM club supporter</span>
            <span className="rounded-full border border-slate-200 px-4 py-1">Kid-owned business</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/catalog"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/40 hover:bg-brand-navy"
            >
              Shop catalog
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-brand-blue/40 px-6 py-3 text-sm font-semibold text-brand-blue hover:border-brand-blue hover:bg-brand-blue/10"
            >
              Meet K3D Prints
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-blue/30 via-white to-brand-blue/20 blur-2xl" />
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
            alt="3D printed toys on a desk"
            className="relative rounded-3xl object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mt-16 grid gap-6 rounded-3xl border border-white/60 bg-brand-navy px-6 py-10 text-white sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue">{step.title}</p>
            <p className="text-lg text-white/80">{step.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">Featured</p>
            <h2 className="text-3xl font-bold text-brand-black">Ready-to-print favorites</h2>
          </div>
          <Link
            to="/catalog"
            className="text-sm font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            View full catalog
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {sampleItems.map((item) => (
            <article key={item.title} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <img src={item.imageUrl} alt={item.title} className="h-56 w-full object-cover" />
              <div className="space-y-2 p-5">
                <h3 className="text-xl font-bold text-brand-black">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
                <p className="text-lg font-semibold text-brand-blue">${item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

