'use client';

import AppLayout from '../../components/layout/AppLayout';
import SupplierRecommendation from '../../components/supplier/SupplierRecommendation';

export default function SupplierRecommendationsPage() {
  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-display text-[#111827]">
            Supplier Recommendation Engine
          </h1>
          <p className="text-[#556068]">
            Find and compare optimal local suppliers in Morocco for improved sustainability and efficiency
          </p>
        </div>
        
        <SupplierRecommendation />
      </div>
    </AppLayout>
  );
} 