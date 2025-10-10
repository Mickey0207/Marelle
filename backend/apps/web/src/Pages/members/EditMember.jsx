import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import membersDataManager from '../../../../external_mock/members/membersDataManager';
import SearchableSelect from '../../components/ui/SearchableSelect';
import FormField from '../../components/ui/FormField';
import { ADMIN_STYLES } from '../../Style/adminStyles';

const GENDERS = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
  { value: '其他', label: '其他' },
];

const LEVELS = [
  { value: '一般', label: '一般' },
  { value: '銀卡', label: '銀卡' },
  { value: '金卡', label: '金卡' },
  { value: 'VIP', label: 'VIP' },
];

const STATUSES = [
  { value: 'active', label: '活動' },
  { value: 'inactive', label: '休眠' },
];

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await membersDataManager.getMemberById(id);
      if (mounted) {
        if (res.success) {
          setMember(res.data);
          setForm({
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            gender: res.data.gender || '男',
            birthday: res.data.birthday || '',
            level: res.data.level || '一般',
            status: res.data.status || 'active',
            points: res.data.points ?? 0,
            tags: res.data.tags || [],
          });
        }
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const tagOptions = useMemo(() => ['高價值','常客','黑名單','社群來客','廣告轉化'].map(t => ({ value: t, label: t })), []);

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form };
    const res = await membersDataManager.updateMember(id, payload);
    setSaving(false);
    if (res.success) {
      navigate('/members');
    }
  };

  if (loading) return <div className="p-6">載入中…</div>;
  if (!member) return <div className="p-6">找不到會員</div>;

  return (
    <div className="min-h-screen bg-[#fdf8f2]">
      <div className={ADMIN_STYLES.contentContainerStandard}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-chinese">編輯會員</h1>
            <p className="text-gray-500">會員編號：{member.memberNo}</p>
          </div>
          <div className="flex gap-2">
            <button className={ADMIN_STYLES.secondaryButton} onClick={() => navigate(-1)}>返回</button>
            <button className={ADMIN_STYLES.primaryButton} onClick={handleSave} disabled={saving}>{saving ? '儲存中…' : '儲存'}</button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="姓名" required>
              <input className={ADMIN_STYLES.input} value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} />
            </FormField>
            <FormField label="Email" required>
              <input className={ADMIN_STYLES.input} type="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
            </FormField>
            <FormField label="電話" required>
              <input className={ADMIN_STYLES.input} value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
            </FormField>
            <FormField label="性別">
              <SearchableSelect options={GENDERS} value={form.gender} onChange={(v) => setForm(p => ({ ...p, gender: v }))} />
            </FormField>
            <FormField label="生日">
              <input className={ADMIN_STYLES.input} type="date" value={form.birthday} onChange={(e) => setForm(p => ({ ...p, birthday: e.target.value }))} />
            </FormField>
            <FormField label="會員等級">
              <SearchableSelect options={LEVELS} value={form.level} onChange={(v) => setForm(p => ({ ...p, level: v }))} />
            </FormField>
            <FormField label="狀態">
              <SearchableSelect options={STATUSES} value={form.status} onChange={(v) => setForm(p => ({ ...p, status: v }))} />
            </FormField>
            <FormField label="積分">
              <input className={ADMIN_STYLES.input} type="number" value={form.points} onChange={(e) => setForm(p => ({ ...p, points: Number(e.target.value || 0) }))} />
            </FormField>
            <FormField label="標籤">
              <SearchableSelect multiple options={tagOptions} value={form.tags} onChange={(v) => setForm(p => ({ ...p, tags: v }))} placeholder="新增或選擇標籤" />
            </FormField>
          </div>
        </div>
      </div>
    </div>
  );
}
