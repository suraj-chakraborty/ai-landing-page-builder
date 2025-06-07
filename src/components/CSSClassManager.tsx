import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface CSSClassManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyClass: (className: string, isChild: boolean, childIndex?: number) => void;
  isChild: boolean;
  childIndex?: number;
  currentAppliedClass?: string | null;
}

const CSSClassManager: React.FC<CSSClassManagerProps> = ({
  isOpen,
  onClose,
  onApplyClass,
  isChild,
  childIndex,
  currentAppliedClass
}) => {
  const [cssClassName, setCssClassName] = useState("");
  const [cssProperties, setCssProperties] = useState("");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [isEditingCSSClass, setIsEditingCSSClass] = useState(false);

  useEffect(() => {
    const savedClasses = localStorage.getItem("cssClasses");
    if (savedClasses) {
      setAvailableClasses(JSON.parse(savedClasses));
    }
  }, []);

  useEffect(() => {
    let styleTag = document.getElementById('css-classes-style') as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'css-classes-style';
      document.head.appendChild(styleTag);
    }

    const cssContent = availableClasses.map(className => {
      const cssProps = localStorage.getItem(`css_${className}`);
      if (!cssProps) return '';
      return `.${className} { ${cssProps} }`;
    }).join('\n');

    styleTag.textContent = cssContent;
  }, [availableClasses]);

  const handleSaveCSSClass = () => {
    try {
      if (!cssClassName.trim() || !cssProperties.trim()) {
        alert("Please enter both class name and CSS properties");
        return;
      }

      const formattedCSS = cssProperties
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => line.endsWith(';') ? line : `${line};`)
        .join('\n');

      if (!availableClasses.includes(cssClassName)) {
        const newClasses = [...availableClasses, cssClassName];
        setAvailableClasses(newClasses);
        localStorage.setItem("cssClasses", JSON.stringify(newClasses));
      }
      
      localStorage.setItem(`css_${cssClassName}`, formattedCSS);
      onApplyClass(cssClassName, isChild, childIndex);
      
      onClose();
    } catch (error) {
      console.error("Error saving CSS class:", error);
      alert("Error saving CSS class. Please try again.");
    }
  };

  const handleDeleteCSSClass = (className: string) => {
    if (window.confirm(`Are you sure you want to delete the CSS class "${className}"?`)) {
      const newClasses = availableClasses.filter(c => c !== className);
      setAvailableClasses(newClasses);
      localStorage.setItem("cssClasses", JSON.stringify(newClasses));
      localStorage.removeItem(`css_${className}`);
    }
  };

  const handleEditCSSClass = (className: string) => {
    const cssProps = localStorage.getItem(`css_${className}`);
    if (cssProps) {
      setCssClassName(className);
      setCssProperties(cssProps);
      setIsEditingCSSClass(true);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CSS Class Management"
    >
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {isEditingCSSClass ? `Edit CSS Class: ${cssClassName}` : "Create New CSS Class"}
          </h3>
          <div className="text-sm text-gray-600 mb-2">
            {isChild ? `Editing CSS for Child Component ${childIndex! + 1}` : "Editing CSS for Parent Component"}
          </div>
          {currentAppliedClass && (
            <div className="text-sm text-green-600 mb-2">
              Currently Applied Class: {currentAppliedClass}
            </div>
          )}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Class Name"
              value={cssClassName}
              onChange={(e) => setCssClassName(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={isEditingCSSClass}
            />
            <textarea
              placeholder="CSS Properties (one per line)"
              value={cssProperties}
              onChange={(e) => setCssProperties(e.target.value)}
              className="w-full p-2 border rounded-md h-32 font-mono"
            />
            <div className="text-sm text-gray-500">
              Example:
              background-color: #f0f0f0;
              padding: 1rem;
              border-radius: 8px;
            </div>
            <button
              onClick={handleSaveCSSClass}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {isEditingCSSClass ? "Update Class" : "Save & Apply Class"}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Available Classes</h3>
          <div className="space-y-2">
            {availableClasses.map((className) => (
              <div key={className} className="flex items-center gap-2 p-2 border rounded-md">
                <span className="flex-1">{className}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditCSSClass(className)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCSSClass(className)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      onApplyClass(className, isChild, childIndex);
                      onClose();
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CSSClassManager; 