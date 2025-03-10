import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-lg font-semibold mb-2 h-14 overflow-hidden">
            {product.name}
          </h2>
        </Link>
        
        <div className="mb-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">${product.price.toFixed(2)}</h3>
          <Link
            to={`/product/${product._id}`}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product; 