'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Home, Shield, Palette, Zap, Building, Eye, Target, Key, Smartphone, Users, Calculator, ArrowRight, Star, CheckCircle, Sofa, BedDouble, LampDesk, Tv, Speaker, Award, MessageSquare, Video, Phone, HelpCircle, ChevronRight, KeyRound, TrendingUp, DollarSign, Baby, Maximize2, BedSingle, Brain, FileText, Lightbulb, Lock, CreditCard, ShoppingCart, MinusCircle, PlusCircle, MapPin, Bed, Bath, Square
} from 'lucide-react';

// Room packs data with unit-specific availability
const roomPacks = [
  {
    id: 'living-room',
    icon: Sofa,
    title: 'Living Room Pack',
    description: 'Designer sofa, coffee table, TV unit, lighting, decor',
    features: ['Premium sofa', 'Smart TV', 'Designer lighting', 'Rug & decor'],
    price: 3500,
    category: 'furniture'
  },
  {
    id: 'bedroom',
    icon: BedDouble,
    title: 'Bedroom Pack',
    description: 'Bed, mattress, wardrobe, bedside tables, lamps',
    features: ['Luxury bed', 'Memory foam mattress', 'Wardrobe', 'Bedside lamps'],
    price: 2800,
    category: 'furniture'
  },
  {
    id: 'home-office',
    icon: LampDesk,
    title: 'Home Office Pack',
    description: 'Desk, ergonomic chair, storage, smart lighting',
    features: ['Ergonomic desk', 'Premium chair', 'Smart lamp', 'Shelving'],
    price: 1800,
    category: 'furniture'
  },
  {
    id: 'media-room',
    icon: Tv,
    title: 'Media Room Pack',
    description: 'Home cinema, surround sound, blackout blinds',
    features: ['4K projector', 'Surround sound', 'Blackout blinds', 'Acoustic panels'],
    price: 4200,
    category: 'furniture'
  },
  {
    id: 'nursery',
    icon: Baby,
    title: 'Nursery Pack',
    description: 'Complete nursery setup for your new arrival',
    features: ['Convertible crib', 'Changing station', 'Baby monitor', 'Blackout curtains', 'Rocking chair'],
    price: 2200,
    category: 'furniture',
    isNew: true
  }
];

const smartFeatures = [
  {
    id: 'smart-security',
    icon: Shield,
    title: 'Smart Security',
    description: 'Video doorbell, smart locks, alarm system',
    features: ['App control', '24/7 monitoring', 'Remote access'],
    price: 1800,
    category: 'smart'
  },
  {
    id: 'home-automation',
    icon: Smartphone,
    title: 'Home Automation',
    description: 'Lighting, heating, blinds, all app-controlled',
    features: ['Voice assistant', 'Scene presets', 'Energy savings'],
    price: 2400,
    category: 'smart'
  },
  {
    id: 'integrated-audio',
    icon: Speaker,
    title: 'Integrated Audio',
    description: 'Multi-room speakers, streaming, voice control',
    features: ['Hi-fi sound', 'Spotify/AirPlay', 'Invisible install'],
    price: 1600,
    category: 'smart'
  }
];

const premiumUpgrades = [
  {
    id: 'luxury-finishes',
    icon: Palette,
    title: 'Luxury Finishes',
    description: 'Marble, hardwood, designer paint, custom cabinetry',
    features: ['Italian marble', 'Hardwood floors', 'Designer paint', 'Custom kitchen'],
    price: 8500,
    category: 'upgrade'
  },
  {
    id: 'energy-efficiency',
    icon: Zap,
    title: 'Energy Efficiency',
    description: 'Solar panels, heat pumps, EV charging',
    features: ['Solar PV', 'A-rated appliances', 'EV charger', 'Smart thermostat'],
    price: 12000,
    category: 'upgrade'
  }
];

interface UnitDetails {
  unitId: string;
  address: string;
  developmentName: string;
  houseType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  price: number;
  floorPlan: string;
  features: string[];
  depositPaid: boolean;
  reservationDate: string;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  category: string;
}

