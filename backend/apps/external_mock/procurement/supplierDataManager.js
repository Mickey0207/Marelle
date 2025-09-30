export const SupplierStatus = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
  BLACKLISTED: 'blacklisted',
}
export const SupplierGrade = {
  A_EXCELLENT: 'A_EXCELLENT',
  B_GOOD: 'B_GOOD',
  C_NORMAL: 'C_NORMAL',
  D_RISKY: 'D_RISKY',
  E_UNQUALIFIED: 'E_UNQUALIFIED',
}

const _suppliers = Array.from({ length: 24 }).map((_, i) => ({
  id: `SUP-${1000+i}`,
  companyName: `示範供應商 ${i+1}`,
  companyNameEn: `Supplier ${i+1}`,
  taxId: `8${String(1000000+i).slice(0,7)}`,
  industry: ['飾品','服飾','物流','包材'][i%4],
  website: `https://supplier${i+1}.example.com`,
  status: Object.values(SupplierStatus)[i % 4],
  grade: Object.values(SupplierGrade)[i % 5],
}))

export default {
  getAllSuppliers() { return [..._suppliers] },
}
