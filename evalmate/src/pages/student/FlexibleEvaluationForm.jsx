import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import formStore from '../../utils/FormStore';
import evaluationStore from '../../utils/EvaluationStore';
import './FlexibleEvaluationForm.css';

function FlexibleEvaluationForm() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Form state
  const [step, setStep] = useState(1); // 1: Team Setup, 2: Evaluations
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errors, setErrors] = useState({});
  
  // Team setup data
  const [teamData, setTeamData] = useState({
    teamId: '',
    teammates: [''] // Start with one empty teammate field
  });
  
  // Evaluation data
  const [evaluationInfo, setEvaluationInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentTeammate, setCurrentTeammate] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);



  useEffect(() => {
    // Load master form data from FormStore
    const loadMasterForm = async () => {
      setIsLoading(true);
      try {
        // Get form from FormStore
        const form = formStore.getForm(formId);
        
        if (!form) {
          console.error('Form not found:', formId);
          navigate('/student/evaluation/pending', {
            state: { message: 'The requested evaluation form was not found.' }
          });
          return;
        } else if (form.type !== 'master' && form.formType !== 'master') {
          console.error('Form is not a master form:', form);
          navigate('/student/evaluation/pending');
          return;
        } else {
          // Convert form data to the expected format
          const formattedForm = {
            id: form.id,
            title: form.title,
            description: form.description,
            course: form.course,
            instructor: form.createdBy || 'Faculty',
            dueDate: form.dueDate,
            isAnonymous: form.isAnonymous,
            allowDraft: form.allowDraft,
            maxTeammates: form.teamConfiguration?.maxTeamSize || form.maxTeamSize || 6,
            minTeammates: form.teamConfiguration?.minTeamSize || form.minTeamSize || 2,
            instructions: form.teamConfiguration?.instructions || form.instructions,
            sections: form.sections || []
          };
          setEvaluationInfo(formattedForm);
        }
        
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Failed to load master form:', error);
        navigate('/student/evaluation/pending', {
          state: { message: 'Failed to load the evaluation form. Please try again.' }
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (formId) {
      loadMasterForm();
    } else {
      setIsLoading(false);
    }
  }, [formId, navigate]);

  // Team setup handlers
  const handleTeamIdChange = (value) => {
    setTeamData(prev => ({ ...prev, teamId: value.toUpperCase().trim() }));
    if (errors.teamId) {
      setErrors(prev => ({ ...prev, teamId: null }));
    }
  };

  const handleTeammateChange = (index, value) => {
    const newTeammates = [...teamData.teammates];
    newTeammates[index] = value.trim();
    setTeamData(prev => ({ ...prev, teammates: newTeammates }));
    
    if (errors[`teammate_${index}`]) {
      setErrors(prev => ({ ...prev, [`teammate_${index}`]: null }));
    }
  };

  const addTeammateField = () => {
    if (teamData.teammates.length < evaluationInfo.maxTeammates) {
      setTeamData(prev => ({
        ...prev,
        teammates: [...prev.teammates, '']
      }));
    }
  };

  const removeTeammateField = (index) => {
    if (teamData.teammates.length > 1) {
      setTeamData(prev => ({
        ...prev,
        teammates: prev.teammates.filter((_, i) => i !== index)
      }));
    }
  };

  const validateTeamSetup = () => {
    const newErrors = {};
    
    // Validate team ID
    if (!teamData.teamId.trim()) {
      newErrors.teamId = 'Team identifier is required';
    } else if (teamData.teamId.length < 3) {
      newErrors.teamId = 'Team identifier must be at least 3 characters';
    }
    
    // Validate teammates
    const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
    
    if (validTeammates.length < evaluationInfo.minTeammates) {
      newErrors.teammates = `You must enter at least ${evaluationInfo.minTeammates} teammates`;
    }
    
    validTeammates.forEach((name, index) => {
      if (name.length < 2) {
        newErrors[`teammate_${index}`] = 'Name must be at least 2 characters';
      }
      
      // Check for duplicates
      const duplicates = validTeammates.filter(n => n.toLowerCase() === name.toLowerCase());
      if (duplicates.length > 1) {
        newErrors[`teammate_${index}`] = 'Duplicate teammate names are not allowed';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedToEvaluations = () => {
    if (validateTeamSetup()) {
      // Initialize form data for valid teammates
      const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
      const initialFormData = {};
      
      validTeammates.forEach((teammate, index) => {
        initialFormData[`teammate_${index}`] = {};
        evaluationInfo.sections.forEach(section => {
          section.questions.forEach(question => {
            if (question.type === 'checkbox') {
              initialFormData[`teammate_${index}`][question.id] = [];
            } else {
              initialFormData[`teammate_${index}`][question.id] = '';
            }
          });
        });
      });
      
      setFormData(initialFormData);
      setStep(2);
    }
  };

  // Evaluation handlers (similar to previous implementation)
  const handleInputChange = (questionId, value) => {
    const teammateKey = `teammate_${currentTeammate}`;
    setFormData(prev => ({
      ...prev,
      [teammateKey]: {
        ...prev[teammateKey],
        [questionId]: value
      }
    }));
    
    const errorKey = `${teammateKey}_${questionId}`;
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
    
    const teammateToValidate = teammateIndex !== null ? teammateIndex : currentTeammate;
    const teammateKey = `teammate_${teammateToValidate}`;
    const teammateData = formData[teammateKey] || {};
    
    section.questions.forEach(question => {
      if (question.required) {
        const value = teammateData[question.id];
        const errorKey = `${teammateKey}_${question.id}`;
        if (!value || (Array.isArray(value) && value.length === 0) || 
            (typeof value === 'string' && value.trim() === '')) {
          sectionErrors[errorKey] = 'This field is required';
        }
      }
    });
    
    return sectionErrors;
  };

  const validateAllEvaluations = () => {
    let allErrors = {};
    const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
    
    validTeammates.forEach((teammate, teammateIndex) => {
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
    
    const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
    setCurrentTeammate(prev => Math.min(prev + 1, validTeammates.length - 1));
    setCurrentSection(0);
    setErrors({});
  };

  const handleSubmit = async () => {
    const allErrors = validateAllEvaluations();

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      
      // Navigate to first error
      const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
      let foundError = false;
      
      for (let teammateIndex = 0; teammateIndex < validTeammates.length && !foundError; teammateIndex++) {
        const teammateKey = `teammate_${teammateIndex}`;
        for (let sectionIndex = 0; sectionIndex < evaluationInfo.sections.length && !foundError; sectionIndex++) {
          const section = evaluationInfo.sections[sectionIndex];
          const hasError = section.questions.some(q => allErrors[`${teammateKey}_${q.id}`]);
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
      const validTeammates = teamData.teammates.filter(name => name.trim() !== '');
      
      // Prepare evaluation data for storage
      const evaluationData = {
        formId: evaluationInfo.id,
        formTitle: evaluationInfo.title,
        course: evaluationInfo.course,
        studentName: user.name,
        teamId: teamData.teamId,
        teammates: validTeammates,
        evaluations: validTeammates.map((name, index) => ({
          teammateId: index,
          teammateName: name.trim(),
          responses: formData[`teammate_${index}`] || {}
        })),
        submissionTime: `${Math.floor(Math.random() * 15) + 10} minutes` // Simulated submission time
      };

      // Save to EvaluationStore
      const submission = evaluationStore.submitEvaluation(evaluationData);
      console.log('Evaluation submitted:', submission);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      navigate('/student/dashboard', { 
        state: { 
          message: `Successfully submitted evaluations for team "${teamData.teamId}" with ${validTeammates.length} teammates!`,
          submissionId: submission.id
        }
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSaveStatus('Failed to submit evaluations');
      setIsSaving(false);
    }
  };

  const renderQuestion = (question) => {
    const teammateKey = `teammate_${currentTeammate}`;
    const teammateData = formData[teammateKey] || {};
    const value = teammateData[question.id] || '';
    const errorKey = `${teammateKey}_${question.id}`;
    const error = errors[errorKey];

    switch (question.type) {
      case 'rating':
        return (
          <div className="flexible-eval-form__rating">
            <div className="flexible-eval-form__rating-scale">
              {Array.from({ length: question.scale }, (_, i) => i + 1).map(rating => (
                <label key={rating} className="flexible-eval-form__rating-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={rating}
                    checked={value == rating}
                    onChange={(e) => handleInputChange(question.id, parseInt(e.target.value))}
                    className="flexible-eval-form__rating-input"
                  />
                  <div className="flexible-eval-form__rating-circle">
                    <span>{rating}</span>
                  </div>
                  {question.labels && (
                    <span className="flexible-eval-form__rating-label">
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
          <div className="flexible-eval-form__textarea-container">
            <textarea
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              className={`flexible-eval-form__textarea ${error ? 'error' : ''}`}
              rows="4"
            />
            {question.maxLength && (
              <div className="flexible-eval-form__char-count">
                {value.length} / {question.maxLength}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flexible-eval-form__loading">
        <div className="flexible-eval-form__loading-spinner"></div>
        <p>Loading evaluation form...</p>
      </div>
    );
  }

  if (!evaluationInfo) {
    return (
      <div className="flexible-eval-form__error">
        <h2>Form Not Found</h2>
        <p>The requested evaluation form could not be found.</p>
        <Button onClick={() => navigate('/student/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const validTeammates = teamData.teammates.filter(name => name.trim() !== '');

  return (
    <div className="flexible-eval-form">
      {/* Header */}
      <div className="flexible-eval-form__header">
        <div className="flexible-eval-form__header-content">
          <h1 className="flexible-eval-form__title">{evaluationInfo.title}</h1>
          <p className="flexible-eval-form__description">{evaluationInfo.description}</p>
          
          <div className="flexible-eval-form__meta">
            <div className="flexible-eval-form__meta-item">
              <strong>Course:</strong> {evaluationInfo.course}
            </div>
            <div className="flexible-eval-form__meta-item">
              <strong>Instructor:</strong> {evaluationInfo.instructor}
            </div>
            <div className="flexible-eval-form__meta-item">
              <strong>Due:</strong> {new Date(evaluationInfo.dueDate).toLocaleDateString()}
            </div>
            {evaluationInfo.isAnonymous && (
              <div className="flexible-eval-form__meta-item flexible-eval-form__anonymous">
                🔒 Anonymous Evaluation
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <Card className="flexible-eval-form__steps">
        <div className="flexible-eval-form__step-indicator">
          <div className={`flexible-eval-form__step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <span className="flexible-eval-form__step-number">1</span>
            <span className="flexible-eval-form__step-label">Team Setup</span>
          </div>
          <div className="flexible-eval-form__step-divider"></div>
          <div className={`flexible-eval-form__step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
            <span className="flexible-eval-form__step-number">2</span>
            <span className="flexible-eval-form__step-label">Evaluations</span>
          </div>
        </div>
      </Card>

      {/* Step 1: Team Setup */}
      {step === 1 && (
        <div className="flexible-eval-form__team-setup">
          <Card title="Step 1: Identify Your Team" className="flexible-eval-form__team-card">
            <p className="flexible-eval-form__team-instructions">
              Please enter your team identifier and the names of your teammates. You will evaluate each teammate using the same criteria.
            </p>
            
            {/* Team ID Input */}
            <div className="flexible-eval-form__form-group">
              <label className="flexible-eval-form__label">
                Team Identifier *
                <span className="flexible-eval-form__help-text">
                  Enter your team name or ID (e.g., "TEAM-A", "GROUP-01", "ALPHA")
                </span>
              </label>
              <input
                type="text"
                value={teamData.teamId}
                onChange={(e) => handleTeamIdChange(e.target.value)}
                placeholder="Enter team identifier..."
                className={`flexible-eval-form__input ${errors.teamId ? 'error' : ''}`}
                maxLength="20"
              />
              {errors.teamId && (
                <div className="flexible-eval-form__error-message">{errors.teamId}</div>
              )}
            </div>

            {/* Teammates Input */}
            <div className="flexible-eval-form__form-group">
              <label className="flexible-eval-form__label">
                Teammate Names *
                <span className="flexible-eval-form__help-text">
                  Enter the names of your teammates (excluding yourself)
                </span>
              </label>
              
              <div className="flexible-eval-form__teammates-input">
                {teamData.teammates.map((teammate, index) => (
                  <div key={index} className="flexible-eval-form__teammate-field">
                    <input
                      type="text"
                      value={teammate}
                      onChange={(e) => handleTeammateChange(index, e.target.value)}
                      placeholder={`Teammate ${index + 1} name...`}
                      className={`flexible-eval-form__input ${errors[`teammate_${index}`] ? 'error' : ''}`}
                    />
                    {teamData.teammates.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeammateField(index)}
                        className="flexible-eval-form__remove-btn"
                        title="Remove this teammate"
                      >
                        ×
                      </button>
                    )}
                    {errors[`teammate_${index}`] && (
                      <div className="flexible-eval-form__error-message">{errors[`teammate_${index}`]}</div>
                    )}
                  </div>
                ))}
                
                {teamData.teammates.length < evaluationInfo.maxTeammates && (
                  <button
                    type="button"
                    onClick={addTeammateField}
                    className="flexible-eval-form__add-btn"
                  >
                    + Add Another Teammate
                  </button>
                )}
              </div>
              
              {errors.teammates && (
                <div className="flexible-eval-form__error-message">{errors.teammates}</div>
              )}
              
              <div className="flexible-eval-form__team-summary">
                <p><strong>Team Size:</strong> {validTeammates.length} teammates (+ you = {validTeammates.length + 1} total members)</p>
                <p><strong>Range:</strong> {evaluationInfo.minTeammates}-{evaluationInfo.maxTeammates} teammates allowed</p>
              </div>
            </div>

            <div className="flexible-eval-form__team-actions">
              <Button
                variant="primary"
                onClick={proceedToEvaluations}
                disabled={validTeammates.length < evaluationInfo.minTeammates}
              >
                Continue to Evaluations →
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Evaluations */}
      {step === 2 && validTeammates.length > 0 && (
        <div className="flexible-eval-form__evaluations">
          {/* Team Summary */}
          <Card className="flexible-eval-form__team-summary-card">
            <div className="flexible-eval-form__team-info">
              <h3>Team: {teamData.teamId}</h3>
              <p>Evaluating teammate {currentTeammate + 1} of {validTeammates.length}</p>
            </div>
            
            <div className="flexible-eval-form__teammates-nav">
              {validTeammates.map((teammate, index) => (
                <button
                  key={index}
                  className={`flexible-eval-form__teammate-tab ${
                    index === currentTeammate ? 'active' : ''
                  } ${index < currentTeammate ? 'completed' : ''}`}
                  onClick={() => {
                    setCurrentTeammate(index);
                    setCurrentSection(0);
                    setErrors({});
                  }}
                >
                  <div className="flexible-eval-form__teammate-avatar">
                    {teammate.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flexible-eval-form__teammate-info">
                    <span className="flexible-eval-form__teammate-name">{teammate}</span>
                    <span className="flexible-eval-form__teammate-status">
                      {index < currentTeammate ? 'Completed' : index === currentTeammate ? 'Current' : 'Pending'}
                    </span>
                  </div>
                  {index < currentTeammate && (
                    <div className="flexible-eval-form__teammate-check">✓</div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Current Teammate */}
          <Card className="flexible-eval-form__current-teammate">
            <div className="flexible-eval-form__evaluatee-info">
              <div className="flexible-eval-form__evaluatee-avatar">
                {validTeammates[currentTeammate].split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3>Currently Evaluating: {validTeammates[currentTeammate]}</h3>
                <p>Team Member • {teamData.teamId}</p>
              </div>
            </div>
          </Card>

          {/* Section Navigation */}
          <div className="flexible-eval-form__section-nav">
            {evaluationInfo.sections.map((section, index) => (
              <button
                key={section.id}
                className={`flexible-eval-form__section-tab ${
                  index === currentSection ? 'active' : ''
                } ${index < currentSection ? 'completed' : ''}`}
                onClick={() => setCurrentSection(index)}
              >
                <span className="flexible-eval-form__section-number">{index + 1}</span>
                <span className="flexible-eval-form__section-title">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Current Section */}
          <Card className="flexible-eval-form__section">
            <div className="flexible-eval-form__section-header">
              <h2>{evaluationInfo.sections[currentSection].title}</h2>
              <p>{evaluationInfo.sections[currentSection].description}</p>
            </div>

            <div className="flexible-eval-form__questions">
              {evaluationInfo.sections[currentSection].questions.map((question) => (
                <div key={question.id} className="flexible-eval-form__question">
                  <div className="flexible-eval-form__question-header">
                    <label className="flexible-eval-form__question-label">
                      {question.question}
                      {question.required && (
                        <span className="flexible-eval-form__required">*</span>
                      )}
                    </label>
                    {question.description && (
                      <p className="flexible-eval-form__question-description">
                        {question.description}
                      </p>
                    )}
                  </div>

                  {renderQuestion(question)}

                  {errors[`teammate_${currentTeammate}_${question.id}`] && (
                    <div className="flexible-eval-form__error-message">
                      {errors[`teammate_${currentTeammate}_${question.id}`]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Save Status */}
          {saveStatus && (
            <div className={`flexible-eval-form__save-status ${
              saveStatus.includes('Failed') ? 'error' : 'success'
            }`}>
              {saveStatus}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flexible-eval-form__actions">
            <div className="flexible-eval-form__nav-buttons">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
              >
                ← Back to Team Setup
              </Button>

              <Button
                variant="ghost"
                onClick={handlePreviousSection}
                disabled={currentSection === 0 && currentTeammate === 0}
              >
                {currentSection === 0 && currentTeammate > 0 ? '← Previous Teammate' : '← Previous'}
              </Button>

              {currentSection < evaluationInfo.sections.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={handleNextSection}
                >
                  Next Section →
                </Button>
              ) : currentTeammate < validTeammates.length - 1 ? (
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
            <div className="flexible-eval-form__progress-info">
              <div className="flexible-eval-form__section-progress">
                Section {currentSection + 1} of {evaluationInfo.sections.length}
              </div>
              <div className="flexible-eval-form__teammate-progress">
                Teammate {currentTeammate + 1} of {validTeammates.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlexibleEvaluationForm;