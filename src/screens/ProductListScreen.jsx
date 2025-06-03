import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts, 
  createProduct, 
  resetCreateProduct, 
  deleteProduct,
  resetDeleteProduct
} from '../slices/productSlice';
import Loader from '../components/Loader';

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    loading, 
    error, 
    products, 
    page, 
    pages, 
    successCreate, 
    product: createdProductData, 
    successDelete
  } = useSelector((state) => state.product);
  
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetCreateProduct());
    dispatch(resetDeleteProduct());

    if (userInfo && userInfo.isAdmin) {
      dispatch(fetchProducts({ pageNumber }));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, pageNumber]);

  useEffect(() => {
    if (successCreate && createdProductData?._id) {
      navigate(`/admin/product/${createdProductData._id}/edit`);
    }
    if (successDelete) {
      alert('Product deleted successfully!');
      dispatch(fetchProducts({ pageNumber }));
    }
  }, [successCreate, createdProductData, navigate, dispatch, successDelete, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          <i className="fas fa-plus mr-2"></i> Create Product
        </button>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CATEGORY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BRAND
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products && products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="bg-gray-800 text-white py-1 px-3 rounded hover:bg-gray-700 mr-2"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center mt-8">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  key={x + 1}
                  to={`/admin/productlist/${x + 1}`}
                  className={`px-4 py-2 mx-1 border ${
                    x + 1 === page
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListScreen; 