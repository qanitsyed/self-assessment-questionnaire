import React from 'react';

const InstructionsPage = ({ setPage, questionnaire }) => {
  // Safety check for questionnaire data
  const themes = questionnaire?.themes || ["Governance"];
  const questionCount = questionnaire?.questions?.length || 0;
  
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Assessment Instructions
            </h1>
            
            <div className="text-gray-600 mb-8 space-y-4">
              <p>
                Welcome to the Self Assessment Questionnaire. This assessment will help you evaluate 
                your organization across key governance areas:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                {themes.map((theme, index) => (
                  <li key={index} className="font-medium">{theme}</li>
                ))}
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Important:</strong> Be honest in your assessment. This tool is designed to help you identify areas for improvement, not to pass judgment.
                    </p>
                  </div>
                </div>
              </div>
              
              <p>
                The questionnaire contains {questionCount} questions. For each question, 
                select the option that best describes your organization's current state.
              </p>
              
              <p>
                At the end, you'll receive a score breakdown by theme to identify strengths and 
                areas for improvement.
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Have your organization's documents and information ready before you begin. You may need to refer to your constitution, policies, and financial records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setPage('questions')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
              >
                Begin Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
