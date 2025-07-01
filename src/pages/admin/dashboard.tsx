import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { 
  Building, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  Plus,
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Check,
  X,
  UserCheck
} from 'lucide-react';
import { Property, Agent, Inquiry } from '@/types/property';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pendingAgents, setPendingAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const propertyForm = useForm({
    defaultValues: {
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
      propertyType: '',
      amenities: '',
      agentId: ''
    }
  });

  const agentForm = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      specialties: ''
    }
  });

  useEffect(() => {
    // Properties listener
    const propertiesQuery = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribeProperties = onSnapshot(propertiesQuery, (snapshot) => {
      const propertiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Property[];
      setProperties(propertiesData);
    });

    // Agents listener
    const agentsQuery = query(collection(db, 'agents'), orderBy('createdAt', 'desc'));
    const unsubscribeAgents = onSnapshot(agentsQuery, (snapshot) => {
      const agentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Agent[];
      setAgents(agentsData.filter(agent => agent.active));
      setPendingAgents(agentsData.filter(agent => !agent.active));
    });

    // Inquiries listener
    const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
      const inquiriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        preferredDate: doc.data().preferredDate?.toDate()
      })) as Inquiry[];
      setInquiries(inquiriesData);
    });

    setLoading(false);

    return () => {
      unsubscribeProperties();
      unsubscribeAgents();
      unsubscribeInquiries();
    };
  }, []);

  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true);
    const imageUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }
      setUploadingImages(false);
      return imageUrls;
    } catch (error) {
      setUploadingImages(false);
      toast({
        title: "Error uploading images",
        description: "Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  const addProperty = async (data: any) => {
    try {
      const newProperty = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          coordinates: { lat: 0, lng: 0 } // Default coordinates
        },
        specifications: {
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseFloat(data.bathrooms),
          sqft: parseInt(data.sqft),
          propertyType: data.propertyType as 'house' | 'condo' | 'townhouse' | 'land' | 'commercial'
        },
        images: [], // Images would be uploaded separately
        amenities: data.amenities.split(',').map((a: string) => a.trim()),
        status: 'available' as const,
        featured: false,
        agentId: data.agentId,
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0
      };

      await addDoc(collection(db, 'properties'), newProperty);
      
      toast({
        title: "Property added successfully",
        description: "The new property has been added to the database.",
      });
      
      setShowAddProperty(false);
      propertyForm.reset();
    } catch (error) {
      toast({
        title: "Error adding property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const addAgent = async (data: any) => {
    try {
      const newAgent = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        bio: data.bio,
        profileImage: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face`, // Default image
        specialties: data.specialties.split(',').map((s: string) => s.trim()),
        rating: 0,
        reviewCount: 0,
        active: true,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'agents'), newAgent);
      
      toast({
        title: "Agent added successfully",
        description: "The new agent has been added and activated.",
      });
      
      setShowAddAgent(false);
      agentForm.reset();
    } catch (error) {
      toast({
        title: "Error adding agent",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const approveAgent = async (agentId: string) => {
    try {
      await updateDoc(doc(db, 'agents', agentId), {
        active: true,
        updatedAt: new Date()
      });
      
      toast({
        title: "Agent approved",
        description: "The agent has been activated and can now list properties.",
      });
    } catch (error) {
      toast({
        title: "Error approving agent",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const rejectAgent = async (agentId: string) => {
    try {
      await deleteDoc(doc(db, 'agents', agentId));
      
      toast({
        title: "Agent rejected",
        description: "The agent application has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error rejecting agent",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const updatePropertyStatus = async (propertyId: string, status: 'available' | 'pending' | 'sold') => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        status,
        updatedAt: new Date()
      });
      
      toast({
        title: "Property updated",
        description: `Property status changed to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFeaturedProperty = async (propertyId: string, currentFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        featured: !currentFeatured,
        updatedAt: new Date()
      });
      
      toast({
        title: "Property updated",
        description: `Property ${!currentFeatured ? 'featured' : 'unfeatured'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error updating property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      
      toast({
        title: "Property deleted",
        description: "The property has been removed from the database.",
      });
    } catch (error) {
      toast({
        title: "Error deleting property",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const assignInquiry = async (inquiryId: string, agentId: string, agentName: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', inquiryId), {
        assignedAgentId: agentId,
        assignedAgentName: agentName,
        status: 'in-progress',
        updatedAt: new Date()
      });
      
      toast({
        title: "Inquiry assigned",
        description: `Inquiry has been assigned to ${agentName}.`,
      });
    } catch (error) {
      toast({
        title: "Error assigning inquiry",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { label: 'Total Properties', value: properties.length.toString(), change: '+12%', icon: Building, color: 'text-blue-600' },
    { label: 'Active Agents', value: agents.length.toString(), change: '+5%', icon: Users, color: 'text-green-600' },
    { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length.toString(), change: '+23%', icon: MessageSquare, color: 'text-amber-600' },
    { label: 'Pending Agents', value: pendingAgents.length.toString(), change: 'Need approval', icon: UserCheck, color: 'text-purple-600' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LuxEstate Admin</h1>
              <p className="text-sm text-gray-600">Manage your real estate platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showAddAgent} onOpenChange={setShowAddAgent}>
              <DialogTrigger asChild>
                <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Agent</DialogTitle>
                </DialogHeader>
                <Form {...agentForm}>
                  <form onSubmit={agentForm.handleSubmit(addAgent)} className="space-y-4">
                    <FormField
                      control={agentForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Agent name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={agentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="agent@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={agentForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={agentForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Agent bio..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={agentForm.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialties (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="Luxury Homes, Commercial, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Add Agent
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={showAddProperty} onOpenChange={setShowAddProperty}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Property</DialogTitle>
                </DialogHeader>
                <Form {...propertyForm}>
                  <form onSubmit={propertyForm.handleSubmit(addProperty)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={propertyForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Property Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Beautiful Modern Home" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="850000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="propertyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="house">House</SelectItem>
                                <SelectItem value="condo">Condo</SelectItem>
                                <SelectItem value="townhouse">Townhouse</SelectItem>
                                <SelectItem value="land">Land</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.5" placeholder="2.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="sqft"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Square Feet</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="2500" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="agentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Assigned Agent</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select agent" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {agents.map((agent) => (
                                  <SelectItem key={agent.id} value={agent.id}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={propertyForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={propertyForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Los Angeles" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={propertyForm.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="90210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={propertyForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Property description..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={propertyForm.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amenities (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="Pool, Garage, Garden, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Add Property
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.label === 'Pending Agents' ? 'text-purple-600' : 'text-green-600'}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="pending">Pending Agents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Property Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search properties..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{property.title}</h3>
                          {property.featured && (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800">Featured</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{formatCurrency(property.price)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {property.viewCount} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {property.location.city}, {property.location.state}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleFeaturedProperty(property.id, property.featured)}
                        >
                          <Star className={`h-4 w-4 ${property.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </Button>
                        <select
                          value={property.status}
                          onChange={(e) => updatePropertyStatus(property.id, e.target.value as any)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="available">Available</option>
                          <option value="pending">Pending</option>
                          <option value="sold">Sold</option>
                        </select>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteProperty(property.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Recent Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                          <p className="text-sm text-gray-600">Property ID: {inquiry.propertyId}</p>
                        </div>
                        <Badge className={getStatusColor(inquiry.status)}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{inquiry.message}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{inquiry.email}</span>
                          <span>{inquiry.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{inquiry.createdAt?.toLocaleDateString()}</span>
                        </div>
                      </div>
                      {inquiry.status === 'new' && (
                        <div className="mt-4 flex gap-2">
                          {agents.map((agent) => (
                            <Button
                              key={agent.id}
                              size="sm"
                              variant="outline"
                              onClick={() => assignInquiry(inquiry.id, agent.id, agent.name)}
                            >
                              Assign to {agent.name}
                            </Button>
                          ))}
                        </div>
                      )}
                      {inquiry.assignedAgentId && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Assigned to: </span>
                          <span className="font-medium">{inquiry.assignedAgentId}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Active Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {agent.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{agent.rating || 0}</span>
                        </div>
                        <span className="text-gray-600">{agent.reviewCount || 0} reviews</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Agents Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-amber-600" />
                  Pending Agent Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingAgents.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No pending agent applications</p>
                  ) : (
                    pendingAgents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                          <p className="text-sm text-gray-600">{agent.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveAgent(agent.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectAgent(agent.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Property Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {properties.reduce((sum, p) => sum + p.viewCount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total views this month</div>
                    <div className="text-sm text-green-600 mt-1">Real-time data</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Inquiries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{inquiries.length}</div>
                    <div className="text-sm text-gray-600">Total inquiries</div>
                    <div className="text-sm text-green-600 mt-1">
                      {inquiries.filter(i => i.status === 'new').length} new
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
