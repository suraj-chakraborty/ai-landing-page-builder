/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import EditableProperties from "./EditableProperties";
// import ChildComponentsEditor from "./ChildComponentsEditor";
// import CustomCSSEditor from "./CustomCSSEditor";
import { COMPONENTS } from "@/components/ComponentRegistry";
// import EditableComponent from "./EditableComponent";
import { Rnd } from "react-rnd";
import  Modal  from "./Modal";

interface Section {
  id: string;
  type: string;
  library: string;
  props: object | any; 
  children: Section[];
  customCSS?: string;
  customClassName?: string;
  customChildCSS?: object;
  childClassNames?: string;
  layoutType?: 'flex' | 'grid' | 'flex-row' | 'flex-col';
  position?: { x: number; y: number };
  width?: string | number;
  height?: string | number;
}


type ChildComponent = {
  type: string;
  library: string;
  props: Section["props"];
};
interface EditableSectionProps {
  section: Section;
  index: number;
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  onUpdateSection: (index: number, props: object) => void;
  isPreview?: boolean;
}

const EditableSection = ({
  section,
  index,
  setSections,
  onUpdateSection,
  isPreview = false
}: EditableSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomCSSModalOpen, setIsCustomCSSModalOpen] = useState(false);
  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);
  const [editingChildIndex, setEditingChildIndex] = useState<number | null>(null);
  const [resizingChildIndex, setResizingChildIndex] = useState<number | null>(null);
  const [editedProps, setEditedProps] = useState(section.props);
  const [selectedLibrary, setSelectedLibrary] = useState(section.library);
  const [customCSS, setCustomCSS] = useState<string>(
    JSON.stringify(section.customCSS || {}, null, 2)
  );
  const [customClassName, setCustomClassName] = useState<string>(section.customClassName || "");
  const [editingError, setEditingError] = useState<string | null>(null);
  const [childProps, setChildProps] = useState<string | any >({
    childCSS: section.customChildCSS || {},
    childClassNames: section.childClassNames || {},
  });
  const [sectionLayoutType, setSectionLayoutType] = useState<Section["layoutType"]>(section.layoutType || "flex");
  const [childLayoutType, setChildLayoutType] = useState<string>("flex-col");
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const [isCSSModalOpen, setIsCSSModalOpen] = useState(false);
  const [cssClassName, setCssClassName] = useState("");
  const [cssProperties, setCssProperties] = useState("");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [isEditingCSSClass, setIsEditingCSSClass] = useState(false);
  const [appliedCSSClass, setAppliedCSSClass] = useState<string | null>(null);
  const Component = COMPONENTS[section.type as keyof typeof COMPONENTS]?.[selectedLibrary as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]];
  const childrenCount = section.children?.length || 0;
  const mainWidth = `${100 / (childrenCount + 1)}%`;

  // Inject parent custom CSS
  useEffect(() => {
    try {
      const parsedCSS = JSON.parse(customCSS || "{}"); // Validate and parse JSON
      const parentStyleId = `custom-css-section-${section.id}`;
      let styleTag = document.getElementById(parentStyleId) as HTMLStyleElement;

      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = parentStyleId;
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `
        .${customClassName} {
          ${Object.entries(parsedCSS)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ")}
        }
      `;
      setEditingError(null);
    } catch (error) {
      setEditingError("Invalid custom CSS format. Please provide valid JSON.");
    }
  }, [customCSS, customClassName, section.id]);

  // Inject child custom CSS
  useEffect(() => {
    const childStyleId = `custom-child-css-section-${section.id}`;
    let styleTag = document.getElementById(childStyleId) as HTMLStyleElement;

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = childStyleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = Object.entries(childProps.childCSS || {})
      .map(
        ([childIndex, css]) => {
          try {
            const parsedCSS = JSON.parse(css as string || "{}");
            return `
              .${childProps.childClassNames[childIndex]} {
                ${Object.entries(parsedCSS)
                  .map(([key, value]) => `${key}: ${value};`)
                  .join(" ")}
              }
            `;

            setSectionLayoutType(section.layoutType || "flex");
          } catch (error) {
            return ""; // Ignore invalid CSS for a specific child
          }
        }
      )
      .join("\n");
  }, [childProps, section.id]);

  // Load available CSS classes from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("cssClasses");
    if (savedClasses) {
      setAvailableClasses(JSON.parse(savedClasses));
    }
  }, []);

  // Update the useEffect for CSS classes
  useEffect(() => {
    // Create a style tag for CSS classes if it doesn't exist
    let styleTag = document.getElementById('css-classes-style') as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'css-classes-style';
      document.head.appendChild(styleTag);
    }

    // Generate CSS for all available classes
    const cssContent = availableClasses.map(className => {
      const cssProps = localStorage.getItem(`css_${className}`);
      if (!cssProps) return '';
      
      return `
        .${className} {
          ${cssProps}
        }
      `;
    }).join('\n');

    styleTag.textContent = cssContent;
  }, [availableClasses]);

  const handleSaveSection = () => {
    if (editingChildIndex !== null) {
      // Save child component changes
    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
                children: s.children.map((child, childIndex) =>
                  childIndex === editingChildIndex
                    ? { 
                        ...child, // Keep all existing child data
                        type: child.type, // Preserve the original component type
                        library: selectedLibrary,
                        props: {
                          ...child.props, // Keep existing props
                          ...editedProps, // Merge with new props
                          features: editedProps.features || child.props.features, // Preserve features
                          title: editedProps.title || child.props.title,
                          subtitle: editedProps.subtitle || child.props.subtitle,
                          buttonText: editedProps.buttonText || child.props.buttonText,
                          style: {
                            ...child.props.style,
                            ...editedProps.style
                          }
                        }
                      }
                    : child
                ),
              }
            : s
        )
      );
    } else {
      // Save parent component changes
      setSections((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                props: {
                  ...s.props,
                  ...editedProps,
                  title: editedProps.title || s.props.title, // Preserve title if exists
                  subtitle: editedProps.subtitle || s.props.subtitle, // Preserve subtitle if exists
                  buttonText: editedProps.buttonText || s.props.buttonText // Preserve button text if exists
                },
                library: selectedLibrary,
                customCSS,
                customClassName,
                customChildCSS: childProps.childCSS,
                childClassNames: childProps.childClassNames,
                layoutType: sectionLayoutType as Section["layoutType"],
            }
          : s
      )
    );
    }
    setIsModalOpen(false); 
    setEditingChildIndex(null);
    setEditedProps({}); // Reset edited props
  };

  const handleDeleteSection = () => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCustomCSSUpdate = (css: string) => {
    try {

        // Simply update the CSS, no JSON validation needed
        setCustomCSS(css);
        setEditingError(null); // Clear any previous errors
    } catch (error) {
      setEditingError("Invalid JSON format for custom CSS.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    const width = ref.offsetWidth;
    const height = ref.offsetHeight;

    setSections((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, props: { ...editedProps, style: { width, height } } } : s
      )
    );
  };

  const toggleResizable = () => {
    setIsResizing((prev) => !prev); // Toggle resizable state
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStop = (e: any, data: any) => {
    // Update the component's position in state
    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, position: { x: data.x, y: data.y } }
          : s
      )
    );
  };

  const handleEditChild = (childIndex: number) => {
    const child = section.children[childIndex];
    // Preserve all existing child data
    setEditedProps({
      ...child.props,
      features: child.props.features || [], // Preserve features array if it exists
      title: child.props.title,
      subtitle: child.props.subtitle,
      buttonText: child.props.buttonText,
    });
    setSelectedLibrary(child.library);
    setEditingChildIndex(childIndex);
    setIsModalOpen(true);
  };

  const handleAddChild = () => {
    const newChild: Section = {
      id: `${section.id}-child-${(section.children?.length || 0) + 1}`,
      type: section.type, // Use the same type as parent
      library: selectedLibrary,
      props: {
        title: "",
        subtitle: "",
        buttonText: "",
        features: [],
        style: {}
      },
      children: [],
    };

    setSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        children: [...(newSections[index].children || []), newChild],
      };
      return newSections;
    });
  };

  const handleRemoveChild = (childIndex: number) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        children: newSections[index].children.filter((_, i) => i !== childIndex),
      };
      return newSections;
    });
  };

  const handleSaveCustomCSS = () => {
    try {
      const parsedCSS = JSON.parse(customCSS);
       setSections((prev) =>
        prev.map((s, i) =>
           i === index
            ? {
                 ...s,
                customCSS: parsedCSS,
                customClassName,
              }
            : s
         )
       );
      setIsCustomCSSModalOpen(false);
      setEditingError(null);
    } catch (error) {
      setEditingError("Invalid JSON format for custom CSS.");
    }
  };

  const handleSaveChildProps = () => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              customChildCSS: childProps.childCSS,
              childClassNames: childProps.childClassNames,
            }
          : s
      )
    );
    setIsChildrenModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChildResizeStop = (childIndex: number, e: any, direction: any, ref: any, delta: any, position: any) => {
    const width = ref.offsetWidth;
    const height = ref.offsetHeight;

    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              children: s.children.map((child, idx) =>
                idx === childIndex
                  ? {
                      ...child,
                      props: {
                        ...child.props,
                        style: { ...child.props.style, width, height }
                      }
                    }
                  : child
              ),
            }
          : s
      )
    );
  };

  const toggleChildResizable = (childIndex: number) => {
    setResizingChildIndex(resizingChildIndex === childIndex ? null : childIndex);
  };

  const handleLayoutChange = (layout: 'flex' | 'grid' | 'flex-row' | 'flex-col') => {
    setSectionLayoutType(layout);
    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, layoutType: layout }
          : s
      )
    );
  };

