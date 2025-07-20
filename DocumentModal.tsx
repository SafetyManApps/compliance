import React, { useState } from 'react';
import { X, Upload, File, AlertCircle } from 'lucide-react';
import { supabase, uploadFile, getFileUrl, DOCUMENTS_BUCKET } from '../lib/supabase';
import { DocumentInsert, DocumentUpdate } from '../types/database';

interface DocumentModalProps {
  document?: any;
  onClose: () => void;
  onSave?: (document: any) => void;
}

export function DocumentModal({ document, onClose, onSave }: DocumentModalProps) {
  const [formData, setFormData] = useState({
    name: document?.name || '',
    type: document?.type || '',
    product_name: document?.product_name || '',
    description: document?.description || '',
    expiryDate: document?.expiryDate || '',
    status: document?.status || 'valid',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setUploadError('File type not supported. Please upload PDF, DOC, DOCX, or image files.');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
    }
  };
    
    if (!formData.name.trim()) {
      setUploadError('Document name is required');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    try {
      let fileUrl = document?.file_url;
      let filePath = document?.file_path;
      let fileSize = document?.file_size;
      
      // Upload new file if selected
      if (selectedFile) {
        const timestamp = Date.now();
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${timestamp}-${formData.name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
        filePath = `documents/${fileName}`;
        
        const uploadData = await uploadFile(selectedFile, filePath);
        fileUrl = getFileUrl(filePath);
        fileSize = `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
      }
      
      const documentData = {
        name: formData.name,
        type: formData.type,
        product_name: formData.product_name,
        description: formData.description,
        file_url: fileUrl,
        file_path: filePath,
        file_size: fileSize,
        status: formData.status as 'valid' | 'expired' | 'pending',
        expiry_date: formData.expiryDate || null,
      };
      
      if (document) {
        // Update existing document
        const { data, error } = await supabase
          .from('documents')
          .update(documentData)
          .eq('id', document.id)
          .select()
          .single();
          
        if (error) throw error;
        
        if (onSave) onSave(data);
      } else {
        // Create new document
        const { data, error } = await supabase
          .from('documents')
          .insert([documentData])
          .select()
          .single();
          
        if (error) throw error;
        
        if (onSave) onSave(data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving document:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to save document');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const handleSubmit = async (e: React.FormEvent) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {document ? 'Edit Document' : 'Upload Document'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Type</option>
                <option value="REACH Declaration">REACH Declaration</option>
                <option value="RoHS Certificate">RoHS Certificate</option>
                <option value="Test Report">Test Report</option>
                <option value="Safety Data Sheet">Safety Data Sheet</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Associated Product Name
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="valid">Valid</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {document?.file_url ? 'Replace File' : 'Upload File'}
            </label>
            
            {/* Current file info */}
            {document?.file_url && !selectedFile && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">Current file: {document.name}</span>
                  {document.file_size && (
                    <span className="text-xs text-blue-600">({document.file_size})</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFile ? selectedFile.name : 'Drop file here or click to browse'}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG, GIF up to 10MB
                </p>
              </label>
            </div>
            
            {/* Selected file info */}
            {selectedFile && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">{selectedFile.name}</span>
                    <span className="text-xs text-green-600">({formatFileSize(selectedFile.size)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Upload error */}
            {uploadError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{uploadError}</span>
                </div>
              </div>
            )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Saving...' : (document ? 'Update Document' : 'Upload Document')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}