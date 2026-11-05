import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type NewsPreview = {
  id: string; slug: string; title: string; summary: string; publishedAt: Date | null;
};
export type CoursePreview = {
  id: string; slug: string; code: string; title: string; semester: number; studyLevel: string; description: string;
};

export function NewsCard({ item }: { item: NewsPreview }) {
  return (
    <article className="border-b border-[#dce3e9] last:border-b-0">
      <Link href={"/novosti/" + item.slug} className="group grid gap-3 px-5 py-5 hover:bg-[#f5f8fb] sm:grid-cols-[118px_minmax(0,1fr)_20px] sm:gap-5">
        <time className="text-xs font-semibold text-[#556777]" dateTime={item.publishedAt?.toISOString()}>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("sr-RS") : "Obaveštenje"}</time>
        <div>
          <h2 className="text-[17px] font-bold leading-6 text-[#173b63] group-hover:underline">{item.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#556777]">{item.summary}</p>
        </div>
        <ArrowRight size={17} className="hidden text-[#173b63] sm:block" aria-hidden="true"/>
      </Link>
    </article>
  );
}

export function CourseCard({ item }: { item: CoursePreview }) {
  return (
    <article className="border-b border-[#dce3e9] last:border-b-0">
      <Link href={"/predmeti/" + item.slug} className="group grid gap-2 px-5 py-5 hover:bg-[#f5f8fb] sm:grid-cols-[105px_minmax(0,1fr)_145px_20px] sm:gap-5">
        <span className="pt-0.5 text-xs font-bold text-[#556777]">{item.code}</span>
        <div>
          <h2 className="text-[17px] font-bold leading-6 text-[#173b63] group-hover:underline">{item.title}</h2>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#556777]">{item.description}</p>
        </div>
        <span className="text-xs text-[#556777] sm:pt-1">{item.studyLevel} · {item.semester}. semestar</span>
        <ArrowRight size={17} className="hidden text-[#173b63] sm:block" aria-hidden="true"/>
      </Link>
    </article>
  );
}
