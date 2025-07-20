import React from 'react';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';

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

interface ProductTableProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectProduct: (productId: string) => void;
  onEditProduct: (product: Product) => void;
}

export function ProductTable({ products, selectedProductIds, onSelectProduct, onEditProduct }: ProductTableProps) {

  const getStatusBadge = (status: string) => {
    const styles = {
      compliant: 'bg-green-100 text-green-800',
      'non-compliant': 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={products.length > 0 && selectedProductIds.length === products.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      products.forEach(product => {
                        if (!selectedProductIds.includes(product.id)) {
                          onSelectProduct(product.id);
                        }
                      });
                    } else {
                      products.forEach(product => {
                        if (selectedProductIds.includes(product.id)) {
                          onSelectProduct(product.id);
                        }
                      });
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Life Cycle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country of Origin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                REACH Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RoHS Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PFAS Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => onSelectProduct(product.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.lifecycle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.countryOfOrigin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.reachStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.rohsStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(product.pfasStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.lastUpdated}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onEditProduct(product)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-700">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}