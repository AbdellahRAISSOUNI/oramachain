'use client';

import SupplierRecommendation from '../../components/supplier/SupplierRecommendation';

export default function SuppliersPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl md:text-3xl font-display text-[#111827] mb-2">
        Supplier Recommendation Engine
      </h1>
      <p className="text-[#556068] text-lg mb-8">
        Find and compare optimal local suppliers in Morocco for improved sustainability and efficiency
      </p>
      
      <SupplierRecommendation />
    </div>
  );
} 