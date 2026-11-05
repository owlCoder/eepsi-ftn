"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, FileText, Search, X } from "lucide-react";
import { groupMaterialsByKind, materialKindLabels, materialKinds, type MaterialKind } from "@/domain/content/material-kinds";

type Material = { id: string; title: string; url: string; kind: MaterialKind };

/** Instant local filtering, without reloading the course page. */
export function CourseMaterials({ materials }: { materials: Material[] }) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<MaterialKind | "ALL">("ALL");
  const normalized = search.trim().toLocaleLowerCase("sr-RS");
  const filtered = materials.filter(item =>
    (kind === "ALL" || item.kind === kind) &&
    (!normalized || item.title.toLocaleLowerCase("sr-RS").includes(normalized)),
  );
  const grouped = groupMaterialsByKind(filtered);
  const counts = useMemo(() => new Map(materialKinds.map(item =>
    [item, materials.filter(material => material.kind === item).length] as const)), [materials]);
  const reset = () => { setSearch(""); setKind("ALL"); };

  return (
    <div className="academic-materials">
      <div className="academic-materials-search">
        <Search size={18} aria-hidden="true"/>
        <input id="course-material-search" type="search" aria-label="Pretraži materijale"
          placeholder="Pronađi dokument ili prezentaciju…" value={search}
          onChange={event => setSearch(event.target.value)}/>
        {search && <button type="button" onClick={() => setSearch("")} aria-label="Obriši pretragu materijala">
          <X size={17} aria-hidden="true"/>
        </button>}
      </div>
      <div className="academic-material-filters" role="group" aria-label="Filtriraj materijale po kategoriji">
        <button type="button" onClick={() => setKind("ALL")} aria-pressed={kind === "ALL"}>
          Svi ({materials.length})
        </button>
        {materialKinds.filter(item => counts.get(item)).map(item => (
          <button key={item} type="button" onClick={() => setKind(item)} aria-pressed={kind === item}>
            {materialKindLabels[item]} ({counts.get(item)})
          </button>
        ))}
      </div>
      <p className="academic-material-count" aria-live="polite">Prikazano {filtered.length} od {materials.length} materijala</p>
      {grouped.length ? <div className="academic-material-groups">
        {grouped.map(group => (
          <section key={group.kind} aria-label={group.label}>
            <h3>{group.label}</h3>
            <div className="academic-material-list">
              {group.items.map(material => (
                <a key={material.id} href={material.url} target="_blank" rel="noopener noreferrer">
                  <FileText size={18} aria-hidden="true" className="academic-material-icon"/>
                  <span>{material.title}</span>
                  <ArrowUpRight size={18} aria-hidden="true" className="academic-material-open"/>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div> : <div className="empty-state">
        <p>Nema materijala za izabrane kriterijume.</p>
        <button type="button" onClick={reset} className="academic-text-link">Prikaži sve materijale</button>
      </div>}
      <p className="academic-material-notice">Materijali se otvaraju na eksternim HTTPS stranicama. Proverite izvor pre preuzimanja.</p>
    </div>
  );
}
