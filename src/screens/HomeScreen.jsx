import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchProducts } from '../slices/productSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { keyword, pageNumber = 1 } = useParams();

  const { products, loading, error, page, pages } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(fetchProducts({ keyword, pageNumber }));
  }, [dispatch, keyword, pageNumber]);

  return (
    <div>
      {!keyword && <ProductCarousel />}
      
      <h1 className="text-3xl font-bold mb-6">Latest Products</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-8">
              {[...Array(pages).keys()].map((x) => (
                <a
                  key={x + 1}
                  href={
                    keyword
                      ? `/search/${keyword}/page/${x + 1}`
                      : `/page/${x + 1}`
                  }
                  className={`px-4 py-2 mx-1 border ${
                    x + 1 === page
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {x + 1}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeScreen; 