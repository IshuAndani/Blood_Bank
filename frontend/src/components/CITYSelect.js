import ALLOWED_CITIES from "../constants/cities"

function CITYSelect({value,handleChange}){
    return (
        <>
            <label htmlFor="city">City : </label>
            <select name="city" id="city" className="form-select" value={value} required onChange={handleChange}>
                <option value="">Select City</option>
                {
                    ALLOWED_CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))
                }
            </select>
        </>
    )
}

export default CITYSelect;