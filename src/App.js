import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';
import { Map } from './components/Map/Map';
import { getPlacesData, getWeatherData } from './api';

export const App = () => {
    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);
    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants');
    const [rating, setRating] = useState('');
    
    //Grab User's Geolocation -- Only At the Start
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude}}) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    },[])

    //Grab the Data of all the Places - reload when dependency array changes
    useEffect(() => {
        if(bounds.sw && bounds.ne) {
            setIsLoading(true);

            //GET Weather Information
            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data) => setWeatherData(data))

            //GET Places Information
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) => {
                    //Filter for Places that have Names and Reviews greater than 0
                    setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
    
                    setFilteredPlaces([])
                    setIsLoading(false);
                })
        }
    }, [type, bounds])

    //Update the Rating
    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating);

        setFilteredPlaces(filteredPlaces);
    }, [rating])

    return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />

            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places} 
                        childClicked={childClicked} 
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setCoordinates={setCoordinates} 
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </>
    );
};