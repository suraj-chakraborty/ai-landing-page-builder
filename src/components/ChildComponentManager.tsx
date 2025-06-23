import React from 'react';
import { Rnd } from 'react-rnd';
import { COMPONENTS } from '@/components/ComponentRegistry';

interface ChildComponent {
  type: string;
  library: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
  appliedCSSClass?: string;
}

interface ChildComponentManagerProps {
  children: ChildComponent[];
  sectionId: string;
  sectionLayoutType: string;
  isPreview: boolean;
  editingChildIndex: number | null;
  resizingChildIndex: number | null;
  onEditChild: (index: number) => void;
  onToggleChildResizable: (index: number) => void;
  onRemoveChild: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChildResizeStop: (index: number, e: any, direction: any, ref: any, delta: any, position: any) => void;
  onOpenCSSModal: (index: number, appliedClass: string | null) => void;
}

const ChildComponentManager: React.FC<ChildComponentManagerProps> = ({
  children,
  sectionId,
  sectionLayoutType,
  isPreview,
//   editingChildIndex,
  resizingChildIndex,
  onEditChild,
  onToggleChildResizable,
  onRemoveChild,
  onChildResizeStop,
  onOpenCSSModal
}) => {
  const getLayoutClasses = (layout: string) => {
    switch (layout) {
      case "flex":
        return "flex flex-wrap gap-4";
      case "flex-row":
        return "flex flex-row gap-4";
      case "flex-col":
        return "flex flex-col gap-4";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4";
      default:
        return "flex flex-wrap gap-4";
    }
  };

  return (
    <div className={getLayoutClasses(sectionLayoutType)}>
      {children.map((child, childIndex) => {
        const ChildComponent = COMPONENTS[child.type as keyof typeof COMPONENTS]?.[child.library as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]];
        
        if (!ChildComponent) {
          console.error(`Child component not found for type '${child.type}' and library '${child.library}'`);
          return null;
        }

        const childContent = (
          <div 
            key={`${sectionId}-child-${childIndex}-${child.type}-${child.library}`}
            className={`relative group ${!isPreview ? 'hover:border hover:border-gray-200 rounded-md p-2' : ''} ${child.props.className || ''}`}
            style={{
              display: child.props.style?.display || 'flex',
              flexDirection: child.props.style?.flexDirection || 'column',
              width: child.props.style?.width || "100%",
              height: child.props.style?.height || "auto",
              gap: '1rem'
            }}
          >
            <ChildComponent {...child.props} />
            {!isPreview && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                <button
                  onClick={() => onEditChild(childIndex)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleChildResizable(childIndex)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  {resizingChildIndex === childIndex ? "Fix Size" : "Resize"}
                </button>
                <button
                  onClick={() => onRemoveChild(childIndex)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Remove
                </button>
                <button
                  onClick={() => onOpenCSSModal(childIndex, child.appliedCSSClass || null)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                >
                  CSS
                </button>
              </div>
            )}
            {!isPreview && child.appliedCSSClass && (
              <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                {child.appliedCSSClass}
              </div>
            )}
          </div>
        );

        return !isPreview && resizingChildIndex === childIndex ? (
          <Rnd
            key={`${sectionId}-child-${childIndex}-${child.type}-${child.library}-rnd`}
            default={{
              x: 0,
              y: 0,
              width: child.props.style?.width || "100%",
              height: child.props.style?.height || "auto",
            }}
            onResizeStop={(e, direction, ref, delta, position) => 
              onChildResizeStop(childIndex, e, direction, ref, delta, position)
            }
          >
            {childContent}
          </Rnd>
        ) : (
          childContent
        );
      })}
    </div>
  );
};

export default ChildComponentManager; 