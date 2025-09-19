import { useHandleSignInCallback } from '@logto/react';

const AdminCallback = () => {
  const { isLoading } = useHandleSignInCallback(() => {
    window.location.href = '/';
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-apricot-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc824d] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">處理登入中...</h2>
          <p className="text-gray-600">請稍候，正在完成登入流程</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AdminCallback;
