
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from Firebase
  const stats = [
    { label: 'Total Properties', value: '1,247', change: '+12%', icon: Building, color: 'text-blue-600' },
    { label: 'Active Agents', value: '89', change: '+5%', icon: Users, color: 'text-green-600' },
    { label: 'New Inquiries', value: '156', change: '+23%', icon: MessageSquare, color: 'text-amber-600' },
    { label: 'Monthly Revenue', value: '$2.4M', change: '+18%', icon: DollarSign, color: 'text-purple-600' }
  ];

  const recentProperties = [
    {
      id: '1',
      title: 'Luxury Penthouse in Beverly Hills',
      price: 2500000,
      status: 'available',
      views: 1247,
      inquiries: 23,
      agent: 'Sarah Mitchell',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Modern Condo in Manhattan',
      price: 1800000,
      status: 'pending',
      views: 892,
      inquiries: 18,
      agent: 'Michael Chen',
      createdAt: '2024-01-14'
    }
  ];

  const recentInquiries = [
    {
      id: '1',
      propertyTitle: 'Luxury Penthouse in Beverly Hills',
      customerName: 'John Smith',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      message: 'Interested in scheduling a viewing this weekend.',
      status: 'new',
      createdAt: '2024-01-15T10:30:00Z',
      assignedAgent: null
    },
    {
      id: '2',
      propertyTitle: 'Modern Condo in Manhattan',
      customerName: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1 (555) 234-5678',
      message: 'Looking for more information about financing options.',
      status: 'in-progress',
      createdAt: '2024-01-15T09:15:00Z',
      assignedAgent: 'Michael Chen'
    }
  ];

  const topAgents = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      email: 'sarah@luxestate.com',
      properties: 45,
      deals: 12,
      revenue: 480000,
      rating: 4.9
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@luxestate.com',
      properties: 38,
      deals: 10,
      revenue: 420000,
      rating: 4.8
    }
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
                      <p className="text-sm text-green-600">{stat.change} from last month</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
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
                  {recentProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>{formatCurrency(property.price)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {property.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {property.inquiries} inquiries
                          </span>
                          <span>Agent: {property.agent}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
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
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{inquiry.customerName}</h3>
                          <p className="text-sm text-gray-600">{inquiry.propertyTitle}</p>
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
                          <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {inquiry.assignedAgent && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Assigned to: </span>
                          <span className="font-medium">{inquiry.assignedAgent}</span>
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
                <CardTitle>Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAgents.map((agent) => (
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
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{agent.properties}</div>
                          <div className="text-gray-600">Properties</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{agent.deals}</div>
                          <div className="text-gray-600">Deals</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">{formatCurrency(agent.revenue)}</div>
                          <div className="text-gray-600">Revenue</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <div className="text-3xl font-bold text-gray-900 mb-2">24,567</div>
                    <div className="text-sm text-gray-600">Total views this month</div>
                    <div className="text-sm text-green-600 mt-1">+15% from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-3xl font-bold text-gray-900 mb-2">12.5%</div>
                    <div className="text-sm text-gray-600">Inquiry to sale conversion</div>
                    <div className="text-sm text-green-600 mt-1">+2.3% from last month</div>
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
