"use client";

import { useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { groupMaterialsByKind, materialKindLabels, materialKinds, type MaterialKind } from "@/domain/content/material-kinds";

type Material = { id: string; title: string; url: string; kind: MaterialKind };

/** Fast, local filtering; changing a filter never reloads the course page. */
export function CourseMaterials({ materials }: { materials: Material[] }) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<MaterialKind | "ALL">("ALL");
  const normalized = search.trim().toLocaleLowerCase("sr-RS");
  const filtered = materials.filter((item) =>
    (kind === "ALL" || item.kind === kind) &&
    (!normalized || item.title.toLocaleLowerCase("sr-RS").includes(normalized)),
  );
  const grouped = groupMaterialsByKind(filtered);
  const counts = new Map(materialKinds.map((item) => [item, materials.filter((material) => material.kind === item).length] as const));
  const reset = () => { setSearch(""); setKind("ALL"); };

  return <div className="mt-6">
    <div className="relative">
      <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
      <input type="search" id="course-material-search" aria-label="Pretraži materijale"
        placeholder="Pronađi prezentaciju, vežbu ili dokument…"
        value={search} onChange={(event) => setSearch(event.target.value)}
        className="input-field !pl-11 !pr-12"/>
      {search && <button type="button" onClick={() => setSearch("")}
        className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
        aria-label="Obriši pretragu materijala"><X size={17}/></button>}
    </div>
    <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filtriraj materijale po kategoriji">
      <button type="button" onClick={() => setKind("ALL")}
        aria-pressed={kind === "ALL"}
        className={"material-filter " + (kind === "ALL" ? "material-filter-active" : "")}>
        Svi <span className="opacity-70">({materials.length})</span>
      </button>
      {materialKinds.filter((item) => counts.get(item)).map((item) =>
        <button type="button" key={item} onClick={() => setKind(item)}
          aria-pressed={kind === item} className={"material-filter " + (kind === item ? "material-filter-active" : "")}>
          {materialKindLabels[item]} <span className="opacity-70">({counts.get(item)})</span>
        </button>)}
    </div>
    <p className="mt-4 text-xs font-semibold text-slate-500" aria-live="polite">
      Prikazano {filtered.length} od {materials.length} materijala
    </p>
    {grouped.length ? <div className="mt-6 space-y-7">{grouped.map((group) =>
      <section key={group.kind} aria-label={group.label}>
        <h3 className="mb-1 text-lg font-extrabold tracking-tight">{group.label}</h3>
        <div className="divide-y divide-slate-100">{group.items.map((material) =>
          <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer"
            className="group flex min-h-14 items-center justify-between gap-4 py-4 text-sm font-semibold text-[#164f58] hover:text-teal-700">
            <span className="min-w-0 break-words">{material.title}</span>
            <ArrowUpRight size={18} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
          </a>)}</div>
      </section>)}</div>
      : <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
        <p className="font-semibold text-slate-700">Nema materijala za izabrane kriterijume.</p>
        <button type="button" onClick={reset} className="mt-3 min-h-10 text-sm font-bold text-teal-700 underline">
          Prikaži sve materijale
        </button>
      </div>}
    <p className="mt-8 border-t border-slate-100 pt-5 text-xs leading-6 text-slate-500">
      Materijali se otvaraju na eksternim HTTPS stranicama. Proverite izvor pre preuzimanja datoteka.
    </p>
  </div>;
}
