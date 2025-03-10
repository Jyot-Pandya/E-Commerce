import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails } from '../slices/productSlice';
import Loader from '../components/Loader';

// Placeholder for product update action that would be in the productSlice
const updateProduct = (product) => ({ type: 'UPDATE_PRODUCT', payload: product });

const ProductEditScreen = () => {
  const { id } = useParams();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, product } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }
    
    if (!product || !product.name || product._id !== id) {
      dispatch(fetchProductDetails(id));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [dispatch, navigate, id, product, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    
    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    // In a real app, this would handle file uploads to a storage service
    console.log(`File selected: ${file.name}`);
    // For demonstration, we'll just set the image URL to a mock value
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
          
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
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