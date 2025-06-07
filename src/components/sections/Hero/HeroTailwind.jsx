export const HeroTailwind = ({ title, subtitle, buttonText, onEdit }) => {
    return (
      <div className="text-center h-content py-10 px-6">
        <h1 className="text-4xl font-bold mb-4">{title || "Default Title"}</h1>
        <p className="text-lg mb-6">{subtitle || "Default Subtitle"}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onEdit}
        >
          {buttonText || "Default Button Text"}
        </button>
      </div>
    );
  };
  
  