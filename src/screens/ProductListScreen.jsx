import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilCallback, useRecoilValue, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import axios from 'axios';
import {
  productsQuery,
  createdProductState,
  productSuccessCreateState,
  productCreateLoadingState,
  productCreateErrorState,
  productDeleteLoadingState,
  productDeleteErrorState,
  productSuccessDeleteState,
  productsRefetchState,
} from '../state/productState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';

const ProductListScreen = () => {
  const { pageNumber = 1 } = useParams();
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoState);

  const productsLoadable = useRecoilValueLoadable(productsQuery({ pageNumber }));
  const { state, contents } = productsLoadable;
  const { products, page, pages } = state === 'hasValue' ? contents : { products: [], page: 1, pages: 1 };
  const loading = state === 'loading';
  const error = state === 'hasError' ? contents : null;

  const createLoading = useRecoilValue(productCreateLoadingState);
  const createError = useRecoilValue(productCreateErrorState);
  const successCreate = useRecoilValue(productSuccessCreateState);
  const createdProduct = useRecoilValue(createdProductState);
  const successDelete = useRecoilValue(productSuccessDeleteState);

  const setSuccessCreate = useSetRecoilState(productSuccessCreateState);
  const setSuccessDelete = useSetRecoilState(productSuccessDeleteState);
  const setProductsRefetch = useSetRecoilState(productsRefetchState);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (successCreate && createdProduct?._id) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
      setSuccessCreate(false); // Reset state
    }
    if (successDelete) {
      alert('Product deleted successfully!');
      setSuccessDelete(false); // Reset state
    }
  }, [successCreate, createdProduct, navigate, successDelete, setSuccessCreate, setSuccessDelete]);

  const deleteHandler = useRecoilCallback(({ set }) => async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      set(productDeleteLoadingState, true);
      set(productDeleteErrorState, null);
      set(productSuccessDeleteState, false);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        set(productDeleteLoadingState, false);
        set(productSuccessDeleteState, true);
        setProductsRefetch(v => v + 1); // Trigger refetch
      } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        set(productDeleteLoadingState, false);
        set(productDeleteErrorState, message);
      }
    }
  });

  const createProductHandler = useRecoilCallback(({ set }) => async () => {
    set(productCreateLoadingState, true);
    set(productCreateErrorState, null);
    set(productSuccessCreateState, false);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`/api/products`, {}, config);
      set(productCreateLoadingState, false);
      set(productSuccessCreateState, true);
      set(createdProductState, data);
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      set(productCreateLoadingState, false);
      set(productCreateErrorState, message);
    }
  });

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          <i className="fas fa-plus mr-2"></i> Create Product
        </button>
      </div>
      
      {createLoading && <Loader />}
      {createError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{createError}</div>}
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error?.message || 'An error occurred'}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CATEGORY
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      BRAND
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {products && products.map((product) => (
                    <tr key={product._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{product.price}
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
                  className={`px-4 py-2 mx-1 border rounded-md ${
                    x + 1 === page
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
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