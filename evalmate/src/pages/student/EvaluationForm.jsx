import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './EvaluationForm.css';

function EvaluationForm() {
  const { evaluationId, groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({});
  const [evaluationInfo, setEvaluationInfo] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTeammate, setCurrentTeammate] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});



  useEffect(() => {
    // This component should redirect to FlexibleEvaluationForm since we no longer use static evaluations
    navigate('/student/dashboard', { 
      state: { message: 'This evaluation type is no longer available. Please use the flexible evaluation forms from your dashboard.' }
    });
  }, [evaluationId, navigate]);

  const handleInputChange = (questionId, value) => {
    const currentTeammateId = evaluationInfo.teammates[currentTeammate].id;
    setFormData(prev => ({
      ...prev,
      [currentTeammateId]: {
        ...prev[currentTeammateId],
        [questionId]: value
      }
    }));
    
    // Clear error for this field if it exists
    const errorKey = `${currentTeammateId}_${questionId}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: null
      }));
    }
  };

  const validateSection = (sectionIndex, teammateIndex = null) => {
    const section = evaluationInfo.sections[sectionIndex];
    const sectionErrors = {};
    
    // If teammateIndex is provided, validate only that teammate
    // Otherwise validate current teammate
    const teammateToValidate = teammateIndex !== null ? teammateIndex : currentTeammate;
    const teammateId = evaluationInfo.teammates[teammateToValidate].id;
    const teammateData = formData[teammateId] || {};
    
    section.questions.forEach(question => {
      if (question.required) {
        const value = teammateData[question.id];
        const errorKey = `${teammateId}_${question.id}`;
        if (!value || (Array.isArray(value) && value.length === 0) || 
            (typeof value === 'string' && value.trim() === '')) {
          sectionErrors[errorKey] = 'This field is required';
        }
      }
    });
    
    return sectionErrors;
  };

  const validateAllTeammates = () => {
    let allErrors = {};
    evaluationInfo.teammates.forEach((teammate, teammateIndex) => {
      evaluationInfo.sections.forEach((section, sectionIndex) => {
        const sectionErrors = validateSection(sectionIndex, teammateIndex);
        allErrors = { ...allErrors, ...sectionErrors };
      });
    });
    return allErrors;
  };

  const handleNextSection = () => {
    const sectionErrors = validateSection(currentSection);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      return;
    }
    
    setCurrentSection(prev => Math.min(prev + 1, evaluationInfo.sections.length - 1));
    setErrors({});
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    } else if (currentTeammate > 0) {
      // Move to previous teammate, last section
      setCurrentTeammate(prev => prev - 1);
      setCurrentSection(evaluationInfo.sections.length - 1);
    }
    setErrors({});
  };

  const handleNextTeammate = () => {
    const sectionErrors = validateSection(currentSection);
    if (Object.keys(sectionErrors).length > 0) {
      setErrors(sectionErrors);
      return;
    }
    
    setCurrentTeammate(prev => Math.min(prev + 1, evaluationInfo.teammates.length - 1));
    setCurrentSection(0); // Reset to first section for next teammate
    setErrors({});
  };

  const handlePreviousTeammate = () => {
    setCurrentTeammate(prev => Math.max(prev - 1, 0));
    setCurrentSection(0); // Reset to first section
    setErrors({});
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('Draft saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Validate all teammates and all sections
    const allErrors = validateAllTeammates();

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      
      // Navigate to first teammate and section with errors
      let foundError = false;
      for (let teammateIndex = 0; teammateIndex < evaluationInfo.teammates.length && !foundError; teammateIndex++) {
        const teammateId = evaluationInfo.teammates[teammateIndex].id;
        for (let sectionIndex = 0; sectionIndex < evaluationInfo.sections.length && !foundError; sectionIndex++) {
          const section = evaluationInfo.sections[sectionIndex];
          const hasError = section.questions.some(q => allErrors[`${teammateId}_${q.id}`]);
          if (hasError) {
            setCurrentTeammate(teammateIndex);
            setCurrentSection(sectionIndex);
            foundError = true;
          }
        }
      }
      return;
    }

    setIsSaving(true);
    try {
      // Simulate API call to submit all evaluations
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const teammateCount = evaluationInfo.teammates.length;
      // Navigate back to dashboard with success message
      navigate('/student/dashboard', { 
        state: { message: `Successfully submitted evaluations for all ${teammateCount} teammates!` }
      });
    } catch (error) {
      setSaveStatus('Failed to submit evaluations');
      setIsSaving(false);
    }
  };

  const renderQuestion = (question) => {
    const currentTeammateId = evaluationInfo.teammates[currentTeammate].id;
    const teammateData = formData[currentTeammateId] || {};
    const value = teammateData[question.id] || '';
    const errorKey = `${currentTeammateId}_${question.id}`;
    const error = errors[errorKey];

    switch (question.type) {
      case 'rating':
        return (
          <div className="evaluation-form__rating">
            <div className="evaluation-form__rating-scale">
              {Array.from({ length: question.scale }, (_, i) => i + 1).map(rating => (
                <label key={rating} className="evaluation-form__rating-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={rating}
                    checked={value == rating}
                    onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                    className="evaluation-form__rating-input"
                  />
                  <div className="evaluation-form__rating-circle">
                    <span>{rating}</span>
                  </div>
                  {question.labels && (
                    <span className="evaluation-form__rating-label">
                      {question.labels[rating - 1]}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div className="evaluation-form__textarea-container">
            <textarea
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              className={`evaluation-form__textarea ${error ? 'error' : ''}`}
              rows="4"
            />
            {question.maxLength && (
              <div className="evaluation-form__char-count">
                {value.length} / {question.maxLength}
              </div>
            )}
          </div>
        );

      case 'multiple-choice':
        return (
          <div className="evaluation-form__multiple-choice">
            {question.options.map((option, index) => (
              <label key={index} className="evaluation-form__choice-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="evaluation-form__choice-input"
                />
                <span className="evaluation-form__choice-text">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="evaluation-form__checkbox-group">
            {question.options.map((option, index) => (
              <label key={index} className="evaluation-form__checkbox-option">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...value, option]
                      : value.filter(v => v !== option);
                    handleInputChange(question.id, newValue);
                  }}
                  className="evaluation-form__checkbox-input"
                />
                <span className="evaluation-form__checkbox-text">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="evaluation-form__slider-container">
            <div className="evaluation-form__slider-labels">
              <span>{question.labels[0]}</span>
              <span className="evaluation-form__slider-value">{value}%</span>
              <span>{question.labels[1]}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              value={value}
              onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
              className="evaluation-form__slider"
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="evaluation-form__loading">
        <div className="evaluation-form__loading-spinner"></div>
        <p>Loading evaluation form...</p>
      </div>
    );
  }

  if (!evaluationInfo) {
    return (
      <div className="evaluation-form__error">
        <h2>Evaluation Not Found</h2>
        <p>The requested evaluation could not be found.</p>
        <Button onClick={() => navigate('/student/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const currentSectionData = evaluationInfo.sections[currentSection];
  const progress = ((currentSection + 1) / evaluationInfo.sections.length) * 100;

  return (
    <div className="evaluation-form">
      {/* Header */}
      <div className="evaluation-form__header">
        <div className="evaluation-form__header-content">
          <h1 className="evaluation-form__title">{evaluationInfo.title}</h1>
          <p className="evaluation-form__description">{evaluationInfo.description}</p>
          
          <div className="evaluation-form__meta">
            <div className="evaluation-form__meta-item">
              <strong>Course:</strong> {evaluationInfo.course}
            </div>
            <div className="evaluation-form__meta-item">
              <strong>Instructor:</strong> {evaluationInfo.instructor}
            </div>
            <div className="evaluation-form__meta-item">
              <strong>Due:</strong> {new Date(evaluationInfo.dueDate).toLocaleDateString()}
            </div>
            {evaluationInfo.isAnonymous && (
              <div className="evaluation-form__meta-item evaluation-form__anonymous">
                🔒 Anonymous Evaluation
              </div>
            )}
          </div>
        </div>

        {/* Teammate Navigation */}
        <Card className="evaluation-form__teammates">
          <div className="evaluation-form__teammates-header">
            <h3>Team Members ({evaluationInfo.teammates.length})</h3>
            <p>Evaluating teammate {currentTeammate + 1} of {evaluationInfo.teammates.length}</p>
          </div>
          
          <div className="evaluation-form__teammates-nav">
            {evaluationInfo.teammates.map((teammate, index) => (
              <button
                key={teammate.id}
                className={`evaluation-form__teammate-tab ${
                  index === currentTeammate ? 'active' : ''
                } ${index < currentTeammate ? 'completed' : ''}`}
                onClick={() => {
                  setCurrentTeammate(index);
                  setCurrentSection(0);
                  setErrors({});
                }}
              >
                <div className="evaluation-form__teammate-avatar">
                  {teammate.avatar ? (
                    <img src={teammate.avatar} alt={teammate.name} />
                  ) : (
                    teammate.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <div className="evaluation-form__teammate-info">
                  <span className="evaluation-form__teammate-name">{teammate.name}</span>
                  <span className="evaluation-form__teammate-role">{teammate.role}</span>
                </div>
                {index < currentTeammate && (
                  <div className="evaluation-form__teammate-status">✓</div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Current Teammate Info */}
        <Card className="evaluation-form__current-teammate">
          <div className="evaluation-form__evaluatee-info">
            <div className="evaluation-form__evaluatee-avatar">
              {evaluationInfo.teammates[currentTeammate].avatar ? (
                <img src={evaluationInfo.teammates[currentTeammate].avatar} alt={evaluationInfo.teammates[currentTeammate].name} />
              ) : (
                evaluationInfo.teammates[currentTeammate].name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div>
              <h3>Currently Evaluating: {evaluationInfo.teammates[currentTeammate].name}</h3>
              <p>{evaluationInfo.teammates[currentTeammate].role} • {evaluationInfo.groupName}</p>
              <p className="evaluation-form__teammate-email">{evaluationInfo.teammates[currentTeammate].email}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className="evaluation-form__progress">
        <div className="evaluation-form__progress-bar">
          <div 
            className="evaluation-form__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="evaluation-form__progress-text">
          Section {currentSection + 1} of {evaluationInfo.sections.length}
        </span>
      </div>

      {/* Section Navigation */}
      <div className="evaluation-form__section-nav">
        {evaluationInfo.sections.map((section, index) => (
          <button
            key={section.id}
            className={`evaluation-form__section-tab ${
              index === currentSection ? 'active' : ''
            } ${index < currentSection ? 'completed' : ''}`}
            onClick={() => setCurrentSection(index)}
          >
            <span className="evaluation-form__section-number">{index + 1}</span>
            <span className="evaluation-form__section-title">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Current Section */}
      <Card className="evaluation-form__section">
        <div className="evaluation-form__section-header">
          <h2>{currentSectionData.title}</h2>
          <p>{currentSectionData.description}</p>
        </div>

        <div className="evaluation-form__questions">
          {currentSectionData.questions.map((question, index) => (
            <div key={question.id} className="evaluation-form__question">
              <div className="evaluation-form__question-header">
                <label className="evaluation-form__question-label">
                  {question.question}
                  {question.required && (
                    <span className="evaluation-form__required">*</span>
                  )}
                </label>
                {question.description && (
                  <p className="evaluation-form__question-description">
                    {question.description}
                  </p>
                )}
              </div>

              {renderQuestion(question)}

              {errors[`${evaluationInfo.teammates[currentTeammate].id}_${question.id}`] && (
                <div className="evaluation-form__error-message">
                  {errors[`${evaluationInfo.teammates[currentTeammate].id}_${question.id}`]}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Save Status */}
      {saveStatus && (
        <div className={`evaluation-form__save-status ${
          saveStatus.includes('Failed') ? 'error' : 'success'
        }`}>
          {saveStatus}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="evaluation-form__actions">
        <div className="evaluation-form__nav-buttons">
          {/* Section Navigation */}
          <Button
            variant="ghost"
            onClick={handlePreviousSection}
            disabled={currentSection === 0 && currentTeammate === 0}
          >
            {currentSection === 0 && currentTeammate > 0 ? '← Previous Teammate' : '← Previous'}
          </Button>

          {evaluationInfo.allowDraft && (
            <Button
              variant="secondary"
              onClick={saveDraft}
              loading={isSaving}
              disabled={isSaving}
            >
              Save Draft
            </Button>
          )}

          {currentSection < evaluationInfo.sections.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNextSection}
            >
              Next Section →
            </Button>
          ) : currentTeammate < evaluationInfo.teammates.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNextTeammate}
            >
              Next Teammate →
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleSubmit}
              loading={isSaving}
              disabled={isSaving}
            >
              Submit All Evaluations
            </Button>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="evaluation-form__progress-info">
          <div className="evaluation-form__section-progress">
            Section {currentSection + 1} of {evaluationInfo.sections.length}
          </div>
          <div className="evaluation-form__teammate-progress">
            Teammate {currentTeammate + 1} of {evaluationInfo.teammates.length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EvaluationForm;