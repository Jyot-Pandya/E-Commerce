import { useState, useEffect } from 'react';
import { useRecoilValueLoadable, useRecoilCallback, useRecoilValue } from 'recoil';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { productDetailsQuery, productReviewSuccessState, productReviewLoadingState, productReviewErrorState } from '../state/productState';
import { userInfoState } from '../state/userState';
import { cartState } from '../state/cartState';
import Rating from '../components/Rating';
import Product from '../components/Product';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton, SkeletonProduct } from '@/components/ui/skeleton';
import { useToast, ToastProvider } from '@/components/ui/toast';
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();

  const productLoadable = useRecoilValueLoadable(productDetailsQuery(id));
  const { state, contents: product } = productLoadable;
  const loading = state === 'loading';
  const error = state === 'hasError' ? productLoadable.contents : null;
  
  const userInfo = useRecoilValue(userInfoState);
  const reviewSuccess = useRecoilValue(productReviewSuccessState);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}/recommendations`);
        setRecommendations(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (state === 'hasValue') {
        fetchRecommendations();
    }
  }, [id, state]);

  useEffect(() => {
    if (state === 'hasValue' && product && product.image) {
      setActiveImage(product.image);
    }
  }, [product, state]);

  useEffect(() => {
    if (reviewSuccess) {
      alert('Review submitted!');
      setRating(0);
      setComment('');
      // In a real app, you'd likely reset the success state and refetch the product details
    }
  }, [reviewSuccess]);

  const addToCartHandler = useRecoilCallback(({snapshot, set}) => async () => {
    const cart = await snapshot.getPromise(cartState);
    const existItem = cart.find((x) => x.product === product._id);

    if (existItem) {
      const newCart = cart.map((x) =>
        x.product === existItem.product ? { ...existItem, qty: existItem.qty + qty } : x
      );
      set(cartState, newCart);
    } else {
      const newItem = {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty,
      };
      set(cartState, [...cart, newItem]);
    }

    navigate('/cart');
  });

  const submitHandler = useRecoilCallback(({ set }) => async (e) => {
    e.preventDefault();
    set(productReviewLoadingState, true);
    set(productReviewErrorState, null);
    set(productReviewSuccessState, false);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      set(productReviewLoadingState, false);
      set(productReviewSuccessState, true);
    } catch (error) {
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      set(productReviewLoadingState, false);
      set(productReviewErrorState, message);
    }
  });

  const renderStars = (count) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className="cursor-pointer text-xl"
            onClick={() => setRating(i + 1)}
          >
            {i < count ? 
              <FaStar className="text-yellow-500" /> : 
              <FaRegStar className="text-gray-400" />
            }
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <Button
        variant="ghost"
        className="mb-6 group"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Products
      </Button>
      
      {loading ? (
        <SkeletonProduct />
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-lg animate-slide-in-bottom">
          {error?.message || 'An error occurred'}
        </div>
      ) : state === 'hasValue' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg shadow-md bg-white p-2">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="w-full h-[400px] object-contain transition-transform hover:scale-105"
                />
              </div>
              
              {/* Thumbnail gallery - would be used if product had multiple images */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <div 
                    className={`w-20 h-20 rounded-md cursor-pointer border-2 ${activeImage === product.image ? 'border-primary' : 'border-transparent'}`}
                    onClick={() => setActiveImage(product.image)}
                  >
              <img
                src={product.image}
                alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  {product.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`w-20 h-20 rounded-md cursor-pointer border-2 ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setActiveImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} ${idx + 1}`} 
                        className="w-full h-full object-cover rounded"
              />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
            <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <Badge 
                    variant={product.countInStock > 0 ? "success" : "destructive"}
                    animation="pulse"
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
                
                <div className="flex items-center mt-2">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{(product.price / (1 - product.discount / 100)).toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      {product.discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="border-t border-b py-4">
                <p className="text-muted-foreground">{product.description}</p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  leftIcon={<FaHeart />}
                >
                  Wishlist
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  leftIcon={<FaShare />}
                >
                  Share
                </Button>
              </div>
            </div>
            
            {/* Add to Cart */}
            <Card variant="raised" animation="hover" className="h-fit">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold text-lg">₹{product.price}</span>
              </div>
              
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={product.countInStock > 0 ? "success" : "destructive"}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
              </div>
              
              {product.countInStock > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => qty > 1 && setQty(qty - 1)}
                        disabled={qty <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{qty}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => qty < product.countInStock && setQty(qty + 1)}
                        disabled={qty >= product.countInStock}
                      >
                        +
                      </Button>
                    </div>
                </div>
              )}
              
                <div className="pt-4">
              <Button
                onClick={addToCartHandler}
                className="w-full"
                    size="lg"
                disabled={product.countInStock === 0}
                    leftIcon={<FaShoppingCart />}
              >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="mt-16 animate-slide-in-bottom">
              <h2 className="text-2xl font-bold mb-6">You might also like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((rec) => (
                  <Product key={rec._id} product={rec} />
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-16 animate-slide-in-bottom">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Review List */}
              <div>
            {product.reviews.length === 0 ? (
                  <Card variant="outlined">
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl mb-4 block">📝</span>
                      <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground">
                        Be the first to review this product
                      </p>
                    </CardContent>
                  </Card>
            ) : (
                  <div className="space-y-4">
                {product.reviews.map((review) => (
                      <Card key={review._id} variant="outline" animation="hover">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{review.name}</CardTitle>
                    <Rating value={review.rating} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            
            {/* Review Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Write a Customer Review</CardTitle>
                  </CardHeader>
                  <CardContent>
              {userInfo ? (
                      <form onSubmit={submitHandler} className="space-y-4">
                        <div>
                          <label className="block mb-2 font-medium">Rating</label>
                          <div className="flex items-center gap-2 text-2xl">
                            {renderStars(rating)}
                          </div>
                  </div>
                  
                        <div>
                          <label className="block mb-2 font-medium">Comment</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                            className="border rounded-md p-2 w-full h-32 resize-none bg-background"
                      required
                            placeholder="Share your experience with this product..."
                    ></textarea>
                  </div>
                  
                  <Button
                    type="submit"
                          disabled={!rating}
                  >
                    Submit Review
                  </Button>
                </form>
              ) : (
                      <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                        Please <Link to="/login" className="underline font-medium">sign in</Link> to write a review
                </div>
              )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductScreen; 