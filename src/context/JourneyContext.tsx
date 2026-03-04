'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Location } from '@/data/locations';

interface JourneyState {
    selectedLocations: Location[];
    sidebarOpen: boolean;
    inquiryOpen: boolean;
}

type JourneyAction =
    | { type: 'ADD_LOCATION'; payload: Location }
    | { type: 'REMOVE_LOCATION'; payload: string }
    | { type: 'CLEAR_JOURNEY' }
    | { type: 'TOGGLE_SIDEBAR' }
    | { type: 'SET_SIDEBAR'; payload: boolean }
    | { type: 'SET_INQUIRY'; payload: boolean }
    | { type: 'HYDRATE'; payload: Location[] };

const initialState: JourneyState = {
    selectedLocations: [],
    sidebarOpen: false,
    inquiryOpen: false,
};

function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
    switch (action.type) {
        case 'ADD_LOCATION': {
            if (state.selectedLocations.find((l) => l.id === action.payload.id)) return state;
            const updated = [...state.selectedLocations, action.payload];
            return { ...state, selectedLocations: updated };
        }
        case 'REMOVE_LOCATION': {
            const updated = state.selectedLocations.filter((l) => l.id !== action.payload);
            return { ...state, selectedLocations: updated };
        }
        case 'CLEAR_JOURNEY':
            return { ...state, selectedLocations: [] };
        case 'TOGGLE_SIDEBAR':
            return { ...state, sidebarOpen: !state.sidebarOpen };
        case 'SET_SIDEBAR':
            return { ...state, sidebarOpen: action.payload };
        case 'SET_INQUIRY':
            return { ...state, inquiryOpen: action.payload };
        case 'HYDRATE':
            return { ...state, selectedLocations: action.payload };
        default:
            return state;
    }
}

interface JourneyContextType {
    state: JourneyState;
    addLocation: (location: Location) => void;
    removeLocation: (id: string) => void;
    clearJourney: () => void;
    toggleSidebar: () => void;
    setSidebar: (open: boolean) => void;
    setInquiry: (open: boolean) => void;
    isSelected: (id: string) => boolean;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(journeyReducer, initialState);

    // Hydrate from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('kyrgyz-journey');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    dispatch({ type: 'HYDRATE', payload: parsed });
                }
            }
        } catch {
            // ignore
        }
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem('kyrgyz-journey', JSON.stringify(state.selectedLocations));
        } catch {
            // ignore
        }
    }, [state.selectedLocations]);

    const addLocation = (location: Location) => dispatch({ type: 'ADD_LOCATION', payload: location });
    const removeLocation = (id: string) => dispatch({ type: 'REMOVE_LOCATION', payload: id });
    const clearJourney = () => dispatch({ type: 'CLEAR_JOURNEY' });
    const toggleSidebar = () => dispatch({ type: 'TOGGLE_SIDEBAR' });
    const setSidebar = (open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open });
    const setInquiry = (open: boolean) => dispatch({ type: 'SET_INQUIRY', payload: open });
    const isSelected = (id: string) => state.selectedLocations.some((l) => l.id === id);

    return (
        <JourneyContext.Provider
            value={{ state, addLocation, removeLocation, clearJourney, toggleSidebar, setSidebar, setInquiry, isSelected }}
        >
            {children}
        </JourneyContext.Provider>
    );
}

export function useJourney() {
    const context = useContext(JourneyContext);
    if (!context) throw new Error('useJourney must be used within a JourneyProvider');
    return context;
}
