import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierModal } from '../components/SupplierModal';
import { ExcelUploadModal } from '../components/ExcelUploadModal';
import { Plus, Filter, Download, Upload } from 'lucide-react';

export function Suppliers() {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-001',
      name: 'TechCorp Inc.',
      contact: 'john.doe@techcorp.com',
      location: 'Germany',
      complianceRate: 95,
      certifications: ['ISO 14001', 'REACH'],
      status: 'active',
      lastAudit: '2024-01-10',
    },
    {
      id: 'SUP-002',
      name: 'AutoSupply Ltd.',
      contact: 'sales@autosupply.com',
      location: 'France',
      complianceRate: 88,
      certifications: ['RoHS', 'ISO 9001'],
      status: 'active',
      lastAudit: '2024-01-08',
    },
    {
      id: 'SUP-003',
      name: 'MedTech Corp.',
      contact: 'info@medtech.com',
      location: 'Netherlands',
      complianceRate: 92,
      certifications: ['ISO 13485', 'REACH', 'RoHS'],
      status: 'pending',
      lastAudit: '2024-01-05',
    },
  ]);

  const handleBatchUpload = (uploadedSuppliers: any[]) => {
    setSuppliers(prevSuppliers => [...prevSuppliers, ...uploadedSuppliers]);
  };

  const handleExportSuppliers = () => {
    // Prepare data for export with clean column names
    const exportData = suppliers.map(supplier => ({
      'Supplier ID': supplier.id,
      'Company Name': supplier.name,
      'Contact Email': supplier.contact,
      'Phone': supplier.phone || '',
      'Location': supplier.location,
      'Address': supplier.address || '',
      'Compliance Rate (%)': supplier.complianceRate,
      'Certifications': supplier.certifications.join(', '),
      'Status': supplier.status,
      'Last Audit': supplier.lastAudit
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Suppliers');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `suppliers_export_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Supplier Management</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleExportSuppliers}
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
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Supplier Table */}
      <SupplierTable 
        suppliers={suppliers}
        onEditSupplier={(supplier) => {
          setSelectedSupplier(supplier);
          setShowModal(true);
        }}
      />

      {/* Supplier Modal */}
      {showModal && (
        <SupplierModal
          supplier={selectedSupplier}
          onClose={() => {
            setShowModal(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      {/* Excel Upload Modal */}
      {showUploadModal && (
        <ExcelUploadModal
          type="suppliers"
          onClose={() => setShowUploadModal(false)}
          onUpload={handleBatchUpload}
        />
      )}
    </div>
  );
}