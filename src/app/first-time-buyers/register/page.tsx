'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Home,
  ArrowRight,
  Shield,
  FileText,
  Calculator,
  PiggyBank,
  Building2,
  Sparkles,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  MapPin,
  HelpCircle,
  ChevronLeft,
  Loader2,
  Award,
  HeartHandshake,
  UserPlus,
  Banknote,
  Target,
  TrendingUp
} from 'lucide-react';

interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<any>
  );
}

const steps: RegistrationStep[] = [
  {
    id: 1,
    title: 'Personal Information',
    description: 'Let us know who you are',
    icon: User
  },
  {
    id: 2,
    title: 'Contact Details',
    description: 'How can we reach you',
    icon: Mail
  },
  {
    id: 3,
    title: 'Financial Readiness',
    description: 'Your buying position',
    icon: PiggyBank
  },
  {
    id: 4,
    title: 'Property Preferences',
    description: 'What are you looking for',
    icon: Home
  },
  {
    id: 5,
    title: 'Account Setup',
    description: 'Secure your account',
    icon: Lock
  }
];

const budgetRanges = [
  { value: '200-300', label: '€200,000 - €300,000' },
  { value: '300-400', label: '€300,000 - €400,000' },
  { value: '400-500', label: '€400,000 - €500,000' },
  { value: '500-600', label: '€500,000 - €600,000' },
  { value: '600+', label: '€600,000+' }
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment', icon: Building2 },
  { value: 'house', label: 'House', icon: Home },
  { value: 'duplex', label: 'Duplex', icon: Building2 },
  { value: 'any', label: 'Any Type', icon: Home }
];

