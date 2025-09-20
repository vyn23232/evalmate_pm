/**
 * Evaluation submission tracking store
 * Manages student evaluation submissions and provides data for faculty reports and notifications
 */

class EvaluationStore {
  constructor() {
    this.submissions = this.loadSubmissions();
    this.notificationCallbacks = [];
  }

  // Load submissions from localStorage
  loadSubmissions() {
    try {
      const stored = localStorage.getItem('evalmate-submissions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error loading submissions from localStorage:', error);
      return [];
    }
  }

  // Save submissions to localStorage
  saveSubmissions() {
    try {
      localStorage.setItem('evalmate-submissions', JSON.stringify(this.submissions));
      this.notifySubscribers();
    } catch (error) {
      console.warn('Error saving submissions to localStorage:', error);
    }
  }

  // Add notification callback
  subscribe(callback) {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Submit a new evaluation
  submitEvaluation(evaluationData) {
    const submission = {
      id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      formId: evaluationData.formId,
      formTitle: evaluationData.formTitle,
      course: evaluationData.course,
      studentName: evaluationData.studentName || 'Anonymous Student',
      teamId: evaluationData.teamId,
      teammates: evaluationData.teammates,
      evaluations: evaluationData.evaluations,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      isRead: false,
      metadata: {
        totalTeammates: evaluationData.teammates.length,
        avgRating: this.calculateAverageRating(evaluationData.evaluations),
        submissionTime: evaluationData.submissionTime || 'Not recorded'
      }
    };

    this.submissions.unshift(submission); // Add to beginning for chronological order
    this.saveSubmissions();
    return submission;
  }

  // Calculate average rating from evaluations
  calculateAverageRating(evaluations) {
    if (!evaluations || evaluations.length === 0) return 0;
    
    let totalRatings = 0;
    let ratingCount = 0;
    
    evaluations.forEach(evaluation => {
      Object.values(evaluation.responses || {}).forEach(response => {
        if (typeof response === 'number' && response >= 1 && response <= 5) {
          totalRatings += response;
          ratingCount++;
        }
      });
    });
    
    return ratingCount > 0 ? Math.round((totalRatings / ratingCount) * 10) / 10 : 0;
  }

  // Get all submissions
  getAllSubmissions() {
    return [...this.submissions];
  }

  // Get submissions for a specific form
  getSubmissionsByForm(formId) {
    return this.submissions.filter(submission => submission.formId === formId);
  }

  // Get submissions by student (for history)
  getSubmissionsByStudent(studentName) {
    return this.submissions
      .filter(submission => submission.studentName === studentName)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  // Get recent submissions (for notifications)
  getRecentSubmissions(limit = 10) {
    return this.submissions
      .slice(0, limit)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  // Get unread submissions count (for notification badge)
  getUnreadCount() {
    return this.submissions.filter(submission => !submission.isRead).length;
  }

  // Mark submission as read
  markAsRead(submissionId) {
    const submission = this.submissions.find(sub => sub.id === submissionId);
    if (submission) {
      submission.isRead = true;
      this.saveSubmissions();
    }
  }

  // Mark all submissions as read
  markAllAsRead() {
    this.submissions.forEach(submission => {
      submission.isRead = true;
    });
    this.saveSubmissions();
  }

  // Get submission statistics
  getStats() {
    const total = this.submissions.length;
    const today = new Date().toDateString();
    const todaySubmissions = this.submissions.filter(
      sub => new Date(sub.submittedAt).toDateString() === today
    ).length;
    
    const formCounts = {};
    this.submissions.forEach(sub => {
      formCounts[sub.formId] = (formCounts[sub.formId] || 0) + 1;
    });

    const avgRating = this.submissions.length > 0 
      ? this.submissions.reduce((sum, sub) => sum + sub.metadata.avgRating, 0) / this.submissions.length
      : 0;

    return {
      total,
      todaySubmissions,
      unread: this.getUnreadCount(),
      averageRating: Math.round(avgRating * 10) / 10,
      formCounts
    };
  }

  // Delete a submission
  deleteSubmission(submissionId) {
    const index = this.submissions.findIndex(sub => sub.id === submissionId);
    if (index !== -1) {
      const deleted = this.submissions.splice(index, 1)[0];
      this.saveSubmissions();
      return deleted;
    }
    return null;
  }

  // Get submission by ID
  getSubmission(submissionId) {
    return this.submissions.find(sub => sub.id === submissionId);
  }

  // Clear all submissions (for demo reset)
  clearAll() {
    this.submissions = [];
    localStorage.removeItem('evalmate-submissions');
    this.saveSubmissions();
  }

  // Export submissions data (for reports)
  exportData() {
    return {
      submissions: this.submissions,
      exportedAt: new Date().toISOString(),
      stats: this.getStats()
    };
  }
}

// Create singleton instance
const evaluationStore = new EvaluationStore();

export default evaluationStore;