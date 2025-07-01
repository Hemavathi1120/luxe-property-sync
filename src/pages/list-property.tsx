
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/navbar';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Upload,
  X,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ListPropertyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');

  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    lotSize: '',
    yearBuilt: '',
    propertyType: 'house' as 'house' | 'condo' | 'townhouse' | 'land' | 'commercial',
    virtualTourUrl: '',
    featured: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages].slice(0, 10)); // Max 10 images
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities(prev => [...prev, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(prev => prev.filter(a => a !== amenity));
  };

  const uploadFiles = async () => {
    const imageUrls: string[] = [];
    let videoUrl = '';

    // Upload images
    for (const image of images) {
      const imageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const url = await getDownloadURL(snapshot.ref);
      imageUrls.push(url);
    }

    // Upload video if exists
    if (videoFile) {
      const videoRef = ref(storage, `properties/videos/${Date.now()}_${videoFile.name}`);
      const snapshot = await uploadBytes(videoRef, videoFile);
      videoUrl = await getDownloadURL(snapshot.ref);
    }

    return { imageUrls, videoUrl };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { imageUrls, videoUrl } = await uploadFiles();

      const property = {
        title: propertyData.title,
        description: propertyData.description,
        price: parseFloat(propertyData.price),
        location: {
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zipCode,
          coordinates: { lat: 0, lng: 0 } // You can integrate Google Geocoding API here
        },
        specifications: {
          bedrooms: parseInt(propertyData.bedrooms),
          bathrooms: parseFloat(propertyData.bathrooms),
          sqft: parseInt(propertyData.sqft),
          lotSize: propertyData.lotSize ? parseInt(propertyData.lotSize) : undefined,
          yearBuilt: propertyData.yearBuilt ? parseInt(propertyData.yearBuilt) : undefined,
          propertyType: propertyData.propertyType
        },
        images: imageUrls,
        videoUrl: videoUrl || undefined,
        virtualTourUrl: propertyData.virtualTourUrl || undefined,
        amenities,
        status: 'available' as const,
        featured: propertyData.featured,
        agentId: 'current-user-id', // Replace with actual agent ID from auth
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0
      };

      await addDoc(collection(db, 'properties'), property);

      toast({
        title: "Property listed successfully!",
        description: "Your property is now live and visible to potential buyers.",
      });

      navigate('/properties');
    } catch (error: any) {
      toast({
        title: "Failed to list property",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              List Your
              <span className="font-bold bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent ml-3">
                Property
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Showcase your premium property to our exclusive network of qualified buyers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-6 w-6 text-amber-600" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="title">Property Title</Label>
                      <Input
                        id="title"
                        placeholder="Luxury Penthouse in Beverly Hills"
                        value={propertyData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the property's unique features, amenities, and selling points..."
                        rows={4}
                        value={propertyData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="2500000"
                          className="pl-10"
                          value={propertyData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type</Label>
                      <Select value={propertyData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                          <SelectItem value="land">Land</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-amber-600" />
                      Location
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Luxury Lane"
                          value={propertyData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Beverly Hills"
                          value={propertyData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="CA"
                          value={propertyData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="90210"
                          value={propertyData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Square className="h-5 w-5 text-amber-600" />
                      Specifications
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <div className="relative">
                          <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="bedrooms"
                            type="number"
                            placeholder="4"
                            className="pl-10"
                            value={propertyData.bedrooms}
                            onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <div className="relative">
                          <Bath className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="bathrooms"
                            type="number"
                            step="0.5"
                            placeholder="3.5"
                            className="pl-10"
                            value={propertyData.bathrooms}
                            onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sqft">Square Feet</Label>
                        <Input
                          id="sqft"
                          type="number"
                          placeholder="3500"
                          value={propertyData.sqft}
                          onChange={(e) => handleInputChange('sqft', e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="yearBuilt">Year Built</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="yearBuilt"
                            type="number"
                            placeholder="2020"
                            className="pl-10"
                            value={propertyData.yearBuilt}
                            onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lotSize">Lot Size (sq ft)</Label>
                        <Input
                          id="lotSize"
                          type="number"
                          placeholder="8000"
                          value={propertyData.lotSize}
                          onChange={(e) => handleInputChange('lotSize', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Upload className="h-5 w-5 text-amber-600" />
                      Images & Media
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="images">Property Images (Max 10)</Label>
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="mt-2"
                        />
                        {images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-20 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="video">Property Video (Optional)</Label>
                        <Input
                          id="video"
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="mt-2"
                        />
                        {videoFile && (
                          <p className="text-sm text-green-600 mt-2">Video selected: {videoFile.name}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="virtualTour">Virtual Tour URL (Optional)</Label>
                        <Input
                          id="virtualTour"
                          type="url"
                          placeholder="https://my.matterport.com/show/?m=..."
                          value={propertyData.virtualTourUrl}
                          onChange={(e) => handleInputChange('virtualTourUrl', e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Amenities</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add amenity (e.g., Swimming Pool)"
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                      />
                      <Button type="button" onClick={addAmenity} variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                            {amenity}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeAmenity(amenity)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Featured Property */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={propertyData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <Label htmlFor="featured">Mark as Featured Property</Label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
                    >
                      {loading ? 'Listing Property...' : 'List Property'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListPropertyPage;
