// SampleReportData.js
// This utility generates sample data for the results page preview

export const generateSampleReportData = (questionnaire) => {
  if (!questionnaire) {
    // If questionnaire not loaded yet, return empty data
    return {
      userData: {
        name: 'Sarah Johnson',
        email: 'sarah@sampleorg.org',
        phone: '+60123456789',
        organization: 'Sample Organization Bhd'
      },
      scores: {
        total: 75,
        maxPossible: 120,
        percentage: 62
      },
      themeScores: {},
      themeClassifications: {},
      answers: {}
    };
  }

  // Sample user data
  const userData = {
    name: 'Sarah Johnson',
    email: 'sarah@sampleorg.org',
    phone: '+60123456789',
    organization: 'Sample Organization Bhd'
  };

  // Create answers with strategic distribution to create desired classifications
  const answers = {};
  const themeQuestions = {};
  
  // Group questions by theme
  questionnaire.questions.forEach((question, index) => {
    if (!themeQuestions[question.theme]) {
      themeQuestions[question.theme] = [];
    }
    themeQuestions[question.theme].push({ index, question });
  });

  // Assign themes to classification levels
  const themeClassificationMap = {};
  const themes = Object.keys(themeQuestions);
  
  if (themes.length >= 4) {
    themeClassificationMap[themes[0]] = 'Non-compliant';   // First theme - Non-compliant
    themeClassificationMap[themes[1]] = 'At Risk';         // Second theme - At Risk
    themeClassificationMap[themes[2]] = 'Compliant';       // Third theme - Compliant
    themeClassificationMap[themes[3]] = 'Best Practice';   // Fourth theme - Best Practice
    
    // Any remaining themes alternate between Compliant and Best Practice
    for (let i = 4; i < themes.length; i++) {
      themeClassificationMap[themes[i]] = i % 2 === 0 ? 'Compliant' : 'Best Practice';
    }
  } else {
    // Handle case with fewer themes
    themes.forEach((theme, i) => {
      if (i === 0) themeClassificationMap[theme] = 'Non-compliant';
      else if (i === 1) themeClassificationMap[theme] = 'At Risk';
      else themeClassificationMap[theme] = 'Compliant';
    });
  }

  // Generate answers based on desired theme classifications
  questionnaire.questions.forEach((question, index) => {
    const desiredClassification = themeClassificationMap[question.theme];
    
    // Find an option with that classification or closest to it
    let optionIndex = 0;
    const classificationPriority = ['Non-compliant', 'At Risk', 'Compliant', 'Best Practice'];
    
    // Add some variability - not all answers in a theme should have the same classification
    const variability = Math.random();
    let targetClassification = desiredClassification;
    
    if (desiredClassification === 'Non-compliant' && variability > 0.7) {
      targetClassification = 'At Risk';
    } else if (desiredClassification === 'At Risk') {
      if (variability > 0.8) targetClassification = 'Compliant';
      else if (variability < 0.2) targetClassification = 'Non-compliant';
    } else if (desiredClassification === 'Compliant') {
      if (variability > 0.7) targetClassification = 'Best Practice';
      else if (variability < 0.2) targetClassification = 'At Risk';
    } else if (desiredClassification === 'Best Practice' && variability < 0.3) {
      targetClassification = 'Compliant';
    }
    
    // Find option matching target classification
    question.options.forEach((option, oIndex) => {
      if (option.classification === targetClassification) {
        optionIndex = oIndex;
      }
    });
    
    answers[index] = optionIndex;
  });

  // Calculate theme scores and classifications based on the sample answers
  const themeScores = {};
  const themeClassifications = {};

  questionnaire.themes.forEach(theme => {
    themeScores[theme] = { score: 0, maxPossible: 0, percentage: 0, questions: [] };
    themeClassifications[theme] = { classification: "Best Practice", questions: [] };
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

      if (theme && themeScores[theme]) {
        themeScores[theme].score += questionScore;
        themeScores[theme].maxPossible += maxPossible;
        themeScores[theme].questions.push({
          question: question.question,
          score: questionScore,
          maxPossible: maxPossible,
          answer: selectedOption.text,
          classification: questionClassification,
          recommendation: questionRecommendation
        });

        themeClassifications[theme].questions.push({
          question: question.question,
          classification: questionClassification,
          recommendation: questionRecommendation
        });

        if (questionClassification === "Non-compliant") {
          themeClassifications[theme].classification = "Non-compliant";
        } else if (questionClassification === "At Risk" &&
                   themeClassifications[theme].classification !== "Non-compliant") {
          themeClassifications[theme].classification = "At Risk";
        } else if (questionClassification === "Compliant" &&
                   themeClassifications[theme].classification === "Best Practice") {
          themeClassifications[theme].classification = "Compliant";
        }
      }
    }
  });

  // Calculate percentages for each theme
  Object.keys(themeScores).forEach(theme => {
    const { score, maxPossible } = themeScores[theme];
    themeScores[theme].percentage = maxPossible > 0 
      ? Math.round((score / maxPossible) * 100) 
      : 0;
  });

  // Calculate overall scores
  const totalScore = Object.values(themeScores).reduce((sum, theme) => sum + theme.score, 0);
  const totalMaxPossible = Object.values(themeScores).reduce((sum, theme) => sum + theme.maxPossible, 0);
  const percentage = totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0;

  return {
    userData,
    scores: {
      total: totalScore,
      maxPossible: totalMaxPossible,
      percentage
    },
    themeScores,
    themeClassifications,
    answers
  };
};

export default generateSampleReportData;
