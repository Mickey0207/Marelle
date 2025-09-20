// 行銷管理數據管理器
class MarketingDataManager {
  constructor() {
    this.storageKeys = {
      campaigns: 'marketing_campaigns',
      adCampaigns: 'ad_campaigns',
      audiences: 'marketing_audiences',
      creativeAssets: 'creative_assets',
      automationRules: 'automation_rules',
      settings: 'marketing_settings'
    };
    
    this.initializeDefaultData();
  }

  // 初始化預設數據
  initializeDefaultData() {
    if (!this.getCampaigns().length) {
      const defaultCampaigns = [
        {
          id: 'mc001',
          name: '春季美妝節',
          type: 'seasonal',
          status: 'active',
          description: '春季限定美妝商品促銷活動',
          schedule: {
            startDate: '2025-03-01',
            endDate: '2025-03-31',
            timezone: 'Asia/Taipei',
            preHeatPeriod: 7,
            phases: [
              {
                id: 'phase1',
                name: '預熱期',
                startDate: '2025-02-22',
                endDate: '2025-02-28',
                status: 'completed'
              },
              {
                id: 'phase2',
                name: '主要促銷期',
                startDate: '2025-03-01',
                endDate: '2025-03-25',
                status: 'active'
              },
              {
                id: 'phase3',
                name: '清倉期',
                startDate: '2025-03-26',
                endDate: '2025-03-31',
                status: 'scheduled'
              }
            ]
          },
          animations: {
            themeType: 'seasonal',
            effectIntensity: 'moderate',
            mobileOptimization: true,
            performanceMode: 'balanced'
          },
          discounts: {
            rules: [
              {
                id: 'discount1',
                type: 'percentage',
                value: 20,
                minAmount: 1000,
                stackable: true,
                targetProducts: ['skincare', 'makeup']
              }
            ],
            stackingPolicy: 'stackable',
            usageLimit: {
              perUser: 3,
              total: 10000
            }
          },
          advertising: {
            adCampaigns: ['ac001', 'ac002'],
            pushNotifications: true,
            emailMarketing: true,
            socialMediaPosts: ['facebook', 'instagram', 'line']
          },
          inventory: {
            reservedStockPercentage: 15,
            priorityAllocation: true,
            dynamicInventory: true,
            oversellProtection: true
          },
          budget: {
            totalBudget: 500000,
            spentBudget: 125000,
            projectedROI: 3.2,
            actualROI: 3.8
          },
          objectives: {
            primaryGoal: 'sales',
            kpis: [
              { name: 'conversion_rate', target: 4.5, actual: 5.2 },
              { name: 'roas', target: 3.0, actual: 3.8 },
              { name: 'new_customers', target: 2000, actual: 2350 }
            ]
          },
          performance: {
            impressions: 1250000,
            clicks: 65000,
            conversions: 3380,
            revenue: 1900000,
            ctr: 5.2,
            conversionRate: 5.2,
            cpa: 37,
            roas: 3.8
          },
          createdAt: '2024-12-15T08:00:00Z',
          updatedAt: '2025-01-15T10:30:00Z',
          createdBy: 'admin',
          status: 'active'
        },
        {
          id: 'mc002',
          name: '母親節特惠',
          type: 'festival',
          status: 'scheduled',
          description: '母親節專屬美妝禮盒優惠',
          schedule: {
            startDate: '2025-05-01',
            endDate: '2025-05-12',
            timezone: 'Asia/Taipei',
            preHeatPeriod: 10,
            phases: [
              {
                id: 'phase1',
                name: '預熱宣傳',
                startDate: '2025-04-21',
                endDate: '2025-04-30',
                status: 'scheduled'
              },
              {
                id: 'phase2',
                name: '正式促銷',
                startDate: '2025-05-01',
                endDate: '2025-05-12',
                status: 'scheduled'
              }
            ]
          },
          animations: {
            themeType: 'traditional',
            effectIntensity: 'intense',
            mobileOptimization: true,
            performanceMode: 'high_quality'
          },
          discounts: {
            rules: [
              {
                id: 'discount2',
                type: 'bundle',
                value: 25,
                minAmount: 1500,
                stackable: false,
                targetProducts: ['gift_sets', 'skincare']
              }
            ],
            stackingPolicy: 'exclusive',
            usageLimit: {
              perUser: 1,
              total: 5000
            }
          },
          budget: {
            totalBudget: 300000,
            spentBudget: 0,
            projectedROI: 3.5
          },
          objectives: {
            primaryGoal: 'engagement',
            kpis: [
              { name: 'gift_box_sales', target: 1000, actual: 0 },
              { name: 'brand_awareness', target: 15, actual: 0 }
            ]
          },
          createdAt: '2025-01-10T08:00:00Z',
          updatedAt: '2025-01-10T08:00:00Z',
          createdBy: 'admin',
          status: 'scheduled'
        }
      ];

      localStorage.setItem(this.storageKeys.campaigns, JSON.stringify(defaultCampaigns));
    }

    if (!this.getAdCampaigns().length) {
      const defaultAdCampaigns = [
        {
          id: 'ac001',
          campaignId: 'mc001',
          name: '春季美妝節 - Facebook廣告',
          platform: {
            name: 'facebook',
            accountId: 'fb_act_12345',
            campaignId: 'fb_campaign_001'
          },
          campaignType: 'conversion',
          creatives: {
            images: ['spring_makeup_banner.jpg', 'skincare_collection.jpg'],
            videos: ['spring_tutorial.mp4'],
            texts: [
              '春季限定！全館美妝8折起',
              '新品上市，打造完美春日妝容'
            ],
            callToActions: ['立即購買', '了解更多']
          },
          targeting: {
            demographics: {
              age: { min: 18, max: 45 },
              gender: ['female'],
              interests: ['beauty', 'skincare', 'makeup']
            },
            geotargeting: {
              countries: ['TW'],
              cities: ['台北', '台中', '高雄']
            }
          },
          budget: {
            dailyBudget: 3000,
            totalBudget: 90000,
            bidStrategy: 'target_roas',
            targetROAS: 3.0
          },
          delivery: {
            startDate: '2025-03-01',
            endDate: '2025-03-31',
            pacing: 'standard'
          },
          status: 'active',
          performance: {
            impressions: 450000,
            clicks: 22500,
            conversions: 1125,
            spend: 67500,
            ctr: 5.0,
            cpc: 3.0,
            cpa: 60,
            roas: 3.2
          }
        },
        {
          id: 'ac002',
          campaignId: 'mc001',
          name: '春季美妝節 - Google Ads',
          platform: {
            name: 'google_ads',
            accountId: 'ga_act_67890',
            campaignId: 'ga_campaign_002'
          },
          campaignType: 'search',
          targeting: {
            keywords: ['春季美妝', '護膚品推薦', '彩妝新品'],
            demographics: {
              age: { min: 20, max: 50 },
              gender: ['female']
            }
          },
          budget: {
            dailyBudget: 2000,
            totalBudget: 60000,
            bidStrategy: 'target_cpa',
            targetCPA: 45
          },
          status: 'active',
          performance: {
            impressions: 180000,
            clicks: 14400,
            conversions: 864,
            spend: 43200,
            ctr: 8.0,
            cpc: 3.0,
            cpa: 50,
            roas: 2.8
          }
        }
      ];

      localStorage.setItem(this.storageKeys.adCampaigns, JSON.stringify(defaultAdCampaigns));
    }

    if (!this.getAudiences().length) {
      const defaultAudiences = [
        {
          id: 'aud001',
          name: '高價值客戶',
          description: '過去12個月消費金額超過10000元的客戶',
          type: 'behavioral',
          criteria: {
            behavioral: {
              purchaseHistory: {
                totalSpent: { min: 10000 },
                frequency: { min: 3 },
                lastPurchase: { days: 90 }
              },
              engagementLevel: 'high'
            }
          },
          size: {
            estimated: 1250,
            actual: 1180,
            lastUpdated: '2025-01-15T10:00:00Z'
          },
          refreshFrequency: 'weekly',
          campaigns: ['mc001'],
          performance: {
            averageCTR: 8.5,
            averageConversionRate: 12.3,
            averageCPA: 25,
            totalRevenue: 2850000
          }
        },
        {
          id: 'aud002',
          name: '新客戶',
          description: '註冊時間少於30天的新用戶',
          type: 'demographic',
          criteria: {
            behavioral: {
              customerLifecycleStage: 'new',
              registrationDate: { days: 30 }
            }
          },
          size: {
            estimated: 2800,
            actual: 2650,
            lastUpdated: '2025-01-15T10:00:00Z'
          },
          refreshFrequency: 'daily',
          campaigns: ['mc001', 'mc002'],
          performance: {
            averageCTR: 6.2,
            averageConversionRate: 3.8,
            averageCPA: 85,
            totalRevenue: 450000
          }
        },
        {
          id: 'aud003',
          name: '彩妝愛好者',
          description: '主要購買彩妝產品的客戶群',
          type: 'psychographic',
          criteria: {
            behavioral: {
              purchaseHistory: {
                categories: ['makeup', 'cosmetics'],
                frequency: { min: 2 }
              }
            },
            psychographic: {
              interests: ['makeup', 'beauty_trends', 'color_cosmetics']
            }
          },
          size: {
            estimated: 3200,
            actual: 3180,
            lastUpdated: '2025-01-15T10:00:00Z'
          },
          refreshFrequency: 'weekly',
          campaigns: ['mc001'],
          performance: {
            averageCTR: 7.8,
            averageConversionRate: 8.9,
            averageCPA: 45,
            totalRevenue: 1680000
          }
        }
      ];

      localStorage.setItem(this.storageKeys.audiences, JSON.stringify(defaultAudiences));
    }

    if (!this.getCreativeAssets().length) {
      const defaultCreatives = [
        {
          id: 'ca001',
          name: '春季美妝主視覺',
          type: 'image',
          file: {
            url: '/assets/creatives/spring_main_visual.jpg',
            size: 2048576,
            dimensions: { width: 1200, height: 800 },
            format: 'jpg'
          },
          variants: [
            {
              platform: 'facebook',
              placement: 'feed',
              dimensions: { width: 1200, height: 628 },
              url: '/assets/creatives/spring_main_visual_fb.jpg'
            },
            {
              platform: 'instagram',
              placement: 'story',
              dimensions: { width: 1080, height: 1920 },
              url: '/assets/creatives/spring_main_visual_ig_story.jpg'
            }
          ],
          tags: ['spring', 'makeup', 'seasonal', 'promotion'],
          category: 'campaign_banner',
          brand: 'marelle',
          usage: {
            campaigns: ['mc001'],
            platforms: ['facebook', 'instagram'],
            performance: {
              impressions: 580000,
              clicks: 23200,
              ctr: 4.0,
              conversions: 1392,
              conversionRate: 6.0
            }
          },
          compliance: {
            approved: true,
            approvedBy: 'marketing_manager',
            approvedAt: '2025-02-15T09:00:00Z',
            issues: []
          },
          version: '1.0',
          isActive: true,
          createdAt: '2025-02-10T08:00:00Z',
          createdBy: 'designer'
        },
        {
          id: 'ca002',
          name: '母親節禮盒廣告影片',
          type: 'video',
          file: {
            url: '/assets/creatives/mothers_day_gift_video.mp4',
            size: 15728640,
            dimensions: { width: 1920, height: 1080 },
            format: 'mp4',
            duration: 30
          },
          variants: [
            {
              platform: 'facebook',
              placement: 'video_feed',
              dimensions: { width: 1280, height: 720 },
              url: '/assets/creatives/mothers_day_gift_video_fb.mp4'
            },
            {
              platform: 'youtube',
              placement: 'video_ad',
              dimensions: { width: 1920, height: 1080 },
              url: '/assets/creatives/mothers_day_gift_video_yt.mp4'
            }
          ],
          tags: ['mothers_day', 'gift_box', 'emotional', 'family'],
          category: 'video_ad',
          brand: 'marelle',
          usage: {
            campaigns: ['mc002'],
            platforms: ['facebook', 'youtube'],
            performance: {
              impressions: 0,
              clicks: 0,
              ctr: 0,
              conversions: 0,
              conversionRate: 0
            }
          },
          compliance: {
            approved: true,
            approvedBy: 'marketing_manager',
            approvedAt: '2025-01-20T14:00:00Z',
            issues: []
          },
          version: '1.0',
          isActive: true,
          createdAt: '2025-01-15T08:00:00Z',
          createdBy: 'video_producer'
        }
      ];

      localStorage.setItem(this.storageKeys.creativeAssets, JSON.stringify(defaultCreatives));
    }

    if (!this.getAutomationRules().length) {
      const defaultAutomationRules = [
        {
          id: 'ar001',
          name: '購物車遺棄挽回',
          type: 'cart_abandonment',
          status: 'active',
          trigger: {
            event: 'cart_abandoned',
            conditions: {
              cartValue: { min: 500 },
              timeDelay: 15 // 分鐘
            }
          },
          actions: [
            {
              type: 'send_email',
              delay: 0,
              template: 'cart_abandonment_reminder',
              discount: {
                type: 'percentage',
                value: 10,
                validityHours: 24
              }
            },
            {
              type: 'send_push_notification',
              delay: 60, // 分鐘
              message: '您的購物車還有商品等待結帳唷！'
            },
            {
              type: 'show_retargeting_ad',
              delay: 120, // 分鐘
              platforms: ['facebook', 'google']
            }
          ],
          performance: {
            triggered: 2850,
            completed: 570,
            conversionRate: 20.0,
            revenue: 285000
          },
          createdAt: '2024-12-01T08:00:00Z',
          createdBy: 'marketing_automation'
        },
        {
          id: 'ar002',
          name: '生日祝賀與優惠',
          type: 'birthday_campaign',
          status: 'active',
          trigger: {
            event: 'birthday_approaching',
            conditions: {
              advanceDays: 7
            }
          },
          actions: [
            {
              type: 'send_email',
              delay: 0,
              template: 'birthday_wishes',
              discount: {
                type: 'percentage',
                value: 20,
                validityDays: 30
              }
            },
            {
              type: 'send_sms',
              delay: 0,
              message: '生日快樂！專屬生日禮已為您準備好'
            }
          ],
          performance: {
            triggered: 450,
            completed: 315,
            conversionRate: 70.0,
            revenue: 189000
          },
          createdAt: '2024-11-15T08:00:00Z',
          createdBy: 'crm_manager'
        },
        {
          id: 'ar003',
          name: '客戶流失挽回',
          type: 'win_back',
          status: 'active',
          trigger: {
            event: 'customer_inactive',
            conditions: {
              inactiveDays: 60,
              previousPurchases: { min: 2 }
            }
          },
          actions: [
            {
              type: 'send_email',
              delay: 0,
              template: 'win_back_offer',
              discount: {
                type: 'percentage',
                value: 25,
                validityDays: 14
              }
            },
            {
              type: 'create_personalized_offer',
              delay: 0,
              basedOn: 'purchase_history'
            }
          ],
          performance: {
            triggered: 680,
            completed: 102,
            conversionRate: 15.0,
            revenue: 153000
          },
          createdAt: '2024-10-20T08:00:00Z',
          createdBy: 'retention_specialist'
        }
      ];

      localStorage.setItem(this.storageKeys.automationRules, JSON.stringify(defaultAutomationRules));
    }
  }

