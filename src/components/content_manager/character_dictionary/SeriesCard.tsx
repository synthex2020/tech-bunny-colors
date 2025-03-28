import React, { useState } from 'react';
import { useNavigate } from "react-router";
import SeriesMoreDetailsModal from "./SeriesMoreDetailModal";
import {
    BookOpen,
    Users,
    MapPin,
    Calendar,
    PlusCircle,
    Info
} from 'lucide-react';

interface Locations {
    title: string;
    type: string;
    geoLocation: string;
    description: string;
    images: string[];
}

interface ImportantEvents {
    title: string;
    date: string;
    importance: string;
    description: string;
    images: string[];
}

interface Character {
    name: string;
    titles: string;
    sex: string;
    gender: string;
    species: string;
    personality: string;
    family: string[];
    hair: string;
    fashion: string;
    quirks: string;
    relationship: string;
    orientation: string;
    race: string;
    age: string;
    images: string[];
    powers: string;
    martialArts: string;
    hobbies: string;
    equipment: string;
    backstory: string;
    references: string;
    referenceImages: string[];
    characterSheet: string;
    bodyModifications: string;
    anatomyMeasurements: string
}

interface Series {
    title: string;
    authors: string;
    artists: string;
    genre: string;
    age: string;
    thumbnail: string;
    description: string;
    plot: string;
    auidence: string;
    history: string;
    physics: string;
    world: string;
    issues: number;
    volumes: number;
    merchandised: boolean;
    published: boolean;
    currentStatus: string;
    powerSystem: string[];
    images: string[];
    timeline: ImportantEvents[];
    locations: Locations[];
    characters: Character[];
}

interface SeriesCardProps {
    series: Series;
    index: number;
}

function SeriesCard({ series, index }: SeriesCardProps) {
    const navigate = useNavigate();
    const [seriesId] = useState('');

    return (
        <div className="card w-96 bg-base-100 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {/* Thumbnail Section */}
            <figure className="relative">
                <img
                    src={series.thumbnail}
                    alt={`${series.title} Thumbnail`}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 badge badge-primary">
                    {series.genre}
                </div>
            </figure>

            {/* Card Body */}
            <div className="card-body">
                {/* Series Title and Status */}
                <div className="flex justify-between items-center">
                    <h2 className="card-title text-xl font-bold">{series.title}</h2>
                    <div className={`badge ${series.published ? 'badge-success' : 'badge-warning'}`}>
                        {series.currentStatus}
                    </div>
                </div>

                {/* Series Details */}
                <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                        <BookOpen size={16} className="text-primary" />
                        <span>By {series.authors}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users size={16} className="text-primary" />
                        <span>Audience: {series.auidence}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-primary" />
                        <span>Issues: {series.issues} | Volumes: {series.volumes}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="card-actions flex flex-wrap gap-2 mt-4">
                    {/* More Details Modal */}
                    <SeriesMoreDetailsModal
                        series={series}
                        modalId={index.toString()}
                    />

                    {/* Add Character Button */}
                    <button
                        className="btn btn-outline text-sm" 
                        onClick={() => navigate('/characterDir/addNewCharacter', {
                            state: { seriesId: seriesId }
                        })}
                    >
                        <PlusCircle size={16} />
                        Add Character
                    </button>

                    {/* Add New Series Button */}
                    <button
                        className="btn btn-outline text-sm"
                        onClick={() => navigate('/characterDir/addNewSeries')}
                    >
                        <PlusCircle size={16} />
                        New Series
                    </button>
                </div>

                {/* Navigation Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    <button
                        className="btn btn-ghost btn-sm flex flex-col items-center"
                        onClick={() => navigate('/characterDir/locationsTable', {
                            state: series.locations
                        })}
                    >
                        <MapPin size={16} />
                        Locations
                    </button>
                    <button
                        className="btn btn-ghost btn-sm flex flex-col items-center"
                        onClick={() => navigate('/characterDir/charactersTable', {
                            state: series.characters
                        })}
                    >
                        <Users size={16} />
                        Characters
                    </button>
                    <button
                        className="btn btn-ghost btn-sm flex flex-col items-center"
                        onClick={() => navigate('/characterDir/importantEvents', {
                            state: series.timeline
                        })}
                    >
                        <Calendar size={16} />
                        Events
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SeriesCard;