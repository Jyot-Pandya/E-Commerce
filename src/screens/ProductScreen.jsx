import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchProductDetails, createProductReview, resetCreateReview } from '../slices/productSlice';
import { addCartItem } from '../slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { product, loading, error, success } = useSelector(
    (state) => state.product
  );
  
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      alert('Review submitted!');
      setRating(0);
      setComment('');
      dispatch(resetCreateReview());
      dispatch(fetchProductDetails(id));
    }
  }, [success, dispatch, id]);

  const addToCartHandler = () => {
    dispatch(addCartItem({ 
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: Number(qty)
    }));
    navigate('/cart');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview({
        productId: id,
        review: { rating, comment },
      })
    );
  };

  return (
    <div>
      <Link to="/" className="inline-block mb-4 text-gray-600 hover:text-gray-800">
        <i className="fas fa-arrow-left mr-2"></i> Back to Products
      </Link>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Product Image */}
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              <div className="mb-4">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>
              <p className="text-xl font-bold mb-4">Price: ${product.price}</p>
              <p className="mb-4">{product.description}</p>
            </div>
            
            {/* Add to Cart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="mb-4 flex justify-between">
                <span>Price:</span>
                <span className="font-bold">${product.price}</span>
              </div>
              
              <div className="mb-4 flex justify-between">
                <span>Status:</span>
                <span>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {product.countInStock > 0 && (
                <div className="mb-4 flex justify-between">
                  <span>Qty:</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="border rounded p-2"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <button
                onClick={addToCartHandler}
                className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:bg-gray-400"
                disabled={product.countInStock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
          
          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            
            {product.reviews.length === 0 ? (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                No Reviews
              </div>
            ) : (
              <div className="mb-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 mb-4">
                    <div className="font-bold">{review.name}</div>
                    <Rating value={review.rating} />
                    <p className="text-gray-600 text-sm">
                      {review.createdAt.substring(0, 10)}
                    </p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Review Form */}
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Write a Customer Review</h3>
              
              {userInfo ? (
                <form onSubmit={submitHandler} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <label className="block mb-2">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="border rounded p-2 w-full"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block mb-2">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="border rounded p-2 w-full"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                  Please <Link to="/login" className="underline">sign in</Link> to write a review
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen; 