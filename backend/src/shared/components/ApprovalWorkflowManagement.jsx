import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PaperClipIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowRightIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import dashboardDataManager, { ApprovalStatus, TaskPriority, BusinessImpact } from '../data/dashboardDataManager';

const ApprovalWorkflowManagement = () => {
  const [approvalInstances, setApprovalInstances] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [filteredInstances, setFilteredInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [showInstanceModal, setShowInstanceModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // pending, all, history
  
  // ÁØ©ÈÅ∏?Ä??
  const [filters, setFilters] = useState({
    workflow_type: '',
    status: [],
    priority: [],
    search: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [approvalInstances, filters, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const instancesResponse = dashboardDataManager.getApprovalInstances();
      const workflowsData = dashboardDataManager.approvalWorkflows;
      
      setApprovalInstances(instancesResponse.instances);
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error loading approval data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...approvalInstances];

    // Ê¥ªÂ?Ê®ôÁ±§ÁØ©ÈÅ∏
    if (activeTab === 'pending') {
      filtered = filtered.filter(instance => 
        instance.overall_status === ApprovalStatus.PENDING || 
        instance.overall_status === ApprovalStatus.IN_PROGRESS
      );
    } else if (activeTab === 'history') {
      filtered = filtered.filter(instance => 
        instance.overall_status === ApprovalStatus.APPROVED || 
        instance.overall_status === ApprovalStatus.REJECTED ||
        instance.overall_status === ApprovalStatus.CANCELLED
      );
    }

    // ?úÂ?ÁØ©ÈÅ∏
    if (filters.search) {
      filtered = filtered.filter(instance => 
        instance.submission_notes?.toLowerCase().includes(filters.search.toLowerCase()) ||
        instance.entity_type.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Â∑•‰?ÊµÅÁ?È°ûÂ?ÁØ©ÈÅ∏
    if (filters.workflow_type) {
      const workflowIds = workflows
        .filter(w => w.entity_type === filters.workflow_type)
        .map(w => w.id);
      filtered = filtered.filter(instance => 
        workflowIds.includes(instance.workflow_id)
      );
    }

    // ?Ä?ãÁØ©??
    if (filters.status.length > 0) {
      filtered = filtered.filter(instance => 
        filters.status.includes(instance.overall_status)
      );
    }

    // ?™Â?Á¥öÁØ©??
    if (filters.priority.length > 0) {
      filtered = filtered.filter(instance => 
        filters.priority.includes(instance.priority)
      );
    }

    // ?âÊ?‰∫§Ê??ìÊ?Â∫èÔ??Ä?∞Á??®Â?Ôº?
    filtered.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

    setFilteredInstances(filtered);
  };

  const approveInstance = async (instanceId, comments = '') => {
    try {
      // ?ôË£°?âË©≤?ºÂè´API?≤Ë?Á∞ΩÊ†∏
      console.log('Approving instance:', instanceId, comments);
      // Ê®°Êì¨?¥Êñ∞
      setApprovalInstances(prev => prev.map(instance => {
        if (instance.id === instanceId) {
          return {
            ...instance,
            overall_status: ApprovalStatus.APPROVED,
            completed_at: new Date(),
            approval_history: [...instance.approval_history, {
              id: Date.now(),
              action: 'approve',
              approver_name: '?∂Â??®Êà∂',
              decision_date: new Date(),
              comments: comments || '?∏Â??öÈ?'
            }]
          };
        }
        return instance;
      }));
    } catch (error) {
      console.error('Error approving instance:', error);
    }
  };

  const rejectInstance = async (instanceId, comments = '') => {
    try {
      console.log('Rejecting instance:', instanceId, comments);
      setApprovalInstances(prev => prev.map(instance => {
        if (instance.id === instanceId) {
          return {
            ...instance,
            overall_status: ApprovalStatus.REJECTED,
            completed_at: new Date(),
            approval_history: [...instance.approval_history, {
              id: Date.now(),
              action: 'reject',
              approver_name: '?∂Â??®Êà∂',
              decision_date: new Date(),
              comments: comments || 'ÈßÅÂ??≥Ë?'
            }]
          };
        }
        return instance;
      }));
    } catch (error) {
      console.error('Error rejecting instance:', error);
    }
  };

  const getWorkflowName = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    return workflow ? workflow.workflow_name : '?™Áü•Â∑•‰?ÊµÅÁ?';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case ApprovalStatus.REJECTED:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case ApprovalStatus.IN_PROGRESS:
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case ApprovalStatus.CANCELLED:
        return <StopIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-amber-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.URGENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case TaskPriority.HIGH:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case TaskPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOverdue = (instance) => {
    if (!instance.due_date || instance.overall_status !== ApprovalStatus.PENDING) return false;
    return new Date(instance.due_date) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
        {/* ?ÅÈù¢Ê®ôÈ? */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Á∞ΩÊ†∏ÊµÅÁ?ÁÆ°Á?</h1>
              <p className="text-gray-600">ÁÆ°Á??åÁõ£?ßÂØ©?πÂ∑•‰ΩúÊ?Á®?/p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                ?çÊñ∞ËºâÂÖ•
              </button>
            </div>
          </div>
        </motion.div>

        {/* Áµ±Ë??°Á? */}
        <ApprovalStatsCards instances={approvalInstances} />

        {/* Ê®ôÁ±§?ÅÂ???*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg mb-6"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'pending', label: 'ÂæÖÁ∞Ω??, count: approvalInstances.filter(i => i.overall_status === ApprovalStatus.PENDING || i.overall_status === ApprovalStatus.IN_PROGRESS).length },
                { key: 'all', label: '?®ÈÉ®', count: approvalInstances.length },
                { key: 'history', label: 'Ê≠∑Âè≤Ë®òÈ?', count: approvalInstances.filter(i => i.overall_status === ApprovalStatus.APPROVED || i.overall_status === ApprovalStatus.REJECTED).length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          {/* ÁØ©ÈÅ∏?Ä??*/}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Â∑•‰?ÊµÅÁ?È°ûÂ? */}
              <select
                value={filters.workflow_type}
                onChange={(e) => setFilters({ ...filters, workflow_type: e.target.value })}
                className="glass-select font-chinese"
              >
                <option value="">?Ä?âÈ???/option>
                <option value="purchase_order">?°Ë≥º??/option>
                <option value="refund_request">?ÄÊ¨æÁî≥Ë´?/option>
                <option value="promotion">‰øÉÈä∑Ê¥ªÂ?</option>
              </select>

              {/* ?Ä?ãÁØ©??*/}
              <FilterDropdown
                label="?Ä??
                options={Object.values(ApprovalStatus)}
                selected={filters.status}
                onChange={(status) => setFilters({ ...filters, status })}
              />

              {/* ?™Â?Á¥öÁØ©??*/}
              <FilterDropdown
                label="?™Â?Á¥?
                options={Object.values(TaskPriority)}
                selected={filters.priority}
                onChange={(priority) => setFilters({ ...filters, priority })}
              />
            </div>
          </div>
        </motion.div>

        {/* Á∞ΩÊ†∏ÂØ¶‰??óË°® */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredInstances.map((instance, index) => (
              <ApprovalInstanceCard
                key={instance.id}
                instance={instance}
                workflow={workflows.find(w => w.id === instance.workflow_id)}
                index={index}
                onApprove={(comments) => approveInstance(instance.id, comments)}
                onReject={(comments) => rejectInstance(instance.id, comments)}
                onViewDetails={() => {
                  setSelectedInstance(instance);
                  setShowInstanceModal(true);
                }}
              />
            ))}
          </AnimatePresence>

          {filteredInstances.length === 0 && (
            <div className="text-center py-12 bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ê≤íÊ??æÂà∞Á∞ΩÊ†∏?ÖÁõÆ</h3>
              <p className="text-gray-500">
                {activeTab === 'pending' ? '?ÆÂ?Ê≤íÊ?ÂæÖÁ∞Ω?∏Á??ÖÁõÆ' : 'Ê≤íÊ?Á¨¶Â?ÁØ©ÈÅ∏Ê¢ù‰ª∂?ÑÈ???}
              </p>
            </div>
          )}
        </motion.div>

        {/* Á∞ΩÊ†∏Ë©≥Ê?Ê®°Ê?Ê°?*/}
        <ApprovalDetailModal
          instance={selectedInstance}
          workflow={selectedInstance ? workflows.find(w => w.id === selectedInstance.workflow_id) : null}
          isOpen={showInstanceModal}
          onClose={() => {
            setShowInstanceModal(false);
            setSelectedInstance(null);
          }}
          onApprove={(comments) => {
            approveInstance(selectedInstance.id, comments);
            setShowInstanceModal(false);
            setSelectedInstance(null);
          }}
          onReject={(comments) => {
            rejectInstance(selectedInstance.id, comments);
            setShowInstanceModal(false);
            setSelectedInstance(null);
          }}
        />
    </div>
  );
};

// Á∞ΩÊ†∏Áµ±Ë??°Á??É‰ª∂
const ApprovalStatsCards = ({ instances }) => {
  const stats = {
    total: instances.length,
    pending: instances.filter(i => i.overall_status === ApprovalStatus.PENDING).length,
    approved: instances.filter(i => i.overall_status === ApprovalStatus.APPROVED).length,
    rejected: instances.filter(i => i.overall_status === ApprovalStatus.REJECTED).length,
    overdue: instances.filter(i => 
      i.overall_status === ApprovalStatus.PENDING && 
      i.due_date && 
      new Date(i.due_date) < new Date()
    ).length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-600">Á∏ΩÁî≥Ë´?/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">ÂæÖÁ∞Ω??/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
        <div className="text-sm text-gray-600">Â∑≤Ê†∏??/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        <div className="text-sm text-gray-600">Â∑≤È???/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
        <div className="text-sm text-gray-600">?æÊ?</div>
      </div>
    </div>
  );
};

// Á∞ΩÊ†∏ÂØ¶‰??°Á??É‰ª∂
const ApprovalInstanceCard = ({ instance, workflow, index, onApprove, onReject, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);
  const [showApprovalForm, setShowApprovalForm] = useState(false);

  const isOverdue = instance.due_date && 
    instance.overall_status === ApprovalStatus.PENDING && 
    new Date(instance.due_date) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-white/70 backdrop-blur-md rounded-xl p-6 border shadow-lg ${
        isOverdue ? 'border-red-300 bg-red-50/30' : 'border-white/20'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            {getStatusIcon(instance.overall_status)}
            <h3 className="text-lg font-semibold text-gray-900">
              {workflow?.workflow_name || '?™Áü•Â∑•‰?ÊµÅÁ?'}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(instance.priority)}`}>
              {instance.priority}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                ?æÊ?
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-600">ÂØ¶È?È°ûÂ?</label>
              <p className="text-sm text-gray-900">{instance.entity_type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">?≥Ë???/label>
              <p className="text-sm text-gray-900">?®Êà∂ {instance.submitted_by}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">?ê‰∫§?ÇÈ?</label>
              <p className="text-sm text-gray-900">
                {new Date(instance.submitted_at).toLocaleDateString('zh-TW')}
              </p>
            </div>
          </div>

          {instance.submission_notes && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-600">?≥Ë?Ë™™Ê?</label>
              <p className="text-sm text-gray-900 mt-1">{instance.submission_notes}</p>
            </div>
          )}

          {/* Á∞ΩÊ†∏?≤Â∫¶ */}
          <ApprovalProgress instance={instance} workflow={workflow} />

          {/* ?ÄËøëÁ∞Ω?∏Ê≠∑??*/}
          {instance.approval_history.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">?ÄËøëÊ?‰Ω?/h4>
              <div className="space-y-2">
                {instance.approval_history.slice(-2).map((action, i) => (
                  <div key={i} className="flex items-center text-sm text-gray-600">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      action.action === 'approve' ? 'bg-green-500' :
                      action.action === 'reject' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="font-medium">{action.approver_name}</span>
                    <span className="mx-1">¬∑</span>
                    <span>{action.action === 'approve' ? '?∏Â?' : action.action === 'reject' ? 'ÈßÅÂ?' : '?ïÁ?'}</span>
                    <span className="mx-1">¬∑</span>
                    <span>{new Date(action.decision_date).toLocaleDateString('zh-TW')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ?ç‰??âÈ? */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onViewDetails}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            ?•Á?Ë©≥Ê?
          </button>
          
          {instance.overall_status === ApprovalStatus.PENDING && (
            <>
              <button
                onClick={() => setShowApprovalForm(!showApprovalForm)}
                className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Á∞ΩÊ†∏
              </button>
            </>
          )}
        </div>
      </div>

      {/* Á∞ΩÊ†∏Ë°®ÂñÆ */}
      <AnimatePresence>
        {showApprovalForm && (
          <ApprovalForm
            onApprove={onApprove}
            onReject={onReject}
            onCancel={() => setShowApprovalForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Á∞ΩÊ†∏?≤Â∫¶?É‰ª∂
const ApprovalProgress = ({ instance, workflow }) => {
  if (!workflow || !workflow.approval_steps) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">Á∞ΩÊ†∏?≤Â∫¶</h4>
      <div className="flex items-center space-x-2">
        {workflow.approval_steps.map((step, index) => {
          const isCurrentStep = index + 1 === instance.current_step;
          const isCompleted = index + 1 < instance.current_step;
          const isPending = index + 1 > instance.current_step;

          return (
            <React.Fragment key={index}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                isCompleted ? 'bg-green-500 text-white' :
                isCurrentStep ? 'bg-amber-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? '?? : index + 1}
              </div>
              <div className="flex-1 text-center">
                <div className={`text-xs font-medium ${
                  isCurrentStep ? 'text-amber-600' :
                  isCompleted ? 'text-green-600' :
                  'text-gray-400'
                }`}>
                  {step.step_name}
                </div>
              </div>
              {index < workflow.approval_steps.length - 1 && (
                <ChevronRightIcon className={`h-4 w-4 ${
                  isCompleted ? 'text-green-500' :
                  isCurrentStep ? 'text-amber-500' :
                  'text-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Á∞ΩÊ†∏Ë°®ÂñÆ?É‰ª∂
const ApprovalForm = ({ onApprove, onReject, onCancel }) => {
  const [comments, setComments] = useState('');
  const [action, setAction] = useState('');

  const handleSubmit = (actionType) => {
    if (actionType === 'approve') {
      onApprove(comments);
    } else if (actionType === 'reject') {
      onReject(comments);
    }
    setComments('');
    setAction('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 p-4 bg-gray-50 rounded-lg border"
    >
      <h4 className="text-sm font-medium text-gray-900 mb-3">Á∞ΩÊ†∏?èË?</h4>
      
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Ë´ãËº∏?•Á∞Ω?∏Ê?Ë¶?.."
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-3"
      />
      
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          ?ñÊ?
        </button>
        <button
          onClick={() => handleSubmit('reject')}
          className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          <HandThumbDownIcon className="h-4 w-4 mr-1" />
          ÈßÅÂ?
        </button>
        <button
          onClick={() => handleSubmit('approve')}
          className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          <HandThumbUpIcon className="h-4 w-4 mr-1" />
          ?∏Â?
        </button>
      </div>
    </motion.div>
  );
};

// ÁØ©ÈÅ∏‰∏ãÊ??∏ÂñÆ?É‰ª∂
const FilterDropdown = ({ label, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);

  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 2,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
      >
        <span>{selected.length > 0 ? `${label} (${selected.length})` : label}</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {isOpen && createPortal(
        <div 
          className="glass-dropdown fixed z-[99999]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 99999
          }}
        >
          <div className="max-h-60 overflow-auto">
            {options.map((option) => (
              <label key={option} className="glass-dropdown-option cursor-pointer">
                <div className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...selected, option]);
                      } else {
                        onChange(selected.filter(item => item !== option));
                      }
                    }}
                    className="rounded mr-3"
                  />
                  <span className="text-sm">{option}</span>
                </div>
              </label>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Á∞ΩÊ†∏Ë©≥Ê?Ê®°Ê?Ê°?
const ApprovalDetailModal = ({ instance, workflow, isOpen, onClose, onApprove, onReject }) => {
  const [comments, setComments] = useState('');

  if (!isOpen || !instance) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Á∞ΩÊ†∏Ë©≥Ê?</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Â∑¶ÂÅ¥ - ?∫Êú¨Ë≥áË? */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">?∫Êú¨Ë≥áË?</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Â∑•‰?ÊµÅÁ?</label>
                  <p className="text-sm text-gray-900">{workflow?.workflow_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ÂØ¶È?È°ûÂ?</label>
                  <p className="text-sm text-gray-900">{instance.entity_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ÂØ¶È?ID</label>
                  <p className="text-sm text-gray-900">{instance.entity_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">?≥Ë???/label>
                  <p className="text-sm text-gray-900">?®Êà∂ {instance.submitted_by}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">?ê‰∫§?ÇÈ?</label>
                  <p className="text-sm text-gray-900">
                    {new Date(instance.submitted_at).toLocaleString('zh-TW')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">?Ä??/label>
                  <p className="text-sm text-gray-900 flex items-center">
                    {getStatusIcon(instance.overall_status)}
                    <span className="ml-2">{instance.overall_status}</span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">?™Â?Á¥?/label>
                  <p className="text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(instance.priority)}`}>
                      {instance.priority}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {instance.submission_notes && (
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">?≥Ë?Ë™™Ê?</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {instance.submission_notes}
                </p>
              </div>
            )}
          </div>

          {/* ?≥ÂÅ¥ - Á∞ΩÊ†∏Ê≠∑Âè≤ */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Á∞ΩÊ†∏Ê≠∑Âè≤</h4>
            <div className="space-y-4">
              {instance.approval_history.map((action, index) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        action.action === 'approve' ? 'bg-green-500' :
                        action.action === 'reject' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      <span className="font-medium text-gray-900">{action.approver_name}</span>
                      <span className="text-sm text-gray-500">({action.approver_role})</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(action.decision_date).toLocaleString('zh-TW')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    ?ç‰?: <span className="font-medium">
                      {action.action === 'approve' ? '?∏Â?' :
                       action.action === 'reject' ? 'ÈßÅÂ?' :
                       action.action === 'delegate' ? 'ÂßîÊ¥æ' :
                       action.action === 'request_info' ? 'Ë¶ÅÊ?Ë£úÂ?Ë≥áË?' :
                       '?∂‰?'}
                    </span>
                  </div>
                  {action.comments && (
                    <div className="text-sm text-gray-600 mt-1">
                      ?èË?: {action.comments}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Á∞ΩÊ†∏?ç‰? */}
        {instance.overall_status === ApprovalStatus.PENDING && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Á∞ΩÊ†∏?ç‰?</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Á∞ΩÊ†∏?èË?
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ë´ãËº∏?•Á∞Ω?∏Ê?Ë¶?.."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ?úÈ?
                </button>
                <button
                  onClick={() => onReject(comments)}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <HandThumbDownIcon className="h-4 w-4 mr-2" />
                  ÈßÅÂ?
                </button>
                <button
                  onClick={() => onApprove(comments)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <HandThumbUpIcon className="h-4 w-4 mr-2" />
                  ?∏Â?
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ËºîÂä©?ΩÊï∏
const getStatusIcon = (status) => {
  switch (status) {
    case ApprovalStatus.APPROVED:
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case ApprovalStatus.REJECTED:
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case ApprovalStatus.IN_PROGRESS:
      return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
    case ApprovalStatus.CANCELLED:
      return <StopIcon className="h-5 w-5 text-gray-500" />;
    default:
      return <ClockIcon className="h-5 w-5 text-amber-500" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case TaskPriority.CRITICAL:
      return 'bg-red-100 text-red-800 border-red-200';
    case TaskPriority.URGENT:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case TaskPriority.HIGH:
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case TaskPriority.MEDIUM:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default ApprovalWorkflowManagement;
