import api from "../api";

export const createBloodBank = async ({name, city, coordinates}) => {
    const res = await api.post('/bloodbank/create',{name,city,coordinates});
    return res;
}

export const getBloodBanks = async () => {
    const res = await api.get('/bloodbank');
    return res;
}

export const getBloodBankDonations = async (id) => {
    const res = await api.get(`/bloodbank/${id}/donations`);
    return res;
}

