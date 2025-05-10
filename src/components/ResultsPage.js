import React from 'react';

// Recommendations Summary Component
const RecommendationsSummary = ({ themeClassifications, themeScores, questionnaire }) => {
  // Filter themes to only include non-compliant and at-risk areas
  const needsImprovementThemes = Object.entries(themeClassifications)
    .filter(([theme, data]) => 
      data.classification === 'Non-compliant' || data.classification === 'At Risk'
    )
    .sort((a, b) => {
      // Sort by severity (non-compliant first, then at-risk)
      if (a[1].classification === 'Non-compliant' && b[1].classification !== 'Non-compliant') {
        return -1;
      }
      if (a[1].classification !== 'Non-compliant' && b[1].classification === 'Non-compliant') {
        return 1;
      }
      return 0;
    });

  if (needsImprovementThemes.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Great Work! No Critical Areas Need Improvement
        </h3>
        <p className="text-green-700">
          Your organization is meeting or exceeding compliance expectations in all key areas.
          Continue to monitor and maintain these good practices.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 mb-8">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        Priority Improvement Recommendations
      </h3>
      
      <div className="space-y-6">
        {needsImprovementThemes.map(([theme, data], index) => {
          // Get the specific questions in this theme that need attention
          const problemQuestions = data.questions
            .filter(q => q.classification === 'Non-compliant' || q.classification === 'At Risk')
            .sort((a, b) => {
              // Sort by severity (non-compliant first, then at-risk)
              if (a.classification === 'Non-compliant' && b.classification !== 'Non-compliant') {
                return -1;
              }
              if (a.classification !== 'Non-compliant' && b.classification === 'Non-compliant') {
                return 1;
              }
              return 0;
            });
            
          // Also get detailed question information from themeScores
          const detailedQuestions = themeScores[theme].questions.filter(q => 
            problemQuestions.some(pq => pq.question === q.question)
          );
          
          return (
            <div key={index} className={`border-l-4 ${
              data.classification === 'Non-compliant' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'
            } p-4 rounded-r-lg`}>
              <div className="flex items-center mb-2">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                  data.classification === 'Non-compliant' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {index + 1}
                </span>
                <h4 className={`font-medium ${
                  data.classification === 'Non-compliant' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {theme} ({data.classification})
                </h4>
              </div>
              
              <div className="ml-11">
                <h5 className="font-medium text-gray-700 mb-2">Questions to Address:</h5>
                <div className="space-y-4 mb-4">
                  {detailedQuestions.map((q, qIndex) => (
                    <div key={qIndex} className="border-l-2 pl-4 pb-4 border-gray-300">
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <div className="text-sm mt-1 text-gray-600">
                        <p><span className="font-medium">Your response:</span> {q.answer}</p>
                        <p className="mt-2"><span className="font-medium">Specific recommendation:</span></p>
                        <p className="mt-1 bg-white p-3 rounded border border-gray-200">{q.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-700 mb-2">Action Plan Timeline:</h5>
                  <div className="space-y-3">
                    {data.classification === 'Non-compliant' ? (
                      <>
                        <div className="flex items-start">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium mr-2 mt-0.5 flex-shrink-0">Urgent</span>
                          <div>
                            <p className="font-medium text-gray-800">Within 30 days:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                              <li>Develop a compliance remediation plan for each item listed above</li>
                              <li>Assign a specific compliance owner for this theme</li>
                              <li>Schedule a board review of the remediation plan</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium mr-2 mt-0.5 flex-shrink-0">Critical</span>
                          <div>
                            <p className="font-medium text-gray-800">Within 90 days:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                              <li>Implement required changes following the specific recommendations</li>
                              <li>Document all changes and new procedures</li>
                              <li>Conduct training for all relevant staff</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2 mt-0.5 flex-shrink-0">Ongoing</span>
                          <div>
                            <p className="font-medium text-gray-800">After 90 days:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                              <li>Conduct a follow-up assessment</li>
                              <li>Report progress to the board</li>
                              <li>Continue monitoring for consistent compliance</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium mr-2 mt-0.5 flex-shrink-0">Important</span>
                          <div>
                            <p className="font-medium text-gray-800">Within 60 days:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                              <li>Review existing processes and identify specific gaps</li>
                              <li>Develop an improvement plan incorporating the recommendations above</li>
                              <li>Assign responsibility for implementation</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mr-2 mt-0.5 flex-shrink-0">Medium</span>
                          <div>
                            <p className="font-medium text-gray-800">Within 120 days:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                              <li>Implement changes based on the specific recommendations</li>
                              <li>Document the improved processes</li>
                              <li>Conduct staff training on the updated procedures</li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Results Page Component
const ResultsPage = ({ scores, themeScores, themeClassifications, getImprovementTips, userData, setPage, questionnaire }) => {
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
            
            {/* Recommendations Summary - NEW SECTION */}
            <RecommendationsSummary 
              themeClassifications={themeClassifications}
              themeScores={themeScores}
              questionnaire={questionnaire}
            />
            
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
                                <div className="flex-1">
                                  <p className="text-gray-600 text-sm">Your answer: {item.answer}</p>
                                  {/*item.recommendation && (
                                    <div className="mt-2">
                                      <p className="text-sm text-gray-500 font-medium">Recommendation:</p>
                                      <p className="text-gray-600 text-sm mt-1">{item.recommendation}</p>
                                    </div>
                                  )*/}
                                </div>
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
            
            {/* Resources */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Helpful Resources
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Regulatory Resources</h4>
                  <ul className="list-disc pl-5 text-gray-600 text-sm mt-1">
                    <li><a href="https://www.ros.gov.my/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Registry of Societies (ROS) - Guidelines for Societies</a></li>
                    <li><a href="https://www.ssm.com.my/Pages/Legal_Framework/Document/GUIDELINES-ON-COMPANY-LIMITED-BY-GUARANTEE-270921-Final.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Suruhanjaya Syarikat Malaysia (SSM) - Company Limited by Guarantee Resources</a></li>
                    <li><a href="https://www.hasil.gov.my/en/institutionsorganizationsfunds-primarily-is-not-for-profit/frequently-asked-questions/berkaitan-perkara-umum-subseksyen-44-6/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Inland Revenue Board (LHDN) - Tax Exemption Guidelines for Charitable Organizations</a></li>
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