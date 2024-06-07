export interface Todo {
  id?: string;
  title: string;
  completed: boolean;
  metadata?: Record<string, unknown>;
}
