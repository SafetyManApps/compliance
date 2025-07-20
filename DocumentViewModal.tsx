import React from 'react';
import { X, Download, Edit2, FileText, Calendar, Package, Tag } from 'lucide-react';
import { Document } from '../types/database';

interface DocumentViewModalProps {
  document: Document;
  onClose: () => void;
}

export function DocumentViewModal({ document, onClose }: DocumentViewModalProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      valid: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-3 py-1 text-sm rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDownload = async () => {
    if (!document.file_url) {
      alert('No file available for download');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = document.file_url;
      link.download = document.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isImageFile = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  const isPdfFile = (url: string) => {
    return /\.pdf$/i.test(url);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Document Details</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDownload}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
              disabled={!document.file_url}
              title="Download document"
            >
              <Download className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Document Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                <p className="text-sm text-gray-500">{document.id}</p>
              </div>
            </div>
            {getStatusBadge(document.status)}
          </div>

          {/* Document Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Document Type</p>
                  <p className="text-sm text-gray-900">{document.type}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Associated Product</p>
                  <p className="text-sm text-gray-900">{document.product_name || 'Not specified'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Upload Date</p>
                  <p className="text-sm text-gray-900">{formatDate(document.created_at)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">File Size</p>
                <p className="text-sm text-gray-900">{document.file_size || 'Unknown'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                {getStatusBadge(document.status)}
              </div>
            </div>
          </div>

          {/* Document Preview */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {document.file_url ? (
              <div>
                {isImageFile(document.file_url) ? (
                  <div className="text-center">
                    <img 
                      src={document.file_url} 
                      alt={document.name}
                      className="max-w-full max-h-96 mx-auto rounded-lg shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling!.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Unable to preview image</p>
                    </div>
                  </div>
                ) : isPdfFile(document.file_url) ? (
                  <div className="text-center">
                    <iframe
                      src={`${document.file_url}#toolbar=0`}
                      className="w-full h-96 border-0 rounded-lg"
                      title={document.name}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">File Preview</p>
                    <p className="text-xs text-gray-500">
                      Preview not available for this file type
                    </p>
                    <button
                      onClick={handleDownload}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Download to view
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-2">No File Available</p>
                <p className="text-xs text-gray-500">
                  No file has been uploaded for this document
                </p>
              </div>
            )}
          </div>

          {/* Document Description */}
          {document.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {document.description || 'No description available.'}
              </p>
            </div>
          )}

          {/* Compliance Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Compliance Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">REACH Compliance:</span>
                <span className="ml-2 text-blue-700">
                  {document.type.includes('REACH') ? 'Covered' : 'Not applicable'}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">RoHS Compliance:</span>
                <span className="ml-2 text-blue-700">
                  {document.type.includes('RoHS') ? 'Covered' : 'Not applicable'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}