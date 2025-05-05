import React, { useState, useEffect } from 'react';

const App = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const [themeScores, setThemeScores] = useState({});
  const [progress, setProgress] = useState(0);
  
  // Load data from the JSON file
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch the JSON file
        const response = await fetch('/questionnaire-data.json');
        const questionnaireData = await response.json();
        
        setData(questionnaireData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading questionnaire data:", error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Calculate progress percentage
  useEffect(() => {
    if (data) {
      const totalQuestions = data.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      setProgress(Math.round((answeredQuestions / totalQuestions) * 100));
    }
  }, [answers, data]);
  
  // Calculate scores by theme
  useEffect(() => {
    if (data && Object.keys(scores).length > 0) {
      const newThemeScores = {};
      
      // Initialize theme scores
      data.themes.forEach(theme => {
        newThemeScores[theme] = {
          score: 0,
          maxPossible: 0,
          percentage: 0
        };
      });
      
      // Calculate scores per theme
      data.questions.forEach((question, index) => {
        const theme = question.theme;
        const questionScore = scores[index] || 0;
        
        // Find max possible score for this question
        const maxPossible = Math.max(...question.options.map(opt => opt.score || 0));
        
        if (theme && newThemeScores[theme]) {
          newThemeScores[theme].score += questionScore;
          newThemeScores[theme].maxPossible += maxPossible;
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
    }
  }, [scores, data]);
  
  // Navigation functions
  const goToNextQuestion = () => {
    if (data && currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentPage('summary');
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentPage('welcome');
    }
  };
  
  const startQuestionnaire = () => {
    setCurrentPage('questions');
    setCurrentQuestionIndex(0);
  };
  
  const restartQuestionnaire = () => {
    setAnswers({});
    setScores({});
    setCurrentPage('welcome');
    setCurrentQuestionIndex(0);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex, score) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
    
    setScores({
      ...scores,
      [questionIndex]: score
    });
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Loading Questionnaire...</h1>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Render welcome page
  if (currentPage === 'welcome' && data) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {data.title}
              </h1>
              
              <div className="text-gray-600 mb-8 space-y-4">
                <p>
                  Welcome to the Self Assessment Questionnaire. This assessment will help you evaluate 
                  your organization across five key areas:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  {data.themes.map((theme, index) => (
                    <li key={index} className="font-medium">{theme}</li>
                  ))}
                </ul>
                
                <p>
                  The questionnaire contains {data.questions.length} questions. For each question, 
                  select the option that best describes your organization's current state.
                </p>
                
                <p>
                  At the end, you'll receive a score breakdown by theme to identify strengths and 
                  areas for improvement.
                </p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={startQuestionnaire}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow transition duration-150 ease-in-out"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render questions page
  if (currentPage === 'questions' && data) {
    const currentQuestion = data.questions[currentQuestionIndex];
    const selectedOptionIndex = answers[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
                {currentQuestion.theme}
              </h2>
              <p className="text-sm text-blue-100">
                Question {currentQuestionIndex + 1} of {data.questions.length}
              </p>
            </div>
            
            {/* Question */}
            <div className="px-6 py-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {currentQuestion.question}
              </h3>
            </div>
            
            {/* Options */}
            <div className="px-6 py-4 space-y-4">
              {currentQuestion.options.map((option, optionIndex) => (
                <div 
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex, option.score)}
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
                {currentQuestionIndex < data.questions.length - 1 ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render summary page
  if (currentPage === 'summary' && data) {
    // Calculate total score and maximum possible
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const totalMaxPossible = data.questions.reduce((sum, q) => {
      const maxScore = Math.max(...q.options.map(opt => opt.score || 0));
      return sum + maxScore;
    }, 0);
    const totalPercentage = Math.round((totalScore / totalMaxPossible) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                Assessment Results
              </h1>
              
              {/* Overall score */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-blue-100 text-blue-800 mb-4">
                  <span className="text-4xl font-bold">{totalPercentage}%</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-700">
                  Overall Score: {totalScore} / {totalMaxPossible}
                </h2>
              </div>
              
              {/* Theme scores */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Score by Theme
                </h3>
                
                <div className="space-y-4">
                  {data.themes.map((theme, index) => {
                    const themeData = themeScores[theme] || { score: 0, maxPossible: 0, percentage: 0 };
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-800">{theme}</h4>
                          <span className="text-sm font-medium text-gray-600">
                            {themeData.score} / {themeData.maxPossible} ({themeData.percentage}%)
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${themeData.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Interpretation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  What Your Score Means
                </h3>
                
                <div className="text-blue-700 space-y-2">
                  <p><strong>90-100%:</strong> Excellent - Your organization demonstrates best practices in this area.</p>
                  <p><strong>70-89%:</strong> Good - Strong performance with some room for improvement.</p>
                  <p><strong>50-69%:</strong> Fair - Basic compliance with significant opportunity for enhancement.</p>
                  <p><strong>Below 50%:</strong> Needs Attention - This area requires immediate improvement focus.</p>
                </div>
              </div>
              
              {/* Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={restartQuestionnaire}
                  className="px-4 py-2 border border-blue-300 rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none"
                >
                  Restart Assessment
                </button>
                
                {/* Export results button */}
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                  onClick={() => {
                    alert("Export functionality would be implemented here in a production environment");
                  }}
                >
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default App;