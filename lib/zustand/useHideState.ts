import { create } from "zustand";

interface HideProps {
  hide: boolean;
  setHide: (e: boolean) => void;
}

export const useHideState = create<HideProps>((set) => ({
  hide: false,
  setHide: (e) => set(() => ({ hide: e })),
}));
