import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { 
  HeartIcon,
  ShareIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { mockProducts, formatPrice } from '../utils/data';
import { useCart } from '../hooks';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      // Animate product details on load
      gsap.fromTo(
        '.product-detail-content',
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    } else {
      navigate('/products');
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Success animation
      gsap.fromTo(
        '.add-to-cart-btn',
        { scale: 1 },
        { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 }
      );
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-lofi">
        <div className="p-8 rounded-2xl bg-white/80 border border-gray-200">
          <p className="font-chinese text-lofi">載入中...</p>
        </div>
      </div>
    );
  }

  // Mock additional images
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-12 bg-lofi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 font-chinese flex items-center px-4 py-2 rounded-lg transition-all duration-200 btn-secondary"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          返回
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="product-detail-content">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square overflow-hidden rounded-2xl bg-white/80 border border-gray-200">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg transition-all duration-200 ${
                      selectedImage === index
                        ? 'ring-2 ring-apricot-500'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail-content space-y-6">
            {/* Category */}
            <div className="text-sm text-primary-btn font-chinese">
              {product.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-lofi font-chinese">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500 font-chinese">
                ({product.reviews} 則評價)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold price-tag">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg price-original">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose max-w-none">
              <p className="text-lofi font-chinese leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className={`status-badge-lofi ${!product.inStock ? 'out' : ''} font-chinese`}>
              {product.inStock ? '有現貨' : '暫時缺貨'}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-chinese">數量：</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`add-to-cart-btn flex-1 flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-all duration-200 font-chinese ${
                    product.inStock
                      ? 'btn-primary'
                      : 'status-badge-lofi out cursor-not-allowed'
                  }`}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-2" />
                  {product.inStock ? '加入購物車' : '暫時缺貨'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 text-lofi" />
                    )}
                  </button>
                  
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-white/80 transition-colors">
                    <ShareIcon className="w-5 h-5 text-lofi" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white/80 border border-gray-200 p-6 rounded-2xl">
              <h3 className="font-semibold text-lofi mb-4 font-chinese">商品詳情</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-lofi font-chinese">分類：</span>
                  <span className="text-primary-btn font-chinese">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lofi font-chinese">評分：</span>
                  <span className="text-lofi">{product.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-lofi font-chinese">評價數：</span>
                  <span className="text-lofi">{product.reviews}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-btn mb-8 font-chinese">
              相關商品
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="card-lofi overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lofi mb-2 font-chinese line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold price-tag">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <button
                        onClick={() => navigate(`/products/${relatedProduct.id}`)}
                        className="btn-ghost text-sm font-chinese"
                      >
                        查看
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;