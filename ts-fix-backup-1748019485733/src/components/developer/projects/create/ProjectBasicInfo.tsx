'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue} from '@/components/ui/select';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const schema = z.object({
  projectName: z.string().min(3, 'Project name must be at least 3 characters'),
  projectType: z.string().min(1, 'Please select a project type'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  targetMarket: z.string().min(1, 'Please select target market'),
  estimatedUnits: z.string().regex(/^\d+$/, 'Must be a valid number'),
  expectedDuration: z.string().min(1, 'Please select expected duration')});

type FormData = z.infer<typeof schema>\n  );
interface ProjectBasicInfoProps {
  data: any;
  onNext: (data: FormData) => void;
}

export default function ProjectBasicInfo({ data, onNext }: ProjectBasicInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data});

  const onSubmit = (formData: FormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Information</h2>
        <p className="text-gray-600">Let's start with the basics of your new development</p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3 }
        >
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            {...register('projectName')}
            placeholder="e.g., Riverside Gardens"
            className="mt-1"
          />
          {errors.projectName && (
            <p className="text-red-500 text-sm mt-1">{errors.projectName.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.1 }
        >
          <Label htmlFor="projectType">Project Type</Label>
          <Select onValueChange={(value) => setValue('projectType', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="mixed-use">Mixed Use</SelectItem>
              <SelectItem value="affordable-housing">Affordable Housing</SelectItem>
              <SelectItem value="student-accommodation">Student Accommodation</SelectItem>
              <SelectItem value="senior-living">Senior Living</SelectItem>
            </SelectContent>
          </Select>
          {errors.projectType && (
            <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.2 }
        >
          <Label htmlFor="targetMarket">Target Market</Label>
          <Select onValueChange={(value) => setValue('targetMarket', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select target market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first-time-buyers">First Time Buyers</SelectItem>
              <SelectItem value="downsizers">Downsizers</SelectItem>
              <SelectItem value="investors">Investors</SelectItem>
              <SelectItem value="luxury">Luxury Market</SelectItem>
              <SelectItem value="families">Young Families</SelectItem>
              <SelectItem value="professionals">Urban Professionals</SelectItem>
            </SelectContent>
          </Select>
          {errors.targetMarket && (
            <p className="text-red-500 text-sm mt-1">{errors.targetMarket.message}</p>
          )}
        </motion.div>

        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.3 }
        >
          <Label htmlFor="description">Project Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe your project, its unique features, and target audience..."
            rows={5}
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            {watch('description')?.length || 0}/50 characters minimum
          </p>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.4 }
          >
            <Label htmlFor="estimatedUnits">Estimated Units</Label>
            <Input
              id="estimatedUnits"
              {...register('estimatedUnits')}
              placeholder="e.g., 120"
              type="number"
              className="mt-1"
            />
            {errors.estimatedUnits && (
              <p className="text-red-500 text-sm mt-1">{errors.estimatedUnits.message}</p>
            )}
          </motion.div>

          <motion.div
            initial={ opacity: 0, y: 20 }
            animate={ opacity: 1, y: 0 }
            transition={ duration: 0.3, delay: 0.5 }
          >
            <Label htmlFor="expectedDuration">Expected Duration</Label>
            <Select onValueChange={(value) => setValue('expectedDuration', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="12-18-months">12-18 months</SelectItem>
                <SelectItem value="18-24-months">18-24 months</SelectItem>
                <SelectItem value="24-36-months">24-36 months</SelectItem>
                <SelectItem value="36-months-plus">36+ months</SelectItem>
              </SelectContent>
            </Select>
            {errors.expectedDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedDuration.message}</p>
            )}
          </motion.div>
        </div>

        {/* AI Suggestion Box */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.3, delay: 0.6 }
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
        >
          <h4 className="font-semibold text-gray-900 mb-2">💡 AI Insights</h4>
          <p className="text-sm text-gray-700">
            Based on current market trends, {watch('targetMarket') === 'first-time-buyers' ? 'first-time buyer' : watch('targetMarket')} 
            {' '}developments in your area are showing strong demand. Consider including features like:
          </p>
          <ul className="mt-3 text-sm text-gray-600 list-disc list-inside">
            <li>Help-to-Buy eligibility to maximize appeal</li>
            <li>Energy-efficient design (BER A rating)</li>
            <li>Smart home features for tech-savvy buyers</li>
          </ul>
        </motion.div>
      </div>

      <div className="flex justify-end mt-8">
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