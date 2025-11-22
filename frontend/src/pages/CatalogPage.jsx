import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/http';
import { useAuth } from '../context/AuthContext';
import { sampleItems } from '../data/sampleItems';

export default function CatalogPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoomMedia, setZoomMedia] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    client
      .get('/items')
      .then((res) => setItems(res.data))
      .catch(() => setError('Unable to load live catalog. Showing featured items instead.'))
      .finally(() => setLoading(false));
  }, []);

  const handleBuy = (item) => {
    if (!user || user.role === 'guest') {
      navigate('/account', { state: { message: 'Please sign in to continue.' } });
      return;
    }
    navigate('/checkout', { state: { item } });
  };

  const displayItems = items.length ? items : sampleItems;

  const jumpToAdminEdit = (item) => {
    navigate('/admin', { state: { editItem: item } });
  };

  return (
    <>
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Catalog</p>
          <h1 className="text-4xl font-bold text-brand-black">Choose your next 3D print</h1>
          <p className="text-slate-600">
            Order these designs or send custom notes at checkout. We’ll confirm price before printing.
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="rounded-full border border-brand-blue/40 px-5 py-2 text-sm font-semibold text-brand-blue hover:border-brand-blue hover:bg-brand-blue/10"
          >
            + Add new item
          </button>
        )}
        {error && <p className="rounded-full bg-white/70 px-4 py-2 text-sm text-orange-600 shadow">{error}</p>}
      </div>

      {loading ? (
        <p className="mt-10 text-center text-slate-500">Loading items...</p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item) => {
            const media = item.media?.length
              ? item.media
              : item.imageUrl
                ? [{ url: item.imageUrl, type: 'image' }]
                : [];
            return (
            <article
              key={item._id || item.title}
              className="relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
            >
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => jumpToAdminEdit(item)}
                  className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-600 shadow hover:text-brand-blue"
                  aria-label={`Edit ${item.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 012.652 2.652l-9.02 9.02a4.5 4.5 0 01-1.897 1.134l-2.719.78.78-2.72a4.5 4.5 0 011.134-1.896l9.383-9.382z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 7.125L16.875 4.5" />
                  </svg>
                </button>
              )}
              {media.length > 0 && (
                <MediaCarousel
                  media={media}
                  onZoom={(mediaEntry) => setZoomMedia({ ...mediaEntry, title: item.title })}
                />
              )}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div>
                  <h3 className="text-xl font-bold text-brand-black">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </div>
                <p className="text-lg font-semibold text-brand-blue">${item.price?.toFixed(2)}</p>
                <button
                  type="button"
                  className="mt-auto rounded-full bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-navy"
                  onClick={() => handleBuy(item)}
                >
                  Request this print
                </button>
              </div>
            </article>
          )})}
        </div>
      )}
    </div>
  
      {zoomMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomMedia(null)}
          role="presentation"
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <button
              type="button"
              onClick={() => setZoomMedia(null)}
              className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-sm font-semibold text-white"
            >
              Close
            </button>
            {zoomMedia.type === 'video' ? (
              <video
                src={zoomMedia.url}
                className="max-h-[90vh] rounded-2xl border border-white/20"
                controls
                autoPlay
              />
            ) : (
              <img
                src={zoomMedia.url}
                alt={zoomMedia.title}
                className="max-h-[90vh] rounded-2xl border border-white/20 object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MediaCarousel({ media, onZoom }) {
  const [index, setIndex] = useState(0);

  if (!media.length) return null;

  const current = media[index];

  const goPrev = (event) => {
    event.stopPropagation();
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const goNext = (event) => {
    event.stopPropagation();
    setIndex((prev) => (prev + 1) % media.length);
  };

  return (
    <div className="relative mt-6 flex h-72 w-full items-center justify-center bg-slate-50">
      {current.type === 'video' ? (
        <video src={current.url} controls className="max-h-full max-w-full rounded-lg" />
      ) : (
        <button
          type="button"
          onClick={() => onZoom(current)}
          className="group flex h-full w-full items-center justify-center focus:outline-none"
        >
          <img
            src={current.url}
            alt=""
            className="max-h-full max-w-full object-contain transition group-hover:scale-[1.02]"
          />
        </button>
      )}
      {media.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-600 shadow"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-slate-600 shadow"
            aria-label="Next"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            {media.map((_, dotIndex) => (
              <button
                type="button"
                key={dotIndex}
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(dotIndex);
                }}
                className={`h-2 w-2 rounded-full ${dotIndex === index ? 'bg-brand-blue' : 'bg-white/60'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

