'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import suppliers, { Supplier, procurementScenarios, categories } from './suppliersData';
import SupplierProfile from './SupplierProfile';
import SupplierComparison from './SupplierComparison';
import ScenarioPlanner from './ScenarioPlanner';
import SupplierMap from './SupplierMap';
import SupplierList from './SupplierList';

export default function SupplierRecommendation() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'recommendation' | 'comparison' | 'scenarios'>('recommendation');
  
  // State for selected suppliers
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    suppliers.find(s => s.recommended) || null
  );
  const [comparisonSupplier, setComparisonSupplier] = useState<Supplier | null>(
    suppliers.find(s => s.currentlyUsed) || null
  );
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string | null>('electronics');
  
  // Filtered suppliers based on category
  const filteredSuppliers = activeCategory 
    ? suppliers.filter(s => s.category === activeCategory)
    : suppliers;
  
  // Handle supplier selection
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };
  
  // Handle comparison supplier selection
  const handleComparisonSelect = (supplier: Supplier) => {
    setComparisonSupplier(supplier);
  };
  
  // Handle category filter change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };
  
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={childVariants} className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-display text-[#111827]">Supplier Recommendations</h2>
            <p className="text-sm text-[#556068] mt-1">Compare and select optimal local suppliers</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setActiveTab('recommendation')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'recommendation' 
                  ? 'bg-[#683cec] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Recommendations
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'comparison' 
                  ? 'bg-[#683cec] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Comparison
            </button>
            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'scenarios' 
                  ? 'bg-[#683cec] text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Scenarios
            </button>
          </div>
        </motion.div>
        
        {/* Category filters */}
        <motion.div variants={childVariants} className="flex space-x-3 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#683cec]/10 text-[#683cec] border border-[#683cec]/30'
                  : 'bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>
        
        {/* Main content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'recommendation' && (
            <motion.div
              key="recommendation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Supplier list */}
              <div className="lg:col-span-1">
                <SupplierList 
                  suppliers={filteredSuppliers}
                  selectedSupplierId={selectedSupplier?.id}
                  onSelect={handleSelectSupplier}
                />
              </div>
              
              {/* Supplier details and map */}
              <div className="lg:col-span-2 space-y-6">
                {selectedSupplier && (
                  <>
                    <SupplierProfile supplier={selectedSupplier} />
                    <SupplierMap 
                      suppliers={filteredSuppliers}
                      selectedSupplierId={selectedSupplier.id}
                      comparisonSupplierId={comparisonSupplier?.id}
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SupplierComparison 
                primarySupplier={selectedSupplier}
                comparisonSupplier={comparisonSupplier}
                suppliers={suppliers}
                onSelectPrimary={handleSelectSupplier}
                onSelectComparison={handleComparisonSelect}
              />
            </motion.div>
          )}
          
          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScenarioPlanner 
                scenarios={procurementScenarios}
                currentSupplier={suppliers.find(s => s.currentlyUsed) || null}
                recommendedSupplier={suppliers.find(s => s.recommended) || null}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 