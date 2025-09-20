import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import formStore from '../../utils/FormStore';
import './FormBuilder.css';

function FormBuilder() {
  const location = useLocation();
  const [editingFormId, setEditingFormId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'Peer Evaluation Form',
    description: 'Form your team and evaluate each teammate based on the criteria below.',
    course: '',
    dueDate: '',
    isAnonymous: true,
    allowDraft: true,
    formType: 'master', // Always master/flexible form type
    teamConfiguration: {
      minTeamSize: 2,
      maxTeamSize: 5,
      allowSelfEvaluation: false,
      instructions: 'Form your team and evaluate each teammate based on the criteria below.'
    },
    sections: []
  });

  const [activeTab, setActiveTab] = useState('design');
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Check for edit mode on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const editFormId = urlParams.get('edit');
    
    if (editFormId) {
      const existingForm = formStore.getForm(editFormId);
      if (existingForm) {
        setEditingFormId(editFormId);
        setIsEditMode(true);
        setFormData({
          ...existingForm,
          teamConfiguration: existingForm.teamConfiguration || {
            minTeamSize: 2,
            maxTeamSize: 5,
            allowSelfEvaluation: false,
            instructions: 'Form your team and evaluate each teammate based on the criteria below.'
          }
        });
      }
    }
  }, [location.search]);

  // Question types available in the form builder
  const questionTypes = [
    {
      type: 'rating',
      name: 'Rating Scale',
      icon: '⭐',
      description: 'Numerical rating (1-5, 1-10, etc.)',
      defaultConfig: {
        scale: 5,
        labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
      }
    },
    {
      type: 'textarea',
      name: 'Text Response',
      icon: '📝',
      description: 'Long-form text input',
      defaultConfig: {
        maxLength: 500,
        placeholder: 'Enter your response...'
      }
    },
    {
      type: 'multiple-choice',
      name: 'Multiple Choice',
      icon: '◉',
      description: 'Single selection from options',
      defaultConfig: {
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    },
    {
      type: 'checkbox',
      name: 'Checkboxes',
      icon: '☑️',
      description: 'Multiple selections allowed',
      defaultConfig: {
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    },
    {
      type: 'slider',
      name: 'Slider',
      icon: '🎚️',
      description: 'Continuous scale input',
      defaultConfig: {
        min: 0,
        max: 100,
        step: 5,
        labels: ['Low', 'High']
      }
    }
  ];

  // Pre-built form templates
  const formTemplates = [
    {
      id: 'comprehensive-peer-evaluation',
      name: 'Comprehensive Peer Evaluation',
      description: 'Complete peer evaluation covering collaboration, technical skills, and leadership',
      formType: 'master',
      sections: [
        {
          id: 'collaboration',
          title: 'Collaboration & Communication',
          description: 'Evaluate how well your teammate collaborates and communicates with the team',
          questions: [
            {
              id: 'comm-effectiveness',
              type: 'rating',
              question: 'How effectively does this teammate communicate with the team?',
              description: 'Consider clarity, responsiveness, and active participation in discussions',
              required: true,
              scale: 5,
              labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
            },
            {
              id: 'collaboration-quality',
              type: 'rating',
              question: 'How well does this teammate collaborate on shared tasks?',
              description: 'Consider willingness to help, sharing resources, and working together effectively',
              required: true,
              scale: 5,
              labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
            },
            {
              id: 'collaboration-comments',
              type: 'textarea',
              question: 'Additional comments on collaboration and communication (optional)',
              description: 'Provide specific examples of effective collaboration or areas for improvement',
              required: false,
              maxLength: 500,
              placeholder: 'Share specific examples...'
            }
          ]
        },
        {
          id: 'technical-contribution',
          title: 'Technical Contribution',
          description: 'Assess the quality and quantity of technical work and contributions',
          questions: [
            {
              id: 'work-quality',
              type: 'rating',
              question: 'How would you rate the quality of this teammate\'s work?',
              description: 'Consider accuracy, attention to detail, and adherence to standards',
              required: true,
              scale: 5,
              labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
            },
            {
              id: 'technical-skills',
              type: 'rating',
              question: 'How would you rate this teammate\'s technical skills relevant to the project?',
              description: 'Consider proficiency with required tools, technologies, and methodologies',
              required: true,
              scale: 5,
              labels: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
            },
            {
              id: 'technical-comments',
              type: 'textarea',
              question: 'Additional comments on technical contribution (optional)',
              description: 'Highlight specific technical strengths or suggest areas for development',
              required: false,
              maxLength: 500,
              placeholder: 'Describe technical contributions...'
            }
          ]
        },
        {
          id: 'reliability-leadership',
          title: 'Reliability & Leadership',
          description: 'Evaluate dependability, accountability, and leadership qualities',
          questions: [
            {
              id: 'reliability',
              type: 'rating',
              question: 'How reliable is this teammate in meeting deadlines and commitments?',
              description: 'Consider punctuality, follow-through on promises, and consistency',
              required: true,
              scale: 5,
              labels: ['Very Unreliable', 'Unreliable', 'Average', 'Reliable', 'Very Reliable']
            },
            {
              id: 'initiative',
              type: 'rating',
              question: 'How often does this teammate take initiative and show leadership?',
              description: 'Consider proactive problem-solving, taking on extra responsibilities, and guiding others',
              required: true,
              scale: 5,
              labels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
            },
            {
              id: 'reliability-comments',
              type: 'textarea',
              question: 'Additional comments on reliability and leadership (optional)',
              description: 'Provide examples of leadership or reliability, or suggest improvements',
              required: false,
              maxLength: 500,
              placeholder: 'Share observations about reliability and leadership...'
            }
          ]
        }
      ]
    },
    {
      id: 'quick-peer-evaluation',
      name: 'Quick Peer Evaluation',
      description: 'Simplified peer evaluation focusing on key collaboration metrics',
      formType: 'master',
      sections: [
        {
          id: 'overall-evaluation',
          title: 'Overall Team Member Evaluation',
          description: 'Rate your teammate\'s overall performance and contribution',
          questions: [
            {
              id: 'overall-contribution',
              type: 'rating',
              question: 'Overall, how would you rate this teammate\'s contribution to the team?',
              description: 'Consider all aspects: work quality, collaboration, reliability, and attitude',
              required: true,
              scale: 5,
              labels: ['Poor', 'Below Average', 'Average', 'Good', 'Excellent']
            },
            {
              id: 'work-together-again',
              type: 'rating',
              question: 'How willing would you be to work with this teammate again?',
              description: 'Based on your experience, rate your willingness to collaborate in future projects',
              required: true,
              scale: 5,
              labels: ['Very Unwilling', 'Unwilling', 'Neutral', 'Willing', 'Very Willing']
            },
            {
              id: 'feedback-comments',
              type: 'textarea',
              question: 'What feedback would you give to help this teammate improve?',
              description: 'Provide constructive feedback focusing on specific behaviors and suggestions',
              required: true,
              maxLength: 300,
              placeholder: 'Provide specific, constructive feedback...'
            }
          ]
        }
      ]
    }
  ];

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      title: template.name,
      description: template.description,
      formType: template.formType,
      sections: template.sections.map(section => ({
        ...section,
        id: `section-${Date.now()}-${section.id}`,
        questions: section.questions.map(question => ({
          ...question,
          id: `question-${Date.now()}-${question.id}`
        }))
      }))
    }));
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: 'Section description',
      questions: []
    };
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    setSelectedSection(newSection.id);
  };

  const addQuestion = (sectionId, questionType) => {
    const questionTypeConfig = questionTypes.find(q => q.type === questionType);
    
    const newQuestion = {
      id: `question-${Date.now()}`,
      type: questionType,
      question: 'New Question',
      description: '',
      required: true,
      ...questionTypeConfig.defaultConfig
    };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }));

    setSelectedQuestion(newQuestion.id);
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateSection = (sectionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, [field]: value }
          : section
      )
    }));
  };

  const updateQuestion = (sectionId, questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map(question =>
                question.id === questionId
                  ? { ...question, [field]: value }
                  : question
              )
            }
          : section
      )
    }));
  };

  const deleteSection = (sectionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const deleteQuestion = (sectionId, questionId) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter(question => question.id !== questionId)
            }
          : section
      )
    }));

    if (selectedQuestion === questionId) {
      setSelectedQuestion(null);
    }
  };

  const saveForm = async () => {
    try {
      // Validate form data
      if (!formData.title.trim()) {
        alert('Please enter a form title');
        return;
      }
      
      if (!formData.course.trim()) {
        alert('Please enter a course name');
        return;
      }
      
      if (formData.sections.length === 0) {
        alert('Please add at least one section to the form');
        return;
      }

      // Prepare form data for saving
      const formPayload = {
        ...formData,
        type: formData.formType, // Ensure type is set for student display
        createdBy: 'Faculty User', // In real app, this would come from auth context
        estimatedTime: `${Math.max(5, formData.sections.length * 5)}-${Math.max(10, formData.sections.length * 8)} minutes`,
        priority: 'medium'
      };

      // Save to FormStore (either update existing or create new)
      let savedForm;
      if (isEditMode && editingFormId) {
        savedForm = formStore.updateForm(editingFormId, { ...formPayload, status: 'draft' });
        console.log('Form updated as draft:', savedForm);
      } else {
        savedForm = formStore.saveDraft(null, formPayload);
        console.log('Form saved as draft:', savedForm);
      }

      const actionText = isEditMode ? 'updated' : 'saved';
      alert(`✅ Form ${actionText} as draft successfully!\n\n📋 Form Type: Flexible Team Evaluation\n📂 Sections: ${formData.sections.length}\n❓ Questions: ${formData.sections.reduce((total, section) => total + section.questions.length, 0)}\n\n💡 Tip: Use "Publish Form" to make it available to students!`);
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    }
  };

  const publishForm = async () => {
    try {
      // Validate form data
      if (!formData.title.trim()) {
        alert('Please enter a form title');
        return;
      }
      
      if (!formData.course.trim()) {
        alert('Please enter a course name');
        return;
      }
      
      if (!formData.dueDate) {
        alert('Please set a due date');
        return;
      }
      
      if (formData.sections.length === 0) {
        alert('Please add at least one section to the form');
        return;
      }

      // Validate that all sections have at least one question
      const emptySections = formData.sections.filter(section => section.questions.length === 0);
      if (emptySections.length > 0) {
        alert('All sections must have at least one question before publishing');
        return;
      }

      // Prepare form data for publishing
      const formPayload = {
        ...formData,
        type: formData.formType, // Ensure type is set for student display
        createdBy: 'Faculty User', // In real app, this would come from auth context
        estimatedTime: `${Math.max(5, formData.sections.length * 5)}-${Math.max(10, formData.sections.length * 8)} minutes`,
        priority: 'high', // New forms get high priority
        status: 'published'
      };

      // Save and publish to FormStore (either update existing or create new)
      let publishedForm;
      if (isEditMode && editingFormId) {
        publishedForm = formStore.updateForm(editingFormId, formPayload);
        console.log('Form updated and published:', publishedForm);
      } else {
        publishedForm = formStore.addForm(formPayload);
        console.log('Form published:', publishedForm);
      }
      
      const formTypeText = '✨ Flexible Team Evaluation Form';
      const teamConfigText = `\n\n🔧 Team Configuration:\n• Team Size: ${formData.teamConfiguration.minTeamSize}-${formData.teamConfiguration.maxTeamSize} members\n• Self-evaluation: ${formData.teamConfiguration.allowSelfEvaluation ? 'Allowed' : 'Not allowed'}\n• Instructions: "${formData.teamConfiguration.instructions}"`;
      
      const stats = formStore.getStats();
      const actionText = isEditMode ? 'updated and published' : 'published';
      
      alert(`🎉 ${formTypeText} ${actionText} successfully!${teamConfigText}\n\n✅ Students can now see this form in their dashboard!\n\n📊 Current Statistics:\n• Published Forms: ${stats.published}\n• Total Forms: ${stats.total}\n\n📋 This Form:\n• Sections: ${formData.sections.length}\n• Questions: ${formData.sections.reduce((total, section) => total + section.questions.length, 0)}\n• Form ID: ${publishedForm.id}`);

      // Reset form for new creation (only if not editing)
      if (!isEditMode) {
        setFormData({
          title: 'Peer Evaluation Form',
          description: 'Form your team and evaluate each teammate based on the criteria below.',
          course: '',
          dueDate: '',
          isAnonymous: true,
          allowDraft: true,
          formType: 'master',
          teamConfiguration: {
            minTeamSize: 2,
            maxTeamSize: 5,
            allowSelfEvaluation: false,
            instructions: 'Form your team and evaluate each teammate based on the criteria below.'
          },
          sections: []
        });
        setSelectedSection(null);
        setSelectedQuestion(null);
      }
      
    } catch (error) {
      console.error('Error publishing form:', error);
      alert('❌ Failed to publish form. Please try again.');
    }
  };

  const renderQuestionPreview = (question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="form-builder__question-preview">
            <div className="form-builder__rating-preview">
              {Array.from({ length: question.scale }, (_, i) => i + 1).map(rating => (
                <div key={rating} className="form-builder__rating-circle">
                  {rating}
                </div>
              ))}
            </div>
            {question.labels && (
              <div className="form-builder__rating-labels">
                <span>{question.labels[0]}</span>
                <span>{question.labels[question.labels.length - 1]}</span>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            placeholder={question.placeholder}
            className="form-builder__textarea-preview"
            readOnly
          />
        );

      case 'multiple-choice':
        return (
          <div className="form-builder__options-preview">
            {question.options.map((option, index) => (
              <div key={index} className="form-builder__option-preview">
                <input type="radio" name={`preview-${question.id}`} disabled />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="form-builder__options-preview">
            {question.options.map((option, index) => (
              <div key={index} className="form-builder__option-preview">
                <input type="checkbox" disabled />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="form-builder__slider-preview">
            <div className="form-builder__slider-labels">
              <span>{question.labels[0]}</span>
              <span>{question.labels[1]}</span>
            </div>
            <input
              type="range"
              min={question.min}
              max={question.max}
              step={question.step}
              disabled
              className="form-builder__slider"
            />
          </div>
        );

      default:
        return <div>Preview not available</div>;
    }
  };

  const getCurrentSection = () => {
    return formData.sections.find(section => section.id === selectedSection);
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions.find(question => question.id === selectedQuestion);
  };

  return (
    <div className="form-builder">
      {/* Header */}
      <div className="form-builder__header">
        <div className="form-builder__title-section">
          <h1 className="form-builder__title">
            {isEditMode ? 'Edit Form' : 'Form Builder'}
          </h1>
          <p className="form-builder__subtitle">
            {isEditMode ? 'Update your existing evaluation form' : 'Create custom evaluation forms for your students'}
          </p>
          {isEditMode && (
            <p className="form-builder__edit-notice">
              📝 Editing: {formData.title} (ID: {editingFormId})
            </p>
          )}
        </div>
        
        <div className="form-builder__header-actions">
          <div className="form-builder__form-type-indicator">
            <span className="form-builder__type-badge form-builder__type-badge--master">
              ✨ Flexible Evaluation Form
            </span>
          </div>
          <Button 
            variant="ghost" 
            size="small"
            onClick={() => setActiveTab('settings')}
          >
            Templates
          </Button>
          <Button variant="secondary" onClick={saveForm}>
            {isEditMode ? 'Update Draft' : 'Save Draft'}
          </Button>
          <Button variant="primary" onClick={publishForm}>
            {isEditMode ? 'Update & Publish' : 'Publish Form'}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="form-builder__tabs">
        <button
          className={`form-builder__tab ${activeTab === 'design' ? 'active' : ''}`}
          onClick={() => setActiveTab('design')}
        >
          🎨 Design
        </button>
        <button
          className={`form-builder__tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
        <button
          className={`form-builder__tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
      </div>

      <div className="form-builder__content">
        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="form-builder__design">
            {/* Left Panel - Form Structure */}
            <div className="form-builder__structure">
              <Card title="Form Structure">
                {/* Form Title */}
                <div className="form-builder__form-info">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    className="form-builder__form-title"
                    placeholder="Form Title"
                  />
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateFormField('description', e.target.value)}
                    className="form-builder__form-description"
                    placeholder="Form description..."
                    rows="3"
                  />
                </div>

                {/* Sections */}
                <div className="form-builder__sections">
                  <div className="form-builder__sections-header">
                    <h3>Sections</h3>
                    <Button size="small" onClick={addSection}>
                      + Add Section
                    </Button>
                  </div>

                  {formData.sections.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className={`form-builder__section-item ${
                        selectedSection === section.id ? 'selected' : ''
                      }`}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <div className="form-builder__section-header">
                        <div className="form-builder__section-info">
                          <span className="form-builder__section-number">{sectionIndex + 1}</span>
                          <div className="form-builder__section-content">
                            <h4>{section.title}</h4>
                            <p>{section.questions.length} questions</p>
                          </div>
                        </div>
                        
                        <div className="form-builder__section-actions">
                          <button
                            className="form-builder__delete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Questions in this section */}
                      {section.questions.map((question, questionIndex) => (
                        <div
                          key={question.id}
                          className={`form-builder__question-item ${
                            selectedQuestion === question.id ? 'selected' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQuestion(question.id);
                          }}
                        >
                          <div className="form-builder__question-info">
                            <div className="form-builder__question-content">
                              <span className="form-builder__question-title">
                                Q{questionIndex + 1}: {question.question}
                              </span>
                              <div className="form-builder__question-meta">
                                <span className="form-builder__question-type-tag">
                                  {questionTypes.find(q => q.type === question.type)?.name}
                                </span>
                                <span className="form-builder__question-required">
                                  {question.required ? 'Required' : 'Optional'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            className="form-builder__delete-question"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteQuestion(section.id, question.id);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}

                      {selectedSection === section.id && (
                        <div className="form-builder__add-questions">
                          <p>Add Question Type:</p>
                          <div className="form-builder__question-types">
                            {questionTypes.map((questionType) => (
                              <button
                                key={questionType.type}
                                className="form-builder__question-type-button"
                                onClick={() => addQuestion(section.id, questionType.type)}
                                title={questionType.description}
                              >
                                <span className="form-builder__question-type-name">
                                  {questionType.name}
                                </span>
                                <span className="form-builder__question-type-description">
                                  {questionType.description}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {formData.sections.length === 0 && (
                    <div className="form-builder__empty-sections">
                      <p>No sections yet. Add a section to get started.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Panel - Editor */}
            <div className="form-builder__editor">
              {selectedSection && getCurrentSection() && (
                <Card title="Section Editor">
                  <div className="form-builder__section-editor">
                    <div className="form-builder__field">
                      <label>Section Title</label>
                      <input
                        type="text"
                        value={getCurrentSection().title}
                        onChange={(e) => updateSection(selectedSection, 'title', e.target.value)}
                        className="form-builder__input"
                      />
                    </div>
                    
                    <div className="form-builder__field">
                      <label>Section Description</label>
                      <textarea
                        value={getCurrentSection().description}
                        onChange={(e) => updateSection(selectedSection, 'description', e.target.value)}
                        className="form-builder__textarea"
                        rows="3"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {selectedQuestion && getCurrentQuestion() && (
                <Card title="Question Editor">
                  <div className="form-builder__question-editor">
                    <div className="form-builder__field">
                      <label>Question Text</label>
                      <input
                        type="text"
                        value={getCurrentQuestion().question}
                        onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'question', e.target.value)}
                        className="form-builder__input"
                      />
                    </div>
                    
                    <div className="form-builder__field">
                      <label>Description (Optional)</label>
                      <textarea
                        value={getCurrentQuestion().description || ''}
                        onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'description', e.target.value)}
                        className="form-builder__textarea"
                        rows="2"
                        placeholder="Additional context for this question..."
                      />
                    </div>

                    <div className="form-builder__field">
                      <label className="form-builder__checkbox-label">
                        <input
                          type="checkbox"
                          checked={getCurrentQuestion().required}
                          onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'required', e.target.checked)}
                        />
                        Required Question
                      </label>
                    </div>

                    {/* Question Type Specific Options */}
                    {getCurrentQuestion().type === 'rating' && (
                      <>
                        <div className="form-builder__field">
                          <label>Scale (1 to X)</label>
                          <select
                            value={getCurrentQuestion().scale}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'scale', parseInt(e.target.value))}
                            className="form-builder__select"
                          >
                            {[3, 4, 5, 7, 10].map(scale => (
                              <option key={scale} value={scale}>{scale}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="form-builder__field">
                          <label>Scale Labels (comma separated)</label>
                          <input
                            type="text"
                            value={getCurrentQuestion().labels?.join(', ') || ''}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'labels', e.target.value.split(', '))}
                            className="form-builder__input"
                            placeholder="Poor, Fair, Good, Very Good, Excellent"
                          />
                        </div>
                      </>
                    )}

                    {getCurrentQuestion().type === 'textarea' && (
                      <>
                        <div className="form-builder__field">
                          <label>Character Limit</label>
                          <input
                            type="number"
                            value={getCurrentQuestion().maxLength || 500}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'maxLength', parseInt(e.target.value))}
                            className="form-builder__input"
                          />
                        </div>
                        
                        <div className="form-builder__field">
                          <label>Placeholder Text</label>
                          <input
                            type="text"
                            value={getCurrentQuestion().placeholder || ''}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'placeholder', e.target.value)}
                            className="form-builder__input"
                          />
                        </div>
                      </>
                    )}

                    {(getCurrentQuestion().type === 'multiple-choice' || getCurrentQuestion().type === 'checkbox') && (
                      <div className="form-builder__field">
                        <label>Options (one per line)</label>
                        <textarea
                          value={getCurrentQuestion().options?.join('\n') || ''}
                          onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'options', e.target.value.split('\n').filter(opt => opt.trim()))}
                          className="form-builder__textarea"
                          rows="4"
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                        />
                      </div>
                    )}

                    {getCurrentQuestion().type === 'slider' && (
                      <>
                        <div className="form-builder__field-group">
                          <div className="form-builder__field">
                            <label>Minimum Value</label>
                            <input
                              type="number"
                              value={getCurrentQuestion().min || 0}
                              onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'min', parseInt(e.target.value))}
                              className="form-builder__input"
                            />
                          </div>
                          
                          <div className="form-builder__field">
                            <label>Maximum Value</label>
                            <input
                              type="number"
                              value={getCurrentQuestion().max || 100}
                              onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'max', parseInt(e.target.value))}
                              className="form-builder__input"
                            />
                          </div>
                        </div>
                        
                        <div className="form-builder__field">
                          <label>Step Size</label>
                          <input
                            type="number"
                            value={getCurrentQuestion().step || 1}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'step', parseInt(e.target.value))}
                            className="form-builder__input"
                          />
                        </div>
                        
                        <div className="form-builder__field">
                          <label>End Labels (comma separated)</label>
                          <input
                            type="text"
                            value={getCurrentQuestion().labels?.join(', ') || ''}
                            onChange={(e) => updateQuestion(selectedSection, selectedQuestion, 'labels', e.target.value.split(', '))}
                            className="form-builder__input"
                            placeholder="Low, High"
                          />
                        </div>
                      </>
                    )}

                    {/* Question Preview */}
                    <div className="form-builder__preview-section">
                      <h4>Preview</h4>
                      <div className="form-builder__question-preview-container">
                        <div className="form-builder__question-preview-header">
                          <strong>{getCurrentQuestion().question}</strong>
                          {getCurrentQuestion().required && <span className="required">*</span>}
                        </div>
                        {getCurrentQuestion().description && (
                          <p className="form-builder__question-preview-description">
                            {getCurrentQuestion().description}
                          </p>
                        )}
                        {renderQuestionPreview(getCurrentQuestion())}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {!selectedSection && !selectedQuestion && (
                <Card>
                  <div className="form-builder__empty-editor">
                    <h3>Form Builder</h3>
                    <p>Select a section or question from the left panel to start editing.</p>
                    <p>💡 <strong>Tip:</strong> Add sections to organize your questions by topic or category.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="form-builder__settings-container">
            <Card title="Form Configuration">
              <div className="form-builder__settings">
                <div className="form-builder__form-type-info">
                  <div className="form-builder__form-type-banner">
                    <div className="form-builder__form-type-icon">✨</div>
                    <div className="form-builder__form-type-content">
                      <h4>Flexible Team Evaluation</h4>
                      <p>Students form their own teams and identify teammates during evaluation. Perfect for project-based courses where teams are self-organized.</p>
                      <div className="form-builder__form-type-features">
                        <span>✨ Self-formed teams</span>
                        <span>✨ Manual team identification</span>
                        <span>✨ Flexible team sizes</span>
                        <span>✨ No pre-assignment needed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-builder__settings-grid">
                  <div className="form-builder__field">
                    <label>Course</label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) => updateFormField('course', e.target.value)}
                      className="form-builder__input"
                      placeholder="e.g., CS 485 - Software Engineering"
                    />
                  </div>

                  <div className="form-builder__field">
                    <label>Due Date</label>
                    <input
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => updateFormField('dueDate', e.target.value)}
                      className="form-builder__input"
                    />
                  </div>

                  <div className="form-builder__field">
                    <label className="form-builder__checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => updateFormField('isAnonymous', e.target.checked)}
                      />
                      Anonymous Evaluations
                    </label>
                    <p className="form-builder__field-help">
                      Students' responses will not be linked to their identity
                    </p>
                  </div>

                  <div className="form-builder__field">
                    <label className="form-builder__checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.allowDraft}
                        onChange={(e) => updateFormField('allowDraft', e.target.checked)}
                      />
                      Allow Draft Saving
                    </label>
                    <p className="form-builder__field-help">
                      Students can save their progress and complete the evaluation later
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Team Configuration */}
            <Card title="Team Configuration">
              <div className="form-builder__team-config">
                <div className="form-builder__team-config-grid">
                  <div className="form-builder__field">
                    <label>Minimum Team Size</label>
                    <select
                      value={formData.teamConfiguration.minTeamSize}
                      onChange={(e) => updateFormField('teamConfiguration', {
                        ...formData.teamConfiguration,
                        minTeamSize: parseInt(e.target.value)
                      })}
                      className="form-builder__input"
                    >
                      <option value={2}>2 members</option>
                      <option value={3}>3 members</option>
                      <option value={4}>4 members</option>
                      <option value={5}>5 members</option>
                    </select>
                  </div>

                  <div className="form-builder__field">
                    <label>Maximum Team Size</label>
                    <select
                      value={formData.teamConfiguration.maxTeamSize}
                      onChange={(e) => updateFormField('teamConfiguration', {
                        ...formData.teamConfiguration,
                        maxTeamSize: parseInt(e.target.value)
                      })}
                      className="form-builder__input"
                    >
                      <option value={3}>3 members</option>
                      <option value={4}>4 members</option>
                      <option value={5}>5 members</option>
                      <option value={6}>6 members</option>
                      <option value={7}>7 members</option>
                      <option value={8}>8 members</option>
                    </select>
                  </div>

                  <div className="form-builder__field form-builder__field--full-width">
                    <label>Instructions for Students</label>
                    <textarea
                      value={formData.teamConfiguration.instructions}
                      onChange={(e) => updateFormField('teamConfiguration', {
                        ...formData.teamConfiguration,
                        instructions: e.target.value
                      })}
                      className="form-builder__textarea"
                      placeholder="Provide instructions for students on how to form teams and complete evaluations..."
                      rows="3"
                    />
                    <p className="form-builder__field-help">
                      These instructions will be shown to students when they start the evaluation
                    </p>
                  </div>

                  <div className="form-builder__field">
                    <label className="form-builder__checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.teamConfiguration.allowSelfEvaluation}
                        onChange={(e) => updateFormField('teamConfiguration', {
                          ...formData.teamConfiguration,
                          allowSelfEvaluation: e.target.checked
                        })}
                      />
                      Allow Self-Evaluation
                    </label>
                    <p className="form-builder__field-help">
                      Students can include themselves in the evaluation process
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Templates Section */}
            <Card title="Quick Start Templates">
              <div className="form-builder__templates">
                <p className="form-builder__templates-description">
                  Start with a pre-built template to save time. You can customize any template after applying it.
                </p>
                
                <div className="form-builder__template-grid">
                  {formTemplates.map(template => (
                    <div key={template.id} className="form-builder__template-card">
                      <div className="form-builder__template-header">
                        <h4>{template.name}</h4>
                        <span className="form-builder__template-badge">
                          ✨ Flexible Teams
                        </span>
                      </div>
                      <p>{template.description}</p>
                      <div className="form-builder__template-stats">
                        <span>{template.sections.length} sections</span>
                        <span>{template.sections.reduce((total, section) => total + section.questions.length, 0)} questions</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="small"
                        onClick={() => applyTemplate(template)}
                      >
                        Apply Template
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <Card title="Form Preview">
            <div className="form-builder__preview">
              <div className="form-builder__preview-header">
                <h2>{formData.title}</h2>
                <p>{formData.description}</p>
                
                <div className="form-builder__preview-meta">
                  {formData.course && <span><strong>Course:</strong> {formData.course}</span>}
                  {formData.dueDate && <span><strong>Due:</strong> {new Date(formData.dueDate).toLocaleDateString()}</span>}
                  {formData.isAnonymous && <span className="form-builder__anonymous-badge">🔒 Anonymous</span>}
                  <span className="form-builder__preview-type-badge master">
                    ✨ Flexible Teams
                  </span>
                </div>

                {/* Team Configuration Preview */}
                <div className="form-builder__preview-master-config">
                  <h4>Team Configuration:</h4>
                  <div className="form-builder__preview-config-details">
                    <span><strong>Team Size:</strong> {formData.teamConfiguration.minTeamSize}-{formData.teamConfiguration.maxTeamSize} members</span>
                    {formData.teamConfiguration.allowSelfEvaluation && (
                      <span><strong>Self-evaluation:</strong> Allowed</span>
                    )}
                  </div>
                  {formData.teamConfiguration.instructions && (
                    <div className="form-builder__preview-instructions">
                      <strong>Instructions for Students:</strong>
                      <p>{formData.teamConfiguration.instructions}</p>
                    </div>
                  )}
                </div>
              </div>

              {formData.sections.map((section, sectionIndex) => (
                <div key={section.id} className="form-builder__preview-section">
                  <div className="form-builder__preview-section-header">
                    <h3>{sectionIndex + 1}. {section.title}</h3>
                    <p>{section.description}</p>
                  </div>

                  {section.questions.map((question, questionIndex) => (
                    <div key={question.id} className="form-builder__preview-question">
                      <div className="form-builder__preview-question-header">
                        <label className="form-builder__preview-question-label">
                          {questionIndex + 1}. {question.question}
                          {question.required && <span className="required">*</span>}
                        </label>
                        {question.description && (
                          <p className="form-builder__preview-question-description">
                            {question.description}
                          </p>
                        )}
                      </div>

                      {renderQuestionPreview(question)}
                    </div>
                  ))}
                </div>
              ))}

              {formData.sections.length === 0 && (
                <div className="form-builder__preview-empty">
                  <p>No sections added yet. Switch to the Design tab to start building your form.</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FormBuilder;