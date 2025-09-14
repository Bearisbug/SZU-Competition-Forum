/**
 * 模仿Rust的Result枚举类型设计
 */
export type Result<T, E> =
  | { ok: true, value: T }
  | { ok: false, value: E };