import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCategories } from '../slices/productSlice';

const CategoryFilter = ({ onSelectCategory, selectedCategory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigate(`/category/${category}`);
    }
  };

  if (loading || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
      <div className="bg-gray-800 text-white px-6 py-3">
        <h2 className="text-xl font-semibold">Shop by Category</h2>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter; 