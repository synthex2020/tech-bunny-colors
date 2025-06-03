//  The central place to manage state for Series 
import { create } from 'zustand';
import { Character, Series, SeriesEvent, SeriesLocation } from '../types';

interface SeriesState {
    //  ADD LISTS FOR LOCATIONS, EVENTS AND MEDIA 
    series: Series[];
    locations : SeriesLocation[];
    events : SeriesEvent[];
    characters: Character[];

    current: Series;
    currentCharacter: Character;
    currentEvent : SeriesEvent;
    currrentLocations : SeriesLocation;

    //  FUNCTIONS TO MANIPULATE THE SERIES STATE 

    //  ADD CURRENT SERIES FOR THE CHARACTER TABLE DISPLAY
    setSeries: (payload: Series[]) => void;
    setCurrent: (payload: Series) => void;
    fetchSeries: (payload: string) => Series;
    removeSeries: () => void;

    setCharacters: (payload: Character[]) => void;
    setCurrentCharacter: (payload: Character) => void;
    removeCharacters: () => void;

    setSeriesLocations : (payload : SeriesLocation[]) => void;
    setCurrentLocation : (payload : SeriesLocation) => void;
    removeSeriesLocations : () => void;

    setSeriesEvents : (payload : SeriesEvent[]) => void;
    setCurrentSeriesEvent : (payload : SeriesEvent) => void;
    removeSeriesEvent : () => void;


};

const initialState: Series = {
    id: '',
    createdAt: '',
    title: '',
    authors: '',
    artists: '',
    genre: '',
    thumbnail: '',
    description: '',
    plot: '',
    audience: '',
    history: '',
    physics: '',
    world: '',
    issues: 0,
    volumes: 0,
    merchandise: false,
    published: false,
    status: '',
    powerSystem: '',
    characters: [],
    locations: [],
    timeline: [],
    media: ['']
};

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
    reference_images : '',
    bodyMods: '',
    anatomy: '',
    model: '',
    family: [],
    referenceMedia: [],
    media: []
}

const initalLocations : SeriesLocation = {

    id : '',
    createdAt : '',
    title : '',
    type : '',
    geoLocation : '',
    description : '',
    locationMedia : []
};

const initialEvents : SeriesEvent = { 
    id : '',
    createdAt :  '',
    title :  '',
    date :  '',
    importance :  '',
    description :  '',
    eventsMedia : []
};





const useSeriesStore = create<SeriesState>((set, get) => ({
    series: [initialState],
    current: initialState,
    characters: initialState.characters,
    currentCharacter: initialCharacter,
    locations : [initalLocations],
    events : [initialEvents],
    currentEvent : initialEvents,
    currrentLocations : initalLocations,
    setSeries: (payload: Series[]) => set((state) => ({ ...state, series: payload })),
    setCurrent: (payload: Series) => set(() => ({ current: payload })),
    fetchSeries: (id: string) => {
        const { series } = get();
        let result = initialState;

        series.forEach((value: Series) => {
            if (value.id === id) {
                result = value;
            } // end if 
        })

        // Update current series and characters
        set(() => ({
            current: result,
            characters: result.characters || [],
        }));

        //console.log('Series search list : ', series)
       // console.log('Search result : ', result)
       // console.log('Series Characters : ', result?.characters)
        return result
    },
    removeSeries: () => set({ series: [initialState] }),
    setCharacters: (payload: Character[]) => set((state) => ({ ...state, characters: payload })),
    setCurrentCharacter: (payload: Character) => set(() => ({ currentCharacter: payload })),
    removeCharacters: () => set({ characters: [initialCharacter] }),

    setSeriesEvents : (payload : SeriesEvent[]) => set((state) => ({...state, events: payload})),
    setCurrentSeriesEvent : (payload : SeriesEvent) => set(() => ({currentEvent : payload}) ),
    removeSeriesEvent : () => set({events : [initialEvents]}),

    setSeriesLocations : (payload : SeriesLocation[]) => set((state) => ({...state, locations : payload})),
    setCurrentLocation : (payload: SeriesLocation) => set(() => ({currrentLocations : payload})),
    removeSeriesLocations : () => set({locations : [initalLocations]})
}));

export default useSeriesStore;