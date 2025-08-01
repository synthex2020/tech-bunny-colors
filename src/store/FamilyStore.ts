import { create } from 'zustand';
import { Family } from '../types';

interface FamilyState {
  families: Family[];
  current: Family;

  setFamilies: (payload: Family[]) => void;
  setCurrent: (payload: Family) => void;
  fetchFamily: (id: string) => Family | undefined;
  removeFamilies: () => void;
}

const initialFamily: Family = {
  id: '',
  familyName: '',
  patron: '',
  history: '',
};

const useFamilyStore = create<FamilyState>((set, get) => ({
  families: [initialFamily],
  current: initialFamily,

  setFamilies: (payload: Family[]) => set(() => ({ families: payload })),
  setCurrent: (payload: Family) => set(() => ({ current: payload })),
  fetchFamily: (id: string) => {
    const { families } = get();
    return families.find((f) => f.id === id);
  },
  removeFamilies: () => set(() => ({ families: [initialFamily] })),
}));

export default useFamilyStore;
