import { useState, useEffect } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { useParams } from 'react-router-dom';
import { productsQuery } from '../state/productState';
import Product from '../components/Product';
import Loader from '../components/Loader';
import ProductCarousel from '../components/ProductCarousel';
import CategoryFilter from '../components/CategoryFilter';

import { FaShoppingCart, FaSearch } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

const HomeScreen = () => {
  const { keyword, pageNumber = 1, category } = useParams();
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [searchInput, setSearchInput] = useState('');

  const productsLoadable = useRecoilValueLoadable(productsQuery({ keyword, pageNumber, category: selectedCategory }));
  const { state, contents } = productsLoadable;
  console.log('productsLoadable state:', state);
  console.log('productsLoadable contents:', contents);
  const { products, page, pages } = state === 'hasValue' ? contents : { products: [], page: 1, pages: 1 };
  const loading = state === 'loading';
  const error = state === 'hasError' ? contents : null;


  // Group products by category when no filter is applied
  const groupedProducts = !selectedCategory && !keyword && state === 'hasValue'
    ? products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {})
    : null;

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      window.location.href = `/search/${searchInput}`;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
     
      {!keyword && <ProductCarousel />}
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {/* Search Box */}
          <Card>
            <CardHeader>
              <CardTitle>Search Products</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  icon={<FaSearch className="text-muted-foreground" />}
                />
                <Button type="submit" className="w-full">
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Category Filter */}
          <CategoryFilter 
            onSelectCategory={handleCategorySelect} 
            selectedCategory={selectedCategory}
          />
          
          {/* Help Box */}
          <Card variant="gradient" animation="hover">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-foreground mb-4">
                Our customer service team is available 24/7 to assist you with any questions.
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <FaShoppingCart className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Shopping Assistance</p>
                  <p className="text-sm text-muted-foreground">support@shophub.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg animate-slide-in-bottom">
              {error?.message || 'An error occurred'}
            </div>
          ) : (
            <>
              {keyword || selectedCategory ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">
                      {keyword 
                        ? `Search Results for "${keyword}"` 
                        : `${selectedCategory} Products`}
                    </h1>
                    <Badge variant="secondary" className="text-sm">
                      {products.length} {products.length === 1 ? 'product' : 'products'} found
                    </Badge>
                  </div>
                  
                  {products.length === 0 ? (
                    <Card variant="outlined" className="animate-slide-in-bottom">
                      <CardContent className="p-6 text-center">
                        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                          <FaSearch className="text-muted-foreground w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No products found</h3>
                        <p className="text-muted-foreground">
                          Try a different search term or browse our categories.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => {
                            setSelectedCategory('');
                            window.history.pushState(null, '', '/');
                          }}
                        >
                          View All Products
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-bottom">
                      {products.map((product) => (
                        <Product key={product._id} product={product} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-6">Our Products</h1>
                  
                  {Object.entries(groupedProducts || {}).map(([category, products]) => (
                    <div key={category} className="mb-12 animate-slide-in-bottom">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">{category}</h2>
                        <Button 
                          variant="ghost"
                          onClick={() => setSelectedCategory(category)}
                          className="font-medium"
                        >
                          View All {category}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.slice(0, 3).map((product) => (
                          <Product key={product._id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
              
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center mt-8">
                  {[...Array(pages).keys()].map((x) => (
                    <a
                      key={x + 1}
                      href={
                        keyword
                          ? `/search/${keyword}/page/${x + 1}`
                          : selectedCategory
                          ? `/category/${selectedCategory}/page/${x + 1}`
                          : `/page/${x + 1}`
                      }
                      className={`flex items-center justify-center w-10 h-10 mx-1 rounded-md transition-colors ${
                        x + 1 === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'
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
      </div>
    </div>
  );
};

export default HomeScreen; 