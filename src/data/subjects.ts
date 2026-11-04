import type { CategoryId } from '@/types';

export type SubjectLevel = '入门' | '基础' | '进阶';

export type CatalogSubject = {
  id: string;
  name: string;
  blurb: string;
  level: SubjectLevel;
  categoryId: CategoryId;
};

export const CATALOG: CatalogSubject[] = [
  { id: 'network', name: '网络基础', blurb: '地址、协议和数据怎么走', level: '入门', categoryId: 'network' },
  { id: 'programming', name: '编程基础', blurb: '变量、函数和代码结构', level: '入门', categoryId: 'programming' },
  { id: 'linux', name: 'Linux 命令', blurb: '列出、切换、查找和权限', level: '入门', categoryId: 'linux' },
  { id: 'database', name: '数据库', blurb: '表、查询和事务', level: '基础', categoryId: 'database' },
  { id: 'web', name: 'Web 前端', blurb: '页面、样式和请求', level: '基础', categoryId: 'web' },
  { id: 'python', name: 'Python', blurb: '列表、模块和常见写法', level: '基础', categoryId: 'python' },
  { id: 'os', name: '操作系统', blurb: '进程、内存和文件', level: '基础', categoryId: 'os' },
  { id: 'security', name: '网络安全', blurb: '加密、登录和攻击', level: '进阶', categoryId: 'security' },
  { id: 'ruankao', name: '软考初级', blurb: '编码、生命周期和测试', level: '进阶', categoryId: 'ruankao' },
];

export const catalogById: Record<string, CatalogSubject> = Object.fromEntries(
  CATALOG.map((subject) => [subject.id, subject]),
);
