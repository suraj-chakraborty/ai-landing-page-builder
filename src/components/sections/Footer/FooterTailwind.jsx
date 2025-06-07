const FooterTailwind = () => {
    return (
      <footer className="bg-gray-800 text-gray-200 py-4 text-center">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-blue-400 hover:text-blue-200">
            Privacy Policy
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-200">
            Terms of Service
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-200">
            Contact Us
          </a>
        </div>
      </footer>
    );
  };
  
  export default FooterTailwind;
  