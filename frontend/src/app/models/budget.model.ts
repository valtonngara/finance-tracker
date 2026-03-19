export interface Budget {
  id: number;
  category: string;
  amount: number;
  month: string;
  spent?: number;
  created_at: string;
}
