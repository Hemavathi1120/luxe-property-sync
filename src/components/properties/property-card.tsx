
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Bed, Bath, Square, Heart, Eye } from 'lucide-react';
import { Property } from '@/types/property';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  isFavorite?: boolean;
}

const PropertyCard = ({ property, onViewDetails, onToggleFavorite, isFavorite }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="relative overflow-hidden">
          <img
            src={property.images[0] ? getOptimizedImageUrl(property.images[0], 400, 300) : '/placeholder.svg'}
            alt={property.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <Badge 
            className={`absolute top-4 left-4 ${
              property.status === 'available' ? 'bg-green-500' : 
              property.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
            } text-white`}
          >
            {property.status.toUpperCase()}
          </Badge>

          {/* Featured Badge */}
          {property.featured && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold">
              FEATURED
            </Badge>
          )}

          {/* Favorite Button */}
          {onToggleFavorite && (
            <Button
              size="sm"
              variant="ghost"
              className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(property.id);
              }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </Button>
          )}

          {/* View Count */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Eye className="h-4 w-4" />
            <span>{property.viewCount}</span>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{property.location.city}, {property.location.state}</span>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {property.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.specifications.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.specifications.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.specifications.sqft.toLocaleString()} sq ft</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
            <Button 
              onClick={() => onViewDetails(property.id)}
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PropertyCard;
