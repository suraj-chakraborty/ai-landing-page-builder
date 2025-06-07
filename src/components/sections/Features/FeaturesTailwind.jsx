const FeaturesTailwind = ({features=[]}) => {
  if (!Array.isArray(features)) {
    return <div>Error: Invalid features data</div>;
  }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default FeaturesTailwind;
  