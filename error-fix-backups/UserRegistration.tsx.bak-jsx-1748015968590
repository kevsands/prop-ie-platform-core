'use client';

import React, { useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { IconType } from "react-icons";

interface UserRegistrationProps {
  onRegister?: (userData: any) => void;
}

// Helper function to render icons safely
const renderIcon = (Icon: IconType, className?: string) => {
  return React.createElement(Icon, { className });
};

const UserRegistration: React.FC<UserRegistrationProps> = ({ onRegister }) => {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address1: "",
    address2: "",
    city: "",
    county: "",
    eircode: "",
    isFirstTimeBuyer: true,
    hasHelpToBuy: false,
    isInvestor: false,
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^(\+\d{1,3})?\s?\d{9,12}$/.test(formData.phone)) {
        newErrors.phone = "Phone number is invalid";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (stepNumber === 2) {
      if (!formData.address1.trim())
        newErrors.address1 = "Address line 1 is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.county.trim()) newErrors.county = "County is required";
      if (!formData.eircode.trim()) {
        newErrors.eircode = "Eircode is required";
      } else if (
        !/^[A-Za-z0-9]{7}$/.test(formData.eircode.replace(/\s/g, ""))
      ) {
        newErrors.eircode = "Eircode is invalid";
      }
    } else if (stepNumber === 3) {
      if (!formData.agreeTerms)
        newErrors.agreeTerms = "You must agree to the terms and conditions";
      if (!formData.agreePrivacy)
        newErrors.agreePrivacy = "You must agree to the privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(step)) {
      // Submit registration
      if (onRegister) {
        onRegister(formData);
      }

      // For demo purposes, show success message
      setStep(4);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">
          Create Your Account
        </h2>
        <p className="text-gray-500">Join Prop.ie to reserve your dream home</p>
      </div>

      {/* Progress Steps */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 1
                  ? "bg-[#2B5273] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {renderIcon(FiUser, "h-5 w-5")}
            </div>
            <span className="text-xs mt-2 font-medium">Account Details</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-[#2B5273]" : "bg-gray-200"}`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 2
                  ? "bg-[#2B5273] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {renderIcon(FiMail, "h-5 w-5")}
            </div>
            <span className="text-xs mt-2 font-medium">
              Contact Information
            </span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-[#2B5273]" : "bg-gray-200"}`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 3
                  ? "bg-[#2B5273] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {renderIcon(FiCheck, "h-5 w-5")}
            </div>
            <span className="text-xs mt-2 font-medium">Preferences</span>
          </div>

          <div
            className={`flex-1 h-1 mx-2 ${step >= 4 ? "bg-[#2B5273]" : "bg-gray-200"}`}
          ></div>

          <div className="flex flex-col items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                step >= 4
                  ? "bg-[#2B5273] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {renderIcon(FiCheck, "h-5 w-5")}
            </div>
            <span className="text-xs mt-2 font-medium">Complete</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Account Details */}
        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {renderIcon(FiMail, "text-gray-400")}
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {renderIcon(FiPhone, "text-gray-400")}
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  placeholder="+353 87 123 4567"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {renderIcon(FiLock, "text-gray-400")}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword 
                      ? renderIcon(FiEyeOff, "text-gray-400")
                      : renderIcon(FiEye, "text-gray-400")
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {renderIcon(FiLock, "text-gray-400")}
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
              Contact Information
            </h3>

            <div className="mb-6">
              <label
                htmlFor="address1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${
                  errors.address1 ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
              />
              {errors.address1 && (
                <p className="mt-1 text-sm text-red-600">{errors.address1}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="address2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address Line 2
              </label>
              <input
                type="text"
                id="address2"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City/Town *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="county"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  County *
                </label>
                <input
                  type="text"
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.county ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.county && (
                  <p className="mt-1 text-sm text-red-600">{errors.county}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="eircode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Eircode *
                </label>
                <input
                  type="text"
                  id="eircode"
                  name="eircode"
                  value={formData.eircode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.eircode ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                />
                {errors.eircode && (
                  <p className="mt-1 text-sm text-red-600">{errors.eircode}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
              Preferences
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFirstTimeBuyer"
                  name="isFirstTimeBuyer"
                  checked={formData.isFirstTimeBuyer}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="isFirstTimeBuyer"
                  className="ml-2 text-sm text-gray-700"
                >
                  I am a first-time buyer
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasHelpToBuy"
                  name="hasHelpToBuy"
                  checked={formData.hasHelpToBuy}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="hasHelpToBuy"
                  className="ml-2 text-sm text-gray-700"
                >
                  I am using the Help-to-Buy scheme
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isInvestor"
                  name="isInvestor"
                  checked={formData.isInvestor}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="isInvestor"
                  className="ml-2 text-sm text-gray-700"
                >
                  I am buying as an investor
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeTerms"
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to the terms and conditions *
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  name="agreePrivacy"
                  checked={formData.agreePrivacy}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="agreePrivacy"
                  className="ml-2 text-sm text-gray-700"
                >
                  I agree to the privacy policy *
                </label>
              </div>
              {errors.agreePrivacy && (
                <p className="text-sm text-red-600">{errors.agreePrivacy}</p>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeMarketing"
                  name="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeMarketing"
                  className="ml-2 text-sm text-gray-700"
                >
                  I want to receive updates and marketing emails
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="p-6 text-center">
            {renderIcon(FiCheck, "mx-auto h-12 w-12 text-green-500")}
            <h3 className="text-xl font-bold mt-4">You're Registered!</h3>
            <p className="text-gray-600 mt-2">
              Thank you for joining Prop.ie — we’ll be in touch shortly.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserRegistration;
