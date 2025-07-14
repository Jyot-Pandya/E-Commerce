import { useSetRecoilState } from 'recoil';
import { cartState } from '../state/cartState';
import { ProductCard } from '@/components/ui/product-card';

const Product = ({ product }) => {
  const setCartItems = useSetRecoilState(cartState);

  const addToCartHandler = () => {
    const item = { 
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: 1
    };

    setCartItems((oldCart) => {
        const existItem = oldCart.find((x) => x.product === item.product);
        if (existItem) {
            // Increment quantity if item already exists
            return oldCart.map((x) =>
                x.product === existItem.product ? { ...x, qty: x.qty + 1 } : x
            );
        } else {
            return [...oldCart, item];
        }
    });
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