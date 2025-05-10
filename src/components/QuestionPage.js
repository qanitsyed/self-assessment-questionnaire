import React from 'react';

const QuestionPage = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  selectedOptionIndex, 
  handleAnswerSelect, 
  goToNextQuestion, 
  goToPreviousQuestion,
  progress
}) => {
  // Tips for each theme
  const themeTips = {
    'Authorisation & Compliance': {
      tip: "Proper authorization and compliance ensures your organization meets all legal requirements for fundraising activities.",
      icon: "🔒"
    },
    'Planning & Documentation': {
      tip: "Good documentation provides clarity, consistency and continuity for your organization's processes.",
      icon: "📝"
    },
    'Fund Management & Controls': {
      tip: "Strong financial controls protect your organization's assets and donor trust.",
      icon: "💰"
    },
    'Reporting & Transparency': {
      tip: "Transparent reporting builds trust with donors, regulators, and the public.",
      icon: "📊"
    },
    'Governance & Oversight': {
      tip: "Effective oversight ensures your organization stays on mission and manages risks appropriately.",
      icon: "👁️"
    }
  };
  
  const currentThemeTip = themeTips[question.theme];
  
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Theme header */}
          <div className="bg-blue-700 text-white px-6 py-4">
            <h2 className="text-lg font-medium">
              {question.theme}
            </h2>
            <p className="text-sm text-blue-100">
              Question {questionIndex + 1} of {totalQuestions}
            </p>
          </div>
          
          {/* Theme tip */}
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div className="flex items-start">
              <div className="text-4xl mr-4">{currentThemeTip.icon}</div>
              <div>
                <h3 className="font-medium text-blue-800">Theme Tip</h3>
                <p className="text-blue-700 text-sm">{currentThemeTip.tip}</p>
              </div>
            </div>
          </div>
          
          {/* Question */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {question.question}
            </h3>
          </div>
          
          {/* Options */}
          <div className="px-6 py-4 space-y-4">
            {question.options.map((option, optionIndex) => (
              <div 
                key={optionIndex}
                onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOptionIndex === optionIndex 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-5 w-5 mt-0.5 border rounded-full ${
                    selectedOptionIndex === optionIndex 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-gray-400'
                  }`}>
                    {selectedOptionIndex === optionIndex && (
                      <span className="flex items-center justify-center h-full w-full">
                        <span className="h-2 w-2 bg-white rounded-full"></span>
                      </span>
                    )}
                  </div>
                  <span className="ml-3 text-gray-700">{option.text}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Question tip */}
          <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Guidance Note</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider all aspects of your organization when answering this question. If different parts of your organization operate differently, choose the option that best represents the overall practice.
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={goToPreviousQuestion}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Previous
            </button>
            
            <button
              onClick={goToNextQuestion}
              className={`px-4 py-2 rounded-md text-white focus:outline-none ${
                selectedOptionIndex !== undefined
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={selectedOptionIndex === undefined}
            >
              {questionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPage;
