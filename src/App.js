import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import UserInfoForm from './components/UserInfoForm';
import InstructionsPage from './components/InstructionsPage';
import QuestionPage from './components/QuestionPage';
import ResultsPage from './components/ResultsPage';
import { generateSampleReportData } from './utils/SampleReportData'; // Import the sample data generator

const App = () => {
  const [page, setPage] = useState('landing');
  const [userData, setUserData] = useState({ name: '', email: '', phone: '', organization: '' });
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({});
  const [themeScores, setThemeScores] = useState({});
  const [themeClassifications, setThemeClassifications] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [viewingSample, setViewingSample] = useState(false);
  const [sampleData, setSampleData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/questionnaire-data.json');
        const jsonData = await response.json();
        setQuestionnaire(jsonData);
        setLoading(false);
      } catch (error) {
        setError("Could not load questionnaire data.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate sample data when questionnaire is loaded
  useEffect(() => {
    if (questionnaire) {
      const sampleReportData = generateSampleReportData(questionnaire);
      setSampleData(sampleReportData);
    }
  }, [questionnaire]);

  useEffect(() => {
    if (questionnaire) {
      const totalQuestions = questionnaire.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      setProgress(Math.round((answeredQuestions / totalQuestions) * 100));
    }
  }, [answers, questionnaire]);

  useEffect(() => {
    if (questionnaire && Object.keys(answers).length > 0) {
      const newThemeScores = {};
      const newThemeClassifications = {};

      questionnaire.themes.forEach(theme => {
        newThemeScores[theme] = { score: 0, maxPossible: 0, percentage: 0, questions: [] };
        newThemeClassifications[theme] = { classification: "Best Practice", questions: [] };
      });

      questionnaire.questions.forEach((question, index) => {
        const theme = question.theme;
        const answerIndex = answers[index];
        if (answerIndex !== undefined) {
          const selectedOption = question.options[answerIndex];
          const questionScore = selectedOption.score;
          const questionClassification = selectedOption.classification;
          const questionRecommendation = selectedOption.recommendation;
          const maxPossible = Math.max(...question.options.map(opt => opt.score || 0));

          if (theme && newThemeScores[theme]) {
            newThemeScores[theme].score += questionScore;
            newThemeScores[theme].maxPossible += maxPossible;
            newThemeScores[theme].questions.push({
              question: question.question,
              score: questionScore,
              maxPossible: maxPossible,
              answer: selectedOption.text,
              classification: questionClassification,
              recommendation: questionRecommendation
            });

            newThemeClassifications[theme].questions.push({
              question: question.question,
              classification: questionClassification,
              recommendation: questionRecommendation
            });

            if (questionClassification === "Non-compliant") {
              newThemeClassifications[theme].classification = "Non-compliant";
            } else if (questionClassification === "At Risk" &&
                       newThemeClassifications[theme].classification !== "Non-compliant") {
              newThemeClassifications[theme].classification = "At Risk";
            } else if (questionClassification === "Compliant" &&
                       newThemeClassifications[theme].classification === "Best Practice") {
              newThemeClassifications[theme].classification = "Compliant";
            }
          }
        }
      });

      Object.keys(newThemeScores).forEach(theme => {
        const { score, maxPossible } = newThemeScores[theme];
        newThemeScores[theme].percentage = maxPossible > 0 
          ? Math.round((score / maxPossible) * 100) 
          : 0;
      });

      setThemeScores(newThemeScores);
      setThemeClassifications(newThemeClassifications);

      const totalScore = Object.values(newThemeScores).reduce((sum, theme) => sum + theme.score, 0);
      const totalMaxPossible = Object.values(newThemeScores).reduce((sum, theme) => sum + theme.maxPossible, 0);

      setScores({
        total: totalScore,
        maxPossible: totalMaxPossible,
        percentage: totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0
      });
    }
  }, [answers, questionnaire]);

  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    if (questionnaire) {
      setPage('instructions');
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

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

  // Function to show sample report
  const showSampleReport = () => {
    setViewingSample(true);
    setPage('results');
    window.scrollTo(0, 0);
  };

  // Function to return from sample report to previous page
  const exitSampleReport = () => {
    setViewingSample(false);
    // Go back to where user was before viewing sample
    if (page === 'results') {
      // If they were on user info page before
      setPage('userInfo');
    } else {
      // If they were on question page
      setPage('questions');
    }
  };

  const getImprovementTips = (theme, classification) => {
    const tips = {
      'Authorisation & Compliance': {
        'Non-compliant': "Create a compliance checklist...",
        'At Risk': "Strengthen compliance documentation...",
        'Compliant': "Maintain strong compliance and automate...",
        'Best Practice': "Share compliance best practices..."
      },
      'Planning & Documentation': {
        'Non-compliant': "Start with basic SOPs...",
        'At Risk': "Add detailed SOPs and version control...",
        'Compliant': "Create visual workflows...",
        'Best Practice': "Convert your process into training..."
      },
      'Fund Management & Controls': {
        'Non-compliant': "Implement basic financial controls...",
        'At Risk': "Add reconciliation and better tracking...",
        'Compliant': "Use advanced tracking software...",
        'Best Practice': "Publish your case studies..."
      },
      'Reporting & Transparency': {
        'Non-compliant': "Publish basic reports...",
        'At Risk': "Create dashboards...",
        'Compliant': "Collect feedback from stakeholders...",
        'Best Practice': "Mentor others in reporting..."
      },
      'Governance & Oversight': {
        'Non-compliant': "Establish governance committee...",
        'At Risk': "Conduct board reviews...",
        'Compliant': "Consider external assessments...",
        'Best Practice': "Publish your governance model..."
      }
    };
    return tips[theme]?.[classification] || "";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (page === 'landing') return <LandingPage setPage={setPage} />;
  if (page === 'userInfo') return (
    <UserInfoForm 
      userData={userData}
      setUserData={setUserData}
      handleSubmit={handleUserFormSubmit}
      showSampleReport={showSampleReport}
      sampleAvailable={!!sampleData}
    />
  );
  if (page === 'instructions') return (
    <InstructionsPage
      setPage={setPage}
      questionnaire={questionnaire}
    />
  );
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
        showSampleReport={showSampleReport}
        sampleAvailable={!!sampleData}
      />
    );
  }
  if (page === 'results') {
    // Use real data or sample data based on viewingSample flag
    const resultsData = viewingSample ? sampleData : {
      scores,
      themeScores,
      themeClassifications,
      userData
    };
    
    return (
      <ResultsPage
        scores={resultsData.scores}
        themeScores={resultsData.themeScores}
        themeClassifications={resultsData.themeClassifications}
        getImprovementTips={getImprovementTips}
        userData={resultsData.userData}
        setPage={viewingSample ? exitSampleReport : setPage}
        questionnaire={questionnaire}
        isSampleReport={viewingSample}
      />
    );
  }

  return <div>Something went wrong.</div>;
};

export default App;
