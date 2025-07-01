
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  specifications: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    lotSize?: number;
    yearBuilt?: number;
    propertyType: 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
  };
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  amenities: string[];
  status: 'available' | 'pending' | 'sold';
  featured: boolean;
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  profileImage: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  active: boolean;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredDate?: Date;
  status: 'new' | 'in-progress' | 'closed';
  assignedAgentId?: string;
  createdAt: Date;
}
