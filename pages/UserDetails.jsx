import { userService } from "../services/user.service.js"
import { saveUser } from "../store/actions/user.actions.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function UserDetails() {

    const [userToEdit, setUserToEdit] = useState(userService.getLoggedinUser())
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (params.userId) loadUser()
    }, [])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUserToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange(ev){
        console.log("handleChange triggered:", ev.target.name, ev.target.value); 
            const { name, value } = ev.target;
        
            setUserToEdit((prevUser) => ({
                ...prevUser,
                ...(name === "fullname" 
                    ? { fullname: value } 
                    : { prefs: { ...prevUser.prefs, [name]: value } })
            }));
    }

    function onSubmitDetails(ev) {
        ev.preventDefault();
        saveUser(userToEdit)
            .then(() => {
                alert("Profile updated!");
                navigate("/"); // ✅ Redirect or handle success
            })
            .catch(err => console.log("Save error:", err));
    }

    let {fullname, prefs} = userToEdit;
    if (!userToEdit) return <div>Loading...</div>;
    return (
        <section className="user-details">
            <h2>Profile</h2>
            <form onSubmit={onSubmitDetails}>
                <input value={fullname} onChange={handleChange}
                    type="text" id="fullname" name="fullname"
                />
                <label htmlFor="color">Color: </label>
                <input value={prefs.color} onChange={handleChange}
                    type="color" id="color" name="color"
                />
                <label htmlFor="bgColor">BgColor: </label>
                <input value={prefs.bgColor} onChange={handleChange}
                    type="color"  id="bgColor" name="bgColor"
                />

                <button>Save</button>
            </form>
        </section>
    )
}