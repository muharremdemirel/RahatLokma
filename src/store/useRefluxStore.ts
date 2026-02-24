import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefluxEntry } from '../types';

interface RefluxState {
  entries: RefluxEntry[];
  addEntry: (entry: RefluxEntry) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (updatedEntry: RefluxEntry) => void;
}

export const useRefluxStore = create<RefluxState>()(
  persist(
    set => ({
      entries: [],
      addEntry: entry => set(state => ({ entries: [entry, ...state.entries] })),
      deleteEntry: id =>
        set(state => ({
          entries: state.entries.filter(e => e.id !== id),
        })),

      updateEntry: (updatedEntry: RefluxEntry) =>
        set(state => ({
          entries: state.entries.map(e =>
            e.id === updatedEntry.id ? updatedEntry : e,
          ),
        })),
    }),
    {
      name: 'reflux-storage', // hafızadaki dosya adı bu
      storage: createJSONStorage(() => AsyncStorage), //deepolama birimi olarak AsyncStorage kullandığımız belirttik
    },
  ),
);
