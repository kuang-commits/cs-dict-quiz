import type { CategoryId } from '@/types';

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  { id: 'network', name: '网络', blurb: '网址、协议和数据怎么走', color: '#1D6FDB' },
  { id: 'programming', name: '编程基础', blurb: '变量、函数和代码怎么写', color: '#6D4AFF' },
  { id: 'database', name: '数据库', blurb: '表、查询和数据怎么存', color: '#0E7A5F' },
  { id: 'os', name: '操作系统', blurb: '进程、内存和文件怎么管', color: '#D4652F' },
  { id: 'security', name: '网络安全', blurb: '加密、登录和攻击怎么防', color: '#C2413B' },
  { id: 'web', name: 'Web', blurb: '页面、接口和前后端', color: '#C43B7A' },
];

export const categoryById: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}
