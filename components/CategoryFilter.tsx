"use client";

import { CATEGORIES, Category } from "@/lib/types";

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4 flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => onChange(cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm border-2 transition-all font-medium ${
            active === cat.slug
              ? "bg-primary border-primary text-white"
              : "bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
