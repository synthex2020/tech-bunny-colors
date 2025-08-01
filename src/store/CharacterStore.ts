import { create } from 'zustand';
import { Character } from '../types';


interface CharacterState {
    characters: Character[];
    current: Character;

    setCharacters: (payload: Character[]) => void;
    setCurrent: (payload: Character) => void;
    fetchCharacter: (id: string) => Character | undefined;
    removeCharacters: () => void;
}

const initialCharacter: Character = {
    id: '',
    createdAt: '',
    titles: '',
    name: '',
    sex: '',
    gender: '',
    species: '',
    personality: '',
    hair: '',
    fashion: '',
    quirks: '',
    relationships: '',
    orientation: '',
    race: '',
    age: '',
    powers: '',
    martialArts: '',
    hobbies: '',
    equipment: '',
    backstory: '',
    references: '',
    characterSheet: '',
    bodyMods: '',
    anatomy: '',
    model: '',
    family: [],
    referenceMedia: [],
    media: [],
};

const useCharacterStore = create<CharacterState>((set, get) => ({
    characters: [initialCharacter],
    current: initialCharacter,

    setCharacters: (payload: Character[]) => set(() => ({ characters: payload })),
    setCurrent: (payload: Character) => set(() => ({ current: payload })),
    fetchCharacter: (id: string) => {
        const { characters } = get();
        return characters.find((c) => c.id === id);
    },
    removeCharacters: () => set(() => ({ characters: [initialCharacter] })),
}));

export default useCharacterStore;
