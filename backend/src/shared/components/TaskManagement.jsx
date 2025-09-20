import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import dashboardDataManager, { TaskStatus, TaskPriority, TaskType, BusinessImpact } from '../data/dashboardDataManager';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  
  // ÁØ©ÈÅ∏?åÊ?Â∞ãÁ???
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    task_type: [],
    assigned_to: null,
    search: ''
  });
  
  // ?íÂ??Ä??
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // ?ÜÈ??Ä??
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filters, sortBy, sortOrder]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = dashboardDataManager.getTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    // ?úÂ?ÁØ©ÈÅ∏
    if (filters.search) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // ?Ä?ãÁØ©??
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }

    // ?™Â?Á¥öÁØ©??
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    // ‰ªªÂ?È°ûÂ?ÁØ©ÈÅ∏
    if (filters.task_type.length > 0) {
      filtered = filtered.filter(task => filters.task_type.includes(task.task_type));
    }

    // ?áÊ¥æ?ÖÁØ©??
    if (filters.assigned_to) {
      filtered = filtered.filter(task => task.assigned_to === filters.assigned_to);
    }

    // ?íÂ?
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'due_date' || sortBy === 'created_at') {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTasks(filtered);
    setCurrentPage(1);
  };

  const updateTaskStatus = async (taskId, newStatus, notes = null) => {
    try {
      const updatedTask = dashboardDataManager.updateTaskStatus(taskId, newStatus, notes);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const assignTask = async (taskId, assignedTo, priority = null, dueDate = null, notes = null) => {
    try {
      const updatedTask = dashboardDataManager.assignTask(taskId, assignedTo, priority, dueDate, notes);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === taskId ? updatedTask : task
        ));
        setShowAssignModal(false);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
    }
  };

  const handleBulkAction = async (action) => {
    const taskIds = Array.from(selectedTasks);
    
    switch (action) {
      case 'complete':
        for (const taskId of taskIds) {
          await updateTaskStatus(taskId, TaskStatus.COMPLETED);
        }
        break;
      case 'cancel':
        for (const taskId of taskIds) {
          await updateTaskStatus(taskId, TaskStatus.CANCELLED);
        }
        break;
      default:
        break;
    }
    
    setSelectedTasks(new Set());
  };

  const toggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case TaskStatus.IN_PROGRESS:
        return <ArrowPathIcon className="h-5 w-5 text-blue-500" />;
      case TaskStatus.OVERDUE:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case TaskStatus.CANCELLED:
        return <XCircleIcon className="h-5 w-5 text-gray-500" />;
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

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (task) => {
    if (!task.due_date || task.status === TaskStatus.COMPLETED) return false;
    return new Date(task.due_date) < new Date();
  };

  // ?ÜÈ?Ë®àÁ?
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">‰ªªÂ?ÁÆ°Á?</h1>
              <p className="text-gray-600">ÁÆ°Á??åËøΩËπ§Á≥ªÁµ±‰ªª?ôÂ?Â∑•‰??ÖÁõÆ</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadTasks}
                className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                ?çÊñ∞ËºâÂÖ•
              </button>
            </div>
          </div>
        </motion.div>

        {/* ÁØ©ÈÅ∏?åÊ?Â∞ãÂ???*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* ?Ä?ãÁØ©??*/}
            <FilterDropdown
              label="?Ä??
              options={Object.values(TaskStatus)}
              selected={filters.status}
              onChange={(status) => setFilters({ ...filters, status })}
              getLabel={(status) => status.replace('_', ' ')}
            />

            {/* ?™Â?Á¥öÁØ©??*/}
            <FilterDropdown
              label="?™Â?Á¥?
              options={Object.values(TaskPriority)}
              selected={filters.priority}
              onChange={(priority) => setFilters({ ...filters, priority })}
              getLabel={(priority) => priority}
            />

            {/* ‰ªªÂ?È°ûÂ?ÁØ©ÈÅ∏ */}
            <FilterDropdown
              label="‰ªªÂ?È°ûÂ?"
              options={Object.values(TaskType)}
              selected={filters.task_type}
              onChange={(task_type) => setFilters({ ...filters, task_type })}
              getLabel={(type) => type.replace('_', ' ')}
            />
          </div>

          {/* ?πÈ??ç‰? */}
          {selectedTasks.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <span className="text-sm text-blue-800">
                Â∑≤ÈÅ∏??{selectedTasks.size} ?ã‰ªª??
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkAction('complete')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Ê®ôË?ÂÆåÊ?
                </button>
                <button
                  onClick={() => handleBulkAction('cancel')}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  ?ñÊ?‰ªªÂ?
                </button>
                <button
                  onClick={() => setSelectedTasks(new Set())}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Ê∏ÖÈô§?∏Ê?
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ‰ªªÂ?Áµ±Ë? */}
        <TaskSummaryStats tasks={filteredTasks} />

        {/* ‰ªªÂ??óË°® */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden"
        >
          {/* Ë°®Ê†ºÊ®ôÈ? */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                ‰ªªÂ??óË°® ({filteredTasks.length})
              </h3>
              <div className="flex items-center space-x-4">
                <SortDropdown 
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={(field, order) => {
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Ë°®Ê†º?ßÂÆπ */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedTasks.size === currentTasks.length && currentTasks.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTasks(new Set(currentTasks.map(t => t.id)));
                        } else {
                          setSelectedTasks(new Set());
                        }
                      }}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ‰ªªÂ?
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ?Ä??
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ?™Â?Á¥?
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ?áÊ¥æ??
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ?∞Ê???
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ?ç‰?
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/30 divide-y divide-gray-200">
                <AnimatePresence>
                  {currentTasks.map((task, index) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      index={index}
                      isSelected={selectedTasks.has(task.id)}
                      onToggleSelect={() => toggleTaskSelection(task.id)}
                      onStatusChange={(status, notes) => updateTaskStatus(task.id, status, notes)}
                      onAssign={() => {
                        setSelectedTask(task);
                        setShowAssignModal(true);
                      }}
                      onViewDetails={() => {
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* ?ÜÈ? */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </motion.div>

        {/* ‰ªªÂ?Ë©≥Ê?Ê®°Ê?Ê°?*/}
        <TaskDetailModal
          task={selectedTask}
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onStatusChange={(status, notes) => {
            updateTaskStatus(selectedTask.id, status, notes);
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />

        {/* ‰ªªÂ??áÊ¥æÊ®°Ê?Ê°?*/}
        <AssignTaskModal
          task={selectedTask}
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedTask(null);
          }}
          onAssign={assignTask}
        />
    </div>
  );
};

// ‰ªªÂ?Áµ±Ë??É‰ª∂
const TaskSummaryStats = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    overdue: tasks.filter(t => t.status !== TaskStatus.COMPLETED && t.due_date && new Date(t.due_date) < new Date()).length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        <div className="text-sm text-gray-600">Á∏Ω‰ªª??/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
        <div className="text-sm text-gray-600">ÂæÖË???/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
        <div className="text-sm text-gray-600">?≤Ë?‰∏?/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-gray-600">Â∑≤Â???/div>
      </div>
      <div className="bg-white/70 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg">
        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        <div className="text-sm text-gray-600">?æÊ?</div>
      </div>
    </div>
  );
};

// ‰ªªÂ?Ë°åÂ?‰ª?
const TaskRow = ({ task, index, isSelected, onToggleSelect, onStatusChange, onAssign, onViewDetails }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`hover:bg-gray-50/50 ${isSelected ? 'bg-blue-50/50' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          className="rounded"
          checked={isSelected}
          onChange={onToggleSelect}
        />
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-start space-x-3">
          {task.status && (
            <div className="mt-1">
              {task.status === TaskStatus.COMPLETED ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : task.status === TaskStatus.IN_PROGRESS ? (
                <ArrowPathIcon className="h-5 w-5 text-blue-500" />
              ) : task.due_date && new Date(task.due_date) < new Date() ? (
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              ) : (
                <ClockIcon className="h-5 w-5 text-amber-500" />
              )}
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{task.title}</div>
            <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                {task.task_type?.replace('_', ' ')}
              </span>
              {task.business_impact && (
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  task.business_impact === BusinessImpact.CRITICAL ? 'bg-red-100 text-red-800' :
                  task.business_impact === BusinessImpact.HIGH ? 'bg-orange-100 text-orange-800' :
                  task.business_impact === BusinessImpact.MEDIUM ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.business_impact}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
          task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
          task.status === TaskStatus.CANCELLED ? 'bg-gray-100 text-gray-800' :
          task.due_date && new Date(task.due_date) < new Date() ? 'bg-red-100 text-red-800' :
          'bg-amber-100 text-amber-800'
        }`}>
          {task.status?.replace('_', ' ')}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
          task.priority === TaskPriority.CRITICAL ? 'bg-red-100 text-red-800 border-red-200' :
          task.priority === TaskPriority.URGENT ? 'bg-orange-100 text-orange-800 border-orange-200' :
          task.priority === TaskPriority.HIGH ? 'bg-amber-100 text-amber-800 border-amber-200' :
          task.priority === TaskPriority.MEDIUM ? 'bg-blue-100 text-blue-800 border-blue-200' :
          'bg-gray-100 text-gray-800 border-gray-200'
        }`}>
          {task.priority}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">
            {task.assigned_to ? `?®Êà∂ ${task.assigned_to}` : '?™Ê?Ê¥?}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className={`text-sm ${
            task.due_date && new Date(task.due_date) < new Date() && task.status !== TaskStatus.COMPLETED
              ? 'text-red-600 font-medium' 
              : 'text-gray-900'
          }`}>
            {task.due_date ? new Date(task.due_date).toLocaleDateString('zh-TW') : '-'}
          </span>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-gray-400 hover:text-gray-600"
          >
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onViewDetails();
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  ?•Á?Ë©≥Ê?
                </button>
                <button
                  onClick={() => {
                    onAssign();
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  ?çÊñ∞?áÊ¥æ
                </button>
                {task.status !== TaskStatus.COMPLETED && (
                  <button
                    onClick={() => {
                      onStatusChange(TaskStatus.COMPLETED);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                  >
                    Ê®ôË?ÂÆåÊ?
                  </button>
                )}
                {task.status === TaskStatus.PENDING && (
                  <button
                    onClick={() => {
                      onStatusChange(TaskStatus.IN_PROGRESS);
                      setShowActions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                  >
                    ?ãÂ??∑Ë?
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};

// ÁØ©ÈÅ∏‰∏ãÊ??∏ÂñÆ?É‰ª∂
const FilterDropdown = ({ label, options, selected, onChange, getLabel }) => {
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
                  <span className="text-sm">
                    {getLabel ? getLabel(option) : option}
                  </span>
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

// ?íÂ?‰∏ãÊ??∏ÂñÆ?É‰ª∂
const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { field: 'due_date', label: '?∞Ê??? },
    { field: 'created_at', label: 'Âª∫Á??•Ê?' },
    { field: 'priority', label: '?™Â?Á¥? },
    { field: 'status', label: '?Ä?? }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
      >
        <FunnelIcon className="h-4 w-4 mr-1" />
        ?íÂ?
        <ChevronDownIcon className="h-4 w-4 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-40 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-1">
            {sortOptions.map((option) => (
              <button
                key={option.field}
                onClick={() => {
                  if (sortBy === option.field) {
                    onSortChange(option.field, sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    onSortChange(option.field, 'asc');
                  }
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 ${
                  sortBy === option.field ? 'bg-amber-50 text-amber-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {sortBy === option.field && (
                    <span className="text-xs">
                      {sortOrder === 'asc' ? '?? : '??}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ?ÜÈ??É‰ª∂
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        È°ØÁ§∫Á¨?{((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, totalPages * 10)} ??
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‰∏ä‰???
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm border rounded ${
              currentPage === page
                ? 'bg-amber-600 text-white border-amber-600'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ‰∏ã‰???
        </button>
      </div>
    </div>
  );
};

// ‰ªªÂ?Ë©≥Ê?Ê®°Ê?Ê°ÜÂ?‰ª?
const TaskDetailModal = ({ task, isOpen, onClose, onStatusChange }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">‰ªªÂ?Ë©≥Ê?</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h4>
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">?Ä??/label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === TaskStatus.COMPLETED ? 'bg-green-100 text-green-800' :
                  task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {task.status?.replace('_', ' ')}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">?™Â?Á¥?/label>
              <p className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === TaskPriority.CRITICAL ? 'bg-red-100 text-red-800' :
                  task.priority === TaskPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {task.priority}
                </span>
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">‰ªªÂ?È°ûÂ?</label>
              <p className="mt-1 text-gray-900">{task.task_type?.replace('_', ' ')}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Ê•≠Â?ÂΩ±Èüø</label>
              <p className="mt-1 text-gray-900">{task.business_impact}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Âª∫Á??•Ê?</label>
              <p className="mt-1 text-gray-900">
                {new Date(task.created_at).toLocaleDateString('zh-TW')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">?∞Ê???/label>
              <p className="mt-1 text-gray-900">
                {task.due_date ? new Date(task.due_date).toLocaleDateString('zh-TW') : '-'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ?úÈ?
            </button>
            {task.status !== TaskStatus.COMPLETED && (
              <button
                onClick={() => onStatusChange(TaskStatus.COMPLETED)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ê®ôË?ÂÆåÊ?
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ‰ªªÂ??áÊ¥æÊ®°Ê?Ê°ÜÂ?‰ª?
const AssignTaskModal = ({ task, isOpen, onClose, onAssign }) => {
  const [assignData, setAssignData] = useState({
    assigned_to: '',
    priority: '',
    due_date: '',
    notes: ''
  });

  useEffect(() => {
    if (task) {
      setAssignData({
        assigned_to: task.assigned_to || '',
        priority: task.priority || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        notes: ''
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(
      task.id,
      parseInt(assignData.assigned_to),
      assignData.priority,
      assignData.due_date ? new Date(assignData.due_date) : null,
      assignData.notes || null
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">?áÊ¥æ‰ªªÂ?</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ?áÊ¥æÁµ?
            </label>
            <select
              value={assignData.assigned_to}
              onChange={(e) => setAssignData({ ...assignData, assigned_to: e.target.value })}
              className="glass-select w-full font-chinese"
              required
            >
              <option value="">?∏Ê??®Êà∂</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  ?®Êà∂ {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ?™Â?Á¥?
            </label>
            <select
              value={assignData.priority}
              onChange={(e) => setAssignData({ ...assignData, priority: e.target.value })}
              className="glass-select w-full font-chinese"
            >
              <option value="">?∏Ê??™Â?Á¥?/option>
              {Object.values(TaskPriority).map(priority => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ?∞Ê???
            </label>
            <input
              type="date"
              value={assignData.due_date}
              onChange={(e) => setAssignData({ ...assignData, due_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ?ôË®ª
            </label>
            <textarea
              value={assignData.notes}
              onChange={(e) => setAssignData({ ...assignData, notes: e.target.value })}
              placeholder="?∞Â??ôË®ª..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ?ñÊ?
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              ?áÊ¥æ‰ªªÂ?
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskManagement;
