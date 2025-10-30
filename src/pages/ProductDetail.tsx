import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { fakeStoreAPI } from '../api/fakestore';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const fetchProduct = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fakeStoreAPI.fetchProduct(parseInt(id));
      setProduct(data);
    } catch (err) {
      setError('Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 5) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <ErrorMessage message={error || 'Product not found'} onRetry={fetchProduct} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#E75650] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-w-full max-h-96 object-contain"
                />
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <span className="inline-block bg-[#E75650]/10 text-[#E75650] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                    {product.category}
                  </span>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating.rate)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">
                      {product.rating.rate} ({product.rating.count} reviews)
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                  <div className="flex items-baseline space-x-2 mb-8">
                    <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <span className="text-lg text-gray-500 line-through">${(product.price * 1.2).toFixed(2)}</span>
                    <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                      Save 20%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity === 1}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-2xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity === 5}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-gray-500">(Max: 5)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#E75650] text-white py-4 rounded-full font-semibold hover:bg-[#d14842] transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{addedToCart ? 'Added to Cart!' : 'Add to Cart'}</span>
                  </button>

                  {addedToCart && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-center animate-pulse">
                      Successfully added to cart!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
