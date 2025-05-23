"use client";

import React from "react";

export default function DeveloperPropertiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2B5273] mb-4">
          My Properties
        </h1>
        <p className="text-gray-600 mb-8">
          This will display all developments you've created, with options to
          view, edit, or add units.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: "prop-001",
              name: "Fitzgerald Gardens",
              location: "Drogheda, Co. Louth",
              units: 27,
              status: "In Planning",
            },
            {
              id: "prop-002",
              name: "Ellwood",
              location: "Rathmines, Dublin 6",
              units: 14,
              status: "Under Construction",
            },
            {
              id: "prop-003",
              name: "Ballymakenny View",
              location: "Galway City",
              units: 32,
              status: "Launching Soon",
            },
          ].map((project) => (
            <div
              key={project.id}
              className="bg-white shadow rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">{project.location}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {project.units} Units
                </span>
                <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  {project.status}
                </span>
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                  View
                </button>
                <button className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
