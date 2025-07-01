
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Property } from '@/types/property';

export const useProperties = (filters?: {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  featured?: boolean;
}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));

    if (filters?.featured) {
      q = query(q, where('featured', '==', true));
    }
    if (filters?.city) {
      q = query(q, where('location.city', '==', filters.city));
    }
    if (filters?.propertyType) {
      q = query(q, where('specifications.propertyType', '==', filters.propertyType));
    }
    if (filters?.bedrooms) {
      q = query(q, where('specifications.bedrooms', '>=', filters.bedrooms));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propertiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];

      // Apply price filters client-side for more complex filtering
      let filteredProperties = propertiesData;
      if (filters?.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
      }

      setProperties(filteredProperties);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filters]);

  return { properties, loading, error };
};
