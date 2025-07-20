import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadModalProps {
  type: 'products' | 'suppliers' | 'supplier-parts';
  onClose: () => void;
  onUpload: (data: any[]) => void;
}

export function ExcelUploadModal({ type, onClose, onUpload }: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const productTemplate = [
    {
      name: 'Electronic Component A',
      category: 'Electronics',
      supplier: 'TechCorp Inc.',
      lifecycle: 'Maturity',
      countryOfOrigin: 'Germany',
      description: 'High-performance electronic component',
      reachStatus: 'compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'compliant'
    },
    {
      name: 'Automotive Part B',
      category: 'Automotive',
      supplier: 'AutoSupply Ltd.',
      lifecycle: 'Growth',
      countryOfOrigin: 'France',
      description: 'Durable automotive component',
      reachStatus: 'non-compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'pending'
    }
  ];

  const supplierTemplate = [
    {
      name: 'TechCorp Inc.',
      contact: 'john.doe@techcorp.com',
      phone: '+1-555-0123',
      location: 'Germany',
      address: '123 Tech Street, Berlin, Germany',
      status: 'active',
      certifications: 'ISO 14001,REACH'
    },
    {
      name: 'AutoSupply Ltd.',
      contact: 'sales@autosupply.com',
      phone: '+33-1-23-45-67-89',
      location: 'France',
      address: '456 Auto Avenue, Paris, France',
      status: 'active',
      certifications: 'RoHS,ISO 9001'
    }
  ];

  const supplierPartTemplate = [
    {
      name: 'Capacitor 100μF',
      partNumber: 'CAP-100UF-25V',
      supplier: 'TechCorp Inc.',
      material: 'Aluminum Electrolytic',
      category: 'Electronic Components',
      description: 'High-quality electrolytic capacitor',
      unitPrice: 0.85,
      currency: 'EUR',
      leadTime: 14,
      minimumOrderQuantity: 1000,
      reachStatus: 'compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'compliant',
      countryOfOrigin: 'Germany'
    },
    {
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
      countryOfOrigin: 'France'
    }
  ];

  const downloadTemplate = () => {
    let template, sheetName;
    
    if (type === 'products') {
      template = productTemplate;
      sheetName = 'Products';
    } else if (type === 'suppliers') {
      template = supplierTemplate;
      sheetName = 'Suppliers';
    } else {
      template = supplierPartTemplate;
      sheetName = 'Supplier Parts';
    }
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${type}_template.xlsx`);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error('The Excel file appears to be empty');
      }

      // Validate data structure
      const validatedData = validateData(jsonData);
      setPreviewData(validatedData.slice(0, 5)); // Show first 5 rows for preview
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setPreviewData([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateData = (data: any[]) => {
    if (type === 'supplier-parts') {
      return data.map((row, index) => {
        const requiredFields = ['name', 'partNumber', 'supplier'];
        const missingFields = requiredFields.filter(field => !row[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
        }

        return {
          id: `SP-${Date.now()}-${index}`,
          name: row.name || '',
          partNumber: row.partNumber || '',
          supplier: row.supplier || '',
          material: row.material || '',
          category: row.category || 'Uncategorized',
          description: row.description || '',
          unitPrice: parseFloat(row.unitPrice) || 0,
          currency: row.currency || 'EUR',
          leadTime: parseInt(row.leadTime) || 0,
          minimumOrderQuantity: parseInt(row.minimumOrderQuantity) || 1,
          reachStatus: ['compliant', 'non-compliant', 'pending'].includes(row.reachStatus) 
            ? row.reachStatus : 'pending',
          rohsStatus: ['compliant', 'non-compliant', 'pending'].includes(row.rohsStatus) 
            ? row.rohsStatus : 'pending',
          pfasStatus: ['compliant', 'non-compliant', 'pending'].includes(row.pfasStatus) 
            ? row.pfasStatus : 'pending',
          countryOfOrigin: row.countryOfOrigin || '',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      });
    } else if (type === 'products') {
      return data.map((row, index) => {
        const requiredFields = ['name'];
        const missingFields = requiredFields.filter(field => !row[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
        }

        return {
          id: `PRD-${Date.now()}-${index}`,
          name: row.name || '',
          category: row.category || 'Uncategorized',
          supplier: row.supplier || '',
          lifecycle: row.lifecycle || '',
          countryOfOrigin: row.countryOfOrigin || '',
          description: row.description || '',
          reachStatus: ['compliant', 'non-compliant', 'pending'].includes(row.reachStatus) 
            ? row.reachStatus : 'pending',
          rohsStatus: ['compliant', 'non-compliant', 'pending'].includes(row.rohsStatus) 
            ? row.rohsStatus : 'pending',
          pfasStatus: ['compliant', 'non-compliant', 'pending'].includes(row.pfasStatus) 
            ? row.pfasStatus : 'pending',
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      });
    } else {
      return data.map((row, index) => {
        const requiredFields = ['name', 'contact'];
        const missingFields = requiredFields.filter(field => !row[field]);
        
        if (missingFields.length > 0) {
          throw new Error(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
        }

        return {
          id: `SUP-${Date.now()}-${index}`,
          name: row.name || '',
          contact: row.contact || '',
          phone: row.phone || '',
          location: row.location || '',
          address: row.address || '',
          complianceRate: Math.floor(Math.random() * 20) + 80, // Random rate between 80-100
          certifications: row.certifications ? row.certifications.split(',').map((cert: string) => cert.trim()) : [],
          status: ['active', 'inactive', 'pending'].includes(row.status) ? row.status : 'pending',
          lastAudit: new Date().toISOString().split('T')[0]
        };
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validatedData = validateData(jsonData);
      onUpload(validatedData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload data');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPreviewColumns = () => {
    if (type === 'supplier-parts') {
      return ['name', 'partNumber', 'supplier', 'material', 'category', 'unitPrice', 'reachStatus', 'rohsStatus', 'pfasStatus'];
    } else if (type === 'products') {
      return ['name', 'category', 'supplier', 'lifecycle', 'countryOfOrigin', 'reachStatus', 'rohsStatus', 'pfasStatus'];
    } else {
      return ['name', 'contact', 'location', 'status'];
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            Upload {type === 'products' ? 'Products' : type === 'suppliers' ? 'Suppliers' : 'Supplier Parts'} from Excel
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Download the template file to see the required format</li>
              <li>2. Fill in your data following the template structure</li>
              <li>3. Upload your completed Excel file</li>
              <li>4. Review the preview and confirm the upload</li>
            </ul>
          </div>

          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Download Template</h4>
                <p className="text-sm text-gray-600">
                  Get the Excel template with the correct format and sample data
                </p>
              </div>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              {isProcessing ? 'Processing...' : `Upload ${type === 'products' ? 'Products' : type === 'suppliers' ? 'Suppliers' : 'Supplier Parts'}`}
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="excel-upload"
              />
              <label htmlFor="excel-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drop your Excel file here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supports .xlsx and .xls files
                </p>
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected file: {file.name}
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">Error:</span>
              </div>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          )}

          {/* Preview */}
          {previewData.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Preview (First 5 rows)
              </h3>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {getPreviewColumns().map((column) => (
                        <th key={column} className="px-4 py-2 text-left font-medium text-gray-700 capitalize">
                          {column.replace(/([A-Z])/g, ' $1').trim()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {getPreviewColumns().map((column) => (
                          <td key={column} className="px-4 py-2 text-gray-900">
                            {Array.isArray(row[column]) 
                              ? row[column].join(', ') 
                              : row[column] || '-'
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Total rows to be imported: {previewData.length > 5 ? `${previewData.length} (showing first 5)` : previewData.length}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isProcessing || error !== null}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : `Upload ${type === 'products' ? 'Products' : type === 'suppliers' ? 'Suppliers' : 'Supplier Parts'}`}
          </button>
        </div>
      </div>
    </div>
  );
}