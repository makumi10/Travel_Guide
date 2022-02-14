import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import { PlaceDetails } from '../../components/PlaceDetails/PlaceDetails';

import useStyles from './styles';

export const List = ({ places, childClicked, isLoading, type, setType, rating, setRating }) => {
    const classes = useStyles();
    const [elementRefs, setElementRefs] = useState([]);

    //Call Useeffect everytime places change
    useEffect(() => {
        //Create an array based on places length - then fill starting from position 0 - then map over array
        //return ref at i -- if it doesnt exist create a new ref
        const refs = Array(places?.length).fill().map((_, i) => elementRefs[i] || createRef());

        setElementRefs(refs);
    }, [places])

    return (
        <div className={classes.container}>
            <Typography variant="h4">Resturants, Hotels & Attractions near you</Typography>
            { isLoading ? (
                <div className={classes.loading}>
                    <CircularProgress size="5rem" />
                </div>
            ) : (
                <>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Type</InputLabel>
                        <Select value={type} onChange={(e) => setType(e.target.value)}>
                            <MenuItem value="restaurants">Restaurants</MenuItem>
                            <MenuItem value="hotels">Hotels</MenuItem>
                            <MenuItem value="attractions">Attractions</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel>Rating</InputLabel>
                        <Select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <MenuItem value={0}>All</MenuItem>
                            <MenuItem value={3}>Above 3.0</MenuItem>
                            <MenuItem value={4}>Above 4.0</MenuItem>
                            <MenuItem value={4.5}>Above 4.5</MenuItem>
                        </Select>
                    </FormControl>

                    <Grid container spacing={3} className={classes.list}>
                        {places?.map((place, i) => (
                            <Grid ref={elementRefs[i]} item key={i} xs={12}>
                                <PlaceDetails 
                                    place={place} 
                                    selected={Number(childClicked) === i} 
                                    refProp={elementRefs[i]} 
                                    key={i}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </div>
    );
};
