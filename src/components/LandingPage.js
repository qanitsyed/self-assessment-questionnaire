import React from 'react';

const LandingPage = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Self-Assessment Toolkit</h1>
          <p className="mt-2 text-blue-100">Strengthening governance practices in Malaysian charitable organizations</p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">The Importance of Good Governance in Charities</h2>
              
              <div className="prose max-w-none">
                <p className="mb-4">Good governance is the foundation upon which effective, transparent, and accountable charitable organizations are built. It ensures that resources are used efficiently and for their intended purposes, building donor trust and maximizing community impact.</p>
                
                <h3 className="text-xl font-semibold text-blue-700 mt-6 mb-3">Why Governance Matters for Malaysian Charities</h3>
                
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li><strong>Regulatory Compliance:</strong> Meeting requirements from ROS, SSM, LHDN, and other regulatory bodies</li>
                  <li><strong>Donor Confidence:</strong> Building trust through transparent and accountable practices</li>
                  <li><strong>Operational Efficiency:</strong> Ensuring resources are directed toward maximum impact</li>
                  <li><strong>Risk Management:</strong> Identifying and mitigating financial, reputational, and operational risks</li>
                  <li><strong>Sustainable Impact:</strong> Creating lasting positive change through effective stewardship</li>
                </ul>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                  <p className="text-blue-800 font-medium">Organizations with strong governance practices demonstrate higher program effectiveness and greater fundraising success than those with weak practices.</p>
                </div>
                
                <p>Our self-assessment tool will help you evaluate your organization's governance practices and identify areas for improvement.</p>
              </div>
              
              <button
                onClick={() => setPage('userInfo')}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
              >
                Start Self-Assessment
              </button>
            </div>
            
            <div className="md:w-1/2 bg-blue-700 text-white p-8">
              <h3 className="text-xl font-semibold mb-4">Key Governance Areas</h3>
              
              <div className="space-y-4">
                <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium">Authorisation & Compliance</h4>
                  <p className="text-sm text-blue-100 mt-1">Ensuring all necessary approvals and permits are obtained properly</p>
                </div>
                
                <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium">Planning & Documentation</h4>
                  <p className="text-sm text-blue-100 mt-1">Creating and maintaining essential documentation and processes</p>
                </div>
                
                <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium">Fund Management & Controls</h4>
                  <p className="text-sm text-blue-100 mt-1">Implementing robust financial controls and donor due diligence</p>
                </div>
                
                <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium">Reporting & Transparency</h4>
                  <p className="text-sm text-blue-100 mt-1">Providing clear reporting on fund usage and impact to stakeholders</p>
                </div>
                
                <div className="bg-blue-800 bg-opacity-50 p-4 rounded-lg">
                  <h4 className="font-medium">Governance & Oversight</h4>
                  <p className="text-sm text-blue-100 mt-1">Establishing effective board oversight and risk management practices</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-blue-600">
                <p className="text-sm"></p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-yellow-800 text-sm">This self-assessment tool is a prototype developed in consultation with industry partners and academic research.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-blue-900 text-white py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© 2025 Charity Governance Knowledge Repository. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
