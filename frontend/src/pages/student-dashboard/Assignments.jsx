import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Upload, Clock, Star, MessageSquare } from 'lucide-react';
import { Badge, TabBar, EmptyState, Modal } from '../../components/dashboard/Common';

const ASSIGNMENTS_DATA = [
  { id: 1, course: 'Operating Systems', title: 'Implement Process Scheduling Algorithm (Round Robin)', status: 'submitted', grade: 92, feedback: 'Clean synchronization and queue handling.', dueDate: '2026-11-16', submittedDate: '2026-11-14' },
  { id: 2, course: 'Algorithms & Complexity', title: 'Dynamic Programming - Matrix Chain Multiplication', status: 'pending', grade: null, feedback: null, dueDate: '2026-11-18' },
  { id: 3, course: 'Database Management Systems', title: 'B+ Tree Index Simulation & Query Cost Benchmark', status: 'late', grade: null, feedback: null, dueDate: '2026-11-10' },
  { id: 4, course: 'Computer Networks', title: 'TCP Flow Control & Sliding Window Protocol Lab', status: 'graded', grade: 88, feedback: 'Strong test cases. Add congestion avoidance handling.', dueDate: '2026-11-12', submittedDate: '2026-11-11' }
];

const AssignmentsPage = () => {
  const [filter, setFilter] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const filtered = ASSIGNMENTS_DATA.filter(a => {
    if (filter === 'All') return true;
    return a.status === filter.toLowerCase();
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'submitted': return 'indigo';
      case 'graded': return 'emerald';
      case 'late': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text">Lab Assignments & Submissions</h2>
          <p className="text-xs text-muted mt-0.5">Submit course assignments and track grading feedback</p>
        </div>
        <TabBar tabs={['All', 'Pending', 'Submitted', 'Graded', 'Late']} active={filter} onChange={setFilter} />
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((assignment) => (
            <div 
              key={assignment.id} 
              className="bg-surface border border-border rounded-xl p-5 shadow-sm hover:border-border/80 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge text={assignment.course} color="gray" />
                    <Badge text={assignment.status.toUpperCase()} color={getStatusColor(assignment.status)} />
                  </div>
                  <h3 className="text-base font-semibold text-text">{assignment.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {assignment.submittedDate && (
                      <>
                        <span>·</span>
                        <span>Submitted: {new Date(assignment.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                  {assignment.feedback && (
                    <p className="text-xs text-text bg-surface-2 p-2.5 rounded-lg border border-border mt-2">
                      <span className="font-semibold text-accent">Faculty Feedback: </span>
                      {assignment.feedback}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {assignment.status === 'graded' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30 text-success">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-base font-bold">{assignment.grade}%</span>
                    </div>
                  )}

                  {assignment.status === 'pending' || assignment.status === 'late' ? (
                    <button 
                      onClick={() => { setSelectedAssignment(assignment); setShowSubmissionModal(true); }}
                      className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Solution</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => { setSelectedAssignment(assignment); setShowSubmissionModal(true); }}
                      className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FileText} 
          title="No assignments found" 
          subtitle="There are no assignments matching the selected status filter." 
        />
      )}

      {showSubmissionModal && selectedAssignment && (
        <SubmissionModal assignment={selectedAssignment} onClose={() => setShowSubmissionModal(false)} />
      )}
    </div>
  );
};

const SubmissionModal = ({ assignment, onClose }) => {
  const [submissionText, setSubmissionText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{assignment.title}</h3>
          <p className="text-xs text-muted mt-0.5">{assignment.course} · Due: {assignment.dueDate}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Code & Solution Notes
            </label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={5}
              placeholder="Paste algorithm explanation, GitHub repository link, or execution notes..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text mb-1.5">
              Source Code / Documentation Upload
            </label>
            <div className="border border-dashed border-border rounded-xl p-6 bg-surface-2 flex flex-col items-center justify-center text-center cursor-pointer hover:border-border/80 transition-colors">
              <Upload className="w-6 h-6 text-muted mb-2" />
              <p className="text-xs font-medium text-text">Select solution zip, pdf, or tar archive</p>
              <p className="text-[11px] text-muted mt-0.5">Maximum archive size: 25MB</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold"
            >
              Submit Lab Assignment
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AssignmentsPage;
