import { useRecoilValueLoadable } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { categoriesQuery } from '../state/productState';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryFilter = ({ onSelectCategory, selectedCategory }) => {
  const navigate = useNavigate();
  const categoriesLoadable = useRecoilValueLoadable(categoriesQuery);
  const { state, contents: categories } = categoriesLoadable;

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      navigate(`/category/${category}`);
    }
  };

  if (state === 'loading') {
    return (
        <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="bg-gray-800 text-white px-6 py-3">
                <h2 className="text-xl font-semibold">Shop by Category</h2>
            </div>
            <div className="p-4 space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
            </div>
        </div>
    )
  }

  if (state === 'hasError' || !categories || categories.length === 0) {
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