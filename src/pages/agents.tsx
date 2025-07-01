
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, Search, Filter } from 'lucide-react';
import Navbar from '@/components/layout/navbar';

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Mock data - in real app, this would come from Firebase
  const agents = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@luxestate.com',
      phone: '+1 (555) 123-4567',
      bio: 'Luxury property specialist with 15+ years experience in high-end residential sales.',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      specialties: ['Luxury Homes', 'Waterfront Properties', 'Investment Properties'],
      rating: 4.9,
      reviewCount: 127,
      active: true,
      location: 'Beverly Hills, CA'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@luxestate.com',
      phone: '+1 (555) 234-5678',
      bio: 'Commercial real estate expert specializing in premium office spaces and retail locations.',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      specialties: ['Commercial Properties', 'Office Spaces', 'Retail Locations'],
      rating: 4.8,
      reviewCount: 89,
      active: true,
      location: 'Manhattan, NY'
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      email: 'elena@luxestate.com',
      phone: '+1 (555) 345-6789',
      bio: 'Residential specialist focusing on family homes and first-time buyers.',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      specialties: ['Family Homes', 'First-Time Buyers', 'Condominiums'],
      rating: 4.7,
      reviewCount: 156,
      active: true,
      location: 'Miami, FL'
    }
  ];

  const specialties = ['All', 'Luxury Homes', 'Commercial Properties', 'Waterfront Properties', 'Investment Properties', 'Family Homes'];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'All' ||
                            agent.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Meet Our Expert Agents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced team of real estate professionals is dedicated to helping you find your perfect property
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search agents by name or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {specialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={selectedSpecialty === specialty ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSpecialty(specialty)}
                      className="whitespace-nowrap"
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={agent.profileImage}
                      alt={agent.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-500 text-white">
                        {agent.active ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{agent.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{agent.rating}</span>
                        <span className="text-sm text-gray-500">({agent.reviewCount})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{agent.location}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{agent.bio}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {agent.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">No agents found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agents;
