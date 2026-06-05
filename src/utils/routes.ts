export type TCategories = 'master' | 'transaction' | 'report' | 'other';

export interface RouteItem {
  route: string;
  category: TCategories;
  code: string;
  name: string;
}

export const routes: RouteItem[] = [
  { route: "/screens", category: 'other', code: 'SCR001', name: 'Screens Overview' },
  { route: "/dashboard", category: 'other', code: 'DSH001', name: 'Dashboard' },
  { route: "/probation-management", category: 'other', code: 'PRB001', name: 'Probation Management' },
  { route: "/notice-period/resignation", category: 'other', code: 'NTP001', name: 'Resignation / Notice Period' },
  { route: "/letter-management", category: 'other', code: 'LTM001', name: 'Letter Management' },
  { route: "/master", category: 'master', code: 'MST001', name: 'Master Dashboard' },
  { route: "/letter/editor", category: 'other', code: 'LTE001', name: 'Letter Editor' },
  { route: "/letter/preview", category: 'other', code: 'LTP001', name: 'Letter Preview' },
  { route: "/letter/generate", category: 'other', code: 'LTG001', name: 'Letter Generator' },
  { route: "/signature/add", category: 'other', code: 'SGA001', name: 'Add Signature' },
  { route: "/signature/list", category: 'other', code: 'SGL001', name: 'Signature List' },
  { route: "/employee/master", category: 'master', code: 'EMP001', name: 'Employee Master' },
  { route: "/employee/add", category: 'other', code: 'EMA001', name: 'Add Employee' }
];