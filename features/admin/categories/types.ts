export type AdminCategory = {
  id: string;
  name: string;
  parentId: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
  children: AdminCategory[];
};

export type CategoryInput = {
  name: string;
  parentId: string | null;
};

