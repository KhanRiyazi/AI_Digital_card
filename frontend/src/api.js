import axios from 'axios';
import toast from 'react-hot-toast';

const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://127.0.0.1:8000';
    return 'https://ai-digital-card.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
            toast.error('Session expired. Please login again.');
            sessionStorage.removeItem('admin_auth_smart');
            window.location.reload();
        } else {
            toast.error(error.response?.data?.detail || 'Request failed');
        }
        return Promise.reject(error);
    }
);

export const API_URLS = {
    PREDICT: '/predict',
    HEALTH: '/health',
    STUDENTS: '/users',
    ANALYTICS: '/analytics',
    TRAINING: '/training',
    AUTH_LOGIN: '/auth/login',
    AUTH_VERIFY: '/auth/verify',
};

export const getStudents = () => {
    const students = localStorage.getItem('smart_student_id_v2');
    return students ? JSON.parse(students) : [];
};

export const saveStudents = (students) => {
    localStorage.setItem('smart_student_id_v2', JSON.stringify(students));
};

export const addStudent = (student) => {
    const students = getStudents();
    const newStudent = {
        ...student,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        attendance: student.attendance || 85,
        examScore: student.examScore || 72,
        parentEngagement: student.parentEngagement || 6.5
    };
    students.push(newStudent);
    saveStudents(students);
    toast.success('Student registered successfully!');
    return newStudent;
};

export const updateStudent = (id, updatedData) => {
    const students = getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        students[index] = { ...students[index], ...updatedData, updatedAt: new Date().toISOString() };
        saveStudents(students);
        toast.success('Student updated successfully!');
        return students[index];
    }
    toast.error('Student not found');
    return null;
};

export const deleteStudent = (id) => {
    const students = getStudents();
    const filtered = students.filter(s => s.id !== id);
    saveStudents(filtered);
    toast.success('Student deleted successfully!');
    return filtered;
};

export const predictPerformance = async (data) => {
    try {
        const response = await apiClient.post(API_URLS.PREDICT, data);
        return response.data;
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post(API_URLS.AUTH_LOGIN, { email, password });
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const exportData = () => {
    const students = getStudents();
    const blob = new Blob([JSON.stringify(students, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
};

export const getAuthStatus = () => {
    return sessionStorage.getItem('admin_auth_smart') === 'true';
};

export const setAuthStatus = (status) => {
    if (status) {
        sessionStorage.setItem('admin_auth_smart', 'true');
    } else {
        sessionStorage.removeItem('admin_auth_smart');
    }
};