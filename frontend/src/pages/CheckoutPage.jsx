import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import client from '../api/http';

const initialShipping = {
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  cardNumber: '',
};

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState(initialShipping);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const item = location.state?.item;

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!item) {
      navigate('/catalog');
      return;
    }
    setSubmitting(true);
    try {
      await client.post('/orders', {
        items: [{ itemId: item._id, quantity: 1 }],
        shipping,
        notes,
      });
      navigate('/orders', { state: { success: 'Request sent to producer!' } });
    } catch (error) {
      setSubmitting(false);
    }
  };

  if (!item) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-lg text-slate-600">Select an item first.</p>
        <button
          type="button"
          onClick={() => navigate('/catalog')}
          className="rounded-full bg-brand-blue px-6 py-2 text-sm font-semibold text-white"
        >
          Back to catalog
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Checkout</p>
        <h1 className="text-4xl font-bold text-brand-black">Tell us where to ship your magic.</h1>
        <p className="text-slate-600">
          We’ll email you once the producer reviews your request with the final price.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <aside className="rounded-3xl bg-white p-6 shadow-card">
          <h2 className="text-2xl font-bold text-brand-black">{item.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          <div className="mt-6 rounded-2xl bg-brand-light p-4 text-sm text-slate-600">
            <p>Need a custom color or size? Add it under “Notes for the creator”.</p>
            <p className="mt-2 font-semibold text-brand-blue">Card number is only used for the last 4 digits.</p>
          </div>
        </aside>

        <form className="space-y-6 rounded-3xl bg-white p-6 shadow-card" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.keys(initialShipping).map((field) => (
              <label key={field} className={`text-sm font-semibold text-brand-black ${field === 'addressLine2' ? 'sm:col-span-2' : ''}`}>
                {field.replace(/([A-Z])/g, ' $1')}
                <input
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
                  type={field.includes('email') ? 'email' : 'text'}
                  name={field}
                  value={shipping[field]}
                  onChange={handleChange}
                  required={field !== 'addressLine2'}
                />
              </label>
            ))}
          </div>
          <label className="text-sm font-semibold text-brand-black">
            Notes for the creator
            <textarea
              className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-blue focus:outline-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-brand-blue py-3 text-base font-semibold text-white hover:bg-brand-navy disabled:opacity-60"
          >
            {submitting ? 'Sending...' : 'Send to producer'}
          </button>
        </form>
      </div>
    </div>
  );
}

