
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Play, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=1920&h=1080&fit=crop&crop=center')"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">
            Discover Your
            <span className="block font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Dream Estate
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl font-light mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Luxury real estate redefined. Explore premium properties with unparalleled elegance and sophistication.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8 py-4 h-auto text-lg shadow-lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-4 h-auto text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Virtual Tour
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-8 text-center"
        >
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-amber-400">500+</div>
            <div className="text-sm text-gray-300">Premium Properties</div>
          </div>
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-amber-400">$2.5B+</div>
            <div className="text-sm text-gray-300">Properties Sold</div>
          </div>
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="text-2xl font-bold text-amber-400">98%</div>
            <div className="text-sm text-gray-300">Client Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
