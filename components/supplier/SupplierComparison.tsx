'use client';

import { motion } from 'framer-motion';
import { Supplier } from './suppliersData';

interface SupplierComparisonProps {
  primarySupplier: Supplier | null;
  comparisonSupplier: Supplier | null;
  suppliers: Supplier[];
  onSelectPrimary: (supplier: Supplier) => void;
  onSelectComparison: (supplier: Supplier) => void;
}

export default function SupplierComparison({
  primarySupplier,
  comparisonSupplier,
  suppliers,
  onSelectPrimary,
  onSelectComparison
}: SupplierComparisonProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.3
      }
    }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Function to calculate the difference between two values
  const calculateDifference = (value1: number, value2: number) => {
    const diff = value1 - value2;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0
    };
  };
  
  // Function to render comparison metric
  const renderMetricComparison = (label: string, value1: number, value2: number, isHigherBetter = true) => {
    const { value, isPositive } = calculateDifference(value1, value2);
    const isBetter = isHigherBetter ? isPositive : !isPositive;
    
    return (
      <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
        <div className="text-sm text-[#556068]">{label}</div>
        <div className="text-center">
          <div className={`text-sm font-medium ${isBetter ? 'text-green-600' : ''}`}>{value1}</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-medium ${!isBetter ? 'text-green-600' : ''}`}>{value2}</div>
        </div>
      </div>
    );
  };
  
  // Function to render a difference indicator
  const renderDifference = (value1: number, value2: number, isHigherBetter = true, showPercentage = false) => {
    const { value, isPositive } = calculateDifference(value1, value2);
    const isBetter = isHigherBetter ? isPositive : !isPositive;
    const percentageDiff = ((value / Math.max(value1, value2)) * 100).toFixed(0);
    
    return (
      <div className={`flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium ${
        isBetter 
          ? 'bg-green-100 text-green-700' 
          : 'bg-red-100 text-red-700'
      }`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
          {isBetter ? (
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          ) : (
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          )}
        </svg>
        {showPercentage ? `${percentageDiff}%` : value.toFixed(isHigherBetter ? 0 : 1)}
      </div>
    );
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={childVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary supplier selector */}
        <div>
          <label className="block text-sm text-[#556068] mb-2">Primary Supplier</label>
          <select
            value={primarySupplier?.id || ''}
            onChange={(e) => {
              const supplier = suppliers.find(s => s.id === e.target.value);
              if (supplier) onSelectPrimary(supplier);
            }}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
          >
            <option value="" disabled>Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} - {supplier.location}
              </option>
            ))}
          </select>
        </div>
        
        {/* Comparison supplier selector */}
        <div>
          <label className="block text-sm text-[#556068] mb-2">Comparison Supplier</label>
          <select
            value={comparisonSupplier?.id || ''}
            onChange={(e) => {
              const supplier = suppliers.find(s => s.id === e.target.value);
              if (supplier) onSelectComparison(supplier);
            }}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-[#683cec] focus:border-[#683cec]"
          >
            <option value="" disabled>Select a supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name} - {supplier.location}
              </option>
            ))}
          </select>
        </div>
      </motion.div>
      
      {primarySupplier && comparisonSupplier ? (
        <motion.div variants={childVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-3 items-center border-b border-gray-200 pb-3">
            <div className="font-medium text-[#111827]">Comparison Metrics</div>
            <div className="text-center font-medium text-[#683cec]">{primarySupplier.name}</div>
            <div className="text-center font-medium text-[#9747FF]">{comparisonSupplier.name}</div>
          </div>
          
          {/* Basic info */}
          <div className="py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-[#111827] mb-3">Company Information</h4>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Location</div>
              <div className="text-center text-sm">{primarySupplier.location}</div>
              <div className="text-center text-sm">{comparisonSupplier.location}</div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Distance</div>
              <div className="text-center text-sm font-medium">
                {primarySupplier.distance} km
                {primarySupplier.distance < comparisonSupplier.distance && (
                  <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    Closer
                  </span>
                )}
              </div>
              <div className="text-center text-sm font-medium">
                {comparisonSupplier.distance} km
                {comparisonSupplier.distance < primarySupplier.distance && (
                  <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                    Closer
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Established</div>
              <div className="text-center text-sm">{primarySupplier.established}</div>
              <div className="text-center text-sm">{comparisonSupplier.established}</div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3">
              <div className="text-sm text-[#556068]">Employees</div>
              <div className="text-center text-sm">{primarySupplier.employees}</div>
              <div className="text-center text-sm">{comparisonSupplier.employees}</div>
            </div>
          </div>
          
          {/* Performance metrics */}
          <div className="py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-[#111827] mb-3">Performance Metrics</h4>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Reliability</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.metrics.reliabilityScore}</div>
                {primarySupplier.metrics.reliabilityScore !== comparisonSupplier.metrics.reliabilityScore && (
                  renderDifference(primarySupplier.metrics.reliabilityScore, comparisonSupplier.metrics.reliabilityScore)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.metrics.reliabilityScore}</div>
                {primarySupplier.metrics.reliabilityScore !== comparisonSupplier.metrics.reliabilityScore && (
                  renderDifference(comparisonSupplier.metrics.reliabilityScore, primarySupplier.metrics.reliabilityScore)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Quality</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.metrics.qualityScore}</div>
                {primarySupplier.metrics.qualityScore !== comparisonSupplier.metrics.qualityScore && (
                  renderDifference(primarySupplier.metrics.qualityScore, comparisonSupplier.metrics.qualityScore)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.metrics.qualityScore}</div>
                {primarySupplier.metrics.qualityScore !== comparisonSupplier.metrics.qualityScore && (
                  renderDifference(comparisonSupplier.metrics.qualityScore, primarySupplier.metrics.qualityScore)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Price Competitiveness</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.metrics.priceCompetitiveness}</div>
                {primarySupplier.metrics.priceCompetitiveness !== comparisonSupplier.metrics.priceCompetitiveness && (
                  renderDifference(primarySupplier.metrics.priceCompetitiveness, comparisonSupplier.metrics.priceCompetitiveness)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.metrics.priceCompetitiveness}</div>
                {primarySupplier.metrics.priceCompetitiveness !== comparisonSupplier.metrics.priceCompetitiveness && (
                  renderDifference(comparisonSupplier.metrics.priceCompetitiveness, primarySupplier.metrics.priceCompetitiveness)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Delivery Speed</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.metrics.deliverySpeed}</div>
                {primarySupplier.metrics.deliverySpeed !== comparisonSupplier.metrics.deliverySpeed && (
                  renderDifference(primarySupplier.metrics.deliverySpeed, comparisonSupplier.metrics.deliverySpeed)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.metrics.deliverySpeed}</div>
                {primarySupplier.metrics.deliverySpeed !== comparisonSupplier.metrics.deliverySpeed && (
                  renderDifference(comparisonSupplier.metrics.deliverySpeed, primarySupplier.metrics.deliverySpeed)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3">
              <div className="text-sm text-[#556068]">Defect Rate</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.metrics.defectRate}%</div>
                {primarySupplier.metrics.defectRate !== comparisonSupplier.metrics.defectRate && (
                  renderDifference(primarySupplier.metrics.defectRate, comparisonSupplier.metrics.defectRate, false)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.metrics.defectRate}%</div>
                {primarySupplier.metrics.defectRate !== comparisonSupplier.metrics.defectRate && (
                  renderDifference(comparisonSupplier.metrics.defectRate, primarySupplier.metrics.defectRate, false)
                )}
              </div>
            </div>
          </div>
          
          {/* Sustainability metrics */}
          <div className="py-4 border-b border-gray-200">
            <h4 className="text-sm font-medium text-[#111827] mb-3">Sustainability Metrics</h4>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Sustainability Score</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.sustainability.score}</div>
                {primarySupplier.sustainability.score !== comparisonSupplier.sustainability.score && (
                  renderDifference(primarySupplier.sustainability.score, comparisonSupplier.sustainability.score)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.sustainability.score}</div>
                {primarySupplier.sustainability.score !== comparisonSupplier.sustainability.score && (
                  renderDifference(comparisonSupplier.sustainability.score, primarySupplier.sustainability.score)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
              <div className="text-sm text-[#556068]">Carbon Footprint</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.sustainability.carbonFootprint} tons</div>
                {primarySupplier.sustainability.carbonFootprint !== comparisonSupplier.sustainability.carbonFootprint && (
                  renderDifference(primarySupplier.sustainability.carbonFootprint, comparisonSupplier.sustainability.carbonFootprint, false)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.sustainability.carbonFootprint} tons</div>
                {primarySupplier.sustainability.carbonFootprint !== comparisonSupplier.sustainability.carbonFootprint && (
                  renderDifference(comparisonSupplier.sustainability.carbonFootprint, primarySupplier.sustainability.carbonFootprint, false)
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center py-3">
              <div className="text-sm text-[#556068]">Renewable Energy</div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{primarySupplier.sustainability.renewableEnergy}%</div>
                {primarySupplier.sustainability.renewableEnergy !== comparisonSupplier.sustainability.renewableEnergy && (
                  renderDifference(primarySupplier.sustainability.renewableEnergy, comparisonSupplier.sustainability.renewableEnergy)
                )}
              </div>
              <div className="text-center flex flex-col items-center">
                <div className="text-sm font-medium">{comparisonSupplier.sustainability.renewableEnergy}%</div>
                {primarySupplier.sustainability.renewableEnergy !== comparisonSupplier.sustainability.renewableEnergy && (
                  renderDifference(comparisonSupplier.sustainability.renewableEnergy, primarySupplier.sustainability.renewableEnergy)
                )}
              </div>
            </div>
          </div>
          
          {/* Cost savings */}
          {(primarySupplier.costSavings.transportCost > 0 || comparisonSupplier.costSavings.transportCost > 0) && (
            <div className="py-4">
              <h4 className="text-sm font-medium text-[#111827] mb-3">Cost Savings</h4>
              
              <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
                <div className="text-sm text-[#556068]">Transport Cost Reduction</div>
                <div className="text-center text-sm font-medium">{primarySupplier.costSavings.transportCost}%</div>
                <div className="text-center text-sm font-medium">{comparisonSupplier.costSavings.transportCost}%</div>
              </div>
              
              <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
                <div className="text-sm text-[#556068]">Import Tax Savings</div>
                <div className="text-center text-sm font-medium">{primarySupplier.costSavings.importTaxes}%</div>
                <div className="text-center text-sm font-medium">{comparisonSupplier.costSavings.importTaxes}%</div>
              </div>
              
              <div className="grid grid-cols-3 items-center py-3 border-b border-gray-100">
                <div className="text-sm text-[#556068]">Lead Time Reduction</div>
                <div className="text-center text-sm font-medium">{primarySupplier.costSavings.leadTime}%</div>
                <div className="text-center text-sm font-medium">{comparisonSupplier.costSavings.leadTime}%</div>
              </div>
              
              <div className="grid grid-cols-3 items-center py-3">
                <div className="text-sm text-[#556068]">Risk Mitigation</div>
                <div className="text-center text-sm font-medium">{primarySupplier.costSavings.riskMitigation}%</div>
                <div className="text-center text-sm font-medium">{comparisonSupplier.costSavings.riskMitigation}%</div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          variants={childVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center"
        >
          <p className="text-gray-500">Please select two suppliers to compare</p>
        </motion.div>
      )}
    </motion.div>
  );
} 