  // 檔期活動管理
  getCampaigns() {
    const campaigns = localStorage.getItem(this.storageKeys.campaigns);
    return campaigns ? JSON.parse(campaigns) : [];
  }

  getCampaignById(id) {
    const campaigns = this.getCampaigns();
    return campaigns.find(campaign => campaign.id === id);
  }

  createCampaign(campaignData) {
    const campaigns = this.getCampaigns();
    const newCampaign = {
      id: `mc${String(Date.now()).slice(-6)}`,
      ...campaignData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: campaignData.status || 'draft'
    };
    campaigns.push(newCampaign);
    localStorage.setItem(this.storageKeys.campaigns, JSON.stringify(campaigns));
    return newCampaign;
  }

  updateCampaign(id, updates) {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex(campaign => campaign.id === id);
    if (index !== -1) {
      campaigns[index] = {
        ...campaigns[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.campaigns, JSON.stringify(campaigns));
      return campaigns[index];
    }
    return null;
  }

  deleteCampaign(id) {
    const campaigns = this.getCampaigns();
    const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
    localStorage.setItem(this.storageKeys.campaigns, JSON.stringify(filteredCampaigns));
    return true;
  }

  updateCampaignStatus(id, status) {
    return this.updateCampaign(id, { status, updatedAt: new Date().toISOString() });
  }

  // 廣告投放管理
  getAdCampaigns() {
    const adCampaigns = localStorage.getItem(this.storageKeys.adCampaigns);
    return adCampaigns ? JSON.parse(adCampaigns) : [];
  }

  getAdCampaignById(id) {
    const adCampaigns = this.getAdCampaigns();
    return adCampaigns.find(adCampaign => adCampaign.id === id);
  }

  getAdCampaignsByCampaignId(campaignId) {
    const adCampaigns = this.getAdCampaigns();
    return adCampaigns.filter(adCampaign => adCampaign.campaignId === campaignId);
  }

  createAdCampaign(adCampaignData) {
    const adCampaigns = this.getAdCampaigns();
    const newAdCampaign = {
      id: `ac${String(Date.now()).slice(-6)}`,
      ...adCampaignData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: adCampaignData.status || 'draft'
    };
    adCampaigns.push(newAdCampaign);
    localStorage.setItem(this.storageKeys.adCampaigns, JSON.stringify(adCampaigns));
    return newAdCampaign;
  }

  updateAdCampaign(id, updates) {
    const adCampaigns = this.getAdCampaigns();
    const index = adCampaigns.findIndex(adCampaign => adCampaign.id === id);
    if (index !== -1) {
      adCampaigns[index] = {
        ...adCampaigns[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.adCampaigns, JSON.stringify(adCampaigns));
      return adCampaigns[index];
    }
    return null;
  }

  deleteAdCampaign(id) {
    const adCampaigns = this.getAdCampaigns();
    const filteredAdCampaigns = adCampaigns.filter(adCampaign => adCampaign.id !== id);
    localStorage.setItem(this.storageKeys.adCampaigns, JSON.stringify(filteredAdCampaigns));
    return true;
  }

  // 受眾管理
  getAudiences() {
    const audiences = localStorage.getItem(this.storageKeys.audiences);
    return audiences ? JSON.parse(audiences) : [];
  }

  getAudienceById(id) {
    const audiences = this.getAudiences();
    return audiences.find(audience => audience.id === id);
  }

  createAudience(audienceData) {
    const audiences = this.getAudiences();
    const newAudience = {
      id: `aud${String(Date.now()).slice(-6)}`,
      ...audienceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    audiences.push(newAudience);
    localStorage.setItem(this.storageKeys.audiences, JSON.stringify(audiences));
    return newAudience;
  }

  updateAudience(id, updates) {
    const audiences = this.getAudiences();
    const index = audiences.findIndex(audience => audience.id === id);
    if (index !== -1) {
      audiences[index] = {
        ...audiences[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.audiences, JSON.stringify(audiences));
      return audiences[index];
    }
    return null;
  }

  deleteAudience(id) {
    const audiences = this.getAudiences();
    const filteredAudiences = audiences.filter(audience => audience.id !== id);
    localStorage.setItem(this.storageKeys.audiences, JSON.stringify(filteredAudiences));
    return true;
  }

  // 創意素材管理
  getCreativeAssets() {
    const creativeAssets = localStorage.getItem(this.storageKeys.creativeAssets);
    return creativeAssets ? JSON.parse(creativeAssets) : [];
  }

  getCreativeAssetById(id) {
    const creativeAssets = this.getCreativeAssets();
    return creativeAssets.find(asset => asset.id === id);
  }

  createCreativeAsset(assetData) {
    const creativeAssets = this.getCreativeAssets();
    const newAsset = {
      id: `ca${String(Date.now()).slice(-6)}`,
      ...assetData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    creativeAssets.push(newAsset);
    localStorage.setItem(this.storageKeys.creativeAssets, JSON.stringify(creativeAssets));
    return newAsset;
  }

  updateCreativeAsset(id, updates) {
    const creativeAssets = this.getCreativeAssets();
    const index = creativeAssets.findIndex(asset => asset.id === id);
    if (index !== -1) {
      creativeAssets[index] = {
        ...creativeAssets[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.creativeAssets, JSON.stringify(creativeAssets));
      return creativeAssets[index];
    }
    return null;
  }

  deleteCreativeAsset(id) {
    const creativeAssets = this.getCreativeAssets();
    const filteredAssets = creativeAssets.filter(asset => asset.id !== id);
    localStorage.setItem(this.storageKeys.creativeAssets, JSON.stringify(filteredAssets));
    return true;
  }

  // 自動化規則管理
  getAutomationRules() {
    const automationRules = localStorage.getItem(this.storageKeys.automationRules);
    return automationRules ? JSON.parse(automationRules) : [];
  }

  getAutomationRuleById(id) {
    const automationRules = this.getAutomationRules();
    return automationRules.find(rule => rule.id === id);
  }

  createAutomationRule(ruleData) {
    const automationRules = this.getAutomationRules();
    const newRule = {
      id: `ar${String(Date.now()).slice(-6)}`,
      ...ruleData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: ruleData.status || 'draft'
    };
    automationRules.push(newRule);
    localStorage.setItem(this.storageKeys.automationRules, JSON.stringify(automationRules));
    return newRule;
  }

  updateAutomationRule(id, updates) {
    const automationRules = this.getAutomationRules();
    const index = automationRules.findIndex(rule => rule.id === id);
    if (index !== -1) {
      automationRules[index] = {
        ...automationRules[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(this.storageKeys.automationRules, JSON.stringify(automationRules));
      return automationRules[index];
    }
    return null;
  }

  deleteAutomationRule(id) {
    const automationRules = this.getAutomationRules();
    const filteredRules = automationRules.filter(rule => rule.id !== id);
    localStorage.setItem(this.storageKeys.automationRules, JSON.stringify(filteredRules));
    return true;
  }

  // 分析數據計算
  getMarketingAnalytics() {
    const campaigns = this.getCampaigns();
    const adCampaigns = this.getAdCampaigns();
    const audiences = this.getAudiences();
    const automationRules = this.getAutomationRules();

    // 計算總體指標
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget?.totalBudget || 0), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + (c.budget?.spentBudget || 0), 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + (c.performance?.revenue || 0), 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + (c.performance?.impressions || 0), 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + (c.performance?.clicks || 0), 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + (c.performance?.conversions || 0), 0);

    // 計算平均指標
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;
    const totalROAS = totalSpent > 0 ? (totalRevenue / totalSpent) : 0;
    const avgCPA = totalConversions > 0 ? (totalSpent / totalConversions) : 0;

    // 平台別表現
    const platformPerformance = adCampaigns.reduce((acc, ad) => {
      const platform = ad.platform.name;
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          campaigns: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          spend: 0,
          revenue: 0
        };
      }
      acc[platform].campaigns++;
      acc[platform].impressions += ad.performance?.impressions || 0;
      acc[platform].clicks += ad.performance?.clicks || 0;
      acc[platform].conversions += ad.performance?.conversions || 0;
      acc[platform].spend += ad.performance?.spend || 0;
      return acc;
    }, {});

    // 自動化效果
    const automationPerformance = automationRules.reduce((acc, rule) => {
      acc.totalTriggered += rule.performance?.triggered || 0;
      acc.totalCompleted += rule.performance?.completed || 0;
      acc.totalRevenue += rule.performance?.revenue || 0;
      return acc;
    }, { totalTriggered: 0, totalCompleted: 0, totalRevenue: 0 });

    return {
      overview: {
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        totalBudget,
        totalSpent,
        budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0,
        totalRevenue,
        totalROAS,
        totalImpressions,
        totalClicks,
        totalConversions,
        avgCTR,
        avgConversionRate,
        avgCPA
      },
      platformPerformance: Object.values(platformPerformance),
      audienceInsights: {
        totalAudiences: audiences.length,
        averageAudienceSize: audiences.reduce((sum, a) => sum + (a.size?.actual || 0), 0) / audiences.length || 0,
        topPerformingAudience: audiences.sort((a, b) => (b.performance?.totalRevenue || 0) - (a.performance?.totalRevenue || 0))[0]
      },
      automationInsights: {
        totalRules: automationRules.length,
        activeRules: automationRules.filter(r => r.status === 'active').length,
        ...automationPerformance,
        automationConversionRate: automationPerformance.totalTriggered > 0 ? 
          (automationPerformance.totalCompleted / automationPerformance.totalTriggered * 100) : 0
      }
    };
  }

  // 獲取趨勢數據（模擬30天趨勢）
  getTrendData(days = 30) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // 模擬趨勢數據
      const baseValue = 1000;
      const randomFactor = 0.8 + Math.random() * 0.4;
      const seasonalFactor = 1 + 0.3 * Math.sin((i / days) * Math.PI * 2);
      
      data.push({
        date: date.toISOString().split('T')[0],
        impressions: Math.floor(baseValue * 50 * randomFactor * seasonalFactor),
        clicks: Math.floor(baseValue * 2.5 * randomFactor * seasonalFactor),
        conversions: Math.floor(baseValue * 0.125 * randomFactor * seasonalFactor),
        revenue: Math.floor(baseValue * 25 * randomFactor * seasonalFactor),
        spend: Math.floor(baseValue * 8 * randomFactor * seasonalFactor)
      });
    }
    
    return data;
  }

  // 個人化推薦功能
  getPersonalizedRecommendations(userId, context = {}) {
    // 模擬個人化推薦
    const recommendations = [
      {
        type: 'product',
        products: [
          { id: 'p001', name: '保濕精華液', score: 0.95, reason: '基於購買歷史' },
          { id: 'p002', name: '抗老面霜', score: 0.88, reason: '相似用戶喜好' },
          { id: 'p003', name: '維他命C精華', score: 0.82, reason: '季節推薦' }
        ]
      },
      {
        type: 'campaign',
        campaigns: [
          { id: 'mc001', name: '春季美妝節', score: 0.92, reason: '符合興趣偏好' },
          { id: 'mc002', name: '母親節特惠', score: 0.75, reason: '時節相關' }
        ]
      },
      {
        type: 'content',
        content: [
          { id: 'c001', title: '春季護膚指南', type: 'article', score: 0.89 },
          { id: 'c002', title: '彩妝教學影片', type: 'video', score: 0.84 }
        ]
      }
    ];

    return recommendations;
  }

  // 動態定價建議
  getDynamicPricingRecommendation(productId, userId = null) {
    // 模擬動態定價計算
    const basePrice = 1200;
    const demandFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1
    const competitorFactor = 0.95 + Math.random() * 0.1; // 0.95-1.05
    const seasonalFactor = 1.0; // 春季無調整
    const personalFactor = userId ? (0.95 + Math.random() * 0.1) : 1.0; // VIP可能有折扣

    const recommendedPrice = Math.round(
      basePrice * demandFactor * competitorFactor * seasonalFactor * personalFactor
    );

    return {
      productId,
      basePrice,
      recommendedPrice,
      factors: {
        demand: demandFactor,
        competitor: competitorFactor,
        seasonal: seasonalFactor,
        personal: personalFactor
      },
      confidence: 0.85,
      expectedUplift: Math.random() * 10 + 5 // 5-15% 預期提升
    };
  }

  // 客戶分群分析
  getCustomerSegmentAnalysis() {
    return {
      segments: [
        {
          name: '高價值客戶',
          size: 1180,
          percentage: 8.5,
          avgSpend: 2850,
          avgFrequency: 4.2,
          lifetimeValue: 12000,
          characteristics: ['高消費', '忠誠度高', '品質導向']
        },
        {
          name: '新客戶',
          size: 2650,
          percentage: 19.1,
          avgSpend: 650,
          avgFrequency: 1.2,
          lifetimeValue: 1500,
          characteristics: ['價格敏感', '需要引導', '潛力客戶']
        },
        {
          name: '彩妝愛好者',
          size: 3180,
          percentage: 22.9,
          avgSpend: 1450,
          avgFrequency: 2.8,
          lifetimeValue: 5200,
          characteristics: ['品類專精', '社群活躍', '影響者']
        },
        {
          name: '護膚專家',
          size: 2890,
          percentage: 20.8,
          avgSpend: 1850,
          avgFrequency: 3.5,
          lifetimeValue: 7800,
          characteristics: ['成分關注', '長期投資', '專業知識']
        },
        {
          name: '偶爾購買者',
          size: 3980,
          percentage: 28.7,
          avgSpend: 450,
          avgFrequency: 0.8,
          lifetimeValue: 800,
          characteristics: ['機會性購買', '促銷敏感', '需要激活']
        }
      ],
      insights: [
        '高價值客戶雖然只佔8.5%，但貢獻了35%的總收入',
        '新客戶轉換率有待提升，建議加強新手引導',
        '彩妝愛好者具有較高的社群影響力，適合推薦計畫',
        '偶爾購買者群體最大，是激活的重要目標'
      ]
    };
  }
}

// 創建全局實例
const marketingDataManager = new MarketingDataManager();

export default marketingDataManager;