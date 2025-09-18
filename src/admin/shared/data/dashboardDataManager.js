// 儀表板管理系統資料管理器
// Dashboard Management System Data Manager

// ==================== 列舉定義 ====================

export const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress', 
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  OVERDUE: 'overdue'
};

export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium', 
  HIGH: 'high',
  URGENT: 'urgent',
  CRITICAL: 'critical'
};

export const TaskType = {
  // 庫存管理
  INVENTORY_RESTOCK: 'inventory_restock',
  INVENTORY_AUDIT: 'inventory_audit',
  LOW_STOCK_ALERT: 'low_stock_alert',
  
  // 訂單處理
  ORDER_PROCESSING: 'order_processing',
  ORDER_REVIEW: 'order_review',
  REFUND_PROCESSING: 'refund_processing',
  
  // 客服管理
  CUSTOMER_INQUIRY: 'customer_inquiry',
  COMPLAINT_HANDLING: 'complaint_handling',
  QUALITY_ASSURANCE: 'quality_assurance',
  
  // 財務管理
  PAYMENT_VERIFICATION: 'payment_verification',
  INVOICE_PROCESSING: 'invoice_processing',
  FINANCIAL_REVIEW: 'financial_review',
  
  // 行銷管理
  PROMOTION_REVIEW: 'promotion_review',
  CONTENT_APPROVAL: 'content_approval',
  CAMPAIGN_SETUP: 'campaign_setup',
  
  // 供應商管理
  SUPPLIER_EVALUATION: 'supplier_evaluation',
  PURCHASE_ORDER_REVIEW: 'purchase_order_review',
  VENDOR_COMMUNICATION: 'vendor_communication',
  
  // 系統維護
  SYSTEM_MAINTENANCE: 'system_maintenance',
  DATA_BACKUP: 'data_backup',
  SECURITY_REVIEW: 'security_review'
};

export const BusinessImpact = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high', 
  CRITICAL: 'critical'
};

export const ApprovalStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// ==================== 模擬資料生成 ====================

class DashboardDataManager {
  constructor() {
    this.tasks = this.generateTasks();
    this.approvalWorkflows = this.generateApprovalWorkflows();
    this.approvalInstances = this.generateApprovalInstances();
    this.operationalMetrics = this.generateOperationalMetrics();
    this.alerts = this.generateAlerts();
    this.reminders = this.generateReminders();
    this.users = this.generateUsers();
    
    // 初始化實時更新
    this.initializeRealTimeUpdates();
  }

  // ==================== 任務管理 ====================

