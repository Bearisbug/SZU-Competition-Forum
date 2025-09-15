export type FilterNode = {
  value: string,
  children?: FilterNode[]
}

export type FilterCategory<T extends string = string> = {
  title: string,
  key: T,
  options: FilterNode[]
}