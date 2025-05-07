import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Main App Component
const App = () => {
  // State management for app navigation and data
  const [page, setPage] = useState('landing');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: ''
  });
  
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [themeScores, setThemeScores] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Load questionnaire data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Attempting to load questionnaire data...");
        
        // When running locally, the JSON file should be in the 'public' folder of your React app
        const fileContent = await window.fs.readFile('questionnaire-data.json');
        const jsonContent = new TextDecoder().decode(fileContent);
        const jsonData = JSON.parse(jsonContent);
        
        console.log("Data loaded successfully");
        setQuestionnaire(jsonData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("We couldn't load the questionnaire data. Please make sure the questionnaire-data.json file is in the correct location.");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculate progress
  useEffect(() => {
    if (questionnaire) {
      const totalQuestions = questionnaire.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      setProgress(Math.round((answeredQuestions / totalQuestions) * 100));
    }
  }, [answers, questionnaire]);

  // Calculate theme scores
  useEffect(() => {
    if (questionnaire && Object.keys(answers).length > 0) {
      // Initialize theme scores
      const newThemeScores = {};
      questionnaire.themes.forEach(theme => {
        newThemeScores[theme] = {
          score: 0,
          maxPossible: 0,
          percentage: 0,
          questions: []
        };
      });
      
      // Calculate scores per theme
      questionnaire.questions.forEach((question, index) => {
        const theme = question.theme;
        const answerIndex = answers[index];
        
        if (answerIndex !== undefined) {
          const questionScore = question.options[answerIndex].score;
          
          // Find max possible score for this question
          const maxPossible = Math.max(...question.options.map(opt => opt.score || 0));
          
          if (theme && newThemeScores[theme]) {
            newThemeScores[theme].score += questionScore;
            newThemeScores[theme].maxPossible += maxPossible;
            newThemeScores[theme].questions.push({
              question: question.question,
              score: questionScore,
              maxPossible: maxPossible,
              answer: question.options[answerIndex].text
            });
          }
        }
      });
      
      // Calculate percentages
      Object.keys(newThemeScores).forEach(theme => {
        const { score, maxPossible } = newThemeScores[theme];
        newThemeScores[theme].percentage = maxPossible > 0 
          ? Math.round((score / maxPossible) * 100) 
          : 0;
      });
      
      setThemeScores(newThemeScores);
      
      // Calculate total scores
      const totalScore = Object.values(newThemeScores).reduce((sum, theme) => sum + theme.score, 0);
      const totalMaxPossible = Object.values(newThemeScores).reduce((sum, theme) => sum + theme.maxPossible, 0);
      
      setScores({
        total: totalScore,
        maxPossible: totalMaxPossible,
        percentage: totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0
      });
    }
  }, [answers, questionnaire]);

  // Handle user form submission
  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    
    // Check if the questionnaire data is loaded before proceeding
    if (questionnaire) {
      setPage('instructions');
    } else {
      // If data is not loaded yet, set loading to true and try to load it again
      setLoading(true);
      
      const loadData = async () => {
        try {
          const fileContent = await window.fs.readFile('questionnaire-data.json');
          const jsonData = JSON.parse(new TextDecoder().decode(fileContent));
          setQuestionnaire(jsonData);
          setLoading(false);
          setPage('instructions');
        } catch (error) {
          console.error("Error loading data:", error);
          setLoading(false);
          alert("Error loading questionnaire data. Please try again.");
        }
      };
      
      loadData();
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  // Navigation functions
  const goToNextQuestion = () => {
    if (questionnaire && currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setPage('results');
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo(0, 0);
    } else {
      setPage('instructions');
      window.scrollTo(0, 0);
    }
  };

  // Generate improvement tips based on scores
  const getImprovementTips = (theme, percentage) => {
    const tips = {
      'Authorisation & Compliance': {
        low: "Focus on creating a compliance checklist for all required approvals and permits before fundraising. Assign a dedicated person to track regulatory requirements.",
        medium: "Strengthen your compliance processes by documenting clear procedures for each type of permit or approval required. Consider quarterly compliance reviews.",
        high: "Maintain your strong practices and consider sharing your compliance framework with other organizations. Stay updated on regulatory changes."
      },
      'Planning & Documentation': {
        low: "Start by creating basic documentation for key fundraising processes. Develop templates for planning and implement a document management system.",
        medium: "Enhance your documentation by adding more detailed SOPs and ensure all key team members can access them. Review documents quarterly.",
        high: "Your planning processes are strong. Consider creating visual workflows and conduct annual documentation reviews to stay current."
      },
      'Fund Management & Controls': {
        low: "Implement basic financial controls including segregation of duties and clear donation tracking. Create a simple donor due diligence process.",
        medium: "Strengthen your controls by adding risk-based verification steps and regular reconciliation processes. Improve donor communication about fund restrictions.",
        high: "Your controls are robust. Consider implementing advanced tracking software and conduct periodic stress tests of your financial systems."
      },
      'Reporting & Transparency': {
        low: "Begin publishing basic donor reports and create templates for sharing how funds are used. Start a simple impact reporting process.",
        medium: "Enhance transparency with more detailed impact reports and create a dashboard for tracking and sharing outcomes with stakeholders.",
        high: "Your reporting is excellent. Consider adding interactive elements to your reports and gather feedback from donors on your transparency efforts."
      },
      'Governance & Oversight': {
        low: "Establish a governance committee and conduct basic board training on oversight responsibilities. Create a simple risk management framework.",
        medium: "Strengthen board engagement by implementing regular governance reviews and establishing clearer oversight processes for fundraising.",
        high: "Your governance structure is strong. Consider external governance assessments and creating a mentoring program for new board members."
      }
    };
    
    if (percentage < 50) return tips[theme].low;
    if (percentage < 75) return tips[theme].medium;
    return tips[theme].high;
  };

  // Render loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">Loading Governance Assessment Tool...</h1>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Render error screen if there's an error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50 p-4">
        <div className="max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-red-100 p-3">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">We're Having Trouble</h2>
            
            <p className="text-gray-600 text-center mb-6">
              {error}
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">File Location Help:</h3>
              <p className="text-blue-700 text-sm mb-2">
                The questionnaire-data.json file should be placed in the <span className="font-mono bg-blue-100 px-1 rounded">public</span> folder of your React application.
              </p>
              <p className="text-blue-700 text-sm">
                Path: <span className="font-mono bg-blue-100 px-1 rounded">public/questionnaire-data.json</span>
              </p>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
              >
                Try Again
              </button>
              
              <button
                onClick={() => setPage('landing')}
                className="ml-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render landing page
  if (page === 'landing') {
    return <LandingPage setPage={setPage} />;
  }

  // Render user information form
  if (page === 'userInfo') {
    return (
      <UserInfoForm 
        userData={userData}
        setUserData={setUserData}
        handleSubmit={handleUserFormSubmit}
      />
    );
  }

  // Render instructions page
  if (page === 'instructions') {
    return (
      <InstructionsPage 
        setPage={setPage}
        questionnaire={questionnaire}
      />
    );
  }

  // Render question page
  if (page === 'questions') {
    const currentQuestion = questionnaire.questions[currentQuestionIndex];
    const selectedOptionIndex = answers[currentQuestionIndex];
    
    return (
      <QuestionPage
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        totalQuestions={questionnaire.questions.length}
        selectedOptionIndex={selectedOptionIndex}
        handleAnswerSelect={handleAnswerSelect}
        goToNextQuestion={goToNextQuestion}
        goToPreviousQuestion={goToPreviousQuestion}
        progress={progress}
      />
    );
  }

  // Render results page
  if (page === 'results') {
    return (
      <ResultsPage
        scores={scores}
        themeScores={themeScores}
        getImprovementTips={getImprovementTips}
        userData={userData}
        setPage={setPage}
      />
    );
  }

  return <div>Something went wrong. Please refresh the page.</div>;
};

// Landing Page Component
const LandingPage = ({ setPage }) => {
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-800 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Charity Governance Knowledge Repository</h1>
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
                  <p className="text-blue-800 font-medium">Organizations with strong governance practices demonstrate 50% higher program effectiveness and 35% greater fundraising success than those with weak practices.</p>
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
                <p className="text-sm">Our self-assessment tool has been developed in consultation with governance experts and aligned with Malaysian regulatory requirements.</p>
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

// User Information Form Component
const UserInfoForm = ({ userData, setUserData, handleSubmit }) => {
  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-center text-blue-800 mb-6">
              Tell Us About Your Organization
            </h1>
            
            <p className="text-gray-600 mb-6">
              Please provide the following information before starting the assessment. This will help us customize your results.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="organization">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userData.organization}
                    onChange={(e) => setUserData({ ...userData, organization: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  Continue to Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Instructions Page Component
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

// Question Page Component
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

// Results Page Component
const ResultsPage = ({ scores, themeScores, getImprovementTips, userData, setPage }) => {
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
            
            {/* Score breakdown by theme */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Score by Theme
              </h2>
              
              <div className="space-y-6">
                {Object.entries(themeScores).map(([theme, data], index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-800">{theme}</h3>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getScoreColor(data.percentage)}`}>
                          {data.percentage}%
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({data.score} / {data.maxPossible})
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className={getScoreBackgroundColor(data.percentage) + " h-2.5 rounded-full"} 
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700">Improvement Tips:</h4>
                      <p className="text-gray-600 mt-1">
                        {getImprovementTips(theme, data.percentage)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Interpretation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                What Your Score Means
              </h3>
              
              <div className="text-blue-700 space-y-2">
                <p><strong>90-100% (Excellent):</strong> Your organization demonstrates best practices in this area.</p>
                <p><strong>70-89% (Good):</strong> Strong performance with some room for improvement.</p>
                <p><strong>50-69% (Fair):</strong> Basic compliance with significant opportunity for enhancement.</p>
                <p><strong>Below 50% (Needs Attention):</strong> This area requires immediate improvement focus.</p>
              </div>
            </div>
            
            {/* Detailed theme breakdown */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Detailed Assessment Breakdown
              </h2>
              
              <div className="space-y-8">
                {Object.entries(themeScores).map(([theme, data], themeIndex) => (
                  <div key={themeIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`${getScoreBackgroundColor(data.percentage)} px-4 py-2 text-white font-medium`}>
                      {theme} - {data.percentage}% ({getScoreLabel(data.percentage)})
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-4">
                        {data.questions.map((item, questionIndex) => (
                          <div key={questionIndex} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                            <p className="font-medium text-gray-800">{item.question}</p>
                            <p className="text-gray-600 mt-1 text-sm">Your answer: {item.answer}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs text-gray-500">Score:</span>
                              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                                {item.score} / {item.maxPossible}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Next steps */}
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Recommended Next Steps
              </h3>
              
              <ol className="list-decimal pl-5 space-y-2 text-green-700">
                <li>Review the areas where your organization scored below 70% and develop an action plan to address these gaps.</li>
                <li>Share these results with your board and key stakeholders to build awareness of governance strengths and weaknesses.</li>
                <li>Implement at least one improvement from each theme area in the next 3-6 months.</li>
                <li>Schedule a follow-up assessment in 12 months to track your progress.</li>
                <li>Consider seeking external governance consulting for areas that scored below 50%.</li>
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

export default App;