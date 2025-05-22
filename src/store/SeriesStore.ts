//  The central place to manage state for Series 
import { create } from 'zustand';
import { Series } from '../types';

interface SeriesState {
    series: Series[];
    current : Series;
    //  FUNCTIONS TO MANIPULATE THE SERIES STATE 
   
    //  ADD CURRENT SERIES FOR THE CHARACTER TABLE DISPLAY
    setSeries: (payload: Series[]) => void;
    setCurrent : (payload: Series) => void;
    fetchSeries : (payload: string) => Series | undefined;
    removeSeries: () => void;
    
    
};

const initialState: Series = {
    id: '',
    createdAt: '',
    title: '',
    authors: '',
    artists: '',
    genre: '',
    thumbnail:'',
    description:'',
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
    media: []
};

const useSeriesStore = create<SeriesState>((set, get) => ({
    series: [initialState],
    current : initialState,
    setSeries : (payload : Series[]) => set((state) => ({...state, series: payload})),
    setCurrent : (payload : Series) => set(() => ({current : payload})),
    fetchSeries : (id : string) => {
        const {series} = get();
        console.log(series)
        const result =  series.find((s : Series) => s.id === id);
        console.log(result)
        return result
    },
    removeSeries : () => set({series: [initialState]})
}));

export default useSeriesStore;