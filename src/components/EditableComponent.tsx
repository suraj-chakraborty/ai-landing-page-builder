// import React, { useState } from 'react';

// // Icon Modal Component
// // const IconModal = ({ show, onClose, onSelectIcon }) => {
// //   const icons = ["icon-1", "icon-2", "icon-3"]; // Example icons
// //   if (!show) return null;

// //   return (
// //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
// //       <div className="bg-white rounded-lg shadow-lg p-6">
// //         <h3 className="text-lg font-semibold mb-4">Select an Icon</h3>
// //         <div className="grid grid-cols-3 gap-4">
// //           {icons.map(icon => (
// //             <div key={icon} className="cursor-pointer" onClick={() => { onSelectIcon(icon); onClose(); }}>
// //               <i className={icon}></i>
// //             </div>
// //           ))}
// //         </div>
// //         <button className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded" onClick={onClose}>Close</button>
// //       </div>
// //     </div>
// //   );
// // };

// // Editable Component
// const EditableComponent = () => {
//   const [customCSS, setCustomCSS] = useState('');
//   const [icon, setIcon] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [layout, setLayout] = useState(''); // 'grid' or 'flex'

//   const componentStyle = {
//     cssText: customCSS,
//   };

//   return (
//     <div className="p-4 border border-gray-300 rounded-lg shadow-md">
//       <div className={`editable-component ${layout === 'grid' ? 'grid' : 'flex'} items-center`} style={componentStyle}>
//         {icon && <i className={icon}></i>}
//         <p className="ml-2">Edit me!</p>
//         <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded" onClick={() => setShowModal(true)}>Choose Icon</button>
//         <button className="ml-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded" onClick={() => setLayout('grid')}>Grid Layout</button>
//         <button className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded" onClick={() => setLayout('flex')}>Flexbox Layout</button>
//       </div>

//       <textarea
//         className="mt-4 w-full p-2 border border-gray-300 rounded"
//         placeholder="Write your CSS here"
//         value={customCSS}
//         onChange={(e) => setCustomCSS(e.target.value)}
//       ></textarea>

//       <IconModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSelectIcon={(selectedIcon) => setIcon(selectedIcon)}
//       />
//     </div>
//   );
// };

// // Fullscreen Canvas Component
// const FullscreenCanvas = ({ sections }) => {
//   return (
//     <div className="fullscreen-canvas p-4">
//       {sections.map((section, index) => (
//         <EditableComponent key={index} />
//       ))}
//     </div>
//   );
// };

// export default EditableComponent;