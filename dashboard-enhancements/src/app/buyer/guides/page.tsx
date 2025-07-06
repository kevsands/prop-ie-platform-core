'use client';

import { useState } from 'react';
import { Book, Download, Clock, User, Search, Filter, ChevronRight, FileText, Video, Headphones, Star } from 'lucide-react';
import { format } from 'date-fns';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'buying-process' | 'financing' | 'legal' | 'moving' | 'maintenance';
  type: 'pdf' | 'video' | 'article' | 'podcast';
  readTime: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  publishedDate: Date;
  lastUpdated: Date;
  downloadUrl?: string;
  videoUrl?: string;
  tags: string[];
  isFeatured: boolean;
  rating: number;
  views: number;
}

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  
  // Mock guides data
  const guides: Guide[] = [
    {
      id: '1',
      title: 'Complete First-Time Buyer\'s Guide',
      description: 'Everything you need to know about buying your first home in Ireland, from start to finish.',
      category: 'buying-process',
      type: 'pdf',
      readTime: 30,
      difficulty: 'beginner',
      author: 'PROP Property Experts',
      publishedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      downloadUrl: '/guides/first-time-buyers-guide.pdf',
      tags: ['first-time-buyer', 'overview', 'essential'],
      isFeatured: true,
      rating: 4.8,
      views: 15420
    },
    {
      id: '2',
      title: 'Understanding Help-to-Buy Scheme',
      description: 'Learn how to maximize your benefits from the Help-to-Buy scheme and calculate your eligibility.',
      category: 'financing',
      type: 'video',
      readTime: 15,
      difficulty: 'beginner',
      author: 'Financial Advisory Team',
      publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      videoUrl: '/videos/htb-explained',
      tags: ['help-to-buy', 'financing', 'government-scheme'],
      isFeatured: true,
      rating: 4.9,
      views: 8932
    },
    {
      id: '3',
      title: 'Legal Checklist for Property Purchase',
      description: 'A comprehensive checklist of all legal requirements and documents needed for property purchase.',
      category: 'legal',
      type: 'article',
      readTime: 20,
      difficulty: 'intermediate',
      author: 'Legal Department',
      publishedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      tags: ['legal', 'contracts', 'documentation'],
      isFeatured: false,
      rating: 4.7,
      views: 6723
    },
    {
      id: '4',
      title: 'Property Viewing Tips',
      description: 'What to look for during property viewings and questions to ask the agent.',
      category: 'buying-process',
      type: 'podcast',
      readTime: 25,
      difficulty: 'beginner',
      author: 'Sarah Johnson',
      publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      tags: ['viewing', 'inspection', 'tips'],
      isFeatured: false,
      rating: 4.6,
      views: 4521
    },
    {
      id: '5',
      title: 'Moving Day Preparation Guide',
      description: 'Step-by-step guide to prepare for your moving day and ensure a smooth transition.',
      category: 'moving',
      type: 'pdf',
      readTime: 10,
      difficulty: 'beginner',
      author: 'Operations Team',
      publishedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      downloadUrl: '/guides/moving-day-guide.pdf',
      tags: ['moving', 'checklist', 'preparation'],
      isFeatured: false,
      rating: 4.5,
      views: 3892
    }
  ];
  
  // Filter guides
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesType = selectedType === 'all' || guide.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });
  
  // Group guides by category
  const guidesbyCategory = filteredGuides.reduce((acc, guide) => {
    if (!acc[guide.category]) {
      acc[guide.category] = [];
    }
    acc[guide.category].push(guide);
    return acc;
  }, {} as Record<string, Guide[]>);
  
  const categoryNames = {
    'buying-process': 'Buying Process',
    'financing': 'Financing & Mortgages',
    'legal': 'Legal & Documentation',
    'moving': 'Moving & Settling In',
    'maintenance': 'Home Maintenance'
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
      case 'video': return <Video className="h-5 w-5 text-blue-600" />;
      case 'article': return <Book className="h-5 w-5 text-green-600" />;
      case 'podcast': return <Headphones className="h-5 w-5 text-purple-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer\'s Guides & Resources</h1>
          <p className="text-gray-600 mt-1">Learn everything you need to know about buying property</p>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="buying-process">Buying Process</option>
                <option value="financing">Financing</option>
                <option value="legal">Legal</option>
                <option value="moving">Moving</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Guides</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="podcast">Podcasts</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Featured Guides */}
        {guides.filter(g => g.isFeatured).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Guides</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {guides.filter(g => g.isFeatured).map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(guide.type)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{guide.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{guide.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {guide.views.toLocaleString()} views
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                      {guide.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Guides by Category */}
        {Object.entries(guidesbyCategory).map(([category, categoryGuides]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {categoryNames[category as keyof typeof categoryNames]}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryGuides.map((guide) => (
                <div 
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-4">
                    {getTypeIcon(guide.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{guide.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {guide.readTime} min
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(guide.difficulty)}`}>
                        {guide.difficulty}
                      </span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Guide Detail Modal */}
        {selectedGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(selectedGuide.type)}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedGuide.title}</h2>
                      <p className="text-gray-600 mt-1">{selectedGuide.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGuide(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedGuide.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedGuide.readTime} min read
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      {selectedGuide.rating} ({selectedGuide.views.toLocaleString()} views)
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedGuide.difficulty)}`}>
                    {selectedGuide.difficulty}
                  </span>
                </div>
                
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">
                    This is where the full content of the guide would be displayed. 
                    In a real application, this would contain the complete article, 
                    video embed, or download link depending on the guide type.
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {selectedGuide.downloadUrl && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="h-5 w-5" />
                      Download PDF
                    </button>
                  )}
                  {selectedGuide.videoUrl && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Video className="h-5 w-5" />
                      Watch Video
                    </button>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    Last updated: {format(selectedGuide.lastUpdated, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}