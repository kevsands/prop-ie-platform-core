'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Home,
  CreditCard,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Check,
  X,
  Edit2,
  Save,
  ChevronRight,
  Lock,
  Key,
  Globe,
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Heart,
  Target,
  Users,
  Building,
  BanknoteIcon,
  Calculator,
  TrendingUp,
  Award,
  Star,
  Gift,
  Zap,
  Brain,
  PiggyBank,
  School,
  Stethoscope,
  ShoppingBag,
  Train,
  Car,
  Trees,
  Sun,
  Coffee,
  Dumbbell,
  Music,
  BookOpen,
  Palette,
  ChevronDown,
  Settings,
  Loader2,
  UserCheck,
  BarChart3,
  Search
} from 'lucide-react';

// Profile sections
const profileSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'preferences', label: 'Property Preferences', icon: Home },
  { id: 'financial', label: 'Financial Info', icon: CreditCard },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  { id: 'activity', label: 'Activity & Insights', icon: BarChart3 }
];

// Lifestyle preferences
const lifestyleOptions = [
  { id: 'family', label: 'Family-oriented', icon: Users },
  { id: 'professional', label: 'Young Professional', icon: Briefcase },
  { id: 'investor', label: 'Property Investor', icon: TrendingUp },
  { id: 'downsizer', label: 'Downsizing', icon: Home },
  { id: 'firsttime', label: 'First-time Buyer', icon: Award }
];

// Amenity preferences
const amenityPreferences = [
  { id: 'schools', label: 'Schools', icon: School },
  { id: 'transport', label: 'Public Transport', icon: Train },
  { id: 'healthcare', label: 'Healthcare', icon: Stethoscope },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'parks', label: 'Parks & Nature', icon: Trees },
  { id: 'gym', label: 'Fitness Centers', icon: Dumbbell },
  { id: 'cafes', label: 'Cafes & Restaurants', icon: Coffee },
  { id: 'culture', label: 'Arts & Culture', icon: Palette }
];

// Property features
const propertyFeatures = [
  { id: 'garden', label: 'Garden', icon: Trees },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'garage', label: 'Garage', icon: Building },
  { id: 'balcony', label: 'Balcony', icon: Sun },
  { id: 'ensuite', label: 'En-suite', icon: Home },
  { id: 'office', label: 'Home Office', icon: Briefcase },
  { id: 'storage', label: 'Storage', icon: Building },
  { id: 'solar', label: 'Solar Panels', icon: Sun }
];

