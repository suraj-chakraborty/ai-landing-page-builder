import React, { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useCallback } from "react";


interface CustomCSSEditorProps {
  customCSS: string;
  setCustomCSS: (css: string) => void;
  customClassName: string;
  setCustomClassName: (className: string) => void;
  editingError?: string;
  Component: React.ElementType;
  componentProps?: Record<string, unknown>;
}

const CustomCSSEditor = ({
  customCSS,
  setCustomCSS,
  customClassName,
  setCustomClassName,
  editingError,
  Component,
  componentProps,
}: CustomCSSEditorProps) => {
  const [defaultCSS, setDefaultCSS] = useState("");

  // Extract unique HTML tags from the component's static markup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const extractTagsFromComponent = (Component: any, props: any = {}): string[] => {
  //   try {
  //     const renderedMarkup = renderToStaticMarkup(<Component {...props} defaultCSS={defaultCSS} />);
  //     const tagRegex = /<(\w+)[\s>]/g;
  //     const tags = new Set<string>();
  //     let match;

  //     while ((match = tagRegex.exec(renderedMarkup)) !== null) {
  //       tags.add(match[1]); // Add unique tag name
  //     }

  //     return Array.from(tags);
  //   } catch (error) {
  //     console.error("Error extracting tags:", error);
  //     return [];
  //   }
  // };



// Inside your component:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractTagsFromComponent = useCallback((Component: any, props: any = {}): string[] => {
  try {
    const renderedMarkup = renderToStaticMarkup(<Component {...props} defaultCSS={defaultCSS} />);
    const tagRegex = /<(\w+)[\s>]/g;
    const tags = new Set<string>();
    let match;

    while ((match = tagRegex.exec(renderedMarkup)) !== null) {
      tags.add(match[1]);
    }

    return Array.from(tags);
  } catch (error) {
    console.error("Error extracting tags:", error);
    return [];
  }
}, [defaultCSS]); // ✅ only include `defaultCSS` since it's the only external reference


  // Initialize default CSS template based on extracted tags
 useEffect(() => {
  if (Component) {
    const tags = extractTagsFromComponent(Component, componentProps);
    const template = tags.map((tag) => `${tag} { /* add your css here */ }`).join("\n");
    setDefaultCSS(template);
  }
}, [extractTagsFromComponent, Component, componentProps]);


  // Handle changes to the custom CSS textarea
  const handleCSSChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomCSS(e.target.value);
  };

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-4">Custom CSS Editor</h3>

      {/* Custom Class Name Input */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Custom Class Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter custom class name"
          value={customClassName}
          onChange={(e) => setCustomClassName(e.target.value)}
        />
      </div>

      {/* Custom CSS Textarea */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Custom CSS</label>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Define your custom CSS here"
          value={customCSS } // Default CSS if customCSS is empty
          onChange={handleCSSChange}
        />
      </div>

      {/* Display Editing Error */}
      {editingError && <p className="text-red-500 mt-2">{editingError}</p>}
    </div>
  );
};

export default CustomCSSEditor;
