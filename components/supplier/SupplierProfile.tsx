'use client';

import { motion } from 'framer-motion';
import { Supplier } from './suppliersData';

interface SupplierProfileProps {
  supplier: Supplier;
}

export default function SupplierProfile({ supplier }: SupplierProfileProps) {
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
  
  // Function to render progress bar
  const renderProgressBar = (value: number) => {
    const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <motion.div 
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    );
  };
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={childVariants} className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-[#111827]">{supplier.name}</h3>
          <p className="text-sm text-[#556068] flex items-center mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
            {supplier.location} • {supplier.distance} km away
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {supplier.recommended && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-lg font-medium">
              Recommended
            </span>
          )}
          {supplier.currentlyUsed && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-lg font-medium">
              Current Supplier
            </span>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={childVariants} className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-[#556068]">Established</p>
          <p className="text-lg font-medium text-[#111827]">{supplier.established}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-[#556068]">Employees</p>
          <p className="text-lg font-medium text-[#111827]">{supplier.employees}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-[#556068]">Certifications</p>
          <p className="text-lg font-medium text-[#111827]">{supplier.certifications.length}</p>
        </div>
      </motion.div>
      
      <motion.div variants={childVariants} className="mb-6">
        <h4 className="text-sm font-medium text-[#111827] mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Reliability</p>
              <p className="text-xs font-medium">{supplier.metrics.reliabilityScore}/100</p>
            </div>
            {renderProgressBar(supplier.metrics.reliabilityScore)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Quality</p>
              <p className="text-xs font-medium">{supplier.metrics.qualityScore}/100</p>
            </div>
            {renderProgressBar(supplier.metrics.qualityScore)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Price Competitiveness</p>
              <p className="text-xs font-medium">{supplier.metrics.priceCompetitiveness}/100</p>
            </div>
            {renderProgressBar(supplier.metrics.priceCompetitiveness)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Delivery Speed</p>
              <p className="text-xs font-medium">{supplier.metrics.deliverySpeed}/100</p>
            </div>
            {renderProgressBar(supplier.metrics.deliverySpeed)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">On-Time Delivery</p>
              <p className="text-xs font-medium">{supplier.metrics.onTimeDelivery}/100</p>
            </div>
            {renderProgressBar(supplier.metrics.onTimeDelivery)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Response Time</p>
              <p className="text-xs font-medium">{supplier.metrics.responseTime} hours</p>
            </div>
            {renderProgressBar(100 - (supplier.metrics.responseTime * 5))}
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={childVariants} className="mb-6">
        <h4 className="text-sm font-medium text-[#111827] mb-3">Sustainability Profile</h4>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <p className="text-xs text-[#556068]">Sustainability Score</p>
            <p className="text-xs font-medium">{supplier.sustainability.score}/100</p>
          </div>
          {renderProgressBar(supplier.sustainability.score)}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Renewable Energy</p>
              <p className="text-xs font-medium">{supplier.sustainability.renewableEnergy}%</p>
            </div>
            {renderProgressBar(supplier.sustainability.renewableEnergy)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Waste Reduction</p>
              <p className="text-xs font-medium">{supplier.sustainability.wasteReduction}%</p>
            </div>
            {renderProgressBar(supplier.sustainability.wasteReduction)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Local Resourcing</p>
              <p className="text-xs font-medium">{supplier.sustainability.localResourcing}%</p>
            </div>
            {renderProgressBar(supplier.sustainability.localResourcing)}
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-xs text-[#556068]">Community Impact</p>
              <p className="text-xs font-medium">{supplier.sustainability.communityImpact}/100</p>
            </div>
            {renderProgressBar(supplier.sustainability.communityImpact)}
          </div>
        </div>
      </motion.div>
      
      {supplier.costSavings.transportCost > 0 && (
        <motion.div variants={childVariants} className="mb-4">
          <div className="bg-[#683cec]/10 rounded-lg p-4">
            <h4 className="text-sm font-medium text-[#683cec] mb-2">Cost Savings Potential</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-[#556068]">Transport</p>
                <p className="text-lg font-medium text-[#111827]">{supplier.costSavings.transportCost}%</p>
              </div>
              <div>
                <p className="text-xs text-[#556068]">Lead Time</p>
                <p className="text-lg font-medium text-[#111827]">{supplier.costSavings.leadTime}%</p>
              </div>
              <div>
                <p className="text-xs text-[#556068]">Import Taxes</p>
                <p className="text-lg font-medium text-[#111827]">{supplier.costSavings.importTaxes}%</p>
              </div>
              <div>
                <p className="text-xs text-[#556068]">Risk Mitigation</p>
                <p className="text-lg font-medium text-[#111827]">{supplier.costSavings.riskMitigation}%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div variants={childVariants}>
        <h4 className="text-sm font-medium text-[#111827] mb-2">Materials & Products</h4>
        <div className="flex flex-wrap gap-2">
          {supplier.materials.map((material, index) => (
            <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-[#556068] rounded-lg">
              {material}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 