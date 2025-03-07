export interface MenuListResponse {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  icon: string;
  orderNum: number;
  permissionId: string | null;
  type: string;
  component: string;
  inAnimation: string;
  outAnimation: string;
  createdAt: string;
  updatedAt: string;
  children: MenuListResponse[] | null;
}
