import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import client from '../api/http';

const initialItem = { title: '', description: '', price: '', imageUrl: '' };
const defaultMediaRow = { url: '', type: 'image' };

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState(initialItem);
  const [mediaRows, setMediaRows] = useState([defaultMediaRow]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadData = async () => {
    const [itemsRes, ordersRes] = await Promise.all([client.get('/items'), client.get('/orders')]);
    setItems(itemsRes.data);
    setOrders(ordersRes.data);
  };

  useEffect(() => {
    loadData()
      .catch(() => setMessage('Unable to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.state?.editItem) {
      handleEdit(location.state.editItem);
      navigate('.', { replace: true, state: null });
    }
  }, [location.state, navigate]);

  const handleSaveItem = async (event) => {
    event.preventDefault();
    try {
      const filteredMedia = mediaRows.filter((row) => row.url.trim());
      const payload = {
        ...newItem,
        price: Number(newItem.price),
        media: filteredMedia,
        imageUrl: filteredMedia.find((entry) => entry.type === 'image')?.url || newItem.imageUrl,
      };

      if (editingId) {
        await client.put(`/items/${editingId}`, payload);
        setMessage('Item updated!');
      } else {
        await client.post('/items', payload);
        setMessage('Item added!');
      }
      setNewItem(initialItem);
      setMediaRows([defaultMediaRow]);
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      title: item.title,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    setMediaRows(
      item.media?.length
        ? item.media.map((entry) => ({ url: entry.url, type: entry.type }))
        : item.imageUrl
          ? [{ url: item.imageUrl, type: 'image' }]
          : [defaultMediaRow],
    );
    setEditingId(item._id);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this catalog item?')) return;
    await client.delete(`/items/${itemId}`);
    setMessage('Item removed.');
    loadData();
  };

  const handlePrice = async (orderId, priceQuote) => {
    await client.patch(`/orders/${orderId}/price`, { priceQuote });
    loadData();
  };

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-500">Loading admin tools…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Producer</p>
        <h1 className="text-4xl font-bold text-brand-black">Manage products & review requests</h1>
      </div>
      {message && (
        <p className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</p>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-black">Upload or update a design</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSaveItem}>
            <label className="text-sm font-semibold text-brand-black">
              Title
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                required
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Price
              <input
                type="number"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                required
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Description
              <textarea
                className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </label>
            <label className="text-sm font-semibold text-brand-black">
              Image URL
              <input
                type="url"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
              />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="flex-1 rounded-full bg-brand-blue py-3 text-sm font-semibold text-white hover:bg-brand-navy"
              >
                {editingId ? 'Update design' : 'Save design'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewItem(initialItem);
                    setMediaRows([defaultMediaRow]);
                  }}
                  className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-brand-black"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-black">Media gallery</p>
                <button
                  type="button"
                  onClick={() => setMediaRows([...mediaRows, defaultMediaRow])}
                  className="text-sm font-semibold text-brand-blue"
                >
                  + Add media
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">Add direct image or video links (YouTube MP4, etc.).</p>
              <div className="mt-4 space-y-3">
                {mediaRows.map((row, index) => (
                  <div
                    key={`${index}-${row.url}`}
                    className="grid gap-2 rounded-2xl border border-slate-100 p-3 sm:grid-cols-[1fr_120px_auto]"
                  >
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={row.url}
                      onChange={(e) => {
                        const next = [...mediaRows];
                        next[index] = { ...next[index], url: e.target.value };
                        setMediaRows(next);
                      }}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    />
                    <select
                      value={row.type}
                      onChange={(e) => {
                        const next = [...mediaRows];
                        next[index] = { ...next[index], type: e.target.value };
                        setMediaRows(next);
                      }}
                      className="rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-blue focus:outline-none"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setMediaRows(mediaRows.filter((_, i) => i !== index))}
                      className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                      disabled={mediaRows.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-brand-black">Current catalog</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-brand-light/60 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-brand-black">
                      {item.title}{' '}
                      {editingId === item._id && (
                        <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs text-brand-blue">editing</span>
                      )}
                    </p>
                    <p>${item.price?.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="rounded-full border border-brand-blue px-3 py-1 text-xs font-semibold text-brand-blue"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!items.length && <p>No items yet. Add your first one above.</p>}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-brand-black">Incoming requests</h2>
          <div className="mt-6 space-y-4">
            {orders
              .filter((order) => order.status === 'awaiting-price' || order.status === 'priced')
              .map((order) => (
                <article key={order._id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <p>
                      Request from <span className="font-semibold text-brand-black">{order.customer?.name}</span>
                    </p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ul className="mt-3 text-sm text-slate-500">
                    {order.items.map((entry) => (
                      <li key={entry._id}>• {entry.item?.title}</li>
                    ))}
                  </ul>
                  {order.status === 'awaiting-price' ? (
                    <PriceForm orderId={order._id} onSubmit={handlePrice} />
                  ) : (
                    <p className="mt-3 text-sm font-semibold text-brand-blue">
                      Price sent: ${order.priceQuote.toFixed(2)}
                    </p>
                  )}
                </article>
              ))}
            {!orders.some((o) => o.status === 'awaiting-price' || o.status === 'priced') && (
              <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No pending requests right now.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function PriceForm({ orderId, onSubmit }) {
  const [price, setPrice] = useState('');

  return (
    <form
      className="mt-4 flex gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(orderId, Number(price));
        setPrice('');
      }}
    >
      <input
        type="number"
        placeholder="Price"
        className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-blue focus:outline-none"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button
        type="submit"
        className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy"
      >
        Send price
      </button>
    </form>
  );
}

