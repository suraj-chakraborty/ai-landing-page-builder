import React from "react";
import { COMPONENTS } from "@/components/ComponentRegistry";
import { console } from "inspector";

interface Component {
  type: keyof typeof COMPONENTS;
  library: 'Chakra' | 'Mui' | 'Antd' | 'Tailwind';
  label: string;
}

interface SidebarProps {
  onComponentClick?: (component: Component) => void;
}

const Sidebar = ({ onComponentClick }: SidebarProps) => {
  const handleComponentClick = (component: Component) => {
    if (onComponentClick) {
      onComponentClick(component);
    }
  };

  // Assuming COMPONENTS is an object like { Hero: { Chakra: ..., Mui: ..., ... }, ... }
  const availableComponents: Component[] = Object.entries(COMPONENTS).flatMap(
    ([type, libraries]) =>
      Object.entries(libraries).map(([library, componentDef]) => ({
        type: type as keyof typeof COMPONENTS,
        library: library as Component["library"],
        label: `${type} (${library})`,
      }))
  );
  console.log("Available Components:", availableComponents);

  return (
    <aside className="w-64 h-screen sticky top-0 bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Available Components</h2>
      <div className="space-y-2">
        {availableComponents.map((component) => (
          <div
            key={`${component.type}-${component.library}`}
            className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("component", JSON.stringify(component));
            }}
            onClick={() => handleComponentClick(component)}
          >
            <div className="font-medium text-gray-900 dark:text-white">
              {component.label}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {component.library}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
