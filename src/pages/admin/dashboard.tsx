import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Building, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  MapPin,
  Calendar,
  Check,
  X,
  UserCheck,
  UserX
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

  // Real-time listeners
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
          <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
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
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
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
