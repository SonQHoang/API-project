import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
import { getAllSpots } from '../../store/spots';
import { useEffect } from 'react';
// import UpdateSpotModal from '../UpdateSpotModal'

function GetAllSpots() {
    // const history = useHistory();
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    const spots = useSelector(state => Object.values(state.spots.allSpots)
    );


    // const [showUpdateModal, setShowUpdateModal] = useState(false);
    // const [selectedSpotId, setSelectedSpotId] = useState(null)



    return (
        <>
            <h1>All Spots</h1>

            {spots.map(spot => {
                return (
                    <div key={spot.id}>
                        <h2>{spot.name}</h2>
                        <p>{`Address: ${spot.address}`}</p>
                        <p>{`City: ${spot.city}`}</p>
                        <p>{`State: ${spot.state}`}</p>
                        <p>{`Country: ${spot.country}`}</p>
                        <p>{`Description: ${spot.description}`}</p>
                        {spot.largeImageUrl && <img src={spot.largeImageUrl} alt="Guitar" />}
                        {spot.SpotImages && spot.SpotImages.map((image, index) => (
                            <img key={index} src={image.url} alt={`Guitar ${index + 1}`} />
                        ))}

                    </div>
                )
            })}
            {/* {showUpdateModal && (
                <UpdateSpotModal
                    spotId={selectedSpotId}
                    onClose={() => setShowUpdateModal(false)}
                />
            )} */}
        </>
    )
}

export default GetAllSpots