// types.ts
export type FilterCategory = "category" | "date" | "author" | "goals" | "requirements" | "roles";

export type FilterOption = {
  category: FilterCategory;
  label: string;
  value: string;
};

export type FilterCategoryData = {
  title: string;
  category: FilterCategory;
  options: FilterOption[];
};