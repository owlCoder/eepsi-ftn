export default function Loading() {
  return (
    <div className="container-page py-18" role="status" aria-label="Učitavanje stranice">
      <div className="h-4 w-32 animate-pulse rounded-lg bg-teal-200"/>
      <div className="mt-6 h-10 max-w-3xl animate-pulse rounded-lg bg-slate-200"/>
      <div className="mt-4 h-5 max-w-xl animate-pulse rounded-lg bg-slate-100"/>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => <div key={i} className="card-surface h-54 animate-pulse bg-white"/>)}
      </div>
      <span className="sr-only">Učitavanje…</span>
    </div>
  );
}
