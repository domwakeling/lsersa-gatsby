import React from 'react';
import PulseLoader from 'react-spinners/PulseLoader'

const LoadingSpinner = () => {
    return (
        <PulseLoader color="#172a95" size={10} speedMultiplier={0.75} loading={true} />
    )
}

export default LoadingSpinner;