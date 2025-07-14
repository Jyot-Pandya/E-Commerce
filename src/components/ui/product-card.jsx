import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardImage, CardBadge } from './card';
import { Badge } from './badge';
import { Button } from './button';

const ProductCard = ({
  product,
  className,
  imageClassName,
  contentClassName,
  onAddToCart,
  variant = 'default',
  animation = 'hover',
  ...props
}) => {
  const isNew = React.useMemo(() => {
    if (!product.createdAt) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(product.createdAt) > oneWeekAgo;
  }, [product.createdAt]);

  const isOnSale = product.discount > 0;
  const isOutOfStock = product.countInStock === 0;

  return (
    <Card
      className={cn('product-card relative overflow-hidden group', className)}
      variant={variant}
      animation={animation}
      {...props}
    >
      {isNew && (
        <CardBadge className="bg-blue-500">New</CardBadge>
      )}
      
      {isOnSale && (
        <Badge 
          variant="destructive" 
          className="absolute top-2 left-2 z-10"
        >
          {product.discount}% OFF
        </Badge>
      )}

      <Link to={`/product/${product._id}`}>
        <CardImage
          src={product.image}
          alt={product.name}
          className={cn(
            'aspect-square object-cover transition-transform duration-300 group-hover:scale-105',
            imageClassName
          )}
        />
      </Link>

      <CardContent className={cn('p-4', contentClassName)}>
        <div className="flex items-center justify-between mb-2">
          <Link 
            to={`/product/${product._id}`} 
            className="text-lg font-medium line-clamp-1 hover:underline transition-colors"
          >
            {product.name}
          </Link>
          <div className="flex items-center">
            <span className="text-sm text-yellow-500 mr-1">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {isOnSale ? (
            <>
              <span className="text-xl font-bold text-primary">
                ₹{Math.round(product.price - (product.price * product.discount / 100))}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                ₹{Math.round(product.price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">
              ₹{Math.round(product.price)}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-1/2"
          asChild
        >
          <Link to={`/product/${product._id}`}>
            Details
          </Link>
        </Button>
        <Button
          variant="default"
          size="sm"
          className="w-1/2"
          onClick={() => onAddToCart && onAddToCart(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { ProductCard }; 