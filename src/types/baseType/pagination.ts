/**
 * 通用分页查询参数接口
 */
export interface PaginationDto {
  /**
   * 页码，从1开始
   * 不能小于1
   */
  page: number;

  /**
   * 每页条数
   * 范围：1-100
   */
  pageSize: number;

  /**
   * 可选排序字段
   */
  sortField?: string;

  /**
   * 排序方向：asc/desc
   */
  sortOrder?: 'ascend' | 'descend';
}
