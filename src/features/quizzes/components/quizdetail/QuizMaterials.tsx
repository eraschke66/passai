import React from "react";
import { Book } from "lucide-react";
import type { MaterialWithSubject } from "../../types/quiz";
import { MaterialCard } from "./MaterialCard";

interface QuizMaterialsProps {
  materials: MaterialWithSubject[];
}

export const QuizMaterials: React.FC<QuizMaterialsProps> = ({ materials }) => {
  return (
    <section className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-base lg:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Book className="w-5 h-5 text-blue-600" />
        Study Materials
      </h2>
      <div className="space-y-2">
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
      <button className="w-full mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-sm">
        View All Materials
      </button>
    </section>
  );
};
