const highlights = [
  { label: 'Kid founder', value: 'Kannan, 11 y/o dreamer' },
  { label: 'Turnaround', value: '3-5 business days' },
  { label: 'Planet friendly', value: 'PLA + recycled packing' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-blue">Our story</p>
          <h1 className="text-4xl font-extrabold text-brand-black">
            K3D Prints started as a hobby and became a mini maker studio.
          </h1>
          <p className="text-lg text-slate-600">
            Hi! I’m Kannan, a middle-school kid who loves 3D printing dragons, robots, and anything people
            can imagine. Every order is printed on my Prusa printer, sanded, painted, and shipped with a handwritten note.
          </p>
          <p className="text-lg text-slate-600">
            I created this site so friends, family, and new customers can submit ideas, order ready-made
            designs, and support a young maker learning business skills along the way.
          </p>
        </div>
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <h2 className="text-2xl font-bold text-brand-black">Why shop with us?</h2>
          <ul className="mt-6 space-y-4 text-slate-600">
            <li>• Fully custom paint jobs and sizing.</li>
            <li>• Safe, family-friendly checkout (PayPal coming soon).</li>
            <li>• Direct chat with the maker for updates and approvals.</li>
            <li>• Portion of every sale goes to STEM clubs at school.</li>
          </ul>
          <div className="mt-8 grid gap-4 rounded-2xl bg-brand-navy/95 p-6 text-white sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-widest text-white/70">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

