import api from './api';

export const bookAppointment = async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
};

export const getMyAppointments = async () => {
    const response = await api.get('/appointments');
    return response.data;
};

export const updateStatus = async (id, status) => {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
};
