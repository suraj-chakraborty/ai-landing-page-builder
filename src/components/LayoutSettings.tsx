import React from 'react';
import Modal from './Modal';

interface LayoutSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  sectionLayoutType: string;
  childLayoutType: string;
  onLayoutChange: (layout: 'flex' | 'grid' | 'flex-row' | 'flex-col') => void;
  onChildLayoutChange: (layout: 'flex-row' | 'flex-col') => void;
}

const LayoutSettings: React.FC<LayoutSettingsProps> = ({
  isOpen,
  onClose,
  sectionLayoutType,
  childLayoutType,
  onLayoutChange,
  onChildLayoutChange
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Layout Settings"
    >
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Parent Layout</h3>
          <div className="flex gap-2">
            <button
              onClick={() => onLayoutChange("flex")}
              className={`px-3 py-1 rounded ${
                sectionLayoutType === "flex" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Flex
            </button>
            <button
              onClick={() => onLayoutChange("grid")}
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
              onClick={() => onChildLayoutChange("flex-row")}
              className={`px-3 py-1 rounded ${
                childLayoutType === "flex-row" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              Row
            </button>
            <button
              onClick={() => onChildLayoutChange("flex-col")}
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

export default LayoutSettings; 