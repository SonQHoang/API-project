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
                <li>
                    <Link to='/spots/:spotId/update'>Update Your Spots</Link>
                </li>
                <li>
                    <Link to='/spots/:spotId/delete'>Delete Your Spots</Link>
                </li>
            </ul>
        </>
    )
}

export default ManageSpots;