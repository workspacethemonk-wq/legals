import { create } from 'zustand';

interface LegalResponse {
  answer: string;
  model_used: string;
  verified: boolean;
  judge_feedback: string;
}

interface AppState {
  query: string;
  response: LegalResponse | null;
  loading: boolean;
  history: { query: string; answer: string }[];
  floatIntensity: number;
  setQuery: (query: string) => void;
  setResponse: (response: LegalResponse | null) => void;
  setLoading: (loading: boolean) => void;
  addToHistory: (query: string, answer: string) => void;
  setFloatIntensity: (intensity: number) => void;
}

export const useStore = create<AppState>((set) => ({
  query: '',
  response: null,
  loading: false,
  history: [],
  floatIntensity: 0.5,
  setQuery: (query) => set({ query }),
  setResponse: (response) => set({ response }),
  setLoading: (loading) => set({ loading }),
  addToHistory: (query, answer) => 
    set((state) => ({ history: [{ query, answer }, ...state.history].slice(0, 10) })),
  setFloatIntensity: (intensity) => set({ floatIntensity: intensity }),
}));
