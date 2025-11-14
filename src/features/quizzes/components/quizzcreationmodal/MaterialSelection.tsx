import React from "react";
import { MaterialItem } from "./MaterialItem";
import type { Material, Subject } from "../../types/quiz";
import {} from "../../types/quiz";
import { Book } from "lucide-react";

interface MaterialSelectionProps {
  selectedSubject: Subject | null;
  filteredMaterials: Material[];
  selectedMaterials: string[];
  toggleMaterialSelection: (id: string) => void;
  selectAllMaterials: () => void;
  deselectAllMaterials: () => void;
}

export const MaterialSelection: React.FC<MaterialSelectionProps> = ({
  selectedSubject,
  filteredMaterials,
  selectedMaterials,
  toggleMaterialSelection,
  selectAllMaterials,
  deselectAllMaterials,
}) => {
  return (
    <div className="p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <div className="flex items-center gap-3 mb-2">
          {selectedSubject && (
            <div
              className={`px-3 py-1.5 rounded-lg bg-${selectedSubject.color}-600 text-white text-sm font-semibold`}
            >
              {selectedSubject.name}
            </div>
          )}
        </div>
        <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-2">
          Select Study Materials
        </h3>
        <p className="text-sm text-slate-600">
          Choose materials for the AI to generate questions from
        </p>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={selectAllMaterials}
          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
        >
          Select All
        </button>
        <button
          onClick={deselectAllMaterials}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          Clear All
        </button>
        <div className="ml-auto text-xs font-semibold text-slate-600">
          {selectedMaterials.length} selected
        </div>
      </div>
      <div className="space-y-2">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Book className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No materials found</p>
            <p className="text-sm text-slate-500 mt-1">
              Upload materials for {selectedSubject?.name}
            </p>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <MaterialItem
              key={material.id}
              material={material}
              isSelected={selectedMaterials.includes(material.id)}
              onToggle={() => toggleMaterialSelection(material.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
