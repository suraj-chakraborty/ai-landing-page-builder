import React from "react";

interface EditablePropertiesProps {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editedProps: any; 
  setEditedProps: (props: unknown) => void;
  selectedLibrary: string;
  setSelectedLibrary: (library: string) => void;
  availableLibraries: string[];
  isChild?: boolean;
  parentType?: string;
}

const EditableProperties = ({
  editedProps,
  setEditedProps,
  selectedLibrary,
  setSelectedLibrary,
  availableLibraries,
  // isChild = false,
  // parentType = ""
}: EditablePropertiesProps) => {
  const handleChange = (prop: string, value: unknown) => {
    setEditedProps((prev: object) => ({
      ...prev, [prop]: value
    }));
  };

  console.log("availableLibraries", availableLibraries);

  // const handleLibraryChange = (library: string) => {
  //   setSelectedLibrary(library);
  //   // Reset props when library changes
  //   setEditedProps({
  //     ...editedProps.style // Preserve any existing styles
  //   });
    
  // };

  // const renderArrayProperty = (prop: string, value: any[]) => {
  //   return (
  //     <div className="mt-2 p-2 border rounded bg-gray-100">
  //       <h4 className="font-medium">{prop} (Array)</h4>
  //       {value.map((item, index) => (
  //         <div key={index} className="mb-2 p-2 border rounded bg-gray-50">
  //           {typeof item === "object" ? (
  //             Object.entries(item).map(([key, val]) => (
  //               <div key={key} className="mb-2">
  //                 <label className="block font-medium">{key}</label>
  //                 <input
  //                   type="text"
  //                   value={typeof val === 'string' ? val : JSON.stringify(val)}
  //                   onChange={(e) => {
  //                     const updatedArray = [...value];
  //                     updatedArray[index] = { ...item, [key]: e.target.value };
  //                     handleChange(prop, updatedArray);
  //                   }}
  //                   className="p-2 border rounded w-full"
  //                 />
  //               </div>
  //             ))
  //           ) : (
  //             <input
  //               type="text"
  //               value={item || ""}
  //               onChange={(e) => {
  //                 const updatedArray = [...value];
  //                 updatedArray[index] = e.target.value;
  //                 handleChange(prop, updatedArray);
  //               }}
  //               className="p-2 border rounded w-full"
  //             />
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };


  const renderArrayProperty = (prop: string, value: (string | Record<string, string>)[]) => {
      return (
        <div className="mt-2 p-2 border rounded bg-gray-100">
          <h4 className="font-medium">{prop} (Array)</h4>
          {value.map((item, index) => (
            <div key={index} className="mb-2 p-2 border rounded bg-gray-50">
              {typeof item === "object" && item !== null ? (
                Object.entries(item).map(([key, val]) => (
                  <div key={key} className="mb-2">
                    <label className="block font-medium">{key}</label>
                    <input
                      type="text"
                      value={val || ""}
                      onChange={(e) => {
                        const updatedArray = [...value];
                        updatedArray[index] = { ...(item as object), [key]: e.target.value };
                        handleChange(prop, updatedArray);
                      }}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                ))
              ) : (
                <input
                  type="text"
                  value={item || ""}
                  onChange={(e) => {
                    const updatedArray = [...value];
                    updatedArray[index] = e.target.value;
                    handleChange(prop, updatedArray);
                  }}
                  className="p-2 border rounded w-full"
                />
              )}
            </div>
          ))}
        </div>
      );
    };

  return (
    <div className="space-y-4">
      {/* Library Selection */}
      <div className="mt-4">
      <h3 className="font-bold mb-4">Edit Properties</h3>
      <div className="mb-4">
        <label className="block font-medium">Library</label>
        <select
          value={selectedLibrary}
          onChange={(e) => setSelectedLibrary(e.target.value)}
          className="p-2 border rounded w-full"
        >
          {availableLibraries.map((library: string) => (
            <option key={library} value={library}>
              {library}
            </option>
          ))}
        </select>
      </div>
      {Object.keys(editedProps).map((prop) => {
        const value = editedProps[prop];
        if (Array.isArray(value)) {
          return (
            <div key={prop} className="mb-4">
              {renderArrayProperty(prop, value)}
            </div>
          );
        } else {
          return (
            <div key={prop} className="mb-4">
              <label className="block font-medium">{prop}</label>
              <input
                type="text"
                value={value || ""}
                onChange={(e) => handleChange(prop, e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          );
        }
      })}
    </div>
  

      {/* Style Properties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={editedProps.style?.backgroundColor || "#ffffff"}
          onChange={(e) =>
            handleChange("style", {
              ...editedProps.style,
              backgroundColor: e.target.value,
            })
          }
          className="w-full p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Text Color
        </label>
        <input
          type="color"
          value={editedProps.style?.color || "#000000"}
          onChange={(e) =>
            handleChange("style", {
              ...editedProps.style,
              color: e.target.value,
            })
          }
          className="w-full p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  );
};

export default EditableProperties;