  generateTasks() {
    const tasks = [];
    const taskTypes = Object.values(TaskType);
    const statuses = Object.values(TaskStatus);
    const priorities = Object.values(TaskPriority);
    const impacts = Object.values(BusinessImpact);

    for (let i = 1; i <= 150; i++) {
      const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const dueDate = new Date(createdDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      tasks.push({
        id: i,
        title: this.generateTaskTitle(taskTypes[Math.floor(Math.random() * taskTypes.length)]),
        description: this.generateTaskDescription(),
        task_type: taskTypes[Math.floor(Math.random() * taskTypes.length)],
        status: status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        business_impact: impacts[Math.floor(Math.random() * impacts.length)],
        
        // 分配資訊
        assigned_to: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : null,
        created_by: Math.floor(Math.random() * 10) + 1,
        
        // 時間資訊
        created_at: createdDate,
        due_date: dueDate,
        started_at: status !== TaskStatus.PENDING ? 
          new Date(createdDate.getTime() + Math.random() * 24 * 60 * 60 * 1000) : null,
        completed_at: status === TaskStatus.COMPLETED ? 
          new Date(dueDate.getTime() - Math.random() * 48 * 60 * 60 * 1000) : null,
        
        // 估算資訊
        estimated_hours: Math.floor(Math.random() * 40) + 1,
        actual_hours: status === TaskStatus.COMPLETED ? 
          Math.floor(Math.random() * 35) + 1 : null,
        
        // 關聯資訊
        related_entity_type: this.getRelatedEntityType(),
        related_entity_id: Math.floor(Math.random() * 1000) + 1,
        
        // 操作記錄
        notes: [],
        attachments: [],
        
        // 自動化資訊
        auto_generated: Math.random() > 0.7,
        generation_rule_id: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : null,
        
        updated_at: new Date()
      });
    }

    return tasks;
  }

  generateTaskTitle(taskType) {
    const titles = {
      [TaskType.INVENTORY_RESTOCK]: ['補充香水庫存', '補充面霜庫存', '補充口紅庫存', '補充精華液庫存'],
      [TaskType.INVENTORY_AUDIT]: ['Q1庫存盤點', '月度庫存檢查', '年度庫存審計', '不定期庫存抽查'],
      [TaskType.LOW_STOCK_ALERT]: ['香奈兒香水庫存不足', 'SK-II面霜庫存預警', '雅詩蘭黛精華庫存警報'],
      [TaskType.ORDER_PROCESSING]: ['處理訂單 #12345', '處理大宗訂單 #67890', '處理VIP客戶訂單'],
      [TaskType.ORDER_REVIEW]: ['審核高額訂單', '審核異常訂單', '審核退換貨申請'],
      [TaskType.REFUND_PROCESSING]: ['處理退款申請', '處理產品瑕疵退款', '處理運送問題退款'],
      [TaskType.CUSTOMER_INQUIRY]: ['客戶產品諮詢', '客戶配送查詢', '客戶帳戶問題'],
      [TaskType.COMPLAINT_HANDLING]: ['處理產品投訴', '處理服務投訴', '處理配送投訴'],
      [TaskType.QUALITY_ASSURANCE]: ['品質檢查報告', '供應商品質評估', '客戶滿意度調查'],
      [TaskType.PAYMENT_VERIFICATION]: ['驗證大額付款', '驗證信用卡交易', '驗證銀行轉帳'],
      [TaskType.INVOICE_PROCESSING]: ['處理供應商發票', '處理月度帳單', '處理退款發票'],
      [TaskType.FINANCIAL_REVIEW]: ['月度財務審核', '季度損益審查', '年度預算檢討'],
      [TaskType.PROMOTION_REVIEW]: ['審核週年慶活動', '審核新品促銷', '審核會員優惠'],
      [TaskType.CONTENT_APPROVAL]: ['審核產品文案', '審核行銷素材', '審核網站內容'],
      [TaskType.CAMPAIGN_SETUP]: ['設定聖誕節活動', '設定母親節促銷', '設定夏季特賣'],
      [TaskType.SUPPLIER_EVALUATION]: ['評估新供應商', '年度供應商考核', '供應商績效檢討'],
      [TaskType.PURCHASE_ORDER_REVIEW]: ['審核採購單', '審核大宗採購', '審核緊急採購'],
      [TaskType.VENDOR_COMMUNICATION]: ['與供應商溝通交期', '協調產品規格', '討論價格調整'],
      [TaskType.SYSTEM_MAINTENANCE]: ['系統安全更新', '資料庫維護', '伺服器效能優化'],
      [TaskType.DATA_BACKUP]: ['每日資料備份', '週度完整備份', '災難復原測試'],
      [TaskType.SECURITY_REVIEW]: ['安全漏洞檢查', '存取權限審核', '防火牆規則更新']
    };
    
    const typeArray = titles[taskType] || ['一般任務'];
    return typeArray[Math.floor(Math.random() * typeArray.length)];
  }

  generateTaskDescription() {
    const descriptions = [
      '需要在指定時間內完成此項目，請注意相關細節和要求。',
      '此任務涉及多個部門協調，請確保溝通順暢。',
      '重要客戶相關事項，請優先處理並保持高品質服務。',
      '定期例行作業，請按照標準作業程序執行。',
      '緊急事項，需要立即關注和處理。',
      '季度重點項目，關係到部門KPI達成。',
      '新流程試行，請詳細記錄執行過程和結果。',
      '客戶滿意度相關，請確保服務品質。'
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  getRelatedEntityType() {
    const types = ['product', 'order', 'customer', 'supplier', 'promotion', 'invoice'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // ==================== 簽核流程管理 ====================

  generateApprovalWorkflows() {
    return [
      {
        id: 1,
        workflow_name: '採購單簽核流程',
        module: 'procurement',
        entity_type: 'purchase_order',
        description: '所有採購單都需要經過此簽核流程',
        trigger_conditions: [
          { field: 'total_amount', operator: '>', value: 10000 }
        ],
        approval_steps: [
          {
            step_order: 1,
            step_name: '部門主管簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'department_manager' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 24,
            allow_delegation: true,
            require_comments: false,
            attachment_required: false
          },
          {
            step_order: 2,
            step_name: '財務主管簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'finance_manager' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 48,
            skip_conditions: [
              { field: 'total_amount', operator: '<', value: 50000 }
            ],
            allow_delegation: true,
            require_comments: true,
            attachment_required: false
          },
          {
            step_order: 3,
            step_name: '總經理簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'general_manager' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 72,
            skip_conditions: [
              { field: 'total_amount', operator: '<', value: 100000 }
            ],
            allow_delegation: false,
            require_comments: true,
            attachment_required: false
          }
        ],
        notification_settings: {
          notify_on_submit: true,
          notify_on_approve: true,
          notify_on_reject: true,
          reminder_frequency_hours: 12,
          escalation_after_hours: 48
        },
        is_active: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date()
      },
      {
        id: 2,
        workflow_name: '退款簽核流程',
        module: 'orders',
        entity_type: 'refund_request',
        description: '客戶退款申請簽核流程',
        trigger_conditions: [
          { field: 'refund_amount', operator: '>', value: 5000 }
        ],
        approval_steps: [
          {
            step_order: 1,
            step_name: '客服主管簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'customer_service_manager' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 8,
            allow_delegation: true,
            require_comments: true,
            attachment_required: false
          }
        ],
        notification_settings: {
          notify_on_submit: true,
          notify_on_approve: true,
          notify_on_reject: true,
          reminder_frequency_hours: 4,
          escalation_after_hours: 12
        },
        is_active: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date()
      },
      {
        id: 3,
        workflow_name: '促銷活動簽核流程',
        module: 'marketing',
        entity_type: 'promotion',
        description: '行銷促銷活動審核流程',
        trigger_conditions: [
          { field: 'discount_percentage', operator: '>', value: 30 }
        ],
        approval_steps: [
          {
            step_order: 1,
            step_name: '行銷主管簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'marketing_manager' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 24,
            allow_delegation: true,
            require_comments: false,
            attachment_required: true
          },
          {
            step_order: 2,
            step_name: '業務總監簽核',
            step_type: 'role_based',
            approvers: [{ approver_type: 'role', role_name: 'sales_director' }],
            approval_logic: 'any_one',
            required_approvals: 1,
            sla_hours: 48,
            allow_delegation: false,
            require_comments: true,
            attachment_required: false
          }
        ],
        notification_settings: {
          notify_on_submit: true,
          notify_on_approve: true,
          notify_on_reject: true,
          reminder_frequency_hours: 8,
          escalation_after_hours: 24
        },
        is_active: true,
        created_at: new Date('2024-01-01'),
        updated_at: new Date()
      }
    ];
  }

  generateApprovalInstances() {
    const instances = [];
    const workflows = this.approvalWorkflows;
    const statuses = Object.values(ApprovalStatus);

    for (let i = 1; i <= 50; i++) {
      const workflow = workflows[Math.floor(Math.random() * workflows.length)];
      const submittedDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      instances.push({
        id: i,
        workflow_id: workflow.id,
        entity_type: workflow.entity_type,
        entity_id: Math.floor(Math.random() * 1000) + 1,
        
        // 申請資訊
        submitted_by: Math.floor(Math.random() * 10) + 1,
        submitted_at: submittedDate,
        submission_notes: this.generateSubmissionNotes(workflow.entity_type),
        
        // 流程狀態
        current_step: Math.floor(Math.random() * workflow.approval_steps.length) + 1,
        overall_status: status,
        
        // 簽核記錄
        approval_history: this.generateApprovalHistory(i, workflow),
        
        // 時間追蹤
        due_date: new Date(submittedDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        completed_at: status === ApprovalStatus.APPROVED || status === ApprovalStatus.REJECTED ? 
          new Date(submittedDate.getTime() + Math.random() * 72 * 60 * 60 * 1000) : null,
        total_processing_time: status === ApprovalStatus.APPROVED || status === ApprovalStatus.REJECTED ? 
          Math.floor(Math.random() * 4320) + 60 : null, // 1-72小時
        
        // 附加資訊
        priority: Object.values(TaskPriority)[Math.floor(Math.random() * Object.values(TaskPriority).length)],
        business_impact: Object.values(BusinessImpact)[Math.floor(Math.random() * Object.values(BusinessImpact).length)],
        risk_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        
        created_at: submittedDate,
        updated_at: new Date()
      });
    }

    return instances;
  }

  generateSubmissionNotes(entityType) {
    const notes = {
      purchase_order: ['緊急採購需求', '季度例行採購', '新品上市採購', '庫存補充採購'],
      refund_request: ['產品品質問題', '配送延遲', '客戶不滿意', '尺寸不合適'],
      promotion: ['季節性促銷', '清庫存活動', '新客戶優惠', '會員專屬優惠']
    };
    
    const typeArray = notes[entityType] || ['一般申請'];
    return typeArray[Math.floor(Math.random() * typeArray.length)];
  }

  generateApprovalHistory(instanceId, workflow) {
    const history = [];
    const actions = ['approve', 'reject', 'request_info', 'delegate'];
    
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      history.push({
        id: instanceId * 10 + i,
        approval_instance_id: instanceId,
        step_number: i + 1,
        
        // 簽核者資訊
        approver_id: Math.floor(Math.random() * 10) + 1,
        approver_name: this.generateUserName(),
        approver_role: workflow.approval_steps[i]?.approvers[0]?.role_name || 'manager',
        
        // 簽核結果
        action: actions[Math.floor(Math.random() * actions.length)],
        decision_date: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
        comments: this.generateApprovalComments(),
        attachments: [],
        
        // 處理時間
        processing_time_minutes: Math.floor(Math.random() * 480) + 15, // 15分鐘到8小時
        
        created_at: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000)
      });
    }
    
    return history;
  }

  generateUserName() {
    const names = ['王小明', '李美麗', '張志偉', '陳淑芬', '林大維', '黃怡君', '吳建國', '蔡雅婷', '劉志強', '鄭美玲'];
    return names[Math.floor(Math.random() * names.length)];
  }

  generateApprovalComments() {
    const comments = [
      '同意此申請，請按流程進行',
      '金額合理，核准執行',
      '需要補充更多資訊',
      '建議降低預算後重新申請',
      '緊急需求，加速處理',
      '符合公司政策，准予執行',
      '需要主管進一步確認',
      '條件符合，同意核准'
    ];
    
    return comments[Math.floor(Math.random() * comments.length)];
  }

  // ==================== 營運指標監控 ====================

  generateOperationalMetrics() {
    const now = new Date();
    
    return {
      real_time_metrics: {
        current_timestamp: now,
        
        // 訂單相關
        orders_today: {
          total_orders: Math.floor(Math.random() * 150) + 50,
          pending_orders: Math.floor(Math.random() * 20) + 5,
          processing_orders: Math.floor(Math.random() * 30) + 10,
          shipped_orders: Math.floor(Math.random() * 80) + 20,
          revenue_today: Math.floor(Math.random() * 500000) + 100000,
          avg_order_value: Math.floor(Math.random() * 3000) + 1000
        },
        
        // 庫存相關
        inventory_alerts: {
          low_stock_items: Math.floor(Math.random() * 15) + 3,
          out_of_stock_items: Math.floor(Math.random() * 5) + 1,
          overstock_items: Math.floor(Math.random() * 8) + 2,
          total_inventory_value: Math.floor(Math.random() * 5000000) + 2000000
        },
        
        // 客服相關
        customer_service: {
          open_tickets: Math.floor(Math.random() * 25) + 10,
          overdue_tickets: Math.floor(Math.random() * 5) + 1,
          avg_response_time_minutes: Math.floor(Math.random() * 120) + 30,
          customer_satisfaction_today: (Math.random() * 1 + 4).toFixed(1)
        },
        
        // 網站表現
        website_performance: {
          current_visitors: Math.floor(Math.random() * 500) + 100,
          conversion_rate_today: (Math.random() * 3 + 2).toFixed(2),
          bounce_rate_today: (Math.random() * 20 + 30).toFixed(2),
          page_load_time_avg: (Math.random() * 2 + 1).toFixed(2),
          uptime_percentage: (Math.random() * 1 + 99).toFixed(2)
        },
        
        // 財務相關
        financial_summary: {
          revenue_today: Math.floor(Math.random() * 500000) + 100000,
          profit_today: Math.floor(Math.random() * 150000) + 30000,
          outstanding_payments: Math.floor(Math.random() * 200000) + 50000,
          overdue_invoices: Math.floor(Math.random() * 10) + 2,
          cash_flow_status: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)]
        }
      },
      
      operational_efficiency: {
        // 處理效率
        processing_efficiency: {
          orders_processed_per_hour: Math.floor(Math.random() * 20) + 10,
          avg_order_processing_time_minutes: Math.floor(Math.random() * 30) + 15,
          orders_requiring_manual_review_percentage: (Math.random() * 10 + 5).toFixed(1),
          automatic_processing_rate: (Math.random() * 20 + 75).toFixed(1)
        },
        
        // 庫存效率
        inventory_efficiency: {
          inventory_turnover_rate: (Math.random() * 3 + 4).toFixed(1),
          stockout_rate_percentage: (Math.random() * 3 + 1).toFixed(1),
          excess_inventory_percentage: (Math.random() * 5 + 2).toFixed(1),
          inventory_accuracy_rate: (Math.random() * 2 + 98).toFixed(1)
        },
        
        // 客服效率
        service_efficiency: {
          first_contact_resolution_rate: (Math.random() * 15 + 80).toFixed(1),
          avg_ticket_resolution_time_hours: (Math.random() * 12 + 4).toFixed(1),
          agent_utilization_rate: (Math.random() * 15 + 80).toFixed(1),
          customer_effort_score: (Math.random() * 1 + 4).toFixed(1)
        },
        
        // 供應鏈效率
        supply_chain_efficiency: {
          supplier_on_time_delivery_rate: (Math.random() * 10 + 90).toFixed(1),
          procurement_cycle_time_days: Math.floor(Math.random() * 5) + 7,
          supplier_defect_rate: (Math.random() * 2 + 0.5).toFixed(2),
          inventory_receiving_accuracy: (Math.random() * 2 + 98).toFixed(1)
        }
      },
      
      anomaly_monitoring: {
        active_anomalies: this.generateActiveAnomalies(),
        
        system_health: {
          database_response_time: Math.floor(Math.random() * 100) + 50,
          api_response_time: Math.floor(Math.random() * 200) + 100,
          error_rate_percentage: (Math.random() * 1 + 0.1).toFixed(2),
          queue_processing_status: ['healthy', 'warning', 'critical'][Math.floor(Math.random() * 3)]
        },
        
        business_health: {
          conversion_rate_status: ['normal', 'below_average', 'concerning'][Math.floor(Math.random() * 3)],
          customer_satisfaction_trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
          inventory_health_score: Math.floor(Math.random() * 20) + 80,
          financial_health_score: Math.floor(Math.random() * 15) + 85
        }
      },
      
      alert_system: {
        critical_alerts: this.generateCriticalAlerts(),
        trending_issues: this.generateTrendingIssues()
      }
    };
  }

  generateActiveAnomalies() {
    const anomalies = [];
    const metrics = ['訂單轉換率', '庫存週轉率', '客戶回應時間', '系統錯誤率', '網站載入速度'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['open', 'investigating', 'resolved'];
    
    for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
      anomalies.push({
        anomaly_id: i + 1,
        metric_name: metrics[Math.floor(Math.random() * metrics.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        detected_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        description: '偵測到指標異常波動，建議進行進一步調查',
        recommended_action: '檢查相關系統狀態並分析根本原因',
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    
    return anomalies;
  }

  generateCriticalAlerts() {
    const alerts = [];
    const alertTypes = ['庫存不足', '系統異常', '訂單積壓', '客戶投訴', '財務異常'];
    const priorities = Object.values(TaskPriority);
    
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      alerts.push({
        alert_id: i + 1,
        alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        message: '系統偵測到需要立即關注的狀況',
        affected_area: '營運管理',
        estimated_impact: '可能影響客戶體驗和營收',
        suggested_actions: ['立即檢查相關數據', '聯繫相關負責人', '啟動緊急應變程序'],
        created_at: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
        acknowledged_by: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : null,
        resolved_at: Math.random() > 0.7 ? new Date() : null
      });
    }
    
    return alerts;
  }

  generateAlerts() {
    return {
      critical: this.generateCriticalAlerts(),
      anomalies: this.generateActiveAnomalies(),
      trending_issues: this.generateTrendingIssues()
    };
  }

  generateTrendingIssues() {
    const issues = [];
    const patterns = ['配送延遲增加', '退款申請上升', '客服回應時間延長', '庫存週轉下降', '轉換率波動'];
    const trends = ['increasing', 'stable', 'decreasing'];
    const risks = ['low', 'medium', 'high'];
    
    for (let i = 0; i < Math.floor(Math.random() * 4) + 2; i++) {
      issues.push({
        issue_pattern: patterns[Math.floor(Math.random() * patterns.length)],
        occurrence_count: Math.floor(Math.random() * 20) + 5,
        trend_direction: trends[Math.floor(Math.random() * trends.length)],
        risk_assessment: risks[Math.floor(Math.random() * risks.length)],
        prevention_recommendations: [
          '加強監控機制',
          '優化作業流程',
          '提供員工培訓',
          '改善系統效能'
        ]
      });
    }
    
    return issues;
  }

  // ==================== 提醒系統 ====================

  generateReminders() {
    const reminders = [];
    
    for (let i = 1; i <= 20; i++) {
      reminders.push({
        reminder_id: i,
        title: this.generateReminderTitle(),
        description: '系統自動生成的提醒事項',
        reminder_type: ['task_deadline', 'approval_pending', 'inventory_alert', 'system_maintenance'][Math.floor(Math.random() * 4)],
        priority: Object.values(TaskPriority)[Math.floor(Math.random() * Object.values(TaskPriority).length)],
        target_user_id: Math.floor(Math.random() * 10) + 1,
        related_entity_type: 'task',
        related_entity_id: Math.floor(Math.random() * 150) + 1,
        scheduled_time: new Date(Date.now() + Math.random() * 48 * 60 * 60 * 1000),
        is_sent: Math.random() > 0.3,
        is_acknowledged: Math.random() > 0.5,
        notification_channels: ['email', 'in_app', 'push'],
        created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
      });
    }
    
    return reminders;
  }

  generateReminderTitle() {
    const titles = [
      '任務即將到期提醒',
      '簽核審批待處理',
      '庫存預警通知',
      '系統維護提醒',
      '客戶回覆期限提醒',
      '月度報告繳交提醒',
      '供應商付款提醒',
      '員工績效評估提醒'
    ];
    
    return titles[Math.floor(Math.random() * titles.length)];
  }

  // ==================== 用戶資料 ====================

  generateUsers() {
    const users = [];
    const roles = ['admin', 'manager', 'employee', 'supervisor'];
    const departments = ['營運部', '行銷部', '財務部', '客服部', '資訊部'];
    
    for (let i = 1; i <= 10; i++) {
      users.push({
        id: i,
        name: this.generateUserName(),
        email: `user${i}@marelle.com`,
        role: roles[Math.floor(Math.random() * roles.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        is_active: true,
        last_login: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        created_at: new Date('2024-01-01')
      });
    }
    
    return users;
  }

  // ==================== 實時更新機制 ====================

  initializeRealTimeUpdates() {
    // 每分鐘更新營運指標
    setInterval(() => {
      this.updateRealTimeMetrics();
    }, 60000);
    
    // 每5分鐘檢查異常
    setInterval(() => {
      this.checkForAnomalies();
    }, 300000);
  }

  updateRealTimeMetrics() {
    // 更新即時指標
    const metrics = this.operationalMetrics.real_time_metrics;
    
    // 訂單數據更新
    metrics.orders_today.total_orders += Math.floor(Math.random() * 3);
    metrics.orders_today.revenue_today += Math.floor(Math.random() * 5000);
    
    // 網站訪客更新
    metrics.website_performance.current_visitors += Math.floor(Math.random() * 20) - 10;
    if (metrics.website_performance.current_visitors < 50) {
      metrics.website_performance.current_visitors = 50;
    }
    
    metrics.current_timestamp = new Date();
  }

  checkForAnomalies() {
    // 檢查是否有新的異常
    if (Math.random() > 0.7) {
      const newAnomaly = {
        anomaly_id: this.operationalMetrics.anomaly_monitoring.active_anomalies.length + 1,
        metric_name: '系統效能',
        severity: 'medium',
        detected_at: new Date(),
        description: '偵測到系統回應時間異常',
        recommended_action: '檢查伺服器狀態',
        status: 'open'
      };
      
      this.operationalMetrics.anomaly_monitoring.active_anomalies.push(newAnomaly);
    }
  }

  // ==================== API 方法 ====================

  // 任務管理API
  getTasks(filters = {}) {
    let filteredTasks = [...this.tasks];
    
    if (filters.status) {
      filteredTasks = filteredTasks.filter(task => filters.status.includes(task.status));
    }
    
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(task => filters.priority.includes(task.priority));
    }
    
    if (filters.task_type) {
      filteredTasks = filteredTasks.filter(task => filters.task_type.includes(task.task_type));
    }
    
    if (filters.assigned_to) {
      filteredTasks = filteredTasks.filter(task => task.assigned_to === filters.assigned_to);
    }
    
    return {
      tasks: filteredTasks,
      total: filteredTasks.length,
      summary: this.getTaskSummary(filteredTasks)
    };
  }

  getTaskSummary(tasks = this.tasks) {
    const summary = {
      total: tasks.length,
      by_status: {},
      by_priority: {},
      overdue: 0,
      due_today: 0
    };
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    tasks.forEach(task => {
      // 按狀態統計
      summary.by_status[task.status] = (summary.by_status[task.status] || 0) + 1;
      
      // 按優先級統計
      summary.by_priority[task.priority] = (summary.by_priority[task.priority] || 0) + 1;
      
      // 逾期和今日到期統計
      if (task.due_date && task.status !== TaskStatus.COMPLETED) {
        const dueDate = new Date(task.due_date);
        if (dueDate < new Date()) {
          summary.overdue++;
        } else if (dueDate <= today) {
          summary.due_today++;
        }
      }
    });
    
    return summary;
  }

  updateTaskStatus(taskId, status, notes = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updated_at = new Date();
      
      if (status === TaskStatus.COMPLETED) {
        task.completed_at = new Date();
      } else if (status === TaskStatus.IN_PROGRESS && !task.started_at) {
        task.started_at = new Date();
      }
      
      if (notes) {
        task.notes.push({
          note: notes,
          created_by: 1, // 假設當前用戶ID為1
          created_at: new Date()
        });
      }
      
      return task;
    }
    return null;
  }

  assignTask(taskId, assignedTo, priority = null, dueDate = null, notes = null) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.assigned_to = assignedTo;
      task.updated_at = new Date();
      
      if (priority) task.priority = priority;
      if (dueDate) task.due_date = new Date(dueDate);
      
      if (notes) {
        task.notes.push({
          note: notes,
          created_by: 1,
          created_at: new Date()
        });
      }
      
      return task;
    }
    return null;
  }

  // 簽核流程API
  getApprovalInstances(filters = {}) {
    let filteredInstances = [...this.approvalInstances];
    
    if (filters.workflow_type) {
      const workflowIds = this.approvalWorkflows
        .filter(w => w.entity_type === filters.workflow_type)
        .map(w => w.id);
      filteredInstances = filteredInstances.filter(instance => 
        workflowIds.includes(instance.workflow_id)
      );
    }
    
    if (filters.status) {
      filteredInstances = filteredInstances.filter(instance => 
        filters.status.includes(instance.overall_status)
      );
    }
    
    if (filters.priority) {
      filteredInstances = filteredInstances.filter(instance => 
        filters.priority.includes(instance.priority)
      );
    }
    
    return {
      instances: filteredInstances,
      total: filteredInstances.length,
      summary: this.getApprovalSummary(filteredInstances)
    };
  }

  getApprovalSummary(instances = this.approvalInstances) {
    const summary = {
      total: instances.length,
      by_status: {},
      overdue: 0,
      due_today: 0,
      avg_processing_time: 0
    };
    
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let totalProcessingTime = 0;
    let completedCount = 0;
    
    instances.forEach(instance => {
      // 按狀態統計
      summary.by_status[instance.overall_status] = 
        (summary.by_status[instance.overall_status] || 0) + 1;
      
      // 逾期和今日到期統計
      if (instance.due_date && instance.overall_status === ApprovalStatus.PENDING) {
        const dueDate = new Date(instance.due_date);
        if (dueDate < new Date()) {
          summary.overdue++;
        } else if (dueDate <= today) {
          summary.due_today++;
        }
      }
      
      // 平均處理時間統計
      if (instance.total_processing_time) {
        totalProcessingTime += instance.total_processing_time;
        completedCount++;
      }
    });
    
    if (completedCount > 0) {
      summary.avg_processing_time = Math.round(totalProcessingTime / completedCount);
    }
    
    return summary;
  }

  // 營運指標API
  getOperationalMetrics() {
    return this.operationalMetrics;
  }

  getDashboardSummary() {
    const taskSummary = this.getTaskSummary();
    const approvalSummary = this.getApprovalSummary();
    const metrics = this.operationalMetrics;
    
    return {
      tasks: taskSummary,
      approvals: approvalSummary,
      metrics: {
        orders_today: metrics.real_time_metrics.orders_today.total_orders,
        revenue_today: metrics.real_time_metrics.orders_today.revenue_today,
        active_alerts: metrics.alert_system.critical_alerts.length,
        system_health: metrics.anomaly_monitoring.system_health.queue_processing_status
      },
      last_updated: new Date()
    };
  }

  // 提醒系統API
  getReminders(userId = null) {
    let filteredReminders = [...this.reminders];
    
    if (userId) {
      filteredReminders = filteredReminders.filter(reminder => 
        reminder.target_user_id === userId
      );
    }
    
    return filteredReminders.sort((a, b) => 
      new Date(a.scheduled_time) - new Date(b.scheduled_time)
    );
  }

  acknowledgeReminder(reminderId) {
    const reminder = this.reminders.find(r => r.reminder_id === reminderId);
    if (reminder) {
      reminder.is_acknowledged = true;
      return reminder;
    }
    return null;
  }

  // 用戶API
  getUsers() {
    return this.users;
  }

  getUserById(userId) {
    return this.users.find(user => user.id === userId);
  }

  // 警報API
  getAlerts() {
    return this.alerts;
  }

  getCriticalAlerts() {
    return this.alerts.critical;
  }

  getAnomalies() {
    return this.alerts.anomalies;
  }

  getTrendingIssues() {
    return this.alerts.trending_issues;
  }
}

// 創建全局實例
const dashboardDataManager = new DashboardDataManager();

export default dashboardDataManager;