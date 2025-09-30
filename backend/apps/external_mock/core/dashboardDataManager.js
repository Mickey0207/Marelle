// Minimal dashboard data manager for workflow and dashboards

export const TaskStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  DONE: 'done',
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical',
};

export const TaskType = {
  BUG: 'bug',
  FEATURE: 'feature',
  TASK: 'task',
};

export const BusinessImpact = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const ApprovalStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

const store = {
  tasks: Array.from({ length: 18 }).map((_, i) => ({
    id: `T-${1000 + i}`,
    title: `任務 ${i + 1}`,
    status: [TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED, TaskStatus.DONE][i % 4],
    priority: [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT, TaskPriority.CRITICAL][i % 5],
    type: [TaskType.TASK, TaskType.FEATURE, TaskType.BUG][i % 3],
    impact: [BusinessImpact.LOW, BusinessImpact.MEDIUM, BusinessImpact.HIGH][i % 3],
    assigned_to: ['Alice', 'Bob', 'Carol'][i % 3],
    due_date: new Date(Date.now() + (i - 6) * 86400000).toISOString(),
    notes: '模擬任務備註',
  })),
  approvals: Array.from({ length: 12 }).map((_, i) => ({
    id: `A-${2000 + i}`,
    entity_type: ['採購單', '退貨申請', '價目表'][i % 3],
    workflow_id: `WF-${1 + (i % 3)}`,
    overall_status: [ApprovalStatus.PENDING, ApprovalStatus.IN_PROGRESS, ApprovalStatus.APPROVED, ApprovalStatus.REJECTED][i % 4],
    priority: [TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT][i % 3],
    submitted_by: ['Alice', 'Bob', 'Carol'][i % 3],
    submitted_at: new Date(Date.now() - i * 3600000).toISOString(),
    due_date: new Date(Date.now() + (i % 5) * 86400000).toISOString(),
    submission_notes: '模擬提交說明',
    approval_history: [],
  })),
};

const dashboardDataManager = {
  // Tasks
  getTasks() {
    return { tasks: [...store.tasks] };
  },
  updateTaskStatus(taskId, newStatus, notes) {
    const t = store.tasks.find(t => t.id === taskId);
    if (t) {
      t.status = newStatus;
      t.notes = notes || t.notes;
    }
    return t;
  },
  assignTask(taskId, assignedTo, priority, dueDate, notes) {
    const t = store.tasks.find(t => t.id === taskId);
    if (t) {
      if (assignedTo) t.assigned_to = assignedTo;
      if (priority) t.priority = priority;
      if (dueDate) t.due_date = dueDate;
      if (notes) t.notes = notes;
    }
    return t;
  },

  // Approvals
  approvalWorkflows: [
    { id: 'WF-1', workflow_name: '採購單審批', entity_type: '採購單' },
    { id: 'WF-2', workflow_name: '退貨申請審批', entity_type: '退貨申請' },
    { id: 'WF-3', workflow_name: '價目表變更審批', entity_type: '價目表' },
  ],
  getApprovalInstances() {
    return { instances: [...store.approvals] };
  },

  // Real-time / Ops metrics for dashboard
  getOperationalMetrics() {
    return {
      systemHealth: { cpu: 32, mem: 58, errors: 0 },
      orders: { today: 124, pending: 18, cancelled: 3 },
      logistics: { shipping: 45, delivered: 320, exceptions: 2 },
    };
  },
};

export default dashboardDataManager;
