'use client';

import { motion } from 'framer-motion';
import { Supplier } from './suppliersData';

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSupplierId?: string;
  onSelect: (supplier: Supplier) => void;
}

export default function SupplierList({ suppliers, selectedSupplierId, onSelect }: SupplierListProps) {
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="bg-gray-50 rounded-xl p-4 h-[650px] overflow-y-auto">
      <h3 className="text-sm font-medium text-[#556068] mb-3">Available Suppliers</h3>
      
      <motion.ul
        className="space-y-3"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {suppliers.map(supplier => (
          <motion.li
            key={supplier.id}
            variants={itemVariants}
            onClick={() => onSelect(supplier)}
            className={`bg-white rounded-lg p-4 cursor-pointer transition-all border ${
              selectedSupplierId === supplier.id 
                ? 'border-[#683cec] shadow-md' 
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#111827]">{supplier.name}</h4>
              {supplier.recommended && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              )}
              {supplier.currentlyUsed && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            
            <div className="text-xs text-[#556068] mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-1">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
              </svg>
              {supplier.location} • {supplier.distance} km
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-[#556068]">Quality</div>
                <div className="text-sm font-medium flex items-center">
                  {supplier.metrics.qualityScore}
                  <span className="text-xs text-gray-400 ml-1">/100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-[#556068]">Reliability</div>
                <div className="text-sm font-medium flex items-center">
                  {supplier.metrics.reliabilityScore}
                  <span className="text-xs text-gray-400 ml-1">/100</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-[#556068]">Sustainability</div>
                <div className="text-sm font-medium flex items-center">
                  {supplier.sustainability.score}
                  <span className="text-xs text-gray-400 ml-1">/100</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="text-xs text-[#556068]">Price</div>
                <div className="text-sm font-medium flex items-center">
                  {supplier.metrics.priceCompetitiveness}
                  <span className="text-xs text-gray-400 ml-1">/100</span>
                </div>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
      
      {suppliers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No suppliers found in this category
        </div>
      )}
    </div>
  );
} 