/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { COMPONENTS } from "@/components/ComponentRegistry";

const ChildComponentsEditor = ({
  section,
  index,
  setSections,
  childProps,
  setChildProps,
  availableLibraries,
}: any) => {
  const handleSaveChildCSS = (childIndex: number, css: string, className: string) => {
    setChildProps((prev: any) => ({
      ...prev,
      childCSS: { ...prev.childCSS, [childIndex]: css },
      childClassNames: { ...prev.childClassNames, [childIndex]: className },
    }));

    setSections((prev: any) =>
      prev.map((s: any, i: number) =>
        i === index
          ? {
              ...s,
              customChildCSS: { ...s.customChildCSS, [childIndex]: css },
              childClassNames: { ...s.childClassNames, [childIndex]: className },
            }
          : s
      )
    );
  };

  const handleChildLibraryChange = (childIndex: number, newLibrary: string) => {
    setSections((prev: any) =>
      prev.map((s: any, i: number) =>
        i === index
          ? {
              ...s,
              children: s.children.map((child: any, cIndex: number) =>
                cIndex === childIndex ? { ...child, library: newLibrary } : child
              ),
            }
          : s
      )
    );
  };

  const handleDeleteChild = (childIndex: number) => {
    setSections((prev: any[]) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              children: section.children?.filter((_: any, cIndex: number) => cIndex !== childIndex) || [],
            }
          : s
      )
    );
  };

  const handleSaveChild = (childIndex: number) => {
    const updatedChildren = [...(section.children || [])]; // Ensure children is initialized
    updatedChildren[childIndex].props = { ...childProps[childIndex] };

    setSections((prev: any[]) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              children: updatedChildren,
              customChildCSS: { ...section.customChildCSS },
              childClassNames: { ...section.childClassNames },
            }
          : s
      )
    );

    // Clear the child props after saving
    setChildProps((prev: any) => {
      const newState = { ...prev };
      delete newState[childIndex];
      return newState;
    });
  };

  return (
    <>
      {Array.isArray(section.children) && section.children.map((child: any, childIndex: number) => {
    console.log(section);
  const childType = child?.type;
  const childLibrary = child?.library;

  if (!childType || !childLibrary) {
    return (
      <div key={`${section.id}-child-${childIndex}`} className="text-red-500">
        Missing child type or library
      </div>
    );
  }

  const ChildComponent = COMPONENTS[child.type as keyof typeof COMPONENTS]?.[child.library as keyof (typeof COMPONENTS)[keyof typeof COMPONENTS]];

  return ChildComponent ? (
    <div key={`${section.id}-child-${childIndex}`} className="mt-0">
      <ChildComponent
        {...(child.props || {})}
        className={section.childClassNames?.[childIndex] || ""}
      />
      <div className="inset-0 group-hover:border-blue-500 pointer-events-none"></div>
            <div
              className=" flex gap-2 opacity-0 group-hover:opacity-100 pointer-events-auto"
              style={{ zIndex: 1 }}
            >
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() =>
            setChildProps((prev: any) => ({
              ...prev,
              [childIndex]: child.props,
            }))
          }
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => handleDeleteChild(childIndex)}
        >
          Delete
        </button>
      </div>

      {/* Library Selector */}
      <div className="mt-4">
        {childProps[childIndex] && (
          <div className="mt-4">
            <h4 className="font-medium">Edit Child Properties</h4>
            <label className="block mb-2">UI Library</label>
            <select
              value={childLibrary}
              onChange={(e) => handleChildLibraryChange(childIndex, e.target.value)}
              className="p-2 border rounded mb-4"
            >
                {availableLibraries.map((library: string) => (
                <option key={library} value={library}>
                  {library}
                </option>
                ))}
            </select>

            {/* Render child properties for editing */}
            {Object.entries(child.props || {}).map(([prop, value]) => {
              if (Array.isArray(value)) {
                return (
                  <div key={prop} className="mb-4">
                    <h4 className="font-medium">{prop} (Array)</h4>
                    {value.map((item: any, itemIndex: number) => (
                      <div key={`${prop}-${itemIndex}`} className="p-2 border rounded bg-gray-50 mb-2">
                        <h5>Item {itemIndex + 1}</h5>
                        {Object.entries(item).map(([itemProp, itemValue]) => (
                          <div key={itemProp} className="mb-2">
                            <label className="block font-medium">{itemProp}</label>
                            <input
                              type="text"
                              value={
                                childProps[childIndex]?.[prop]?.[itemIndex]?.[itemProp] ||
                                itemValue ||
                                ""
                              }
                              onChange={(e) =>
                                setChildProps((prev: any) => {
                                  const updatedChild = { ...prev[childIndex] };
                                  const updatedProp = updatedChild[prop] || [];
                                  updatedProp[itemIndex] = {
                                    ...updatedProp[itemIndex],
                                    [itemProp]: e.target.value,
                                  };
                                  updatedChild[prop] = updatedProp;

                                  return {
                                    ...prev,
                                    [childIndex]: updatedChild,
                                  };
                                })
                              }
                              className="p-2 border rounded w-full"
                              placeholder={`Edit ${itemProp}`}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                );
              } else if (typeof value === "object" && value !== null) {
                return (
                  <div key={prop} className="mb-4">
                    <h4 className="font-medium">{prop} (Object)</h4>
                    {Object.entries(value).map(([nestedProp, nestedValue]) => (
                      <div key={nestedProp} className="mb-2">
                        <label className="block font-medium">{nestedProp}</label>
                        <input
                          type="text"
                          value={
                            childProps[childIndex]?.[prop]?.[nestedProp] || nestedValue || ""
                          }
                          onChange={(e) =>
                            setChildProps((prev: any) => {
                              const updatedChild = { ...prev[childIndex] };
                              const updatedProp = updatedChild[prop] || {};
                              updatedProp[nestedProp] = e.target.value;
                              updatedChild[prop] = updatedProp;

                              return {
                                ...prev,
                                [childIndex]: updatedChild,
                              };
                            })
                          }
                          className="p-2 border rounded w-full"
                          placeholder={`Edit ${nestedProp}`}
                        />
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div key={prop} className="mb-4">
                    <label className="block font-medium">{prop}</label>
                    <input
                      type="text"
                      value={childProps[childIndex]?.[prop] || value || ""}
                      onChange={(e) =>
                        setChildProps((prev: any) => ({
                          ...prev,
                          [childIndex]: {
                            ...prev[childIndex],
                            [prop]: e.target.value,
                          },
                        }))
                      }
                      className="p-2 border rounded w-full"
                      placeholder={`Edit ${prop}`}
                    />
                  </div>
                );
              }
            })}

            {/* CSS Editor */}
            <textarea
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter custom CSS for this child component"
              value={section.customChildCSS?.[childIndex] || ""}
              onChange={(e) =>
                handleSaveChildCSS(
                  childIndex,
                  e.target.value,
                  section.childClassNames?.[childIndex] || ""
                )
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter class name"
              value={section.childClassNames?.[childIndex] || ""}
              onChange={(e) =>
                handleSaveChildCSS(
                  childIndex,
                  section.customChildCSS?.[childIndex] || "",
                  e.target.value
                )
              }
            />

            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleSaveChild(childIndex)}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div key={`${section.id}-child-${childIndex}`} className="text-red-500">
      Child component not found for type &quot;{childType}&quot; and library &quot;{childLibrary}&quot;
    </div>
  );
})}
    </>
  );
};

export default ChildComponentsEditor;