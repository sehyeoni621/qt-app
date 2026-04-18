import { create } from "zustand";
import { initialTodos, type MoodLevel, type Todo } from "./mockData";

type HomeState = {
  mood: MoodLevel | null;
  todos: Todo[];
  setMood: (m: MoodLevel) => void;
  toggleTodo: (id: string) => void;
};

export const useHomeStore = create<HomeState>((set) => ({
  mood: null,
  todos: initialTodos,
  setMood: (mood) => set({ mood }),
  toggleTodo: (id) =>
    set((s) => ({
      todos: s.todos.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    })),
}));