export default function UnitCustomizationPage() {
  const params = useParams();
  const router = useRouter();
  const unitId = params?.unitId as string;
  
  const [loading, setLoading] = useState(true);
  const [unitDetails, setUnitDetails] = useState<UnitDetails | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [propChoiceCredit, setPropChoiceCredit] = useState(2500);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('furniture');

  useEffect(() => {
    const loadUnitDetails = async () => {
      try {
        // Mock authentication check
        const mockUser = {
          id: 'buyer-123',
          firstName: 'Sarah',
          lastName: 'O\'Connor',
          email: 'sarah@example.com'
        };

        // Mock unit details based on unitId
        const mockUnit: UnitDetails = {
          unitId: unitId,
          address: unitId.includes('unit-15') ? '15 Fitzgerald Gardens, Drogheda' : '23 Fitzgerald Gardens, Drogheda',
          developmentName: 'Fitzgerald Gardens',
          houseType: '3 Bed / 5P Terraced',
          bedrooms: 3,
          bathrooms: 2,
          area: 107,
          price: 395000,
          floorPlan: '/images/developments/fitzgerald-gardens/3bed-floorplan.jpg',
          features: ['Private Garden', 'Energy Efficient Design', 'Premium Finishes', 'Parking Space'],
          depositPaid: true,
          reservationDate: '2024-03-15'
        };

        // Validate booking deposit
        if (!mockUnit.depositPaid) {
          alert('Booking deposit required before accessing customization options.');
          router.push('/buyer/prop-choice');
          return;
        }

        setUser(mockUser);
        setUnitDetails(mockUnit);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load unit details:', error);
        router.push('/buyer/prop-choice');
      }
    };

    if (unitId) {
      loadUnitDetails();
    }
  }, [unitId, router]);

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const creditApplied = Math.min(propChoiceCredit, subtotal);
    const finalTotal = subtotal - creditApplied;
    
    return {
      subtotal,
      creditApplied,
      finalTotal
    };
  };

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Please add items to your cart before proceeding.');
      return;
    }
    
    const totals = calculateTotals();
    // In real app, this would integrate with payment processor
    alert(`Proceeding to payment: €${totals.finalTotal.toLocaleString()} (after €${totals.creditApplied.toLocaleString()} credit applied)`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customization options...</p>
        </div>
      </div>
    );
  }

  if (!unitDetails || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Lock className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Unable to load unit details or verify booking deposit.</p>
          <Link 
            href="/buyer/prop-choice"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Back to PROP Choice
          </Link>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/buyer/prop-choice" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to PROP Choice
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">Customize Your Home</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">PROP Choice Credit Available</p>
              <p className="text-2xl font-bold text-green-600">€{propChoiceCredit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Unit Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{unitDetails.address}</h2>
                  <p className="text-gray-600">{unitDetails.developmentName}</p>
                  <p className="text-lg font-semibold text-purple-600 mt-2">{unitDetails.houseType}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">€{unitDetails.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Property Price</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{unitDetails.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{unitDetails.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">{unitDetails.area} sq.m</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {unitDetails.features.map((feature, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-8">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  {[
                    { id: 'furniture', label: 'Room Packs', icon: Sofa },
                    { id: 'smart', label: 'Smart Features', icon: Smartphone },
                    { id: 'upgrade', label: 'Premium Upgrades', icon: Palette }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {React.createElement(tab.icon, { size: 20 })}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {/* Room Packs */}
                {activeTab === 'furniture' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {roomPacks.map((pack, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                            {React.createElement(pack.icon, { size: 24 })}
                          </div>
                          {pack.isNew && (
                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{pack.title}</h3>
                        <p className="text-gray-600 mb-4">{pack.description}</p>
                        <p className="text-2xl font-bold text-purple-600 mb-4">€{pack.price.toLocaleString()}</p>
                        <ul className="space-y-2 mb-6">
                          {pack.features.map((feature, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="text-green-400" size={16} />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => addToCart(pack)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Smart Features */}
                {activeTab === 'smart' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {smartFeatures.map((feature, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                          {React.createElement(feature.icon, { size: 24 })}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <p className="text-2xl font-bold text-blue-600 mb-4">€{feature.price.toLocaleString()}</p>
                        <ul className="space-y-2 mb-6">
                          {feature.features.map((feat, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="text-green-400" size={16} />
                              <span className="text-gray-700">{feat}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => addToCart(feature)}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Premium Upgrades */}
                {activeTab === 'upgrade' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {premiumUpgrades.map((upgrade, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white mb-4">
                          {React.createElement(upgrade.icon, { size: 24 })}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{upgrade.title}</h3>
                        <p className="text-gray-600 mb-4">{upgrade.description}</p>
                        <p className="text-2xl font-bold text-orange-600 mb-4">€{upgrade.price.toLocaleString()}</p>
                        <ul className="space-y-2 mb-6">
                          {upgrade.features.map((feat, bIdx) => (
                            <li key={bIdx} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="text-green-400" size={16} />
                              <span className="text-gray-700">{feat}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => addToCart(upgrade)}
                          className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">Your Cart</h3>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                  {cart.length}
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-2">Add items to start customizing</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">€{item.price.toLocaleString()} each</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                            <span className="font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              <PlusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-6">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">€{totals.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>PROP Choice Credit:</span>
                        <span className="font-medium">-€{totals.creditApplied.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>€{totals.finalTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </button>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Items will be installed before move-in date
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}