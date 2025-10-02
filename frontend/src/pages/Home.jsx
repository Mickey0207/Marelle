import { useEffect } from 'react';
import { gsap } from 'gsap';
import { mockProducts } from "../../external_mock/data/products.mock";
import HeroSection from '../components/home/HeroSection.jsx';
import FeaturedProducts from '../components/home/FeaturedProducts.jsx';
import FeaturesSection from '../components/home/FeaturesSection.jsx';
import NewsletterSection from '../components/home/NewsletterSection.jsx';

const Home = () => {
  // 拆分後不再需要區塊 ref

  useEffect(() => {
    // Hero section animation
    gsap.fromTo(
      '.hero-content',
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
      }
    );

    // Product cards stagger animation
    gsap.fromTo(
      '.product-card',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
      }
    );
  }, []);

  const featuredProducts = mockProducts.slice(0, 8);

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(180deg, #FFFFFF 0%, #FEFDFB 100%)'}}>
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <FeaturesSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;