export default function BuyerProfilePage() {
  const router = useRouter();
  const [activeSectionsetActiveSection] = useState('personal');
  const [isEditingsetIsEditing] = useState(false);
  const [loadingsetLoading] = useState(false);
  const [showPasswordsetShowPassword] = useState(false);
  const [profileCompletesetProfileComplete] = useState(75);
  const [verificationStatussetVerificationStatus] = useState<'unverified' | 'pending' | 'verified'>('pending');
  const [uploadProgresssetUploadProgress] = useState(0);

  // Form states
  const [personalInfosetPersonalInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+353 87 123 4567',
    dateOfBirth: '1985-05-15',
    occupation: 'Software Engineer',
    employer: 'Tech Company Ltd',
    address: '123 Main Street, Dublin 4',
    county: 'Dublin',
    maritalStatus: 'Single',
    dependents: 0,
    nationality: 'Irish',
    ppsNumber: '1234567XX'
  });

  const [preferencessetPreferences] = useState({
    propertyType: ['House', 'Apartment'],
    minBeds: 2,
    maxBeds: 4,
    minBaths: 1,
    parking: 1,
    priceMin: 250000,
    priceMax: 450000,
    locations: ['Dublin', 'Cork', 'Galway'],
    lifestyle: ['family', 'professional'],
    amenities: ['schools', 'transport', 'parks'],
    features: ['garden', 'parking', 'office'],
    moveInTimeframe: '3-6 months',
    reasonForBuying: 'First Home'
  });

  const [financialInfosetFinancialInfo] = useState({
    annualIncome: 65000,
    employmentType: 'Permanent',
    employmentLength: '3+ years',
    additionalIncome: 0,
    monthlyExpenses: 2000,
    existingLoans: 5000,
    creditScore: 'Excellent',
    deposit: 50000,
    htbEligible: true,
    mortgageApprovalInPrinciple: true,
    mortgageAmount: 350000,
    mortgageProvider: 'Bank of Ireland'
  });

  const [notificationSettingssetNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    newProperties: true,
    priceDrops: true,
    viewingReminders: true,
    documentDeadlines: true,
    marketInsights: false,
    developerUpdates: true,
    promotions: false,
    newsletter: true
  });

  const [privacySettingssetPrivacySettings] = useState({
    profileVisibility: 'Private',
    shareWithDevelopers: true,
    shareWithAgents: false,
    dataAnalytics: true,
    marketingEmails: false,
    twoFactorAuth: true,
    loginAlerts: true,
    apiAccess: false
  });

  const [documentssetDocuments] = useState([
    { id: 1, name: 'Passport', type: 'ID', status: 'verified', uploadDate: '2024-01-15' },
    { id: 2, name: 'Proof of Address', type: 'Address', status: 'verified', uploadDate: '2024-01-16' },
    { id: 3, name: 'Bank Statements', type: 'Financial', status: 'pending', uploadDate: '2024-02-01' },
    { id: 4, name: 'Employment Letter', type: 'Employment', status: 'pending', uploadDate: '2024-02-05' },
    { id: 5, name: 'P60 2023', type: 'Tax', status: 'uploaded', uploadDate: '2024-02-10' }
  ]);

  const [activityStats] = useState({
    propertiesViewed: 127,
    propertiesSaved: 23,
    viewingsScheduled: 8,
    offersSubmitted: 2,
    documentsUploaded: 12,
    lastActive: 'Today at 3:45 PM',
    accountCreated: 'January 2024',
    searchesPerformed: 89,
    averageViewTime: '4m 32s'
  });

  const saveProfile = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve1500));
    setLoading(false);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev>= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-6 mb-6 md:mb-0">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {uploadProgress> 0 && uploadProgress <100 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin" />
                  <span className="absolute text-sm font-medium">{uploadProgress}%</span>
                </div>
              ) : (
                <>
                  <User className="w-16 h-16 text-white/70" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="profile-image"
                    onChange={handleImageUpload}
                  />
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 p-2 bg-blue-700 rounded-full cursor-pointer hover:bg-blue-800 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </>
              )}
            </div>
            {/* Verification Badge */}
            <div className={`absolute -bottom-2 -right-2 p-2 rounded-full ${
              verificationStatus === 'verified' ? 'bg-green-500' :
              verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}>
              {verificationStatus === 'verified' ? <CheckCircle className="w-5 h-5 text-white" /> :
               verificationStatus === 'pending' ? <AlertCircle className="w-5 h-5 text-white" /> :
               <X className="w-5 h-5 text-white" />}
            </div>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-blue-100 mb-1">{personalInfo.email}</p>
            <p className="text-blue-100 mb-3">{personalInfo.phone}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{personalInfo.county}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="text-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#ffffff30"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#ffffff"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - profileComplete / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div>
                <span className="text-3xl font-bold">{profileComplete}%</span>
                <p className="text-xs">Complete</p>
              </div>
            </div>
          </div>
          <p className="text-sm mb-2">Profile Completion</p>
          <button className="text-xs underline">Complete Now →</button>
        </div>
      </div>
    </div>
  );

  const PersonalInfoSection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveProfile}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={personalInfo.firstName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={personalInfo.lastName}
            onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={personalInfo.occupation}
            onChange={(e) => setPersonalInfo({ ...personalInfo, occupation: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Address
          </label>
          <input
            type="text"
            value={personalInfo.address}
            onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        {/* PPS Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PPS Number
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={personalInfo.ppsNumber}
              onChange={(e) => setPersonalInfo({ ...personalInfo, ppsNumber: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status
          </label>
          <select
            value={personalInfo.maritalStatus}
            onChange={(e) => setPersonalInfo({ ...personalInfo, maritalStatus: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
      </div>
    </motion.div>
  );

  const PreferencesSection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Preferences</h2>

      {/* Property Type */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Property Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['House', 'Apartment', 'Duplex', 'Townhouse'].map((type) => (
            <label key={type} className="relative">
              <input
                type="checkbox"
                checked={preferences.propertyType.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      propertyType: [...preferences.propertyTypetype]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      propertyType: preferences.propertyType.filter(t => t !== type)
                    });
                  }
                }
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                preferences.propertyType.includes(type)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <Home className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium">{type}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Minimum Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <input
                type="number"
                value={preferences.priceMin}
                onChange={(e) => setPreferences({ ...preferences, priceMin: parseInt(e.target.value) })}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Maximum Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
              <input
                type="number"
                value={preferences.priceMax}
                onChange={(e) => setPreferences({ ...preferences, priceMax: parseInt(e.target.value) })}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
        {/* Price Slider */}
        <div className="mt-4">
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div 
              className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              style={
                left: `${(preferences.priceMin / 1000000) * 100}%`,
                width: `${((preferences.priceMax - preferences.priceMin) / 1000000) * 100}%`
              }
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>€0</span>
            <span>€250k</span>
            <span>€500k</span>
            <span>€750k</span>
            <span>€1M</span>
          </div>
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Lifestyle</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {lifestyleOptions.map((option) => (
            <label key={option.id} className="relative">
              <input
                type="checkbox"
                checked={preferences.lifestyle.includes(option.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      lifestyle: [...preferences.lifestyle, option.id]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      lifestyle: preferences.lifestyle.filter(l => l !== option.id)
                    });
                  }
                }
                className="sr-only"
              />
              <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                preferences.lifestyle.includes(option.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <option.icon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium block text-center">{option.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Important Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenityPreferences.map((amenity) => (
            <label key={amenity.id} className="relative">
              <input
                type="checkbox"
                checked={preferences.amenities.includes(amenity.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      amenities: [...preferences.amenities, amenity.id]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      amenities: preferences.amenities.filter(a => a !== amenity.id)
                    });
                  }
                }
                className="sr-only"
              />
              <div className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-2 ${
                preferences.amenities.includes(amenity.id)
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <amenity.icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Property Features */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Must-Have Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {propertyFeatures.map((feature) => (
            <label key={feature.id} className="relative">
              <input
                type="checkbox"
                checked={preferences.features.includes(feature.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPreferences({
                      ...preferences,
                      features: [...preferences.features, feature.id]
                    });
                  } else {
                    setPreferences({
                      ...preferences,
                      features: preferences.features.filter(f => f !== feature.id)
                    });
                  }
                }
                className="sr-only"
              />
              <div className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-2 ${
                preferences.features.includes(feature.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <feature.icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{feature.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const FinancialSection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Information</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Annual Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              value={financialInfo.annualIncome}
              onChange={(e) => setFinancialInfo({ ...financialInfo, annualIncome: parseInt(e.target.value) })}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            value={financialInfo.employmentType}
            onChange={(e) => setFinancialInfo({ ...financialInfo, employmentType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
            <option value="Self-employed">Self-employed</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Deposit Available */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deposit Available
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
            <input
              type="number"
              value={financialInfo.deposit}
              onChange={(e) => setFinancialInfo({ ...financialInfo, deposit: parseInt(e.target.value) })}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Credit Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credit Score Rating
          </label>
          <select
            value={financialInfo.creditScore}
            onChange={(e) => setFinancialInfo({ ...financialInfo, creditScore: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Excellent">Excellent (750+)</option>
            <option value="Good">Good (700-749)</option>
            <option value="Fair">Fair (650-699)</option>
            <option value="Poor">Poor (<650)</option>
          </select>
        </div>
      </div>

      {/* Mortgage Information */}
      <div className="mt-8 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-lg font-semibold mb-4">Mortgage Status</h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={financialInfo.mortgageApprovalInPrinciple}
              onChange={(e) => setFinancialInfo({ ...financialInfo, mortgageApprovalInPrinciple: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium">I have mortgage approval in principle</span>
          </label>

          {financialInfo.mortgageApprovalInPrinciple && (
            <div className="grid md:grid-cols-2 gap-4 ml-8">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Approved Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={financialInfo.mortgageAmount}
                    onChange={(e) => setFinancialInfo({ ...financialInfo, mortgageAmount: parseInt(e.target.value) })}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Mortgage Provider</label>
                <input
                  type="text"
                  value={financialInfo.mortgageProvider}
                  onChange={(e) => setFinancialInfo({ ...financialInfo, mortgageProvider: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={financialInfo.htbEligible}
              onChange={(e) => setFinancialInfo({ ...financialInfo, htbEligible: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="font-medium">I\'m eligible for Help-to-Buy scheme</span>
          </label>
        </div>
      </div>

      {/* Affordability Calculator */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Affordability Calculator
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Maximum Borrowing</p>
            <p className="text-2xl font-bold text-blue-600">
              €{(financialInfo.annualIncome * 3.5).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Total Budget</p>
            <p className="text-2xl font-bold text-purple-600">
              €{(financialInfo.annualIncome * 3.5 + financialInfo.deposit).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const DocumentsSection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
          <Upload className="w-4 h-4" />
          Upload Document
          <input type="file" className="hidden" accept="image/*,application/pdf" />
        </label>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                doc.status === 'verified' ? 'bg-green-100' :
                doc.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
              }`}>
                <FileText className={`w-6 h-6 ${
                  doc.status === 'verified' ? 'text-green-600' :
                  doc.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{doc.name}</h3>
                <p className="text-sm text-gray-600">
                  {doc.type} • Uploaded {doc.uploadDate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                doc.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
              <button className="text-gray-400 hover:text-gray-600">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-6 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Document Requirements</h3>
            <p className="text-sm text-blue-700">
              To complete your verification, please upload: Passport/ID, Proof of Address (within 3 months),
              Bank Statements (last 6 months), Employment Letter, and P60/P21.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ActivitySection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity & Insights</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-900">{activityStats.propertiesViewed}</span>
          </div>
          <p className="text-sm text-blue-700">Properties Viewed</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-900">{activityStats.propertiesSaved}</span>
          </div>
          <p className="text-sm text-purple-700">Properties Saved</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">{activityStats.viewingsScheduled}</span>
          </div>
          <p className="text-sm text-green-700">Viewings Scheduled</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-900">{activityStats.offersSubmitted}</span>
          </div>
          <p className="text-sm text-orange-700">Offers Submitted</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Property Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Based on your viewing history, you prefer <span className="font-medium">3-bed homes</span> in 
              <span className="font-medium"> Dublin suburbs</span> with <span className="font-medium">gardens</span>.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              Properties matching your criteria have seen a <span className="font-medium">5% price increase</span> 
              in the last month. Consider acting quickly on favorites.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              <span className="font-medium">3 new properties</span> matching your preferences were listed this week.
              <a href="/properties" className="text-blue-600 hover:underline ml-1">View now →</a>
            </p>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Viewed Fitzgerald Gardens - 3 Bed</p>
              <p className="text-sm text-gray-600">Today at 3:45 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Scheduled viewing for Riverside Manor</p>
              <p className="text-sm text-gray-600">Yesterday at 10:30 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Saved 5 properties to favorites</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NotificationsSection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            {Object.entries({
              newProperties: 'New properties matching your criteria',
              priceDrops: 'Price drops on saved properties',
              viewingReminders: 'Viewing appointment reminders',
              documentDeadlines: 'Document upload deadlines',
              marketInsights: 'Market insights and reports',
              developerUpdates: 'Updates from developers'}).map(([keylabel]) => (
              <label key={key} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-gray-700">{label}</span>
                <input
                  type="checkbox"
                  checked={notificationSettings[key]}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Communication Preferences */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Communication Preferences</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">Email Alerts</p>
                  <p className="text-sm text-gray-600">Receive important updates via email</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.emailAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium">SMS Alerts</p>
                  <p className="text-sm text-gray-600">Get text messages for urgent updates</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationSettings.smsAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const PrivacySection = () => (
    <motion.div
      initial={ opacity: 0, y: 20 }
      animate={ opacity: 1, y: 0 }
      transition={ duration: 0.3 }
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy & Security</h2>

      <div className="space-y-8">
        {/* Profile Visibility */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Visibility</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">Profile Visibility</p>
                <p className="text-sm text-gray-600">Control who can see your profile information</p>
              </div>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Private">Private</option>
                <option value="Developers">Developers Only</option>
                <option value="Public">Public</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Share with Developers</p>
                <p className="text-sm text-gray-600">Allow developers to see your preferences</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.shareWithDevelopers}
                onChange={(e) => setPrivacySettings({ ...privacySettings, shareWithDevelopers: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.twoFactorAuth}
                onChange={(e) => setPrivacySettings({ ...privacySettings, twoFactorAuth: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium">Login Alerts</p>
                <p className="text-sm text-gray-600">Get notified of new device logins</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.loginAlerts}
                onChange={(e) => setPrivacySettings({ ...privacySettings, loginAlerts: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </label>

            <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
                <Key className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Data Management</h3>
          <div className="space-y-4">
            <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Download Your Data</p>
                  <p className="text-sm text-gray-600">Get a copy of all your information</p>
                </div>
                <Download className="w-5 h-5 text-gray-400" />
              </div>
            </button>

            <button className="w-full p-4 text-left border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-600">Permanently remove your account</p>
                </div>
                <X className="w-5 h-5 text-red-400" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <ProtectedRoute requiredRole={['buyer', 'admin']}>
      <div>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ProfileHeader />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                <nav className="space-y-2">
                  {profileSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 pt-8 border-t">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/buyer/calculator')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      Update Budget
                    </button>
                    <button
                      onClick={() => router.push('/properties')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      Search Properties
                    </button>
                    <button
                      onClick={() => router.push('/buyer/saved')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      Saved Properties
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeSection === 'personal' && <PersonalInfoSection />}
                {activeSection === 'preferences' && <PreferencesSection />}
                {activeSection === 'financial' && <FinancialSection />}
                {activeSection === 'documents' && <DocumentsSection />}
                {activeSection === 'notifications' && <NotificationsSection />}
                {activeSection === 'privacy' && <PrivacySection />}
                {activeSection === 'activity' && <ActivitySection />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}