import { useDispatch } from 'react-redux';
import { addCartItem } from '../slices/cartSlice';
import { ProductCard } from '@/components/ui/product-card';

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addCartItem({ 
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1
    }));
  };

  return (
    <ProductCard
      product={{
        ...product,
        discount: product.discount || 0,
        description: product.description || 'No description available'
      }}
      onAddToCart={addToCartHandler}
      variant="default"
      animation="hover"
    />
  );
};

export default Product; 