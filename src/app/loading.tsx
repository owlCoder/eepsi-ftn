export default function Loading() {
  return (
    <div className="container-page py-12 md:py-16" role="status" aria-label="Učitavanje stranice">
      <p className="mb-5 text-sm font-semibold text-[#556777]">Učitavanje sadržaja…</p>
      <div className="h-8 max-w-xl animate-pulse rounded-md bg-[#dce3e9]"/>
      <div className="mt-4 h-4 max-w-2xl animate-pulse rounded bg-[#e6ebef]"/>
      <div className="mt-8 overflow-hidden rounded-lg border border-[#dce3e9] bg-white">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="flex gap-5 border-b border-[#dce3e9] p-5 last:border-b-0">
          <div className="h-4 w-20 shrink-0 animate-pulse rounded bg-[#e6ebef]"/>
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-[#e6ebef]"/>
        </div>)}
      </div>
    </div>
  );
}
