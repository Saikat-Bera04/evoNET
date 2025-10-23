'use client';
import React, { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface MasonryItem {
  id: string | number;
  imageUrl: string;
  imageHint: string;
  url: string;
  name: string;
}

interface MasonryProps {
  items: MasonryItem[];
  columns?: number;
  gap?: number;
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'center';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  className?: string;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  columns = 3,
  gap = 16,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(columns);

  const getAnimationProps = (from: typeof animateFrom) => {
    switch (from) {
      case 'top': return { y: -50, opacity: 0 };
      case 'center': return { scale: 0.8, opacity: 0 };
      case 'bottom':
      default: return { y: 50, opacity: 0 };
    }
  };

  const setupEventListeners = useCallback(() => {
    if (!containerRef.current) return;
    const itemElements = containerRef.current.querySelectorAll('.masonry-item');
    
    itemElements.forEach(itemEl => {
      const imgEl = itemEl.querySelector('img');
      if (!imgEl) return;

      const enterAnimation = () => {
        const targets: (gsap.TweenTarget | null)[] = [];
        if (scaleOnHover) targets.push(imgEl);
        if (blurToFocus) targets.push(itemElements);
        
        gsap.to(targets, {
          scale: scaleOnHover ? hoverScale : 1,
          filter: blurToFocus ? 'blur(0px)' : 'none',
          duration: 0.3,
          ease: 'power2.out',
        });
        if (blurToFocus) {
           gsap.to(itemEl, { zIndex: 10, duration: 0.1 });
        }
      };
      
      const leaveAnimation = () => {
        const targets: (gsap.TweenTarget | null)[] = [];
        if (scaleOnHover) targets.push(imgEl);
        if (blurToFocus) targets.push(itemElements);

        gsap.to(targets, {
          scale: 1,
          filter: blurToFocus ? 'blur(8px)' : 'none',
          duration: 0.3,
          ease: 'power2.out',
        });
         if (blurToFocus) {
           gsap.to(itemEl, { zIndex: 1, duration: 0.1 });
        }
      };

      itemEl.addEventListener('mouseenter', enterAnimation);
      itemEl.addEventListener('mouseleave', leaveAnimation);

      return () => {
        itemEl.removeEventListener('mouseenter', enterAnimation);
        itemEl.removeEventListener('mouseleave', leaveAnimation);
      };
    });
  }, [scaleOnHover, hoverScale, blurToFocus, containerRef.current]);


  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setColumnCount(1);
      else if (window.innerWidth < 1024) setColumnCount(2);
      else setColumnCount(columns);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);
  

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    // Reset styles
    gsap.set(container.children, { clearProps: 'all' });
    
    const columnsArray: { el: HTMLDivElement, height: number }[] = Array.from({ length: columnCount }, (_, i) => {
        const col = document.createElement('div');
        col.className = `masonry-column flex flex-col`;
        col.style.width = `calc(${100 / columnCount}% - ${gap * (columnCount - 1) / columnCount}px)`;
        return { el: col, height: 0 };
    });

    container.innerHTML = '';
    columnsArray.forEach(col => container.appendChild(col.el));
    container.style.gap = `${gap}px`;


    // Distribute items
    items.forEach(itemData => {
      const col = columnsArray.reduce((prev, curr) => (curr.height < prev.height ? curr : prev));
      
      const itemWrapper = document.createElement('div');
      itemWrapper.className = 'masonry-item-wrapper';
      itemWrapper.style.marginBottom = `${gap}px`;

      const link = document.createElement('a');
      link.href = itemData.url;
      link.className = 'masonry-item block relative overflow-hidden rounded-lg shadow-lg cursor-target';
      link.setAttribute('aria-label', `View ${itemData.name}`);
      
      const img = document.createElement('img');
      img.src = itemData.imageUrl;
      img.alt = itemData.name;
      img.className = 'w-full h-auto block transition-all duration-300';
      img.setAttribute('data-ai-hint', itemData.imageHint);

      link.appendChild(img);
      itemWrapper.appendChild(link);
      col.el.appendChild(itemWrapper);
      
      const imgHeight = (container.clientWidth / columnCount) / (600 / 800);
      col.height += imgHeight + gap;
    });

    // Animate
    gsap.fromTo(
      '.masonry-item',
      getAnimationProps(animateFrom),
      {
        ...getAnimationProps(animateFrom),
        y: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        stagger: {
          each: stagger,
          from: 'start',
          grid: 'auto'
        },
        onComplete: setupEventListeners
      }
    );
    
    if (blurToFocus) {
      gsap.set(".masonry-item img", { filter: 'blur(8px)' });
    }

  }, [items, columnCount, gap, animateFrom, duration, ease, stagger, blurToFocus, setupEventListeners]);


  return <div ref={containerRef} className={cn('flex w-full', className)} />;
};

export default Masonry;
