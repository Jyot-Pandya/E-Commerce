import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilValueLoadable, useRecoilCallback, useSetRecoilState } from 'recoil';
import {
  productDetailsQuery,
  productSuccessUpdateState,
  productUpdateLoadingState,
  productUpdateErrorState,
} from '../state/productState';
import { userInfoState } from '../state/userState';
import Loader from '../components/Loader';

const ProductEditScreen = () => {
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoState);

  const productLoadable = useRecoilValueLoadable(productDetailsQuery(id));
  const { state, contents: product } = productLoadable;
  
  const successUpdate = useRecoilValue(productSuccessUpdateState);
  const loadingUpdate = useRecoilValue(productUpdateLoadingState);
  const errorUpdate = useRecoilValue(productUpdateErrorState);

  const setSuccessUpdate = useSetRecoilState(productSuccessUpdateState);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    }

    if (successUpdate) {
      setSuccessUpdate(false);
      navigate('/admin/productlist');
    } else {
      if (state === 'hasValue' && product) {
        if (!product || product._id !== id) {
          // This case should ideally not happen if query is working correctly
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
      }
    }
  }, [id, product, state, successUpdate, navigate, userInfo, setSuccessUpdate]);

  const submitHandler = useRecoilCallback(({ set }) => async (e) => {
    e.preventDefault();
    set(productUpdateLoadingState, true);
    set(productUpdateErrorState, null);
    set(productSuccessUpdateState, false);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const productData = { _id: id, name, price, image, brand, category, countInStock, description };
      await axios.put(`/api/products/${id}`, productData, config);
      set(productUpdateLoadingState, false);
      set(productSuccessUpdateState, true);
    } catch (error) {
      const message = error.response && error.response.data.message ? error.response.data.message : error.message;
      set(productUpdateLoadingState, false);
      set(productUpdateErrorState, message);
    }
  });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log(`File selected: ${file.name}`);
    setImage(`/images/${file.name}`);
  };

  return (
    <div>
      <Link to="/admin/productlist" className="inline-block mb-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i> Go Back
      </Link>
      
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
          
          {loadingUpdate && <Loader />}
          {errorUpdate && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errorUpdate}</div>}

          {state === 'loading' ? (
            <Loader />
          ) : state === 'hasError' ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {productLoadable.contents?.message || 'An error occurred'}
            </div>
          ) : (
            <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="price">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="image">
                  Image
                </label>
                <input
                  type="text"
                  id="image"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <div className="mt-2">
                  <input
                    type="file"
                    id="image-file"
                    onChange={uploadFileHandler}
                    className="w-full p-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="countInStock">
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="countInStock"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="category">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  className="w-full p-2 border rounded"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Update
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductEditScreen; 