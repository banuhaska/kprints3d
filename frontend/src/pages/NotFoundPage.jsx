import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-5xl font-bold text-brand-black">Oops!</h1>
      <p className="text-slate-600">We couldn’t find that page. Maybe try the catalog or home page?</p>
      <div className="flex gap-3">
        <Link className="rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white" to="/">
          Home
        </Link>
        <Link className="rounded-full border border-brand-blue px-5 py-2 text-sm font-semibold text-brand-blue" to="/catalog">
          Catalog
        </Link>
      </div>
    </div>
  );
}

