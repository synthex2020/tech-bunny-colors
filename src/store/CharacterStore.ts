import { create } from 'zustand';
import { Character, CharacterProfile } from '../types';


interface CharacterState {
    characters: Character[];
    current: Character;
    profile : CharacterProfile;

    setCharacters: (payload: Character[]) => void;
    setCurrent: (payload: Character) => void;
    setCurrentCharacterProfile : (payload: CharacterProfile) => void;
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
    character_sheet: '',
    bodyMods: '',
    anatomy: '',
    model: '',
    family: [],
    referenceMedia: [],
    media: [],
};

const initialProfile: CharacterProfile = {
  identity: {
    name: "",
    nickname: "",
    gender: "",
    family: "",
    education: "",
    address: "",
    languages: [],
    career: [],
    pets: [],
    plants: [],
    religion: "",
    favouriteColor: "",
    favouriteFood: "",
    favouriteObject: "",
    luckyNumber: 0,
    fears: [],
    supernatural: {
      fightStyle: "",
      class: "",
      strengths: [],
      weaknesses: [],
      primaryElement: "",
      secondaryElement: "",
      tertiaryElement: "",
    },
  },
  anatomy: {
    age: 15,
    sex: "Male",
    race: "",
    species: "",
    bodyType: "",
    bloodType: "",
    height: "",
    weight: "",
    eyesight: "",
    colorBlind: "",
    glasses: false,
    handed: "",
    voice_type: "",
    scars: [],
    burns: [],
    skinDamage: [],
    tattoos: [],
    birthmarks: [],
    nose: "",
    eyes: "",
    posture: "",
    breast: "",
    legs: "",
    moles: [],
  },
  personality: {
    sayings: "",
    hobbies: "",
    habits: [],
    personality: "",
    insecurities: [],
  },
  bio: {
    dob: "",
    dod: "",
    birthplace: "",
    surgeries: [],
    cavities: [],
    sexualHistory: [],
    currentLovers: [],
    pastLovers: [],
    relationshipStatus: "",
    problemRelationships: "",
    familyRelationships: "",
    friends: [],
    rivals: [],
    admires: [],
    hates: [],
    philosphyLove: "",
    phiolosphyRelationships: "",
    childhood: "",
    criminalRecord: [],
    fears: [],
    successes: [],
    failures: [],
    dreams: [],
  },
  other: {
    inspiration: "",
    referenceImage: null,
  },
};

const useCharacterStore = create<CharacterState>((set, get) => ({
    characters: [initialCharacter],
    current: initialCharacter,
    profile: initialProfile,

    setCharacters: (payload: Character[]) => set(() => ({ characters: payload })),
    setCurrent: (payload: Character) => set(() => ({ current: payload })),
    setCurrentCharacterProfile: (payload : CharacterProfile) => set(() => ({profile: payload})),
    fetchCharacter: (id: string) => {
        const { characters } = get();
        return characters.find((c) => c.id === id);
    },
    removeCharacters: () => set(() => ({ characters: [initialCharacter] })),
}));

export default useCharacterStore;
