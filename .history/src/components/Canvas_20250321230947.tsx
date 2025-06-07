import React from "react";
import EditableSection from "@/components/EditableSection";
import { parsePromptToSections } from "@/utils/parsePromptToSections";
import { COMPONENTS } from "@/components/ComponentRegistry";

// Add a function to generate unique IDs
const generateUniqueId = () => {
  return `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface Component {
  type: keyof typeof COMPONENTS;
  library: 'Chakra' | 'Mui' | 'Antd';
  label: string;
}

interface Section {
  id: string;
  type: string;
  library: string;
  props: any;
  children: any[];
}

interface CanvasProps {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  onUpdateSection: (index: number, props: any) => void;
  isPreview?: boolean;
}

const Canvas = ({ sections, setSections, onUpdateSection, isPreview = false }: CanvasProps) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (isPreview) return;
    e.preventDefault();

    const data = e.dataTransfer.getData("component");
    if (!data) return;

    const newComponent = JSON.parse(data) as Component;
    console.log("New Component Dropped:", newComponent.label);

    if (!newComponent.label) {
      console.error("Component label is missing.");
      return;
    }

    const parsedSections = parsePromptToSections(newComponent.label.toLowerCase());
    const defaultProps = parsedSections.length > 0 ? parsedSections[0].props : {};

    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const overlappingIndex = sections.findIndex((section: Section) => {
      const sectionRect = document
        .getElementById(`section-${section.id}`)
        ?.getBoundingClientRect();
      return (
        sectionRect &&
        dropX > sectionRect.left - rect.left &&
        dropX < sectionRect.right - rect.left &&
        dropY > sectionRect.top - rect.top &&
        dropY < sectionRect.bottom - rect.top
      );
    });

    setSections((prev: Section[]) => {
      if (overlappingIndex !== -1) {
        const updatedSections = prev.map((section: Section, index: number) =>
          index === overlappingIndex
            ? {
                ...section,
                children: [
                  ...(section.children || []),
                  { ...newComponent, props: { ...defaultProps } },
                ],
              }
            : section
        );

        return updatedSections;
      } else {
        const ComponentLibrary = COMPONENTS[newComponent.type]?.[newComponent.library];

        if (!ComponentLibrary) {
          console.error("Component or library not found for:", newComponent);
          return prev;
        }

        return [
          ...prev,
          {
            id: generateUniqueId(),
            type: newComponent.type,
            library: newComponent.library,
            props: { ...defaultProps },
            children: [],
          },
        ];
      }
    });
  };

  return (
    <div className={`flex-1 overflow-auto bg-white dark:bg-gray-900 ${isPreview ? 'pt-16' : ''}`}>
      <div
        className="min-h-screen w-full overflow-auto flex flex-col"
        onDragOver={(e) => !isPreview && e.preventDefault()}
        onDrop={handleDrop}
      >
        {sections.length === 0 && !isPreview && (
          <div className="flex w-full h-full items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-xl">
              Drag and drop components here
            </p>
          </div>
        )}
        {sections.map((section: Section, index: number) => (
          <EditableSection
            key={section.id}
            section={section}
            index={index}
            setSections={setSections}
            onUpdateSection={(index, props) => {
              setSections((prev) =>
                prev.map((s, i) =>
                  i === index ? { ...s, props } : s
                )
              );
            }}
            isPreview={isPreview}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;