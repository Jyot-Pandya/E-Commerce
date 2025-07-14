import { Link } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';
import { topProductsQuery } from '../state/productState';
import Loader from './Loader';

const ProductCarousel = () => {
  const topProductsLoadable = useRecoilValueLoadable(topProductsQuery);
  const { state, contents: topProducts } = topProductsLoadable;

  return state === 'loading' ? (
    <Loader />
  ) : state === 'hasError' ? (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {topProducts?.message || 'An error occurred'}
    </div>
  ) : state === 'hasValue' && (
    <div className="mb-8 bg-gray-100 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Top Rated Products</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {topProducts && topProducts.map((product) => (
          <div 
            key={product._id} 
            className="flex-none w-64 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800">{product.name}</h3>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 mr-1">
                    <i className="fas fa-star"></i>
                  </span>
                  <span>{product.rating} ({product.numReviews} reviews)</span>
                </div>
                <p className="mt-2 font-bold">₹{product.price.toFixed(2)}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel; 