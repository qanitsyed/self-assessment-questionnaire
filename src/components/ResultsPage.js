import React from 'react';

// Results Page Component
const ResultsPage = ({ scores, themeScores, themeClassifications, getImprovementTips, userData, setPage }) => {
  // Function to get colors based on numeric scores (for overall percentage)
  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };
  
  const getScoreBackgroundColor = (percentage) => {
    if (percentage >= 90) return "bg-green-600";
    if (percentage >= 70) return "bg-blue-600";
    if (percentage >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };
  
  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 70) return "Good";
    if (percentage >= 50) return "Fair";
    return "Needs Attention";
  };
  
  // Functions to get colors based on classification
  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Best Practice': return "text-green-600";
      case 'Compliant': return "text-blue-600";
      case 'At Risk': return "text-yellow-600";
      case 'Non-compliant': return "text-red-600";
      default: return "text-gray-600";
    }
  };
  
  const getClassificationBackgroundColor = (classification) => {
    switch (classification) {
      case 'Best Practice': return "bg-green-600";
      case 'Compliant': return "bg-blue-600";
      case 'At Risk': return "bg-yellow-600";
      case 'Non-compliant': return "bg-red-600";
      default: return "bg-gray-600";
    }
  };
  
  const getClassificationBadgeColor = (classification) => {
    switch (classification) {
      case 'Best Practice': return "bg-green-100 text-green-800";
      case 'Compliant': return "bg-blue-100 text-blue-800";
      case 'At Risk': return "bg-yellow-100 text-yellow-800";
      case 'Non-compliant': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const handlePrintReport = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-blue-50 py-8" id="report-container">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-800">
                Governance Assessment Results
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition print:hidden"
                >
                  Print Report
                </button>
                <button
                  onClick={() => setPage('landing')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition print:hidden"
                >
                  Start New Assessment
                </button>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-800">Organization Information</h2>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Organization</p>
                    <p className="font-medium">{userData.organization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Person</p>
                    <p className="font-medium">{userData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userData.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overall score */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Overall Governance Score
              </h2>
              <div className="inline-flex flex-col items-center">
                <div className="relative">
                  <svg className="w-32 h-32">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="10" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="56" 
                      cx="64" 
                      cy="64"
                    />
                    <circle 
                      className={getScoreBackgroundColor(scores.percentage)} 
                      strokeWidth="10" 
                      strokeDasharray={`${scores.percentage * 3.51}, 351`}
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="56" 
                      cx="64" 
                      cy="64"
                    />
                  </svg>
                  <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold ${getScoreColor(scores.percentage)}`}>
                    {scores.percentage}%
                  </span>
                </div>
                <p className={`mt-2 font-semibold ${getScoreColor(scores.percentage)}`}>
                  {getScoreLabel(scores.percentage)}
                </p>
                <p className="text-gray-600 mt-1">
                  {scores.total} / {scores.maxPossible} points
                </p>
              </div>
            </div>
            
            {/* Theme Classifications */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Governance Classifications by Theme
              </h2>
              
              <div className="space-y-6">
                {Object.entries(themeClassifications).map(([theme, data], index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{theme}</h3>
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getClassificationBadgeColor(data.classification)}`}>
                          {data.classification}
                        </span>
                      </div>
                    </div>
                    
                    {/* Score info from theme scores */}
                    {themeScores[theme] && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Point-based Score</span>
                          <span>{themeScores[theme].percentage}% ({themeScores[theme].score} / {themeScores[theme].maxPossible})</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={getScoreBackgroundColor(themeScores[theme].percentage) + " h-2.5 rounded-full"} 
                            style={{ width: `${themeScores[theme].percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Improvement Tips:</h4>
                      <p className="text-gray-600 mt-1">
                        {getImprovementTips(theme, data.classification)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Interpretation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                What Your Classifications Mean
              </h3>
              
              <div className="text-blue-700 space-y-2">
                <p><strong className="text-green-700">Best Practice:</strong> Your organization demonstrates exemplary governance practices that exceed requirements.</p>
                <p><strong className="text-blue-700">Compliant:</strong> Your organization meets all requirements with consistent, well-documented processes.</p>
                <p><strong className="text-yellow-700">At Risk:</strong> Your organization has gaps or inconsistencies that could lead to compliance issues.</p>
                <p><strong className="text-red-700">Non-compliant:</strong> Your organization has significant gaps that require immediate attention.</p>
              </div>
            </div>
            
            {/* Detailed theme breakdown */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Detailed Assessment Breakdown
              </h2>
              
              <div className="space-y-8">
                {Object.entries(themeScores).map(([theme, data], themeIndex) => {
                  const themeClassification = themeClassifications[theme].classification;
                  return (
                    <div key={themeIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className={`${getClassificationBackgroundColor(themeClassification)} px-4 py-2 text-white font-medium`}>
                        {theme} - {themeClassification}
                      </div>
                      
                      <div className="p-4">
                        <div className="space-y-4">
                          {data.questions.map((item, questionIndex) => (
                            <div key={questionIndex} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                              <p className="font-medium text-gray-800">{item.question}</p>
                              <div className="flex justify-between items-start mt-1">
                                <p className="text-gray-600 text-sm flex-1">Your answer: {item.answer}</p>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getClassificationBadgeColor(item.classification)}`}>
                                  {item.classification}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Next steps */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Recommended Next Steps
              </h3>
              
              <ol className="list-decimal pl-5 space-y-2 text-green-700">
                <li>Address any areas classified as "Non-compliant" immediately to mitigate potential risks.</li>
                <li>Develop an action plan to improve areas classified as "At Risk" within the next 3 months.</li>
                <li>Share these results with your board and key stakeholders to build awareness of governance strengths and weaknesses.</li>
                <li>Schedule quarterly reviews of your "At Risk" areas to track your progress.</li>
                <li>Consider seeking external governance consulting for any theme classified as "Non-compliant".</li>
              </ol>
            </div>
            
            {/* Resources */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Helpful Resources
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Regulatory Resources</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-1">
                    <li>Registry of Societies (ROS) - Guidelines for Societies</li>
                    <li>Suruhanjaya Syarikat Malaysia (SSM) - Company Limited by Guarantee Resources</li>
                    <li>Inland Revenue Board (LHDN) - Tax Exemption Guidelines for Charitable Organizations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Governance Templates & Tools</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-1">
                    <li>Board Policies & Procedures Template</li>
                    <li>Financial Controls Checklist</li>
                    <li>Fundraising Compliance Checklist</li>
                    <li>Donor Due Diligence Framework</li>
                    <li>Risk Management Matrix</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Training & Development</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-1">
                    <li>Board Governance Training Programs</li>
                    <li>Financial Management for Non-Profits Workshop</li>
                    <li>Compliance & Risk Management Certification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 print:bg-white">
            <p className="text-center text-gray-500 text-sm">
              This assessment was completed on {new Date().toLocaleDateString()}. For more information and resources, visit our knowledge repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
