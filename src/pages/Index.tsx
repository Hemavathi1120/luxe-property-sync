
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/navbar';
import HeroSection from '@/components/ui/hero-section';
import PropertyCard from '@/components/properties/property-card';
import { useProperties } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Award, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { properties: featuredProperties } = useProperties({ featured: true });

  const features = [
    {
      icon: Star,
      title: "Premium Selection",
      description: "Handpicked luxury properties from the most prestigious locations worldwide."
    },
    {
      icon: Shield,
      title: "Trusted Service",
      description: "Over two decades of excellence in luxury real estate transactions."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized as the leading luxury real estate platform globally."
    },
    {
      icon: TrendingUp,
      title: "Market Insights",
      description: "Advanced analytics and market intelligence for informed decisions."
    }
  ];

  const handleViewDetails = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Why Choose
              <span className="font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent ml-3">
                LuxEstate
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the pinnacle of luxury real estate with our comprehensive suite of premium services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Featured
              <span className="font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent ml-3">
                Properties
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our most exclusive and sought-after luxury properties.
            </p>
          </motion.div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProperties.slice(0, 6).map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <PropertyCard
                    property={property}
                    onViewDetails={handleViewDetails}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No featured properties available at the moment.</p>
              <Button 
                onClick={() => navigate('/properties')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
              >
                Browse All Properties
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {featuredProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Button 
                onClick={() => navigate('/properties')}
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8 py-4 h-auto text-lg"
              >
                View All Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Ready to Find Your
              <span className="font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent ml-3">
                Dream Home?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let our expert team guide you through the journey of finding the perfect luxury property.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8 py-4 h-auto text-lg"
                onClick={() => navigate('/properties')}
              >
                Start Your Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 h-auto text-lg"
                onClick={() => navigate('/contact')}
              >
                Speak with an Expert
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
