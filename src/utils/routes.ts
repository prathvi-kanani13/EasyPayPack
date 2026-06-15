export type TCategories = 'master' | 'transaction' | 'report' | 'other';

export interface RouteItem {
  route: string;
  category: TCategories;
  code: string;
  name: string;
}

export const routes: RouteItem[] = [

  // Dashboard and Screens
  { route: "/screens", category: 'other', code: 'SCR001', name: 'Screens Overview' },
  { route: "/dashboard", category: 'other', code: 'DSH001', name: 'Dashboard' },

  // Other Routes
  { route: "/probation-management", category: 'other', code: 'PRB001', name: 'Probation Manag1ement' },
  { route: "/notice-period/resignation", category: 'other', code: 'NTP001', name: 'Resignation / Notice Period' },

  // Master Routes
  { route: "/master", category: 'master', code: 'MST001', name: 'Master Dashboard' },

  // Letter Routes
  { route: "/letter-management", category: 'other', code: 'LTM001', name: 'Letter Management' },
  { route: "/letter/editor", category: 'other', code: 'LTE001', name: 'Letter Editor' },
  { route: "/letter/preview", category: 'other', code: 'LTP001', name: 'Letter Preview' },
  { route: "/letter/generate", category: 'other', code: 'LTG001', name: 'Letter Generator' },

  // Signature Routes
  { route: "/signature/add", category: 'other', code: 'SGA001', name: 'Add Signature' },
  { route: "/signature/list", category: 'other', code: 'SGL001', name: 'Signature List' },

  // Employee Routes
  { route: "/employee/master", category: 'master', code: 'EMP001', name: 'Employee Master' },
  { route: "/employee/add", category: 'other', code: 'EMA001', name: 'Add Employee' },

  // Grade Designation Routes
  { route: "/grade-designation/master", category: 'master', code: 'GDM001', name: 'Grade Designation Master' },
  { route: "/grade-designation/slab-list", category: 'master', code: 'GDS001', name: 'Grade Designation Slab List' },
  { route: "/grade-designation/slab-salary", category: 'master', code: 'GDS002', name: 'Grade Designation Slab Salary' },

  // Salary Head Routes
  { route: "/salary-head/master", category: 'master', code: 'SHM001', name: 'Salary Head Master' },
  { route: "/salary-head/add", category: 'master', code: 'SHA001', name: 'Add Salary Head' },
  { route: "/salary-head/edit/:id", category: 'master', code: 'SHE001', name: 'Edit Salary Head' },
];