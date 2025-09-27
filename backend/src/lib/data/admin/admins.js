// 模擬：管理員清單
import { ROLE_PRESETS } from './modules';

export const initialAdmins = [
  {
    id: 'u001',
    username: 'owner',
    name: '系統管理員',
    email: 'owner@example.com',
    role: 'Super Admin',
    status: 'active',
    lastLogin: '2025-09-20 10:12:00',
    modules: ROLE_PRESETS['Super Admin']
  },
  {
    id: 'u002',
    username: 'amy',
    name: 'Amy Chen',
    email: 'amy@example.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-09-24 09:05:12',
    modules: ROLE_PRESETS['Manager']
  },
  {
    id: 'u003',
    username: 'john',
    name: 'John Wu',
    email: 'john@example.com',
    role: 'Staff',
    status: 'inactive',
    lastLogin: '2025-09-18 21:32:40',
    modules: ROLE_PRESETS['Staff']
  },
];

export default { initialAdmins };
