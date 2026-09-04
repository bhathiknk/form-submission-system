import apiClient from './apiClient';

export async function createSubmission(payload) {
  const { data } = await apiClient.post('/submissions', payload);
  return data;
}

export async function getSubmissions({ gender, search, page = 1, limit = 20 } = {}) {
  const params = { page, limit };
  if (gender) params.gender = gender;
  if (search) params.search = search;
  const { data } = await apiClient.get('/submissions', { params });
  return data;
}

export async function updateSubmission(id, payload) {
  const { data } = await apiClient.put(`/submissions/${id}`, payload);
  return data;
}

export async function deleteSubmission(id) {
  const { data } = await apiClient.delete(`/submissions/${id}`);
  return data;
}
