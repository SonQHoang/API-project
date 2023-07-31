import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { getAllSpots, deleteSpot, updateSpot } from '../../store/spots';
import { useEffect } from 'react';


function GetAllSpots() {
    // const history = useHistory();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const spots = useSelector(state => {
        return Object.values(state.spots.allSpots)
    });

    const handleDelete = (spotId) => {
        dispatch(deleteSpot(spotId))
    }

    const handleUpdate = (spotId) => {
        dispatch(updateSpot(spotId))
    }

    return (
        <>
            <h1>Your Spots</h1>

            {spots.map(spot => {
                return (
                    <div key={spot.id}>
                        <h2>{spot.name}</h2>
                        <p>{`City: ${spot.city}`}</p>
                        <p>{`State: ${spot.state}`}</p>
                        <p>{`Country: ${spot.country}`}</p>
                        <button onClick={() => handleDelete(spot.id)}>Delete</button>
                        <button onClick={() => handleUpdate(spot.id)}>Update</button>
                    </div>
                )
            })}
        </>
    )
}

export default GetAllSpots;