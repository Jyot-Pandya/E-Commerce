const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="mb-4">
              Your one-stop shop for all your electronic needs. We offer the best
              products at competitive prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="/" className="hover:text-gray-300">Home</a>
              </li>
              <li className="mb-2">
                <a href="/cart" className="hover:text-gray-300">Cart</a>
              </li>
              <li className="mb-2">
                <a href="/login" className="hover:text-gray-300">Login</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="mb-2">123 E-Commerce St.</p>
            <p className="mb-2">New York, NY 10001</p>
            <p className="mb-2">Email: info@shophub.com</p>
            <p className="mb-2">Phone: (123) 456-7890</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>© {currentYear} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 