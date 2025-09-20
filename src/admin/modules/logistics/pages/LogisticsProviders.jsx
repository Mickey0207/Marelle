import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

const LogisticsProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  const mockProviders = [
    {
      id: "provider_001",
      name: "順豐速運",
      type: "express",
      contactInfo: {
        phone: "02-2345-6789",
        email: "contact@sf-express.com",
        address: "台北市信義區信義路五段23號"
      },
      serviceAreas: ["台北市", "新北市", "桃園市", "台中市"],
      isActive: true
    },
    {
      id: "provider_002", 
      name: "黑貓宅急便",
      type: "courier",
      contactInfo: {
        phone: "02-3456-7890",
        email: "service@blackcat.com",
        address: "台北市中山區民生東路456號"
      },
      serviceAreas: ["全台灣"],
      isActive: true
    }
  ];

  useEffect(() => {
    setProviders(mockProviders);
  }, []);

  return (
    <div className="bg-[#fdf8f2] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">物流供應商管理</h1>
          <p className="text-gray-600">管理和維護物流配送供應商資訊</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white/80 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{provider.name}</h3>
              <div className="space-y-2">
                <div>電話：{provider.contactInfo.phone}</div>
                <div>信箱：{provider.contactInfo.email}</div>
                <div>地址：{provider.contactInfo.address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogisticsProviders;
