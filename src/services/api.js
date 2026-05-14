// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // matches your backend port
});

// No token needed for now – you can add later if you implement auth

export const createParcel = async (parcelData) => {
    const response = await api.post('/parcels', parcelData);
    return response.data;
};

// Get all parcels (will filter by userEmail on the frontend)
export const getParcels = async () => {
    const response = await api.get('/parcels');
    return response.data;  
};

export const getParcelById = async (id) => {
    const response = await api.get(`/parcels/${id}`);
    return response.data;
};

export const updateParcel = async (id, parcelData) => {
    const response = await api.put(`/parcels/${id}`, parcelData);
    return response.data;
};

export const deleteParcel = async (id) => {
    const response = await api.delete(`/parcels/${id}`);
    return response.data;
};

// Convenience function that filters parcels for the current user
export const fetchMyParcels = async (userEmail) => {
    const allParcels = await getParcels();
    return allParcels.filter(parcel => parcel.userEmail === userEmail);
};

export const createRiderApplication = async (applicationData) => {
    const response = await api.post('/rider-applications', applicationData);
    return response.data;
}

