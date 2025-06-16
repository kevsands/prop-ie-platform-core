import React from 'react';
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { FiArrowLeft, FiArrowRight, FiMapPin, FiUpload, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const schema = z.object({
  address: z.string().min(5, 'Please enter a valid address'),
  city: z.string().min(2, 'Please enter a city'),
  county: z.string().min(2, 'Please enter a county'),
  eircode: z.string().regex(/^[A-Za-z0-9]{7}$/, 'Please enter a valid Eircode'),
  siteArea: z.string().regex(/^\d+(\.\d+)?$/, 'Please enter a valid number'),
  siteDescription: z.string().min(20, 'Please provide a site description'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()}).optional()});

type FormData = z.infer<typeof schema>
  );
interface LocationSelectionProps {
  data: any;
  onNext: (data: FormData) => void;
  onBack: () => void;
}

export default function LocationSelection({ data, onNext, onBack }: LocationSelectionProps) {
  const [sitePlansetSitePlan] = useState<File | null>(null);
  const [isLocatingsetIsLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSitePlan(file);
    }
  };

  const getCurrentLocation = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          setValue('coordinates', {
            lat: position.coords.latitude,
            lng: position.coords.longitude});
          setIsLocating(false);
        },
        (error: any) => {

          setIsLocating(false);
        }
      );
    }
  };

  const onSubmit = (formData: FormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Site Details</h2>
        <p className="text-gray-600">Specify the location and site information for your project</p>
      </div>

      <div className="space-y-6">
        {/* Address Fields */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3 }
        >
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="123 Main Street"
            className="mt-1"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.1 }
          >
            <Label htmlFor="city">City/Town</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Dublin"
              className="mt-1"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.1 }
          >
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              {...register('county')}
              placeholder="Dublin"
              className="mt-1"
            />
            {errors.county && (
              <p className="text-red-500 text-sm mt-1">{errors.county.message}</p>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.2 }
          >
            <Label htmlFor="eircode">Eircode</Label>
            <Input
              id="eircode"
              {...register('eircode')}
              placeholder="D02X285"
              className="mt-1"
            />
            {errors.eircode && (
              <p className="text-red-500 text-sm mt-1">{errors.eircode.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.2 }
          >
            <Label htmlFor="siteArea">Site Area (m²)</Label>
            <Input
              id="siteArea"
              {...register('siteArea')}
              placeholder="5000"
              className="mt-1"
            />
            {errors.siteArea && (
              <p className="text-red-500 text-sm mt-1">{errors.siteArea.message}</p>
            )}
          </motion.div>
        </div>

        {/* Interactive Map */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.3 }
        >
          <Label>Site Location</Label>
          <Card className="mt-2 overflow-hidden">
            <div className="h-64 bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FiMapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Interactive map will be displayed here</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isLocating}
                    className="mt-3"
                  >
                    {isLocating ? 'Getting location...' : 'Use Current Location'}
                  </Button>
                </div>
              </div>
              {watch('coordinates') && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3">
                  <p className="text-sm font-medium">Coordinates</p>
                  <p className="text-xs text-gray-600">
                    {watch('coordinates.lat')?.toFixed(6)}, {watch('coordinates.lng')?.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Site Description */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.4 }
        >
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            {...register('siteDescription')}
            placeholder="Describe the site location, surrounding area, access points..."
            rows={4}
            className="mt-1"
          />
          {errors.siteDescription && (
            <p className="text-red-500 text-sm mt-1">{errors.siteDescription.message}</p>
          )}
        </motion.div>

        {/* Site Plan Upload */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.5 }
        >
          <Label>Site Plan Upload</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
              className="hidden"
            />

            {sitePlan ? (
              <div className="space-y-3">
                <FiCheck className="w-12 h-12 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600">{sitePlan.name}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change File
                </Button>
              </div>
            ) : (
              <>
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drop your site plan here or click to upload</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG, DWG, DXF (max 20MB)
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Location Benefits */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.6 }
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200"
        >
          <h4 className="font-semibold text-gray-900 mb-2">🌍 Location Analysis</h4>
          <p className="text-sm text-gray-700 mb-3">
            Based on the location data, here's what makes this site attractive:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5" />
              <span>Excellent transport links - 5 min walk to Luas station</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5" />
              <span>Growing neighborhood with 15% population increase</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5" />
              <span>Near schools, shopping centers, and recreational facilities</span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheck className="text-green-500 mt-0.5" />
              <span>Average property prices up 8% year-over-year</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
          Continue
          <FiArrowRight className="ml-2" />
        </Button>
      </div>
    </form>
  );
}