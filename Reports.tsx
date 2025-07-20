import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { ReportCard } from '../components/ReportCard';
import { ComplianceOverview } from '../components/ComplianceOverview';
import { TrendChart } from '../components/TrendChart';
import { FileBarChart, Download, Calendar, Filter } from 'lucide-react';

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const handleExportReport = () => {
    // Sample compliance data for export
    const complianceData = [
      { Category: 'Electronics', 'REACH Compliant (%)': 85, 'RoHS Compliant (%)': 88, 'PFAS Compliant (%)': 82, 'Non-Compliant (%)': 15, 'Total Products': 320 },
      { Category: 'Automotive', 'REACH Compliant (%)': 92, 'RoHS Compliant (%)': 94, 'PFAS Compliant (%)': 89, 'Non-Compliant (%)': 8, 'Total Products': 280 },
      { Category: 'Medical', 'REACH Compliant (%)': 78, 'RoHS Compliant (%)': 81, 'PFAS Compliant (%)': 75, 'Non-Compliant (%)': 22, 'Total Products': 150 },
      { Category: 'Industrial', 'REACH Compliant (%)': 88, 'RoHS Compliant (%)': 90, 'PFAS Compliant (%)': 85, 'Non-Compliant (%)': 12, 'Total Products': 497 }
    ];

    // Sample trend data
    const trendData = [
      { Month: 'January', 'REACH Compliance (%)': 85, 'RoHS Compliance (%)': 87, 'PFAS Compliance (%)': 82, 'Products Reviewed': 245 },
      { Month: 'February', 'REACH Compliance (%)': 88, 'RoHS Compliance (%)': 89, 'PFAS Compliance (%)': 85, 'Products Reviewed': 267 },
      { Month: 'March', 'REACH Compliance (%)': 87, 'RoHS Compliance (%)': 88, 'PFAS Compliance (%)': 84, 'Products Reviewed': 289 },
      { Month: 'April', 'REACH Compliance (%)': 91, 'RoHS Compliance (%)': 92, 'PFAS Compliance (%)': 88, 'Products Reviewed': 312 },
      { Month: 'May', 'REACH Compliance (%)': 89, 'RoHS Compliance (%)': 90, 'PFAS Compliance (%)': 86, 'Products Reviewed': 298 },
      { Month: 'June', 'REACH Compliance (%)': 93, 'RoHS Compliance (%)': 94, 'PFAS Compliance (%)': 90, 'Products Reviewed': 334 }
    ];

    // Summary statistics
    const summaryData = [
      { Metric: 'Total Products', Value: 1247 },
      { Metric: 'REACH Compliant Products', Value: 1089 },
      { Metric: 'RoHS Compliant Products', Value: 1124 },
      { Metric: 'PFAS Compliant Products', Value: 1056 },
      { Metric: 'Fully Compliant Products', Value: 1021 },
      { Metric: 'Non-Compliant Products', Value: 158 },
      { Metric: 'Overall REACH Compliance Rate (%)', Value: 87.3 },
      { Metric: 'Overall RoHS Compliance Rate (%)', Value: 90.1 },
      { Metric: 'Overall PFAS Compliance Rate (%)', Value: 84.7 },
      { Metric: 'Active Suppliers', Value: 89 },
      { Metric: 'Average Supplier REACH Compliance Rate (%)', Value: 91.7 },
      { Metric: 'Average Supplier RoHS Compliance Rate (%)', Value: 93.2 },
      { Metric: 'Average Supplier PFAS Compliance Rate (%)', Value: 88.5 }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Add summary sheet
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Add compliance by category sheet
    const complianceWs = XLSX.utils.json_to_sheet(complianceData);
    XLSX.utils.book_append_sheet(wb, complianceWs, 'Compliance by Category');

    // Add trend analysis sheet
    const trendWs = XLSX.utils.json_to_sheet(trendData);
    XLSX.utils.book_append_sheet(wb, trendWs, 'Trend Analysis');

    // Auto-size columns for all sheets
    [summaryWs, complianceWs, trendWs].forEach(ws => {
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      const colWidths = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellAddress];
          if (cell && cell.v) {
            maxWidth = Math.max(maxWidth, String(cell.v).length);
          }
        }
        colWidths.push({ wch: Math.min(maxWidth + 2, 30) });
      }
      ws['!cols'] = colWidths;
    });

    // Generate filename with current date and period
    const date = new Date().toISOString().split('T')[0];
    const filename = `compliance_report_${selectedPeriod}_${date}.xlsx`;

    // Download file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </button>
          <button 
            onClick={handleExportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="REACH Compliance Report"
          description="Detailed analysis of REACH regulation compliance across all products"
          icon={FileBarChart}
          lastGenerated="2 hours ago"
        />
        <ReportCard
          title="RoHS Compliance Report"
          description="Assessment of RoHS directive compliance and non-conformities"
          icon={FileBarChart}
          lastGenerated="1 day ago"
        />
        <ReportCard
          title="PFAS Compliance Report"
          description="Assessment of PFAS (Per- and polyfluoroalkyl substances) compliance"
          icon={FileBarChart}
          lastGenerated="2 days ago"
        />
        <ReportCard
          title="Supplier Performance"
          description="Evaluation of supplier compliance rates across all regulations"
          icon={FileBarChart}
          lastGenerated="3 days ago"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceOverview />
        <TrendChart period={selectedPeriod} />
      </div>
    </div>
  );
}