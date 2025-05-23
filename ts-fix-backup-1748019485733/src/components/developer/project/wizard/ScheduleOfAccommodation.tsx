"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiTrash2, FiHome, FiSquare, FiBriefcase, FiDollarSign } from 'react-icons/fi';
import type { IconBaseProps } from 'react-icons';

interface ScheduleOfAccommodationProps {
  onSubmit: (data: ScheduleOfAccommodationData) => void;
  initialData?: ScheduleOfAccommodationData;
}

export interface UnitType {
  id: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  count: number;
  pricePerUnit: number;
}

export interface ScheduleOfAccommodationData {
  units: UnitType[];
  totalUnits: number;
  totalArea: number;
  commercialArea: number;
  communalArea: number;
}

const unitTypes = [
  { id: 'apartment', name: 'Apartment' },
  { id: 'house', name: 'House' },
  { id: 'duplex', name: 'Duplex' },
  { id: 'penthouse', name: 'Penthouse' },
  { id: 'studio', name: 'Studio' },
  { id: 'commercial', name: 'Commercial Unit' },
  { id: 'retail', name: 'Retail Unit' },
  { id: 'office', name: 'Office Space' }
];

const ScheduleOfAccommodation: React.FC<ScheduleOfAccommodationProps> = ({ onSubmit, initialData }) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<ScheduleOfAccommodationData>({
    defaultValues: initialData || {
      units: [{ 
        id: `unit-${Date.now()}`, 
        type: 'apartment', 
        bedrooms: 2, 
        bathrooms: 1, 
        area: 0, 
        count: 1, 
        pricePerUnit: 0 
      }],
      totalUnits: 0,
      totalArea: 0,
      commercialArea: 0,
      communalArea: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "units"
  });

  const units = watch('units');

  // Calculate totals
  const totalUnits = units?.reduce((sumunit) => sum + (unit.count || 0), 0) || 0;
  const totalResidentialArea = units?.reduce((sumunit) => {
    if (['commercial', 'retail', 'office'].includes(unit.type)) return sum;
    return sum + ((unit.area || 0) * (unit.count || 0));
  }, 0) || 0;

  const addUnitType = () => {
    append({ 
      id: `unit-${Date.now()}`, 
      type: 'apartment', 
      bedrooms: 2, 
      bathrooms: 1, 
      area: 0, 
      count: 1, 
      pricePerUnit: 0 
    });
  };

  const isResidentialType = (type: string) => {
    return !['commercial', 'retail', 'office'].includes(type);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule of Accommodation</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Unit Types */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Unit Types</h3>
            <button
              type="button"
              onClick={addUnitType}
              className="px-3 py-1 flex items-center text-sm bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
            >
              {FiPlus({ className: "mr-1" })} Add Unit Type
            </button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-4">No unit types added yet.</p>
              <button
                type="button"
                onClick={addUnitType}
                className="px-4 py-2 inline-flex items-center bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
              >
                {FiPlus({ className: "mr-2" })} Add First Unit Type
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bedrooms</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bathrooms</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area (m²)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (€)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Area (m²)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((fieldindex) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                          {...register(`units.${index}.type` as const, { required: true })}
                        >
                          {unitTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isResidentialType(watch(`units.${index}.type`)) ? (
                          <input
                            type="number"
                            min="0"
                            className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                            {...register(`units.${index}.bedrooms` as const, { 
                              required: true,
                              min: 0,
                              valueAsNumber: true
                            })}
                          />
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isResidentialType(watch(`units.${index}.type`)) ? (
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                            {...register(`units.${index}.bathrooms` as const, { 
                              required: true,
                              min: 0,
                              valueAsNumber: true
                            })}
                          />
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="block w-24 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                          {...register(`units.${index}.area` as const, { 
                            required: true,
                            min: 0,
                            valueAsNumber: true
                          })}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="1"
                          className="block w-20 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                          {...register(`units.${index}.count` as const, { 
                            required: true,
                            min: 1,
                            valueAsNumber: true
                          })}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          step="1000"
                          className="block w-28 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273] sm:text-sm"
                          {...register(`units.${index}.pricePerUnit` as const, { 
                            required: true,
                            min: 0,
                            valueAsNumber: true
                          })}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {(watch(`units.${index}.area`) || 0) * (watch(`units.${index}.count`) || 0)} m²
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {FiTrash2({})}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                      Total:
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-bold">
                      {totalUnits}
                    </td>
                    <td className="px-6 py-3"></td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-bold">
                      {totalResidentialArea} m²
                    </td>
                    <td className="px-6 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Additional Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
          <div>
            <label htmlFor="commercialArea" className="block text-sm font-medium text-gray-700 mb-1">
              Commercial Area (m²)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiBriefcase({ className: "text-gray-400" })}
              </div>
              <input
                id="commercialArea"
                type="number"
                min="0"
                step="0.01"
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                placeholder="Enter commercial area"
                {...register('commercialArea', { 
                  min: { value: 0, message: 'Commercial area must be positive' },
                  valueAsNumber: true
                })}
              />
            </div>
            {errors.commercialArea && (
              <p className="mt-1 text-sm text-red-600">{errors.commercialArea.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="communalArea" className="block text-sm font-medium text-gray-700 mb-1">
              Communal Area (m²)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiSquare({ className: "text-gray-400" })}
              </div>
              <input
                id="communalArea"
                type="number"
                min="0"
                step="0.01"
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                placeholder="Enter communal area"
                {...register('communalArea', { 
                  min: { value: 0, message: 'Communal area must be positive' },
                  valueAsNumber: true
                })}
              />
            </div>
            {errors.communalArea && (
              <p className="mt-1 text-sm text-red-600">{errors.communalArea.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleOfAccommodation;