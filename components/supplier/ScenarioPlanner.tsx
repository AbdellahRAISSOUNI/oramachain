'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Supplier } from './suppliersData';

interface Scenario {
  id: string;
  name: string;
  description: string;
  totalCost: number;
  leadTime: number;
  carbonFootprint: number;
  riskLevel: string;
  sustainabilityScore: number;
  benefits: string[];
  drawbacks: string[];
}

interface ScenarioPlannerProps {
  scenarios: Scenario[];
  currentSupplier: Supplier | null;
  recommendedSupplier: Supplier | null;
}

export default function ScenarioPlanner({ scenarios, currentSupplier, recommendedSupplier }: ScenarioPlannerProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>(scenarios[0]?.id || '');
  const [animatingComparisonIndex, setAnimatingComparisonIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);
  
  // Get the currently selected scenario
  const scenario = scenarios.find(s => s.id === selectedScenario) || scenarios[0];
  
  // Handle scenario selection
  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
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
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Draw the comparison chart
  useEffect(() => {
    const canvas = chartRef.current;
    if (canvas && scenario) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas dimensions
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart settings
        const barHeight = 30;
        const barGap = 50;
        const chartLeftPadding = 170;
        const chartTopPadding = 30;
        const chartRightPadding = 80;
        const maxBarWidth = canvas.width - chartLeftPadding - chartRightPadding;
        
        // Chart data normalized to max values
        const chartData = [
          { 
            label: 'Total Cost',
            values: scenarios.map(s => s.totalCost),
            colors: ['#e63946', '#2a9d8f', '#a8dadc'],
            format: (value: number) => `$${(value / 1000).toFixed(0)}k`,
            invert: true // Lower is better
          },
          { 
            label: 'Lead Time',
            values: scenarios.map(s => s.leadTime),
            colors: ['#e63946', '#2a9d8f', '#a8dadc'],
            format: (value: number) => `${value} days`,
            invert: true // Lower is better
          },
          { 
            label: 'Carbon Footprint',
            values: scenarios.map(s => s.carbonFootprint),
            colors: ['#e63946', '#2a9d8f', '#a8dadc'],
            format: (value: number) => `${value} tons`,
            invert: true // Lower is better
          },
          { 
            label: 'Sustainability',
            values: scenarios.map(s => s.sustainabilityScore),
            colors: ['#2a9d8f', '#a8dadc', '#e63946'],
            format: (value: number) => `${value}/100`,
            invert: false // Higher is better
          }
        ];
        
        // Draw each row of the chart
        chartData.forEach((row, rowIndex) => {
          const y = chartTopPadding + rowIndex * barGap;
          
          // Draw row label
          ctx.font = '14px sans-serif';
          ctx.fillStyle = '#556068';
          ctx.textAlign = 'right';
          ctx.fillText(row.label, chartLeftPadding - 15, y + barHeight / 2 + 5);
          
          // Find max value for scaling
          const maxValue = Math.max(...row.values);
          
          // Draw bars for each scenario
          scenarios.forEach((scenario, scenarioIndex) => {
            // Get value and calculate width
            const value = row.values[scenarioIndex];
            let width = row.invert
              ? maxBarWidth * (1 - (value / maxValue)) // Invert for cost, lead time, carbon (lower is better)
              : maxBarWidth * (value / maxValue); // Don't invert for sustainability (higher is better)
            
            // Ensure minimum visible width
            width = Math.max(width, 40);
            
            // Draw bar
            ctx.fillStyle = row.colors[scenarioIndex];
            ctx.fillRect(chartLeftPadding, y, width, barHeight);
            
            // Draw value text
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.fillText(row.format(value), chartLeftPadding + 10, y + barHeight / 2 + 4);
            
            // Draw scenario name for the first row
            if (rowIndex === 0) {
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = '#111827';
              ctx.textAlign = 'left';
              ctx.fillText(
                scenario.name, 
                chartLeftPadding, 
                chartTopPadding - 15
              );
            }
          });
        });
      }
    }
  }, [scenarios, scenario]);
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Scenario selector */}
      <motion.div variants={childVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((s, index) => (
          <div
            key={s.id}
            onClick={() => handleScenarioChange(s.id)}
            className={`cursor-pointer rounded-xl p-4 border transition-all ${
              selectedScenario === s.id
                ? 'border-[#683cec] bg-[#683cec]/5 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${selectedScenario === s.id ? 'text-[#683cec]' : 'text-[#111827]'}`}>
                {s.name}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                s.riskLevel === 'Low'
                  ? 'bg-green-100 text-green-700'
                  : s.riskLevel === 'Moderate'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
              }`}>
                {s.riskLevel} Risk
              </span>
            </div>
            <p className="text-xs text-[#556068] mb-3">
              {s.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#556068]">Cost: </span>
                <span className="font-medium">${(s.totalCost / 1000).toFixed(0)}k</span>
              </div>
              <div>
                <span className="text-[#556068]">Lead Time: </span>
                <span className="font-medium">{s.leadTime} days</span>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
      
      {/* Scenario details */}
      {scenario && (
        <motion.div variants={childVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Visual comparison chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-[#111827] mb-4">Scenario Comparison</h3>
            <div className="h-[250px]">
              <canvas
                ref={chartRef}
                className="w-full h-full"
              />
            </div>
          </div>
          
          {/* Right column: Benefits and drawbacks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-[#111827] mb-4">{scenario.name} Analysis</h3>
            
            {/* Benefits */}
            <div className="mb-4">
              <h4 className="text-xs font-medium text-green-700 mb-2">Benefits</h4>
              <motion.ul className="space-y-1">
                {scenario.benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="flex items-start"
                  >
                    <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-xs text-[#556068]">{benefit}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            
            {/* Drawbacks */}
            <div>
              <h4 className="text-xs font-medium text-red-700 mb-2">Drawbacks</h4>
              <motion.ul className="space-y-1">
                {scenario.drawbacks.map((drawback, index) => (
                  <motion.li
                    key={index}
                    variants={listItemVariants}
                    className="flex items-start"
                  >
                    <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                    </svg>
                    <span className="text-xs text-[#556068]">{drawback}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Implementation overview */}
      <motion.div variants={childVariants} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-[#111827] mb-4">Implementation Timeline</h3>
        
        <div className="relative">
          {/* Timeline bar */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          
          {/* Timeline steps */}
          <div className="space-y-8 ml-10 relative">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#683cec] text-white">
                1
              </div>
              <h4 className="text-sm font-medium text-[#111827] mb-1">Initial Assessment</h4>
              <p className="text-xs text-[#556068]">Detailed evaluation of current supply chain performance and identification of key improvement areas.</p>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#683cec] text-white">
                2
              </div>
              <h4 className="text-sm font-medium text-[#111827] mb-1">Supplier Engagement</h4>
              <p className="text-xs text-[#556068]">Establish communication with recommended Moroccan suppliers and conduct initial capability assessments.</p>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#683cec] text-white">
                3
              </div>
              <h4 className="text-sm font-medium text-[#111827] mb-1">Pilot Program</h4>
              <p className="text-xs text-[#556068]">Implement a limited-scope test program with the recommended supplier to validate performance metrics.</p>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute -left-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#683cec] text-white">
                4
              </div>
              <h4 className="text-sm font-medium text-[#111827] mb-1">Full Integration</h4>
              <p className="text-xs text-[#556068]">Complete transition to the new supply chain configuration with regular performance monitoring.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 