import React from "react";
import useSeriesStore from "../store/SeriesStore";
import { Series } from "../types";

const SeriesStoreFront = () => {
    const seriesStore = useSeriesStore();
    
    const handleData = (newData : Series[]) => {
        seriesStore.setSeries(newData);
    };

    
    
};

export default SeriesStoreFront;