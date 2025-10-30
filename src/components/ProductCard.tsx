import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">{product.rating.rate}</span>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs text-[#E75650] font-semibold uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E75650] transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              <span className="text-xs text-gray-500">{product.rating.count} reviews</span>
            </div>
            <button className="bg-[#E75650] text-white p-2.5 rounded-full hover:bg-[#d14842] transition-all hover:scale-110 shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