const counties = [
  'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 
  'Kilkenny', 'Wexford', 'Wicklow', 'Kildare', 'Meath',
  'Louth', 'Kerry', 'Clare', 'Tipperary', 'Mayo'
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStepsetCurrentStep] = useState(1);
  const [showPasswordsetShowPassword] = useState(false);
  const [showConfirmPasswordsetShowConfirmPassword] = useState(false);
  const [loadingsetLoading] = useState(false);
  const [passwordStrengthsetPasswordStrength] = useState(0);

  const [formDatasetFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',

    // Contact Details
    email: '',
    phone: '',
    preferredContact: 'email',

    // Financial Readiness
    currentStatus: '',
    budget: '',
    deposit: '',
    hasAIP: false,
    hasHTB: false,
    hasSolicitor: false,
    employmentStatus: '',

    // Property Preferences
    propertyType: [],
    preferredCounties: [],
    bedrooms: '',
    moveInTimeframe: '',

    // Account Setup
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false,
    agreedDataProcessing: false
  });

  const [errorssetErrors] = useState<any>({});

  // Password strength calculator
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length>= 8) strength++;
      if (/[A-Z]/.test(formData.password)) strength++;
      if (/[a-z]/.test(formData.password)) strength++;
      if (/[0-9]/.test(formData.password)) strength++;
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validateStep = (step: number) => {
    const newErrors: any = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        else {
          const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
          if (age <18) newErrors.dateOfBirth = 'You must be 18 or older';
          if (age> 100) newErrors.dateOfBirth = 'Please enter a valid date of birth';
        }
        break;

      case 2:
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^(\+353|0)?[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Invalid Irish phone number';
        }
        break;

      case 3:
        if (!formData.currentStatus) newErrors.currentStatus = 'Please select your current status';
        if (!formData.budget) newErrors.budget = 'Please select your budget range';
        if (!formData.employmentStatus) newErrors.employmentStatus = 'Employment status is required';
        if (!formData.deposit) newErrors.deposit = 'Deposit amount is required';
        else if (parseInt(formData.deposit) <0) newErrors.deposit = 'Invalid deposit amount';
        break;

      case 4:
        if (formData.propertyType.length === 0) newErrors.propertyType = 'Select at least one property type';
        if (formData.preferredCounties.length === 0) newErrors.preferredCounties = 'Select at least one county';
        if (!formData.bedrooms) newErrors.bedrooms = 'Number of bedrooms is required';
        if (!formData.moveInTimeframe) newErrors.moveInTimeframe = 'Move-in timeframe is required';
        break;

      case 5:
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length <8) newErrors.password = 'Password must be at least 8 characters';
        else if (passwordStrength <3) newErrors.password = 'Password is too weak';

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
        if (!formData.agreedDataProcessing) newErrors.agreedDataProcessing = 'You must agree to data processing';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep <steps.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(00);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep> 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(00);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve2000));

      // Save to localStorage for demo
      localStorage.setItem('userRegistration', JSON.stringify(formData));

      // Redirect to buyer dashboard welcome page
      router.push('/buyer/first-time-buyers/welcome');
    } catch (error) {

      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e: any) => setFormData({ ...formData, firstName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e: any) => setFormData({ ...formData, lastName: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e: any) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john.doe@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e: any) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+353 87 123 4567"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">Irish mobile or landline number</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Contact Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={(e: any) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="mr-3"
                  />
                  <Mail className="mr-2" size={20} />
                  <span>Email</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={(e: any) => setFormData({ ...formData, preferredContact: e.target.value })}
                    className="mr-3"
                  />
                  <Phone className="mr-2" size={20} />
                  <span>Phone</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where are you in your journey? *
              </label>
              <select
                value={formData.currentStatus}
                onChange={(e: any) => setFormData({ ...formData, currentStatus: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.currentStatus ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select your status</option>
                <option value="researching">Just starting to research</option>
                <option value="saving">Actively saving for deposit</option>
                <option value="mortgage-ready">Mortgage approval in progress</option>
                <option value="ready-now">Ready to buy immediately</option>
                <option value="found-property">Already found a property</option>
              </select>
              {errors.currentStatus && (
                <p className="text-red-500 text-sm mt-1">{errors.currentStatus}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range *
                </label>
                <select
                  value={formData.budget}
                  onChange={(e: any) => setFormData({ ...formData, budget: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Deposit Saved *
                </label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e: any) => setFormData({ ...formData, deposit: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.deposit ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="25000"
                />
                {errors.deposit && (
                  <p className="text-red-500 text-sm mt-1">{errors.deposit}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employment Status *
              </label>
              <select
                value={formData.employmentStatus}
                onChange={(e: any) => setFormData({ ...formData, employmentStatus: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.employmentStatus ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select employment status</option>
                <option value="employed-paye">Employed (PAYE)</option>
                <option value="self-employed">Self-Employed</option>
                <option value="contractor">Contractor</option>
                <option value="public-sector">Public Sector</option>
                <option value="other">Other</option>
              </select>
              {errors.employmentStatus && (
                <p className="text-red-500 text-sm mt-1">{errors.employmentStatus}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Have you completed any of these steps?
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.hasAIP}
                  onChange={(e: any) => setFormData({ ...formData, hasAIP: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded"
                />
                <Calculator className="mr-2 text-gray-600" size={20} />
                <div>
                  <span className="font-medium">Mortgage Approval in Principle</span>
                  <p className="text-sm text-gray-500">I have AIP from a lender</p>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.hasHTB}
                  onChange={(e: any) => setFormData({ ...formData, hasHTB: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded"
                />
                <PiggyBank className="mr-2 text-gray-600" size={20} />
                <div>
                  <span className="font-medium">Help-to-Buy Registration</span>
                  <p className="text-sm text-gray-500">Registered with Revenue for HTB</p>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.hasSolicitor}
                  onChange={(e: any) => setFormData({ ...formData, hasSolicitor: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded"
                />
                <FileText className="mr-2 text-gray-600" size={20} />
                <div>
                  <span className="font-medium">Solicitor Appointed</span>
                  <p className="text-sm text-gray-500">I have chosen my solicitor</p>
                </div>
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type Preferences *
              </label>
              <div className="grid grid-cols-2 gap-4">
                {propertyTypes.map(type => (
                  <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      value={type.value}
                      checked={formData.propertyType.includes(type.value)}
                      onChange={(e: any) => {
                        const types = [...formData.propertyType];
                        if (e.target.checked) {
                          types.push(type.value);
                        } else {
                          const index = types.indexOf(type.value);
                          if (index> -1) types.splice(index1);
                        }
                        setFormData({ ...formData, propertyType: types });
                      }
                      className="mr-3 h-4 w-4 text-blue-600 rounded"
                    />
                    {React.createElement(type.icon, { className: 'mr-2 text-gray-600', size: 20 })}
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.propertyType && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Counties * <span className="text-sm font-normal text-gray-500">(Select up to 3)</span>
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {counties.map(county => (
                  <label key={county} className="flex items-center p-2 cursor-pointer hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      value={county}
                      checked={formData.preferredCounties.includes(county)}
                      onChange={(e: any) => {
                        const counties = [...formData.preferredCounties];
                        if (e.target.checked && counties.length <3) {
                          counties.push(county);
                        } else if (!e.target.checked) {
                          const index = counties.indexOf(county);
                          if (index> -1) counties.splice(index1);
                        }
                        setFormData({ ...formData, preferredCounties: counties });
                      }
                      disabled={!formData.preferredCounties.includes(county) && formData.preferredCounties.length>= 3}
                      className="mr-2 h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">{county}</span>
                  </label>
                ))}
              </div>
              {errors.preferredCounties && (
                <p className="text-red-500 text-sm mt-1">{errors.preferredCounties}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bedrooms *
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e: any) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.bedrooms ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select bedrooms</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5+">5+ Bedrooms</option>
                </select>
                {errors.bedrooms && (
                  <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When do you plan to move? *
                </label>
                <select
                  value={formData.moveInTimeframe}
                  onChange={(e: any) => setFormData({ ...formData, moveInTimeframe: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.moveInTimeframe ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select timeframe</option>
                  <option value="asap">ASAP</option>
                  <option value="1-3months">1-3 months</option>
                  <option value="3-6months">3-6 months</option>
                  <option value="6-12months">6-12 months</option>
                  <option value="12months+">12+ months</option>
                </select>
                {errors.moveInTimeframe && (
                  <p className="text-red-500 text-sm mt-1">{errors.moveInTimeframe}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e: any) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}

              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Password strength</span>
                    <span className="text-sm font-medium">
                      {passwordStrength <2 ? 'Weak' : passwordStrength <4 ? 'Medium' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength <2 ? 'bg-red-500' : 
                        passwordStrength <4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={ width: `${(passwordStrength / 5) * 100}%` }
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use 8+ characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e: any) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e: any) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and 
                  {' '}<Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
              )}

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedDataProcessing}
                  onChange={(e: any) => setFormData({ ...formData, agreedDataProcessing: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm">
                  I agree to the processing of my personal data for property matching and platform services
                </span>
              </label>
              {errors.agreedDataProcessing && (
                <p className="text-red-500 text-sm mt-1">{errors.agreedDataProcessing}</p>
              )}

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeMarketing}
                  onChange={(e: any) => setFormData({ ...formData, agreeMarketing: e.target.checked })}
                  className="mr-3 h-4 w-4 text-blue-600 rounded mt-0.5"
                />
                <span className="text-sm">
                  I would like to receive marketing communications about properties, market insights, and exclusive offers
                </span>
              </label>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-blue-900">Your Data is Protected</h4>
                  <p className="text-blue-800 text-sm mt-1">
                    PROP is fully GDPR compliant and ISO 27001 certified. Your personal data is encrypted 
                    and will only be used to help you find your perfect home. We never share your information 
                    with third parties without your explicit consent.
                  </p>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="text-red-600 mr-2" size={20} />
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Home className="text-blue-600" size={24} />
              <span className="font-bold text-xl">PROP</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-gray-600">Already have an account?</span>
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((stepindex: any) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep> step.id
                      ? 'bg-green-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep> step.id ? <CheckCircle size={24} /> : step.id}
                </div>
                {index <steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 transition-all ${
                      currentStep> step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 md:p-8">
            <div className="flex items-center gap-4">
              {React.createElement(steps[currentStep - 1].icon, { size: 32 })}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{steps[currentStep - 1].title}</h1>
                <p className="text-blue-100 mt-1">{steps[currentStep - 1].description}</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="p-6 md:p-8 bg-gray-50 flex justify-between border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === steps.length ? 'Complete Registration' : 'Next'}
                  <ArrowRight size={20} / />
              )}
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calculator className="text-blue-600" size={28} />
            </div>
            <h3 className="font-semibold mb-1">HTB Calculator</h3>
            <p className="text-sm text-gray-600">
              Calculate your €30k benefit instantly
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-green-600" size={28} />
            </div>
            <h3 className="font-semibold mb-1">Exclusive Properties</h3>
            <p className="text-sm text-gray-600">
              First access to new developments
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="text-purple-600" size={28} />
            </div>
            <h3 className="font-semibold mb-1">Expert Support</h3>
            <p className="text-sm text-gray-600">
              Dedicated first-time buyer specialists
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="text-orange-600" size={28} />
            </div>
            <h3 className="font-semibold mb-1">Award Winning</h3>
            <p className="text-sm text-gray-600">
              Ireland\'s #1 proptech platform
            </p>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Trusted by over 10,000 first-time buyers across Ireland</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <span className="flex items-center gap-1">
              <Shield size={16} />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-1">
              <Lock size={16} />
              ISO 27001 Certified
            </span>
            <span className="flex items-center gap-1">
              <Award size={16} />
              PropTech Winner 2024
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}