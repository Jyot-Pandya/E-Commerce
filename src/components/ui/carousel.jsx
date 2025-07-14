import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

const Carousel = ({
  children,
  autoPlay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className,
  slideClassName,
  variant = 'default',
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const childrenArray = React.Children.toArray(children);

  const updateIndex = useCallback((newIndex) => {
    if (newIndex < 0) {
      newIndex = childrenArray.length - 1;
    } else if (newIndex >= childrenArray.length) {
      newIndex = 0;
    }
    setActiveIndex(newIndex);
  }, [childrenArray.length]);

  const handleNext = useCallback(() => {
    updateIndex(activeIndex + 1);
  }, [activeIndex, updateIndex]);

  const handlePrev = useCallback(() => {
    updateIndex(activeIndex - 1);
  }, [activeIndex, updateIndex]);

  useEffect(() => {
    let interval;
    if (autoPlay && !isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, interval);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoPlay, handleNext, interval, isPaused]);

  const variants = {
    default: 'rounded-lg overflow-hidden relative',
    flat: 'overflow-hidden relative',
    glass: 'rounded-lg overflow-hidden relative bg-white/10 backdrop-blur-md border border-white/20',
  };

  return (
    <div 
      className={cn(
        variants[variant] || variants.default,
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      <div className="flex transition-transform duration-500 ease-out" 
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {React.Children.map(children, (child, index) => (
          <div className={cn('w-full flex-shrink-0', slideClassName)}>
            {child}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10"
            onClick={handleNext}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
        </>
      )}

      {showDots && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {childrenArray.map((_, index) => (
            <button
              key={index}
              onClick={() => updateIndex(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                index === activeIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { Carousel }; 