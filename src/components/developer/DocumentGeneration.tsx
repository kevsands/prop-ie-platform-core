"use client";

import React, { useState, useEffect } from "react";
import type { IconBaseProps } from 'react-icons';
import type { IconType } from 'react-icons';
import type { FC } from 'react';
import { Icon } from '../ui/Icon';
import { ICON_SIZES, ICON_COLORS } from '../ui/Icon';
import { useBOQData } from '@/hooks/useBOQData';
import { excelExportService } from '@/services/excelExportService';
import { ExcelExportContextMenu } from './context-menus/ExcelExportContextMenu';

interface DocumentGenerationProps {
  projectId: string;
  projectName: string;
  developerName: string;
  projectAddress: string;
  totalUnits: number;
  constructionCost: number;
  startDate: string;
  completionDate: string;
}

const DocumentGeneration: React.FC<DocumentGenerationProps> = ({
  projectId,
  projectName,
  developerName,
  projectAddress,
  totalUnits,
  constructionCost,
  startDate,
  completionDate}) => {
  
  // Fetch BOQ data for integration
  const { data: boqData, isLoading: isLoadingBOQ } = useBOQData(projectId);
  
  const [selectedDocTypesetSelectedDocType] = useState<string>("boq");
  const [generatingsetGenerating] = useState<boolean>(false);
  const [generatedDocumentssetGeneratedDocuments] = useState<
    {
      id: string;
      name: string;
      type: string;
      date: string;
      size: string;
      status: "ready" | "generating" | "failed";
      url?: string;
    }[]
  >([
    {
      id: "1",
      name: "Bill of Quantities - Initial",
      type: "boq",
      date: "2025-04-15",
      size: "2.4 MB",
      status: "ready",
      url: "#",
    {
      id: "2",
      name: "Subcontractor Instructions - Electrical",
      type: "instructions",
      date: "2025-04-16",
      size: "1.8 MB",
      status: "ready",
      url: "#",
    {
      id: "3",
      name: "Project Timeline Report",
      type: "report",
      date: "2025-04-18",
      size: "3.2 MB",
      status: "ready",
      url: "#",
    {
      id: "4",
      name: "Financial Projection Summary",
      type: "financial",
      date: "2025-04-20",
      size: "1.5 MB",
      status: "ready",
      url: "#"]);

  const [customOptionssetCustomOptions] = useState({
    includeImages: true,
    includePricing: true,
    includeTimeline: true,
    format: "pdf",
    recipientEmail: "");

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setCustomOptions({
      ...customOptions,
      [name]: type === "checkbox" ? checked : value});
  };

  const handleGenerateDocument = async () => {
    setGenerating(true);

    try {
      // If Excel format is selected, use the Excel export service
      if (customOptions.format === "xlsx") {
        const exportResult = await excelExportService.exportToExcel({
          type: selectedDocType,
          format: 'xlsx',
          data: {
            projectId,
            projectName,
            boqData,
            constructionCost,
            totalUnits
          },
          context: selectedDocType === 'boq' ? 'boq' : 'financial'
        });

        if (exportResult.success) {
          const newDoc = {
            id: (generatedDocuments.length + 1).toString(),
            name: exportResult.filename,
            type: selectedDocType,
            date: new Date().toISOString().split("T")[0],
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            status: "ready" as const,
            url: exportResult.url
          };

          setGeneratedDocuments([newDoc, ...generatedDocuments]);
        }
      } else {
        // Simulate other document generation
        setTimeout(() => {
          const newDoc = {
            id: (generatedDocuments.length + 1).toString(),
            name: getDocumentName(),
            type: selectedDocType,
            date: new Date().toISOString().split("T")[0],
            size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
            status: "ready" as const,
            url: "#"
          };

          setGeneratedDocuments([newDoc, ...generatedDocuments]);
        }, 2000);
      }
    } catch (error) {
      console.error('Document generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Handle Excel export from context menu
  const handleExcelExport = async (type: string, format: string) => {
    try {
      const result = await excelExportService.exportToExcel({
        type,
        format: format as 'xlsx' | 'csv',
        data: {
          projectId,
          projectName,
          boqData,
          constructionCost,
          totalUnits
        },
        context: 'boq'
      });
      
      if (result.success) {
        console.log('Export successful:', result.filename);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const getDocumentName = () => {
    switch (selectedDocType) {
      case "boq":
        return `Bill of Quantities - ${projectName} - ${new Date().toLocaleDateString()}`;
      case "instructions":
        return `Subcontractor Instructions - ${projectName} - ${new Date().toLocaleDateString()}`;
      case "report":
        return `Project Report - ${projectName} - ${new Date().toLocaleDateString()}`;
      case "financial":
        return `Financial Summary - ${projectName} - ${new Date().toLocaleDateString()}`;
      case "contract":
        return `Contract Template - ${projectName} - ${new Date().toLocaleDateString()}`;
      default:
        return `Document - ${projectName} - ${new Date().toLocaleDateString()}`;
    }
  };

  const filteredDocuments =
    selectedDocType === "all"
      ? generatedDocuments
      : generatedDocuments.filter((doc: any) => doc.type === selectedDocType);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">
          Document Generation
        </h2>
        <p className="text-gray-500">
          Project: {projectName} (ID: {projectId})
        </p>
      </div>

      {/* Document Type Selection */}
      <div className="p-6 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
          Generate New Document
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center ${
              selectedDocType === "boq"
                ? "border-[#2B5273] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedDocType("boq")}
          >
            <div className="flex items-center space-x-2">
              <Icon name="clipboard" className="text-gray-400" />
              <h4
                className={`font-medium ${selectedDocType === "boq" ? "text-[#2B5273]" : "text-gray-700"`}
              >
                Bill of Quantities
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Material & labor estimates
            </p>
          </div>

          <div
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center ${
              selectedDocType === "instructions"
                ? "border-[#2B5273] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedDocType("instructions")}
          >
            <div className="flex items-center space-x-2">
              <Icon name="file-text" className="text-gray-400" />
              <h4
                className={`font-medium ${selectedDocType === "instructions" ? "text-[#2B5273]" : "text-gray-700"`}
              >
                Subcontractor Instructions
              </h4>
            </div>
            <Icon 
              name="file-text" 
              className={`h-8 w-8 mb-2 ${selectedDocType === "instructions" ? "text-[#2B5273]" : "text-gray-400"`} 
            />
            <h4
              className={`font-medium ${selectedDocType === "instructions" ? "text-[#2B5273]" : "text-gray-700"`}
            >
              Subcontractor Instructions
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Detailed work guidelines
            </p>
          </div>

          <div
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center ${
              selectedDocType === "report"
                ? "border-[#2B5273] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedDocType("report")}
          >
            <Icon 
              name="file" 
              className={`h-8 w-8 mb-2 ${selectedDocType === "report" ? "text-[#2B5273]" : "text-gray-400"`} 
            />
            <h4
              className={`font-medium ${selectedDocType === "report" ? "text-[#2B5273]" : "text-gray-700"`}
            >
              Project Report
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Status & progress summary
            </p>
          </div>

          <div
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center ${
              selectedDocType === "financial"
                ? "border-[#2B5273] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedDocType("financial")}
          >
            <Icon 
              name="file" 
              className={`h-8 w-8 mb-2 ${selectedDocType === "financial" ? "text-[#2B5273]" : "text-gray-400"`} 
            />
            <h4
              className={`font-medium ${selectedDocType === "financial" ? "text-[#2B5273]" : "text-gray-700"`}
            >
              Financial Summary
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Cost & revenue projections
            </p>
          </div>

          <div
            className={`cursor-pointer p-4 rounded-lg border-2 flex flex-col items-center justify-center text-center ${
              selectedDocType === "contract"
                ? "border-[#2B5273] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedDocType("contract")}
          >
            <Icon 
              name="file" 
              className={`h-8 w-8 mb-2 ${selectedDocType === "contract" ? "text-[#2B5273]" : "text-gray-400"`} 
            />
            <h4
              className={`font-medium ${selectedDocType === "contract" ? "text-[#2B5273]" : "text-gray-700"`}
            >
              Contract Template
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Legal agreement templates
            </p>
          </div>
        </div>
      </div>

      {/* Document Options */}
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
          Document Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3">Content Options</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeImages"
                  name="includeImages"
                  checked={customOptions.includeImages}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="includeImages"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Include images and diagrams
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includePricing"
                  name="includePricing"
                  checked={customOptions.includePricing}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="includePricing"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Include pricing information
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeTimeline"
                  name="includeTimeline"
                  checked={customOptions.includeTimeline}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#2B5273] focus:ring-[#2B5273] border-gray-300 rounded"
                />
                <label
                  htmlFor="includeTimeline"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Include timeline and deadlines
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3">Output Options</h4>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="format"
                  className="block text-sm text-gray-700 mb-1"
                >
                  File Format
                </label>
                <select
                  id="format"
                  name="format"
                  value={customOptions.format}
                  onChange={handleOptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="docx">Word Document (DOCX)</option>
                  <option value="xlsx">Excel Spreadsheet (XLSX)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="recipientEmail"
                  className="block text-sm text-gray-700 mb-1"
                >
                  Email to Recipient (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="mail" className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="recipientEmail"
                    name="recipientEmail"
                    value={customOptions.recipientEmail}
                    onChange={handleOptionChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleGenerateDocument}
            disabled={generating}
            className={`${
              generating ? "bg-gray-400" : "bg-[#2B5273] hover:bg-[#1E3142]"
            } text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center`}
          >
            {generating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <Icon name="download" className="mr-2" />
                Generate Document
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Preview */}
      {selectedDocType === "boq" && (
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
            Document Preview
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-center mb-4">
              <Icon name="clipboard" className="h-12 w-12 mx-auto text-[#2B5273] mb-2" />
              <h4 className="text-xl font-bold text-[#2B5273]">
                Bill of Quantities
              </h4>
              <p className="text-gray-500">{projectName}</p>
            </div>

            <div className="border-t border-b py-4 my-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Developer:</p>
                  <p className="font-medium">{developerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Address:</p>
                  <p className="font-medium">{projectAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Units:</p>
                  <p className="font-medium">{totalUnits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Construction Cost:</p>
                  <p className="font-medium">
                    €{constructionCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date:</p>
                  <p className="font-medium">{startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Date:</p>
                  <p className="font-medium">{completionDate}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">Sample BOQ Items:</h5>
              <ExcelExportContextMenu
                context="boq"
                data={boqData}
                onExport={handleExcelExport}
              >
                <table className="min-w-full divide-y divide-gray-200 cursor-context-menu">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {boqData?.items ? (
                      boqData.items.slice(0).map((itemindex) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            {item.description}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">€{item.amount.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-700">001</td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            Site Clearance & Foundation
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">€35,000</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm text-gray-700">002</td>
                          <td className="px-4 py-2 text-sm text-gray-700">
                            Concrete Slab & Formwork
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-700">€27,500</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </ExcelExportContextMenu>
              
              {boqData && (
                <div className="mt-2 text-xs text-gray-500">
                  Right-click the table to export BOQ data to Excel
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentGeneration;
