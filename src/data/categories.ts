import type { CategoryId } from '@/types';

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  { id: 'network', name: '网络', blurb: '网址、协议和数据怎么走', color: '#3D8BFF' },
  { id: 'programming', name: '编程基础', blurb: '变量、函数和代码怎么写', color: '#8B7CFF' },
  { id: 'database', name: '数据库', blurb: '表、查询和数据怎么存', color: '#3DDC97' },
  { id: 'os', name: '操作系统', blurb: '进程、内存和文件怎么管', color: '#F0A05A' },
  { id: 'security', name: '网络安全', blurb: '加密、登录和攻击怎么防', color: '#F07167' },
  { id: 'web', name: 'Web', blurb: '页面、接口和前后端', color: '#E56BB5' },
  { id: 'python', name: 'Python', blurb: '列表、函数和常见写法', color: '#4B8BFF' },
  { id: 'linux', name: 'Linux', blurb: '日常命令怎么用', color: '#E0B15A' },
  { id: 'ruankao', name: '软考', blurb: '初级考试里的基础概念', color: '#7FD0C4' },
  { id: 'custom', name: '自建', blurb: '自己添加的术语', color: '#A7B0BB' },
];

export const categoryById: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>;

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}
