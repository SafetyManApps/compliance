import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { DocumentTable } from '../components/DocumentTable';
import { DocumentModal } from '../components/DocumentModal';
import { DocumentViewModal } from '../components/DocumentViewModal';
import { useDocuments } from '../hooks/useDocuments';
import { Document } from '../types/database';
import { deleteFile } from '../lib/supabase';
import { Upload, Filter, Search, Download } from 'lucide-react';

export function Documents() {
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { documents, loading, error, fetchDocuments, deleteDocument } = useDocuments();


  const handleExportDocuments = () => {
    // Prepare data for export
    const exportData = documents.map(doc => ({
      'Document ID': doc.id,
      'Document Name': doc.name,
      'Document Type': doc.type,
      'Associated Product': doc.product_name || '',
      'Upload Date': new Date(doc.created_at).toLocaleDateString(),
      'File Size': doc.file_size || '',
      'Status': doc.status,
      'File URL': doc.file_url || '',
      'Description': doc.description || ''
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Documents');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `documents_export_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowModal(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const documentToDelete = documents.find(doc => doc.id === documentId);
        
        // Delete file from storage if it exists
        if (documentToDelete?.file_path) {
          try {
            await deleteFile(documentToDelete.file_path);
          } catch (error) {
            console.warn('Failed to delete file from storage:', error);
          }
        }
        
        // Delete document record from database
        await deleteDocument(documentId);
        
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Failed to delete document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const handleDocumentSave = (savedDocument: Document) => {
    // Refresh the documents list
    fetchDocuments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading documents: {error}</p>
        <button 
          onClick={fetchDocuments}
          className="mt-2 text-red-600 hover:text-red-700 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={handleExportDocuments}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Document Table */}
      <DocumentTable 
        documents={documents}
        searchTerm={searchTerm}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDeleteDocument={handleDeleteDocument}
      />

      {/* Document Modal */}
      {showModal && (
        <DocumentModal
          document={selectedDocument}
          onSave={handleDocumentSave}
          onClose={() => {
            setShowModal(false);
            setSelectedDocument(null);
          }}
        />
      )}

      {/* Document View Modal */}
      {showViewModal && selectedDocument && (
        <DocumentViewModal
          document={selectedDocument}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}