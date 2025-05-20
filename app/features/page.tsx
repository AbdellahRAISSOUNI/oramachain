'use client';

import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SmoothScroller from '../../components/SmoothScroller';
import ScrollAnimations from '../../components/ScrollAnimations';
import CustomCursor from '../../components/CustomCursor';

export default function Features() {
  return (
    <>
      <CustomCursor />
      <SmoothScroller>
        <Header />
        
        {/* Features Hero Section */}
        <section 
          data-scroll-section 
          className="min-h-screen relative flex items-center justify-center pt-24"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Premium <span className="gradient-text">Features</span>
              </h1>
              <div className="h-1 w-24 bg-accent2"></div>
            </div>
            
            <div data-scroll-animation className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg mb-6">
                  OramaChain offers a comprehensive suite of premium features designed to transform your blockchain experience. Our platform combines cutting-edge AI with robust blockchain technology to deliver solutions that are both powerful and user-friendly.
                </p>
                <p className="text-lg">
                  Explore our key features below and discover how OramaChain can revolutionize your approach to blockchain technology.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center">
                  <div className="text-6xl font-display font-bold gradient-text">OC</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature List Section */}
        <section 
          data-scroll-section 
          className="min-h-screen flex items-center justify-center bg-secondary"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Key <span className="gradient-text">Features</span>
              </h2>
              <div className="h-1 w-24 bg-accent3"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
              {[
                {
                  title: "AI-Powered Analytics",
                  description: "Advanced analytics using artificial intelligence to provide actionable insights from blockchain data."
                },
                {
                  title: "Smart Contracts",
                  description: "Automated, secure contract execution with built-in validation and verification systems."
                },
                {
                  title: "Distributed Ledger",
                  description: "Immutable, transparent record-keeping across a decentralized network of nodes."
                },
                {
                  title: "Supply Chain Tracking",
                  description: "End-to-end visibility and traceability for complex supply chains with real-time updates."
                },
                {
                  title: "Enterprise Integration",
                  description: "Seamless integration with existing enterprise systems through robust APIs and connectors."
                },
                {
                  title: "Security Framework",
                  description: "Multi-layered security protocols with advanced encryption and access controls."
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  data-scroll-animation
                  className="bg-white p-8 rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-accent1/10 flex items-center justify-center mb-6">
                    <span className="text-accent1 text-xl font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-text/70">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Feature Comparison Section */}
        <section 
          data-scroll-section 
          className="min-h-screen flex items-center justify-center"
        >
          <div className="max-w-7xl mx-auto w-full py-24 px-6 md:px-16">
            <div data-scroll-animation className="mb-12">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Feature <span className="gradient-text">Comparison</span>
              </h2>
              <div className="h-1 w-24 bg-accent2"></div>
            </div>
            
            <div data-scroll-animation className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full bg-white">
                <thead>
                  <tr className="bg-secondary">
                    <th className="py-4 px-6 text-left">Feature</th>
                    <th className="py-4 px-6 text-center">Standard</th>
                    <th className="py-4 px-6 text-center gradient-bg text-white">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Basic Blockchain", standard: true, premium: true },
                    { feature: "Smart Contracts", standard: true, premium: true },
                    { feature: "AI Analytics", standard: false, premium: true },
                    { feature: "Enterprise Integration", standard: false, premium: true },
                    { feature: "Advanced Security", standard: false, premium: true },
                    { feature: "24/7 Support", standard: false, premium: true }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="py-4 px-6 font-medium">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {row.standard ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">×</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {row.premium && <span className="text-accent2">✓</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        <Footer />
        
        <ScrollAnimations />
      </SmoothScroller>
    </>
  );
} 