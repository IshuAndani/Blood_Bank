import { useEffect, useState } from 'react';

export default function DOBInput({ handleChange }){
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const min = new Date(today.getFullYear() - 65, today.getMonth(), today.getDate());
    const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    setMinDate(min.toISOString().split('T')[0]);
    setMaxDate(max.toISOString().split('T')[0]);
  }, []);

  return (
      <>     
        <label htmlFor="dob"> Date of Birth : </label>
        <input
          type="date"
          name="dob"
          id='dob'
          className="form-control"
          required
          min={minDate}
          max={maxDate}
          onChange={handleChange}
      />
      </>

  );
};