const handleChildLayoutChange = (layout: 'flex-row' | 'flex-col') => {
  setChildLayoutType(layout);
  setSections((prev) => {
    console.log("Previous sections before layout change:", prev);
    
    return prev.map((s, i) =>
      i === index
        ? {
            ...s,
            children: s.children.map((child) => {
              console.log("Child before layout change:", child);
              return {
                ...child,
                props: {
                  ...child.props,
                  style: {
                    ...child.props?.style,
                    display: layout,
                    flexDirection: layout === 'flex-row' ? 'row' : 'column',
                    width:
                      layout === 'flex-row'
                        ? '100%'
                        : child.props?.style?.width || '100%',
                    height:
                      layout === 'flex-col'
                        ? '100%'
                        : child.props?.style?.height || 'auto',
                  },
                },
              };
            }),
          }
        : s
    );
  });
};



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

  // Update the handleSaveCSSClass function
  const handleSaveCSSClass = () => {
    try {
      if (!cssClassName.trim()) {
        alert("Please enter a class name");
        return;
      }

      if (!cssProperties.trim()) {
        alert("Please enter CSS properties");
        return;
      }

      // Format CSS properties
      const formattedCSS = cssProperties
        .split('\n')
        .map(line => line.trim())
        .filter(line => line) // Remove empty lines
        .map(line => {
          // Add semicolon if missing
          if (!line.endsWith(';')) {
            return line + ';';
          }
          return line;
        })
        .join('\n');

      // Add new class to available classes if it doesn't exist
      if (!availableClasses.includes(cssClassName)) {
        const newClasses = [...availableClasses, cssClassName];
        setAvailableClasses(newClasses);
        localStorage.setItem("cssClasses", JSON.stringify(newClasses));
      }
      
      // Save CSS properties
      localStorage.setItem(`css_${cssClassName}`, formattedCSS);
      
      // Apply the class immediately if editing a child
      if (editingChildIndex !== null) {
        handleApplyCSSClass(cssClassName, true, editingChildIndex);
      } else {
        handleApplyCSSClass(cssClassName);
      }
      
      setIsCSSModalOpen(false);
      setCssClassName("");
      setCssProperties("");
      setIsEditingCSSClass(false);
    } catch (error) {
      console.error("Error saving CSS class:", error);
      alert("Error saving CSS class. Please try again.");
    }
  };

  // Update the handleApplyCSSClass function
  const handleApplyCSSClass = (className: string, isChild: boolean = false, childIndex?: number) => {
    if (isChild && typeof childIndex === 'number') {
      // Apply CSS class to child component
      setSections((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                children: s.children.map((child, idx) =>
                  idx === childIndex
                    ? {
                        ...child,
                        props: {
                          ...child.props,
                          className: className,
                          appliedCSSClass: className // Store the applied class name
                        }
                      }
                    : child
                ),
              }
            : s
        )
      );
      setAppliedCSSClass(className);
    } else {
      // Apply CSS class to parent component
      setSections((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                customClassName: className,
                appliedCSSClass: className // Store the applied class name
              }
            : s
        )
      );
      setAppliedCSSClass(className);
    }
  };

  // Add these new functions after handleApplyCSSClass
  const handleDeleteCSSClass = (className: string) => {
    if (window.confirm(`Are you sure you want to delete the CSS class "${className}"?`)) {
      // Remove class from available classes
      const newClasses = availableClasses.filter(c => c !== className);
      setAvailableClasses(newClasses);
      
      // Remove from localStorage
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
      setIsCSSModalOpen(true);
    }
  };

  // Also ensure that when editing starts, we properly load the existing values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  const handleEditProperty = (prop: string, value: any) => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setEditedProps((prev: any) => ({
      ...prev,
      [prop]: value || prev[prop] // Keep existing value if new value is empty
    }));
  };

  // When starting to edit, load all existing props
  const startEditing = () => {
    setEditedProps({
      ...section.props,
      title: section.props.title || "",
      subtitle: section.props.subtitle || "",
      buttonText: section.props.buttonText || ""
    });
    setSelectedLibrary(section.library);
    setIsModalOpen(true);
  };

  if (!Component) {
    console.error("Component not found for:", section);
    return null;
  }

    return (
        <div
          id={`section-${section.id}`}
          className={`${
            customClassName ||
        (!isPreview ? "p-4 bg-gray-50 group-hover:border-blue-500 hover:border hover:border-gray-200 rounded-md" : "")
          }`}
        >
          {/* Container for layout */}
          <div
        className={`relative group rounded-md ${!isPreview ? 'hover:border hover:border-gray-200' : ''}`}
            style={{
          display: sectionLayoutType,
          width: "100%",
          height: "100%",
            }}
          >
            {/* Hover controls */}
        {!isPreview && (
          <>
            <div className="absolute inset-0 group-hover:border-blue-500 pointer-events-none"></div>
            <div
              className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-auto"
              style={{ zIndex: 1 }}
            >
              <button
                onClick={startEditing}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={toggleResizable}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                {isResizing ? "Fix Size" : "Resize"}
              </button>
              <button
                onClick={handleDeleteSection}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleAddChild}
                className="bg-purple-500 text-white px-2 py-1 rounded"
              >
                Add Child
              </button>
              <button
                onClick={() => setIsLayoutModalOpen(true)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Layout
              </button>
              <button
                onClick={() => setIsCSSModalOpen(true)}
                className="bg-indigo-500 text-white px-2 py-1 rounded"
              >
                CSS Classes
              </button>
            </div>
          </>
        )}
    
        {/* Component */}
        {isResizing && !isPreview ? (
              <Rnd
                default={{
                  x: section.position?.x || 0,
                  y: section.position?.y || 0,
                  width: section.width || "100%",
              height: section.height || "auto",
                }}
                onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
          >
            <Component {...section.props} />
          </Rnd>
        ) : (
          <Component {...section.props} />
        )}

        {/* Child Components */}
        {section.children && section.children.length > 0 && (
          <div className={getLayoutClasses(sectionLayoutType || "flex")}>
            {section.children.map((child, childIndex) => {
              const ChildComponent = COMPONENTS[child.type as keyof typeof COMPONENTS]?.[child.library as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]];
              
              if (!ChildComponent) {
                console.error(`Child component not found for type '${child.type}' and library '${child.library}'`);
                return null;
              }

              const childContent = (
                <div 
                  key={`${section.id}-child-${childIndex}-${child.type}-${child.library}`}
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
                        onClick={() => handleEditChild(childIndex)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleChildResizable(childIndex)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        {resizingChildIndex === childIndex ? "Fix Size" : "Resize"}
                      </button>
                      <button
                        onClick={() => handleRemoveChild(childIndex)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => {
                          setEditingChildIndex(childIndex);
                          setAppliedCSSClass(child.props.appliedCSSClass || null);
                          setIsCSSModalOpen(true);
                        }}
                        className="bg-indigo-500 text-white px-2 py-1 rounded"
                      >
                        CSS
                      </button>
                    </div>
                  )}
                  {!isPreview && child.props.appliedCSSClass && (
                    <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                      {child.props.appliedCSSClass}
                    </div>
                  )}
                </div>
              );

              return !isPreview && resizingChildIndex === childIndex ? (
                <Rnd
                  key={`${section.id}-child-${childIndex}-${child.type}-${child.library}-rnd`}
                  default={{
                    x: 0,
                    y: 0,
                    width: child.props.style?.width || "100%",
                    height: child.props.style?.height || "auto",
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => 
                    handleChildResizeStop(childIndex, e, direction, ref, delta, position)
                  }
                >
                  {childContent}
              </Rnd>
            ) : (
                childContent
              );
            })}
              </div>
            )}
    
        {/* Layout Modal */}
        {!isPreview && (
                <Modal
            isOpen={isLayoutModalOpen}
            onClose={() => setIsLayoutModalOpen(false)}
            title="Layout Settings"
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Parent Layout</h3>
                <div className="flex gap-2">
                      <button
                    onClick={() => handleLayoutChange("flex")}
                    className={`px-3 py-1 rounded ${
                      sectionLayoutType === "flex" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Flex
                  </button>
                  <button
                    onClick={() => handleLayoutChange("grid")}
                    className={`px-3 py-1 rounded ${
                      sectionLayoutType === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Child Layout</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleChildLayoutChange("flex-row")}
                    className={`px-3 py-1 rounded ${
                      childLayoutType === "flex-row" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Row
                  </button>
                  <button
                    onClick={() => handleChildLayoutChange("flex-col")}
                    className={`px-3 py-1 rounded ${
                      childLayoutType === "flex-col" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Column
                  </button>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsLayoutModalOpen(false)}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      >
                  Close
                      </button>
              </div>
            </div>
          </Modal>
        )}

        {/* CSS Class Modal */}
        {!isPreview && (
          <Modal
            isOpen={isCSSModalOpen}
            onClose={() => {
              setIsCSSModalOpen(false);
              setCssClassName("");
              setCssProperties("");
              setIsEditingCSSClass(false);
              setAppliedCSSClass(null);
            }}
            title="CSS Class Management"
          >
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {isEditingCSSClass ? `Edit CSS Class: ${cssClassName}` : "Create New CSS Class"}
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  {editingChildIndex !== null 
                    ? `Editing CSS for Child Component ${editingChildIndex + 1}`
                    : "Editing CSS for Parent Component"}
                </div>
                {appliedCSSClass && (
                  <div className="text-sm text-green-600 mb-2">
                    Currently Applied Class: {appliedCSSClass}
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
                            handleApplyCSSClass(className, editingChildIndex !== null, editingChildIndex || undefined);
                            setIsCSSModalOpen(false);
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
                  onClick={() => {
                    setIsCSSModalOpen(false);
                    setCssClassName("");
                    setCssProperties("");
                    setIsEditingCSSClass(false);
                    setAppliedCSSClass(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit Modal */}
        {!isPreview && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingChildIndex(null);
            }}
            title={editingChildIndex !== null ? "Edit Child Component" : "Edit Component"}
          >
            <div className="p-4">
              {/* <EditableProperties
                editedProps={editProps}
                setEditedProps={setEditProps}
                selectedLibrary={selectedLibrary}
                setSelectedLibrary={setSelectedLibrary}
                availableLibraries={['Chakra', 'Mui', 'Antd']}
                isChild={editingChildIndex !== null}
                parentType={section.type}
              /> */}
                  <EditableProperties
                    editedProps={editedProps}
                    setEditedProps={setEditedProps}
                    selectedLibrary={selectedLibrary}
                    setSelectedLibrary={setSelectedLibrary}
                    availableLibraries={Object.keys(
                      COMPONENTS[section.type as keyof typeof COMPONENTS] || {}
                    )}
                  />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingChildIndex(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSection}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
                </Modal>
        )}
          </div>
        </div>
    );
};

export default EditableSection;