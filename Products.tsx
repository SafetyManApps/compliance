import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ProductTable } from '../components/ProductTable';
import { ProductModal } from '../components/ProductModal';
import { ExcelUploadModal } from '../components/ExcelUploadModal';
import { ReachDeclarationModal } from '../components/ReachDeclarationModal';
import { RohsDeclarationModal } from '../components/RohsDeclarationModal';
import { PfasDeclarationModal } from '../components/PfasDeclarationModal';
import { Plus, Filter, Download, Upload } from 'lucide-react';

export function Products() {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReachDeclarationModal, setShowReachDeclarationModal] = useState(false);
  const [showRohsDeclarationModal, setShowRohsDeclarationModal] = useState(false);
  const [showPfasDeclarationModal, setShowPfasDeclarationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'Electronic Component A',
      category: 'Electronics',
      supplier: 'TechCorp Inc.',
      lifecycle: 'Maturity',
      countryOfOrigin: 'Germany',
      reachStatus: 'compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'compliant',
      lastUpdated: '2024-01-15',
    },
    {
      id: 'PRD-002',
      name: 'Automotive Part B',
      category: 'Automotive',
      supplier: 'AutoSupply Ltd.',
      lifecycle: 'Growth',
      countryOfOrigin: 'France',
      reachStatus: 'non-compliant',
      rohsStatus: 'compliant',
      pfasStatus: 'pending',
      lastUpdated: '2024-01-14',
    },
    {
      id: 'PRD-003',
      name: 'Medical Device C',
      category: 'Medical',
      supplier: 'MedTech Corp.',
      lifecycle: 'Introduction',
      countryOfOrigin: 'Netherlands',
      reachStatus: 'pending',
      rohsStatus: 'pending',
      pfasStatus: 'non-compliant',
      lastUpdated: '2024-01-13',
    },
  ]);

  const handleSelectProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectedProducts = products.filter(product => 
    selectedProductIds.includes(product.id)
  );

  const handleBatchUpload = (uploadedProducts: any[]) => {
    setProducts(prevProducts => [...prevProducts, ...uploadedProducts]);
  };

  const handleExportProducts = () => {
    // Prepare data for export with clean column names
    const exportData = products.map(product => ({
      'Product ID': product.id,
      'Product Name': product.name,
      'Category': product.category,
      'Supplier': product.supplier,
      'Life Cycle': product.lifecycle,
      'Country of Origin': product.countryOfOrigin,
      'REACH Status': product.reachStatus,
      'RoHS Status': product.rohsStatus,
      'PFAS Status': product.pfasStatus,
      'Last Updated': product.lastUpdated,
      'Description': product.description || ''
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `products_export_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={handleExportProducts}
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
            onClick={() => setShowReachDeclarationModal(true)}
            disabled={selectedProductIds.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedProductIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <span>Generate REACH Declaration ({selectedProductIds.length})</span>
          </button>
          <button 
            onClick={() => setShowRohsDeclarationModal(true)}
            disabled={selectedProductIds.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedProductIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>Generate RoHS Declaration ({selectedProductIds.length})</span>
          </button>
          <button 
            onClick={() => setShowPfasDeclarationModal(true)}
            disabled={selectedProductIds.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedProductIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <span>Generate PFAS Declaration ({selectedProductIds.length})</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <ProductTable 
        products={products}
        selectedProductIds={selectedProductIds}
        onSelectProduct={handleSelectProduct}
        onEditProduct={(product) => {
          setSelectedProduct(product);
          setShowModal(true);
        }}
      />

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {/* Excel Upload Modal */}
      {showUploadModal && (
        <ExcelUploadModal
          type="products"
          onClose={() => setShowUploadModal(false)}
          onUpload={handleBatchUpload}
        />
      )}

      {/* REACH Declaration Modal */}
      {showReachDeclarationModal && (
        <ReachDeclarationModal
          products={selectedProducts}
          onClose={() => setShowReachDeclarationModal(false)}
        />
      )}

      {/* RoHS Declaration Modal */}
      {showRohsDeclarationModal && (
        <RohsDeclarationModal
          products={selectedProducts}
          onClose={() => setShowRohsDeclarationModal(false)}
        />
      )}

      {/* PFAS Declaration Modal */}
      {showPfasDeclarationModal && (
        <PfasDeclarationModal
          products={selectedProducts}
          onClose={() => setShowPfasDeclarationModal(false)}
        />
      )}
    </div>
  );
}