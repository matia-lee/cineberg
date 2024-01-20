import { useState, useEffect } from 'react';

const MovieCard = ({ movie }) => {
    const [genres, setGenres] = useState([]);