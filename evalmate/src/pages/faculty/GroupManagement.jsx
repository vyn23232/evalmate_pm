import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './GroupManagement.css';

function GroupManagement() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    maxMembers: 4,
    course: '',
    description: ''
  });

  // Mock data for courses and students
  const [courses] = useState([]);

  const [groups, setGroups] = useState([]);

  const [unassignedStudents] = useState([]);

  const filteredGroups = groups.filter(group => group.course === selectedCourse);
  const filteredUnassigned = unassignedStudents.filter(student => student.course === selectedCourse);

  const getGroupStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--color-success)';
      case 'recruiting': return 'var(--color-warning)';
      case 'inactive': return 'var(--color-text-secondary)';
      default: return 'var(--color-text-secondary)';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 85) return 'var(--color-success)';
    if (performance >= 70) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleCreateGroup = () => {
    if (!groupFormData.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: groupFormData.name,
      course: groupFormData.course,
      members: [],
      maxMembers: parseInt(groupFormData.maxMembers),
      created: new Date().toISOString(),
      status: 'recruiting',
      performance: 0,
      evaluationsCompleted: 0,
      evaluationsPending: 0
    };

    setGroups(prev => [...prev, newGroup]);
    setGroupFormData({ name: '', maxMembers: 4, course: selectedCourse, description: '' });
    setIsCreatingGroup(false);
  };

  const handleDeleteGroup = (groupId) => {
    if (confirm('Are you sure you want to delete this group?')) {
      setGroups(prev => prev.filter(group => group.id !== groupId));
      if (selectedGroup === groupId) {
        setSelectedGroup(null);
      }
    }
  };

  const handleAutoAssign = () => {
    // Simple auto-assignment algorithm
    const availableStudents = [...filteredUnassigned];
    const updatedGroups = [...filteredGroups];
    
    for (const group of updatedGroups) {
      while (group.members.length < group.maxMembers && availableStudents.length > 0) {
        const student = availableStudents.pop();
        group.members.push({
          id: student.id,
          name: student.name,
          email: student.email,
          role: group.members.length === 0 ? 'leader' : 'member',
          joined: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString()
        });
      }
    }

    setGroups(prev => prev.map(group => {
      const updated = updatedGroups.find(g => g.id === group.id);
      return updated || group;
    }));

    alert('Students have been auto-assigned to groups!');
  };

  const addStudentToGroup = (student, groupId) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId && group.members.length < group.maxMembers) {
        const newMember = {
          id: student.id,
          name: student.name,
          email: student.email,
          role: group.members.length === 0 ? 'leader' : 'member',
          joined: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString()
        };
        return { ...group, members: [...group.members, newMember] };
      }
      return group;
    }));
  };

  const removeStudentFromGroup = (studentId, groupId) => {
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return { ...group, members: group.members.filter(member => member.id !== studentId) };
      }
      return group;
    }));
  };

  const getSelectedGroupData = () => {
    return groups.find(group => group.id === selectedGroup);
  };

  return (
    <div className="group-management">
      {/* Header */}
      <div className="group-management__header">
        <div className="group-management__title-section">
          <h1 className="group-management__title">Group Management</h1>
          <p className="group-management__subtitle">
            Create, manage, and monitor student groups for collaborative projects
          </p>
        </div>

        <div className="group-management__controls">
          <div className="group-management__filter">
            <label>Course:</label>
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="group-management__select"
            >
              {courses.map(course => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <Button 
            variant="primary" 
            onClick={() => setIsCreatingGroup(true)}
          >
            + Create Group
          </Button>

          <Button 
            variant="secondary" 
            onClick={handleAutoAssign}
            disabled={filteredUnassigned.length === 0}
          >
            🤖 Auto-Assign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="group-management__overview">
        <Card className="group-management__stat-card">
          <div className="group-management__stat">
            <div className="group-management__stat-icon">👥</div>
            <div className="group-management__stat-content">
              <h3>{filteredGroups.length}</h3>
              <p>Active Groups</p>
            </div>
          </div>
        </Card>

        <Card className="group-management__stat-card">
          <div className="group-management__stat">
            <div className="group-management__stat-icon">👤</div>
            <div className="group-management__stat-content">
              <h3>{filteredGroups.reduce((total, group) => total + group.members.length, 0)}</h3>
              <p>Assigned Students</p>
            </div>
          </div>
        </Card>

        <Card className="group-management__stat-card">
          <div className="group-management__stat">
            <div className="group-management__stat-icon">⏳</div>
            <div className="group-management__stat-content">
              <h3>{filteredUnassigned.length}</h3>
              <p>Unassigned Students</p>
            </div>
          </div>
        </Card>

        <Card className="group-management__stat-card">
          <div className="group-management__stat">
            <div className="group-management__stat-icon">📊</div>
            <div className="group-management__stat-content">
              <h3>{Math.round(filteredGroups.reduce((total, group) => total + group.performance, 0) / filteredGroups.length) || 0}%</h3>
              <p>Average Performance</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="group-management__tabs">
        <button
          className={`group-management__tab ${activeTab === 'groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('groups')}
        >
          Groups ({filteredGroups.length})
        </button>
        <button
          className={`group-management__tab ${activeTab === 'unassigned' ? 'active' : ''}`}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned ({filteredUnassigned.length})
        </button>
        <button
          className={`group-management__tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="group-management__content">
        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="group-management__groups-view">
            <div className="group-management__groups-grid">
              {filteredGroups.length === 0 ? (
                <div className="group-management__empty-state">
                  <h3>👥 No Groups Created</h3>
                  <p>Create your first student group to get started with collaborative assignments and peer evaluations.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setIsCreatingGroup(true)}
                    style={{ marginTop: '1rem' }}
                  >
                    Create First Group
                  </Button>
                </div>
              ) : (
                filteredGroups.map(group => (
                <Card 
                  key={group.id} 
                  className={`group-management__group-card ${selectedGroup === group.id ? 'selected' : ''}`}
                  onClick={() => setSelectedGroup(group.id)}
                >
                  <div className="group-management__group-header">
                    <div className="group-management__group-info">
                      <h3>{group.name}</h3>
                      <span 
                        className="group-management__group-status"
                        style={{ color: getGroupStatusColor(group.status) }}
                      >
                        {group.status}
                      </span>
                    </div>
                    <button
                      className="group-management__delete-group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="group-management__group-stats">
                    <div className="group-management__group-stat">
                      <span>Members</span>
                      <span>{group.members.length}/{group.maxMembers}</span>
                    </div>
                    {group.performance > 0 && (
                      <div className="group-management__group-stat">
                        <span>Performance</span>
                        <span style={{ color: getPerformanceColor(group.performance) }}>
                          {group.performance}%
                        </span>
                      </div>
                    )}
                    <div className="group-management__group-stat">
                      <span>Evaluations</span>
                      <span>{group.evaluationsCompleted}/{group.evaluationsCompleted + group.evaluationsPending}</span>
                    </div>
                  </div>

                  <div className="group-management__group-members">
                    {group.members.slice(0, 3).map(member => (
                      <div key={member.id} className="group-management__member-avatar">
                        <span>{member.name.split(' ').map(n => n[0]).join('')}</span>
                        {member.role === 'leader' && <span className="group-management__leader-badge">👑</span>}
                      </div>
                    ))}
                    {group.members.length > 3 && (
                      <div className="group-management__member-overflow">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="group-management__group-actions">
                    <Button variant="ghost" size="small">
                      View Details
                    </Button>
                    <Button variant="secondary" size="small">
                      Add Member
                    </Button>
                  </div>
                </Card>
                ))
              )}
            </div>

            {/* Group Details Panel */}
            {selectedGroup && getSelectedGroupData() && (
              <Card title={`${getSelectedGroupData().name} - Details`} className="group-management__details-panel">
                <div className="group-management__group-details">
                  <div className="group-management__detail-section">
                    <h4>Group Information</h4>
                    <div className="group-management__detail-grid">
                      <div className="group-management__detail-item">
                        <label>Created:</label>
                        <span>{new Date(getSelectedGroupData().created).toLocaleDateString()}</span>
                      </div>
                      <div className="group-management__detail-item">
                        <label>Status:</label>
                        <span style={{ color: getGroupStatusColor(getSelectedGroupData().status) }}>
                          {getSelectedGroupData().status}
                        </span>
                      </div>
                      <div className="group-management__detail-item">
                        <label>Max Members:</label>
                        <span>{getSelectedGroupData().maxMembers}</span>
                      </div>
                      <div className="group-management__detail-item">
                        <label>Course:</label>
                        <span>{getSelectedGroupData().course}</span>
                      </div>
                    </div>
                  </div>

                  <div className="group-management__detail-section">
                    <h4>Members ({getSelectedGroupData().members.length})</h4>
                    <div className="group-management__members-list">
                      {getSelectedGroupData().members.map(member => (
                        <div key={member.id} className="group-management__member-item">
                          <div className="group-management__member-info">
                            <div className="group-management__member-avatar">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="group-management__member-details">
                              <h5>{member.name}</h5>
                              <p>{member.email}</p>
                              <div className="group-management__member-meta">
                                <span className={`group-management__member-role ${member.role}`}>
                                  {member.role === 'leader' ? '👑 Leader' : '👤 Member'}
                                </span>
                                <span className="group-management__member-activity">
                                  Last active: {formatTimeAgo(member.lastActive)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            className="group-management__remove-member"
                            onClick={() => removeStudentFromGroup(member.id, selectedGroup)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Unassigned Students Tab */}
        {activeTab === 'unassigned' && (
          <Card title="Unassigned Students">
            <div className="group-management__unassigned-grid">
              {filteredUnassigned.length === 0 ? (
                <div className="group-management__empty-state">
                  <h3>✅ All Students Assigned</h3>
                  <p>Great! All students in this course have been assigned to groups.</p>
                </div>
              ) : (
                filteredUnassigned.map(student => (
                <div key={student.id} className="group-management__student-card">
                  <div className="group-management__student-info">
                    <div className="group-management__student-avatar">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="group-management__student-details">
                      <h4>{student.name}</h4>
                      <p>{student.email}</p>
                      <div className="group-management__student-skills">
                        {student.skills.map(skill => (
                          <span key={skill} className="group-management__skill-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="group-management__student-gpa">
                        GPA: {student.gpa}
                      </div>
                    </div>
                  </div>
                  
                  <div className="group-management__student-actions">
                    <select 
                      className="group-management__assign-select"
                      onChange={(e) => {
                        if (e.target.value) {
                          addStudentToGroup(student, parseInt(e.target.value));
                        }
                      }}
                    >
                      <option value="">Assign to group...</option>
                      {filteredGroups
                        .filter(group => group.members.length < group.maxMembers)
                        .map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name} ({group.members.length}/{group.maxMembers})
                          </option>
                        ))
                      }
                    </select>
                  </div>
                </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="group-management__analytics">
            <Card title="Group Performance Analytics">
              <div className="group-management__analytics-grid">
                <div className="group-management__chart-container">
                  <h4>Group Performance Comparison</h4>
                  <div className="group-management__performance-chart">
                    {filteredGroups.map(group => (
                      <div key={group.id} className="group-management__performance-bar">
                        <div className="group-management__bar-info">
                          <span>{group.name}</span>
                          <span>{group.performance}%</span>
                        </div>
                        <div className="group-management__bar-container">
                          <div 
                            className="group-management__bar-fill"
                            style={{ 
                              width: `${group.performance}%`,
                              backgroundColor: getPerformanceColor(group.performance)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="group-management__stats-summary">
                  <h4>Summary Statistics</h4>
                  <div className="group-management__summary-stats">
                    <div className="group-management__summary-stat">
                      <label>Total Groups:</label>
                      <span>{filteredGroups.length}</span>
                    </div>
                    <div className="group-management__summary-stat">
                      <label>Average Group Size:</label>
                      <span>{(filteredGroups.reduce((total, group) => total + group.members.length, 0) / filteredGroups.length || 0).toFixed(1)}</span>
                    </div>
                    <div className="group-management__summary-stat">
                      <label>Groups at Capacity:</label>
                      <span>{filteredGroups.filter(group => group.members.length === group.maxMembers).length}</span>
                    </div>
                    <div className="group-management__summary-stat">
                      <label>Average Performance:</label>
                      <span>{Math.round(filteredGroups.reduce((total, group) => total + group.performance, 0) / filteredGroups.length) || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {isCreatingGroup && (
        <div className="group-management__modal-overlay">
          <div className="group-management__modal">
            <Card title="Create New Group">
              <div className="group-management__form">
                <div className="group-management__form-field">
                  <label>Group Name</label>
                  <input
                    type="text"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name..."
                    className="group-management__input"
                  />
                </div>

                <div className="group-management__form-field">
                  <label>Maximum Members</label>
                  <select
                    value={groupFormData.maxMembers}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="group-management__select"
                  >
                    {[2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} members</option>
                    ))}
                  </select>
                </div>

                <div className="group-management__form-field">
                  <label>Course</label>
                  <select
                    value={groupFormData.course}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, course: e.target.value }))}
                    className="group-management__select"
                  >
                    {courses.map(course => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group-management__form-field">
                  <label>Description (Optional)</label>
                  <textarea
                    value={groupFormData.description}
                    onChange={(e) => setGroupFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Group description or project details..."
                    rows="3"
                    className="group-management__textarea"
                  />
                </div>

                <div className="group-management__form-actions">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsCreatingGroup(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleCreateGroup}
                  >
                    Create Group
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupManagement;