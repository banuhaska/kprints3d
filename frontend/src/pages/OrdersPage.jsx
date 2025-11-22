import { useEffect, useState } from 'react';
import client from '../api/http';

const statusLabel = {
  'awaiting-price': {
    text: 'Waiting for producer price',
    badge: 'bg-yellow-100 text-yellow-700',
  },
  priced: {
    text: 'Price ready',
    badge: 'bg-blue-100 text-blue-700',
  },
  accepted: {
    text: 'Accepted',
    badge: 'bg-green-100 text-green-700',
  },
  declined: {
    text: 'Declined',
    badge: 'bg-red-100 text-red-700',
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client
      .get('/orders')
      .then((res) => setOrders(res.data))
      .catch(() => setError('Unable to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = async (orderId, decision) => {
    await client.patch(`/orders/${orderId}/decision`, { decision });
    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, status: decision === 'accept' ? 'accepted' : 'declined' }
          : order,
      ),
    );
  };

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-slate-500">Loading orders…</div>;
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-orange-600">
        {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Orders</p>
        <h1 className="text-4xl font-bold text-brand-black">Track your 3D print journey</h1>
      </div>

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <article key={order._id} className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-lg font-semibold text-brand-black">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <span className={`rounded-full px-4 py-1 text-sm font-semibold ${statusLabel[order.status]?.badge || 'bg-slate-100 text-slate-700'}`}>
                {statusLabel[order.status]?.text}
              </span>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {order.items.map((entry) => (
                <li key={entry._id}>
                  • {entry.item?.title || 'Custom item'} × {entry.quantity}
                </li>
              ))}
            </ul>

            {order.priceQuote && (
              <p className="mt-4 text-sm font-semibold text-brand-blue">
                Producer price: ${order.priceQuote.toFixed(2)}
              </p>
            )}

          {order.status === 'priced' && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleDecision(order._id, 'accept')}
                  className="rounded-full bg-brand-blue px-6 py-2 text-sm font-semibold text-white hover:bg-brand-navy"
                >
                  Accept price
                </button>
                <button
                  type="button"
                  onClick={() => handleDecision(order._id, 'decline')}
                  className="rounded-full border border-slate-300 px-6 py-2 text-sm font-semibold text-brand-black"
                >
                  Decline
                </button>
              </div>
            )}
          </article>
        ))}

        {!orders.length && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center text-slate-500">
            No orders yet. Visit the catalog to start your first print!
          </div>
        )}
      </div>
    </div>
  );
}

