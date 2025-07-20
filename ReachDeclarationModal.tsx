import React, { useState } from 'react';
import { X, Download, FileText, Calendar, Building, User, Image, Palette } from 'lucide-react';
import jsPDF from 'jspdf';

interface Product {
  id: string;
  name: string;
  category: string;
  supplier: string;
  lifecycle: string;
  countryOfOrigin: string;
  reachStatus: 'compliant' | 'non-compliant' | 'pending';
  rohsStatus: 'compliant' | 'non-compliant' | 'pending';
  pfasStatus: 'compliant' | 'non-compliant' | 'pending';
  lastUpdated: string;
}

interface ReachDeclarationModalProps {
  products: Product[];
  onClose: () => void;
}

export function ReachDeclarationModal({ products, onClose }: ReachDeclarationModalProps) {
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    companyAddress: '123 Business Street\nCity, State 12345\nCountry',
    contactPerson: 'John Doe',
    contactTitle: 'Compliance Manager',
    contactEmail: 'compliance@acme.com',
    contactPhone: '+1-555-0123',
    declarationDate: new Date().toISOString().split('T')[0],
    declarationNumber: `REACH-${Date.now()}`,
    logoUrl: '',
    signatureUrl: '',
  });

  const addImageFromUrl = async (pdf: jsPDF, imageUrl: string, x: number, y: number, width: number, height: number) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            pdf.addImage(dataURL, 'PNG', x, y, width, height);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
      });
    } catch (error) {
      console.warn('Failed to load image:', error);
    }
  };

  const generateDeclarationLetter = async () => {
    // Create new PDF document
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin + 10; // Extra space for decorative border

    // Add company logo if provided
    if (formData.logoUrl) {
      try {
        await addImageFromUrl(pdf, formData.logoUrl, margin, yPosition, 40, 20);
        yPosition += 30; // Space after logo
      } catch (error) {
        console.warn('Failed to add logo:', error);
      }
    }

    // Helper function to add text with automatic page breaks
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, isCenter: boolean = false) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(fontSize);
      if (isBold) {
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFont('helvetica', 'normal');
      }
      
      if (isCenter) {
        const textWidth = pdf.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        pdf.text(text, x, yPosition);
      } else {
        // Split long lines to fit within margins
        const maxWidth = pageWidth - (margin * 2);
        const lines = pdf.splitTextToSize(text, maxWidth);
        
        for (let i = 0; i < lines.length; i++) {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(lines[i], margin, yPosition);
          yPosition += lineHeight;
        }
        return;
      }
      
      yPosition += lineHeight;
    };

    // Add spacing
    const addSpacing = (lines: number = 1) => {
      yPosition += lineHeight * lines;
    };

    // Generate PDF content
    addText('REACH DECLARATION LETTER', 16, true, true);
    addSpacing(2);
    
    addText(`Declaration Number: ${formData.declarationNumber}`, 12, true);
    addText(`Date: ${new Date(formData.declarationDate).toLocaleDateString()}`, 12, true);
    addSpacing(2);
    
    addText(formData.companyName, 12, true);
    formData.companyAddress.split('\n').forEach(line => {
      addText(line, 10);
    });
    addSpacing(2);
    
    addText('REACH REGULATION (EC) No 1907/2006 DECLARATION', 14, true, true);
    addSpacing(2);
    
    addText('Dear Customer,', 10);
    addSpacing();
    
    addText(`We hereby declare that the following products supplied by ${formData.companyName} comply with the requirements of the REACH Regulation (EC) No 1907/2006 concerning the Registration, Evaluation, Authorization and Restriction of Chemicals.`, 10);
    addSpacing(2);
    
    addText('PRODUCTS COVERED BY THIS DECLARATION:', 12, true);
    addSpacing();
    
    products.forEach((product, index) => {
      addText(`${index + 1}. Product Name: ${product.name}`, 10, true);
      addText(`   Product ID: ${product.id}`, 10);
      addText(`   Category: ${product.category}`, 10);
      addText(`   Supplier: ${product.supplier}`, 10);
      addText(`   Country of Origin: ${product.countryOfOrigin}`, 10);
      addText(`   REACH Status: ${product.reachStatus.toUpperCase()}`, 10);
      addText(`   Last Updated: ${product.lastUpdated}`, 10);
      addSpacing();
    });
    
    addSpacing();
    addText('DECLARATION STATEMENT:', 12, true);
    addSpacing();
    
    addText('We confirm that:', 10);
    addSpacing();
    
    const statements = [
      'None of the products listed above contain substances of very high concern (SVHC) from the REACH candidate list in concentrations above 0.1% (w/w).',
      'All chemical substances used in the manufacturing of these products have been registered under REACH or are exempt from registration requirements.',
      'We continuously monitor the REACH candidate list and will inform you immediately if any of our products are affected by future updates.',
      'Safety Data Sheets (SDS) are available upon request for all chemical substances and mixtures covered by this declaration.',
      'This declaration is based on information provided by our suppliers and our own analysis. We reserve the right to update this declaration as new information becomes available.'
    ];
    
    statements.forEach((statement, index) => {
      addText(`${index + 1}. ${statement}`, 10);
      addSpacing();
    });
    
    addSpacing();
    addText('CONTACT INFORMATION:', 12, true);
    addSpacing();
    
    addText('For any questions regarding this REACH declaration, please contact:', 10);
    addSpacing();
    
    addText(formData.contactPerson, 10, true);
    addText(formData.contactTitle, 10);
    addText(`Email: ${formData.contactEmail}`, 10);
    addText(`Phone: ${formData.contactPhone}`, 10);
    addSpacing(2);
    
    addText('This declaration is valid as of the date stated above and supersedes all previous declarations for the products listed.', 10);
    addSpacing(2);
    
    addText('Sincerely,', 10);
    addSpacing(2);
    
    // Add electronic signature if provided
    if (formData.signatureUrl) {
      try {
        await addImageFromUrl(pdf, formData.signatureUrl, margin, yPosition, 60, 20);
        yPosition += 25;
      } catch (error) {
        console.warn('Failed to add signature:', error);
      }
    }
    
    addText(formData.contactPerson, 10, true);
    addText(formData.contactTitle, 10);
    addText(formData.companyName, 10);
    addSpacing(3);
    
    addText('---', 10);
    addText('This document was generated automatically by the Compliance Tracking System.', 8);
    addText(`Generated on: ${new Date().toLocaleString()}`, 8);

    // Save the PDF
    pdf.save(`REACH_Declaration_${formData.declarationNumber}.pdf`);
    
    alert('REACH Declaration PDF has been generated and downloaded!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-semibold">Generate REACH Declaration Letter</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Selected Products Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Selected Products ({products.length})
            </h3>
            <div className="max-h-32 overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="text-sm text-blue-800 py-1">
                  <span className="font-medium">{product.name}</span> 
                  <span className="text-blue-600 ml-2">({product.id})</span>
                  <span className="ml-2 text-blue-700">- {product.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declaration Number
                </label>
                <input
                  type="text"
                  value={formData.declarationNumber}
                  onChange={(e) => setFormData({ ...formData, declarationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Address *
                </label>
                <textarea
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title/Position *
                </label>
                <input
                  type="text"
                  value={formData.contactTitle}
                  onChange={(e) => setFormData({ ...formData, contactTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Declaration Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Declaration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declaration Date *
                </label>
                <input
                  type="date"
                  value={formData.declarationDate}
                  onChange={(e) => setFormData({ ...formData, declarationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Customization Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Document Customization
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of your company logo (PNG, JPG, or SVG format recommended)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electronic Signature URL
                </label>
                <input
                  type="url"
                  value={formData.signatureUrl}
                  onChange={(e) => setFormData({ ...formData, signatureUrl: e.target.value })}
                  placeholder="https://example.com/signature.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL of your electronic signature image (transparent PNG recommended)
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Image className="h-4 w-4 mr-2" />
                Image Requirements
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Images must be publicly accessible URLs</li>
                <li>• Recommended formats: PNG (for transparency), JPG, or SVG</li>
                <li>• Logo: Optimal size 200x100px or similar aspect ratio</li>
                <li>• Signature: Optimal size 300x100px with transparent background</li>
                <li>• Images will be automatically resized to fit the document</li>
              </ul>
            </div>
          </div>

          {/* Declaration Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Declaration Summary</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Products:</strong> {products.length} selected</p>
              <p><strong>Company:</strong> {formData.companyName}</p>
              <p><strong>Contact:</strong> {formData.contactPerson} ({formData.contactTitle})</p>
              <p><strong>Date:</strong> {new Date(formData.declarationDate).toLocaleDateString()}</p>
              <p><strong>Declaration Number:</strong> {formData.declarationNumber}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={generateDeclarationLetter}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Generate & Download Letter</span>
          </button>
        </div>
      </div>
    </div>
  );
}