'use client';

import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiFileText, FiDollarSign, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Appointment {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  contractValue: number;
  documents: string[];
  notes: string;
}

interface ProfessionalAppointmentsProps {
  projectId: string;
  projectName: string;
}

const ProfessionalAppointments: React.FC<ProfessionalAppointmentsProps> = ({
  projectId,
  projectName
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'design' | 'construction' | 'legal'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    role: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    status: 'pending',
    contractValue: 0,
    notes: ''
  });
  
  // Mock data for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      name: 'Jane Smith',
      role: 'Architect',
      company: 'Smith & Associates',
      email: 'jane@smithassociates.com',
      phone: '+353 87 123 4567',
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      status: 'active',
      contractValue: 75000,
      documents: ['contract.pdf', 'scope_of_work.pdf'],
      notes: 'Lead architect responsible for overall design and planning permission.'
    },
    {
      id: '2',
      name: 'Michael O\'Brien',
      role: 'Structural Engineer',
      company: 'Dublin Engineering Ltd',
      email: 'michael@dublineng.ie',
      phone: '+353 86 234 5678',
      startDate: '2025-01-20',
      endDate: '2025-06-30',
      status: 'active',
      contractValue: 45000,
      documents: ['contract.pdf', 'engineering_specs.pdf'],
      notes: 'Responsible for structural calculations and foundation design.'
    },
    {
      id: '3',
      name: 'Sarah Kelly',
      role: 'Quantity Surveyor',
      company: 'Kelly Surveying',
      email: 'sarah@kellysurveying.ie',
      phone: '+353 85 345 6789',
      startDate: '2025-01-10',
      endDate: '2025-12-31',
      status: 'active',
      contractValue: 35000,
      documents: ['contract.pdf', 'cost_estimates.pdf'],
      notes: 'Handling all cost estimations and material quantity calculations.'
    },
    {
      id: '4',
      name: 'John Murphy',
      role: 'Main Contractor',
      company: 'Murphy Construction',
      email: 'john@murphyconstruction.ie',
      phone: '+353 83 456 7890',
      startDate: '2025-03-01',
      endDate: '2025-12-31',
      status: 'pending',
      contractValue: 2500000,
      documents: ['contract.pdf', 'schedule.pdf', 'insurance.pdf'],
      notes: 'Main contractor for the entire development.'
    },
    {
      id: '5',
      name: 'Lisa Brennan',
      role: 'Interior Designer',
      company: 'Brennan Interiors',
      email: 'lisa@brennaninteriors.com',
      phone: '+353 89 567 8901',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      status: 'pending',
      contractValue: 40000,
      documents: ['contract.pdf', 'design_concepts.pdf'],
      notes: 'Handling interior design for show homes and common areas.'
    },
    {
      id: '6',
      name: 'David Wilson',
      role: 'Solicitor',
      company: 'Wilson & Partners',
      email: 'david@wilsonpartners.ie',
      phone: '+353 88 678 9012',
      startDate: '2025-01-05',
      endDate: '2025-12-31',
      status: 'active',
      contractValue: 25000,
      documents: ['contract.pdf', 'legal_framework.pdf'],
      notes: 'Handling all legal aspects of the development.'
    },
    {
      id: '7',
      name: 'Emma Thompson',
      role: 'Landscape Architect',
      company: 'Green Spaces Design',
      email: 'emma@greenspaces.ie',
      phone: '+353 87 789 0123',
      startDate: '2025-04-01',
      endDate: '2025-09-30',
      status: 'pending',
      contractValue: 30000,
      documents: ['contract.pdf', 'landscape_plans.pdf'],
      notes: 'Designing all outdoor spaces and communal gardens.'
    },
    {
      id: '8',
      name: 'Robert O\'Neill',
      role: 'Electrical Contractor',
      company: 'O\'Neill Electrical',
      email: 'robert@oneillelectrical.ie',
      phone: '+353 86 890 1234',
      startDate: '2025-05-01',
      endDate: '2025-11-30',
      status: 'pending',
      contractValue: 350000,
      documents: ['contract.pdf', 'electrical_specs.pdf'],
      notes: 'Responsible for all electrical installations.'
    }
  ]);
  
  // Filter appointments based on active tab and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'design' && ['Architect', 'Interior Designer', 'Landscape Architect'].includes(appointment.role)) ||
      (activeTab === 'construction' && ['Main Contractor', 'Electrical Contractor', 'Structural Engineer'].includes(appointment.role)) ||
      (activeTab === 'legal' && ['Solicitor', 'Quantity Surveyor'].includes(appointment.role));
    
    const matchesSearch = 
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });
  
  // Group appointments by role
  const designTeam = appointments.filter(a => ['Architect', 'Interior Designer', 'Landscape Architect'].includes(a.role));
  const constructionTeam = appointments.filter(a => ['Main Contractor', 'Electrical Contractor', 'Structural Engineer'].includes(a.role));
  const legalTeam = appointments.filter(a => ['Solicitor', 'Quantity Surveyor'].includes(a.role));
  
  // Calculate total contract value
  const totalContractValue = appointments.reduce((sum, appointment) => sum + appointment.contractValue, 0);
  
  // Handle adding new appointment
  const handleAddAppointment = () => {
    const id = (appointments.length + 1).toString();
    const newAppointmentWithId = {
      ...newAppointment,
      id,
      documents: [],
      status: newAppointment.status as 'pending' | 'active' | 'completed' | 'cancelled'
    } as Appointment;
    
    setAppointments([...appointments, newAppointmentWithId]);
    setNewAppointment({
      role: '',
      name: '',
      company: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
      status: 'pending',
      contractValue: 0,
      notes: ''
    });
    setShowAddModal(false);
  };
  
  // Handle input change for new appointment
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: name === 'contractValue' ? parseFloat(value) || 0 : value
    });
  };
  
  // Handle status change
  const handleStatusChange = (id: string, newStatus: 'pending' | 'active' | 'completed' | 'cancelled') => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, status: newStatus } : appointment
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-[#2B5273]">Professional Appointments</h2>
        <p className="text-gray-500">Project: {projectName} (ID: {projectId})</p>
      </div>
      
      {/* Summary Cards */}
      <div className="p-6 border-b bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Appointments</h3>
            <p className="text-2xl font-bold text-[#2B5273]">{appointments.length}</p>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-green-600 font-medium">{appointments.filter(a => a.status === 'active').length} Active</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-amber-500 font-medium">{appointments.filter(a => a.status === 'pending').length} Pending</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Design Team</h3>
            <p className="text-2xl font-bold text-[#2B5273]">{designTeam.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {designTeam.filter(a => a.status === 'active').length} Active Members
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Construction Team</h3>
            <p className="text-2xl font-bold text-[#2B5273]">{constructionTeam.length}</p>
            <p className="text-sm text-gray-500 mt-2">
              {constructionTeam.filter(a => a.status === 'active').length} Active Members
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</h3>
            <p className="text-2xl font-bold text-[#2B5273]">€{totalContractValue.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-2">
              Across {appointments.length} appointments
            </p>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="p-6 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all'
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Appointments
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'design'
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Design Team
            </button>
            <button
              onClick={() => setActiveTab('construction')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'construction'
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Construction
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'legal'
                  ? 'bg-[#2B5273] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Legal & Finance
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#2B5273] hover:bg-[#1E3142] text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Appointment
            </button>
          </div>
        </div>
      </div>
      
      {/* Appointments List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Professional
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timeline
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-[#2B5273] rounded-full flex items-center justify-center text-white font-medium">
                      {appointment.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                      <div className="text-sm text-gray-500">{appointment.email}</div>
                      <div className="text-sm text-gray-500">{appointment.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {appointment.startDate} – {appointment.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  €{appointment.contractValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appointment.status === 'active' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleStatusChange(appointment.id, appointment.status === 'active' ? 'completed' : 'active')}
                    className="text-[#2B5273] hover:text-[#1E3142]"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-[#2B5273] mb-4">Add New Professional Appointment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={newAppointment.name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select name="role" value={newAppointment.role || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select Role</option>
                  <option value="Architect">Architect</option>
                  <option value="Structural Engineer">Structural Engineer</option>
                  <option value="Quantity Surveyor">Quantity Surveyor</option>
                  <option value="Main Contractor">Main Contractor</option>
                  <option value="Interior Designer">Interior Designer</option>
                  <option value="Solicitor">Solicitor</option>
                  <option value="Landscape Architect">Landscape Architect</option>
                  <option value="Electrical Contractor">Electrical Contractor</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company" value={newAppointment.company || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={newAppointment.email || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" name="phone" value={newAppointment.phone || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* Contract Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (€)</label>
                <input type="number" name="contractValue" value={newAppointment.contractValue || 0} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" name="startDate" value={newAppointment.startDate || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" name="endDate" value={newAppointment.endDate || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={newAppointment.notes || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" rows={3} />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddAppointment} className="px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142]">Add Appointment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalAppointments;