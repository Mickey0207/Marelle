import React, { useState } from 'react';
import { ADMIN_STYLES } from '../../../styles';
// import CustomSelect from '../../../components/CustomSelect';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({
    paymentMethods: {
      creditCard: true,
      bankTransfer: true,
      paypal: false,
      applePay: false,
      googlePay: false,
      cashOnDelivery: true
    },
    currency: {
      primary: 'TWD',
      supported: ['TWD', 'USD', 'CNY', 'HKD']
    },
    fees: {
      creditCardFee: 2.8,
      bankTransferFee: 0,
      processingFee: 0
    },
    limits: {
      minOrderAmount: 100,
      maxOrderAmount: 50000,
      dailyLimit: 100000
    }
  });

  const handleMethodChange = (method, enabled) => {
    setSettings(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: enabled
      }
    }));
  };

  const handleFeeChange = (feeType, value) => {
    setSettings(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        [feeType]: parseFloat(value) || 0
      }
    }));
  };

  const handleLimitChange = (limitType, value) => {
    setSettings(prev => ({
      ...prev,
      limits: {
        ...prev.limits,
        [limitType]: parseInt(value) || 0
      }
    }));
  };

  return (
    <div className={ADMIN_STYLES.pageContainer}>
      <div className={ADMIN_STYLES.contentContainer}>
        <div className="mb-6">
          <h1 className={ADMIN_STYLES.pageTitle}>付款設定</h1>
          <p className={ADMIN_STYLES.pageSubtitle}>管理付款方式和相關設定</p>
        </div>

        <div className="space-y-6">
          {/* 付款方式 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">付款方式</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">信用卡</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.creditCard}
                  onChange={(e) => handleMethodChange('creditCard', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">銀行轉帳</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.bankTransfer}
                  onChange={(e) => handleMethodChange('bankTransfer', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">PayPal</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.paypal}
                  onChange={(e) => handleMethodChange('paypal', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">Apple Pay</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.applePay}
                  onChange={(e) => handleMethodChange('applePay', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">Google Pay</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.googlePay}
                  onChange={(e) => handleMethodChange('googlePay', e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium font-chinese">貨到付款</label>
                <input
                  type="checkbox"
                  checked={settings.paymentMethods.cashOnDelivery}
                  onChange={(e) => handleMethodChange('cashOnDelivery', e.target.checked)}
                  className="rounded"
                />
              </div>
            </div>
          </div>

          {/* 貨幣設定 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">貨幣設定</h3>
            <div className="space-y-4">
              <div>
                <CustomSelect
                  label="主要貨幣"
                  value={settings.currency.primary}
                  onChange={(value) => setSettings(prev => ({
                    ...prev,
                    currency: { ...prev.currency, primary: value }
                  }))}
                  options={[
                    { value: 'TWD', label: 'TWD (台幣)', icon: '💰' },
                    { value: 'USD', label: 'USD (美元)', icon: '💵' },
                    { value: 'CNY', label: 'CNY (人民幣)', icon: '💴' },
                    { value: 'HKD', label: 'HKD (港幣)', icon: '💶' }
                  ]}
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* 手續費設定 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">手續費設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  信用卡手續費 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.fees.creditCardFee}
                  onChange={(e) => handleFeeChange('creditCardFee', e.target.value)}
                  className="w-24 px-3 py-2 border rounded-md"
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  銀行轉帳手續費 (固定金額)
                </label>
                <input
                  type="number"
                  value={settings.fees.bankTransferFee}
                  onChange={(e) => handleFeeChange('bankTransferFee', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  處理費 (固定金額)
                </label>
                <input
                  type="number"
                  value={settings.fees.processingFee}
                  onChange={(e) => handleFeeChange('processingFee', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* 限制設定 */}
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-chinese">限制設定</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  最小訂單金額
                </label>
                <input
                  type="number"
                  value={settings.limits.minOrderAmount}
                  onChange={(e) => handleLimitChange('minOrderAmount', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  最大訂單金額
                </label>
                <input
                  type="number"
                  value={settings.limits.maxOrderAmount}
                  onChange={(e) => handleLimitChange('maxOrderAmount', e.target.value)}
                  className="w-32 px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 font-chinese">
                  每日交易限額
                </label>
                <input
                  type="number"
                  value={settings.limits.dailyLimit}
                  onChange={(e) => handleLimitChange('dailyLimit', e.target.value)}
                  className="w-40 px-3 py-2 border rounded-md"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* 儲存按鈕 */}
          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-[#D4A574] text-white rounded-md hover:bg-[#B8956A] transition-colors font-chinese"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;