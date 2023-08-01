import { Link } from 'react-router-dom'

function ManageSpots() {
    // const dispatch = useDispatch();
    // const history = useHistory();

    return (
        <>
            <h1>Manage Spots</h1>
            <ul>
                <li>
                    <Link to='/spots/all'>Get Your Spots</Link>
                </li>
                <li>
                    <Link to='/spots/new'>Create a New Spot</Link>
                </li>
    {/* //! Unless it's necessary, going to potentially add a feature later where pressing either of these links will allow for you to go to a list of the spots in question and then perform the CRUD
    //? I'll ask a question later to see if these need to be on manage Spots or if it can be just inside Get Your Spots */}
                {/* <li>
                    <Link to='/spots/:spotId/update'>Update Your Spots</Link>
                </li> */}
                {/* <li>
                    <Link to='/spots/:spotId/delete'>Delete Your Spots</Link>
                </li> */}
            </ul>
        </>
    )
}

export default ManageSpots;