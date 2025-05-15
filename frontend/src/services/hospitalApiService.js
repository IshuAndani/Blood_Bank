import api from "../api";

export const createHospital = async ({name, city, coordinates}) => {
    const res = await api.post('/hospital/create',{name,city,coordinates});
    return res;
}

export const getHospitals = async () => {
    const res = await api.get('/hospital');
    return res;
}