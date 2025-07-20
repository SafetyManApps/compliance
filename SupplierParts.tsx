import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { SupplierPartTable } from '../components/SupplierPartTable';
import { SupplierPartModal } from '../components/SupplierPartModal';
import { ExcelUploadModal } from '../components/ExcelUploadModal';
import { Plus, Filter, Download, Upload, Search, Component } from 'lucide-react';

export interface SupplierPart {
  id: string;
  name: string;
  partNumber: string;
  supplier: string;
  material: string;
  category: string;
  description: string;
  unitPrice: number;
  currency: string;
  leadTime: number;
  minimumOrderQuantity: number;
  reachStatus: 'compliant' | 'non-compliant' | 'pending';
  rohsStatus: 'compliant' | 'non-compliant' | 'pending';
  pfasStatus: 'compliant' | 'non-compliant' | 'pending';
  countryOfOrigin: string;
  lastUpdated: string;
}

export function SupplierParts() {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SupplierPart | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [supplierParts, setSupplierParts] = useState<SupplierPart[]>([
    {
      id: 'SP-001',
      name: 'Capacitor 100μF',
      partNumber: 'CAP-100UF-25V',
      supplier: 'TechCorp Inc.',
      material: 'Aluminum Electrolytic',
      category: 'Electronic Components',
      description: 'High-quality electrolytic capacitor for power applications',
      unitPrice: 0.85,
      currency: 'EUR',
      leadTime: 14,
      minimumOrderQuantity: 1000,
      reachStatus: 'compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'compliant',
      countryOfOrigin: 'Germany',
      lastUpdated: '2024-01-15',
    },
    {
      id: 'SP-002',
      name: 'Steel Bracket',
      partNumber: 'BRK-ST-001',
      supplier: 'AutoSupply Ltd.',
      material: 'Stainless Steel 316L',
      category: 'Mechanical Parts',
      description: 'Corrosion-resistant mounting bracket',
      unitPrice: 12.50,
      currency: 'EUR',
      leadTime: 21,
      minimumOrderQuantity: 100,
      reachStatus: 'compliant',
      rohsStatus: 'non-compliant',
      pfasStatus: 'pending',
      countryOfOrigin: 'France',
      lastUpdated: '2024-01-14',
    },
    {
      id: 'SP-003',
      name: 'Silicone Gasket',
      partNumber: 'GSK-SIL-50',
      supplier: 'MedTech Corp.',
      material: 'Medical Grade Silicone',
      category: 'Sealing Components',
      description: 'FDA-approved silicone gasket for medical devices',
      unitPrice: 3.25,
      currency: 'EUR',
      leadTime: 28,
      minimumOrderQuantity: 500,
      reachStatus: 'pending',
      rohsStatus: 'compliant',
      pfasStatus: 'non-compliant',
      countryOfOrigin: 'Netherlands',
      lastUpdated: '2024-01-13',
    },
  ]);

  const handleBatchUpload = (uploadedParts: SupplierPart[]) => {
    setSupplierParts(prevParts => [...prevParts, ...uploadedParts]);
  };

  const handleExportParts = () => {
    // Prepare data for export with clean column names
    const exportData = supplierParts.map(part => ({
      'Part ID': part.id,
      'Part Name': part.name,
      'Part Number': part.partNumber,
      'Supplier': part.supplier,
      'Material': part.material,
      'Category': part.category,
      'Description': part.description,
      'Unit Price': part.unitPrice,
      'Currency': part.currency,
      'Lead Time (Days)': part.leadTime,
      'Minimum Order Quantity': part.minimumOrderQuantity,
      'REACH Status': part.reachStatus,
      'RoHS Status': part.rohsStatus,
      'PFAS Status': part.pfasStatus,
      'Country of Origin': part.countryOfOrigin,
      'Last Updated': part.lastUpdated
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Supplier Parts');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `supplier_parts_export_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  const filteredParts = supplierParts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supplier Parts Management</h2>
          <p className="text-gray-600 mt-1">Manage parts sourced from external suppliers</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleExportParts}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Excel</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Part</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search parts by name, part number, supplier, or material..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{supplierParts.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <Component className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Fully Compliant Parts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {supplierParts.filter(p => p.reachStatus === 'compliant' && p.rohsStatus === 'compliant' && p.pfasStatus === 'compliant').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <Component className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Unique Suppliers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {new Set(supplierParts.map(p => p.supplier)).size}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50 text-purple-600">
              <Component className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Avg Lead Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round(supplierParts.reduce((sum, p) => sum + p.leadTime, 0) / supplierParts.length)} days
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-50 text-amber-600">
              <Component className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <SupplierPartTable 
        parts={filteredParts}
        onEditPart={(part) => {
          setSelectedPart(part);
          setShowModal(true);
        }}
      />

      {/* Part Modal */}
      {showModal && (
        <SupplierPartModal
          part={selectedPart}
          onClose={() => {
            setShowModal(false);
            setSelectedPart(null);
          }}
        />
      )}

      {/* Excel Upload Modal */}
      {showUploadModal && (
        <ExcelUploadModal
          type="supplier-parts"
          onClose={() => setShowUploadModal(false)}
          onUpload={handleBatchUpload}
        />
      )}
    </div>
  );
}