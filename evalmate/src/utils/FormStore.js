/**
 * Simple frontend data store for demo purposes
 * In a real application, this would be replaced with API calls to a backend database
 */

class FormStore {
  constructor() {
    this.forms = this.loadForms();
    this.initializeDefaultForms();
  }

  // Load forms from localStorage (persists across browser sessions)
  loadForms() {
    try {
      const stored = localStorage.getItem('evalmate-forms');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading forms from localStorage:', error);
      return [];
    }
  }

  // Save forms to localStorage
  saveForms() {
    try {
      localStorage.setItem('evalmate-forms', JSON.stringify(this.forms));
    } catch (error) {
      console.warn('Error saving forms to localStorage:', error);
    }
  }

  // Initialize with default forms if none exist
  initializeDefaultForms() {
    // No default forms - application starts clean for demo purposes
    // All data comes from faculty creating forms or localStorage
    if (this.forms.length === 0) {
      this.forms = [];
      this.saveForms();
    }
  }

  // Get all published forms (for student dashboard)
  getPublishedForms() {
    return this.forms.filter(form => form.status === 'published');
  }

  // Get all forms (for faculty dashboard)
  getAllForms() {
    return this.forms;
  }

  // Add a new form
  addForm(formData) {
    const newForm = {
      ...formData,
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.forms.push(newForm);
    this.saveForms();
    return newForm;
  }

  // Update an existing form
  updateForm(formId, updates) {
    const index = this.forms.findIndex(form => form.id === formId);
    if (index !== -1) {
      this.forms[index] = {
        ...this.forms[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveForms();
      return this.forms[index];
    }
    return null;
  }

  // Delete a form
  deleteForm(formId) {
    const index = this.forms.findIndex(form => form.id === formId);
    if (index !== -1) {
      const deletedForm = this.forms.splice(index, 1)[0];
      this.saveForms();
      return deletedForm;
    }
    return null;
  }

  // Get a specific form by ID
  getForm(formId) {
    return this.forms.find(form => form.id === formId);
  }

  // Publish a form
  publishForm(formId) {
    const form = this.getForm(formId);
    if (form) {
      return this.updateForm(formId, {
        status: 'published',
        publishedAt: new Date().toISOString()
      });
    }
    return null;
  }

  // Save form as draft
  saveDraft(formId, formData) {
    const existingForm = this.getForm(formId);
    if (existingForm) {
      return this.updateForm(formId, { ...formData, status: 'draft' });
    } else {
      return this.addForm({ ...formData, status: 'draft' });
    }
  }

  // Convert form data for student display
  convertForStudentDisplay(form) {
    return {
      id: form.id,
      type: 'master',
      title: form.title,
      description: form.description,
      course: form.course,
      createdBy: form.createdBy,
      dueDate: form.dueDate,
      estimatedTime: form.estimatedTime || '20-30 minutes',
      priority: form.priority || 'medium',
      isAnonymous: form.isAnonymous,
      isFlexible: true,
      sections: form.sections.map(section => 
        typeof section === 'string' ? section : section.title
      ),
      totalQuestions: form.sections.reduce((total, section) => {
        if (typeof section === 'string') return total + 1;
        return total + (section.questions ? section.questions.length : 1);
      }, 0),
      maxTeamSize: form.teamConfiguration?.maxTeamSize || form.maxTeamSize || 5,
      minTeamSize: form.teamConfiguration?.minTeamSize || form.minTeamSize || 2,
      instructions: form.teamConfiguration?.instructions || form.instructions || 'Form your team and evaluate teammates.'
    };
  }

  // Clear all data (for demo reset)
  clearAll() {
    this.forms = [];
    localStorage.removeItem('evalmate-forms');
    this.initializeDefaultForms();
  }

  // Get statistics
  getStats() {
    const published = this.forms.filter(f => f.status === 'published');
    const drafts = this.forms.filter(f => f.status === 'draft');
    
    return {
      total: this.forms.length,
      published: published.length,
      drafts: drafts.length,
      flexibleForms: this.forms.length
    };
  }
}

// Create singleton instance
const formStore = new FormStore();

export default formStore;