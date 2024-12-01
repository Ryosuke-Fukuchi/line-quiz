import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl!, supabaseKey!);

export type Task = {
  id: number;
  name: string;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase.from("task").select("*");
  console.log({ error });
  return (data ?? []) as Task[];
};

export const getTaskById = async (id: number): Promise<Task[]> => {
  const { data, error } = await supabase.from("task").select("*").eq("id", id);
  console.log({ error });
  return (data ?? []) as Task[];
};
