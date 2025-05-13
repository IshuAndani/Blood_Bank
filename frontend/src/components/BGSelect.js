import { BLOOD_GROUPS } from "../constants/bloodGroups"

function BGSelect({handleChange}){
    return (
        <>
            <label htmlFor="bloodGroup">Blood Group : </label>
            <select name="bloodGroup"  id="bloodGroup" className="form-select" required onChange={handleChange}>
                <option value="">Select Blood Group</option>
                {
                    BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                    ))
                }
            </select>
        </>
    )
}

export default BGSelect;