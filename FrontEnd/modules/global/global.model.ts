export type FilterNode = {
  label: string,
  key: string,
  children?: FilterNode[]
}

export type FilterCategory = {
  title: string,
  key: string,
  options: FilterNode[]
}