import netlifyIdentity from 'netlify-identity-widget';
const API_URL = `/.netlify/functions`;

export const apiDeleteProject = async id => {
  const url = `${API_URL}/project/${id}`;
  return fetcher(url, { method: 'DELETE' });
};

export const apiPatchProject = async (id, data) => {
  const url = `${API_URL}/project/${id}`;
  return fetcher(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const apiPostProject = async data => {
  const url = `${API_URL}/project`;
  return fetcher(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const fetchProject = async id => {
  const url = `${API_URL}/project/${id}`;
  return fetcher(url);
};

export const fetchAllProjects = async pagination => {
  const queryParams = new URLSearchParams(pagination);
  const url = `${API_URL}/all-projects?${queryParams}`;
  return fetcher(url);
};

export const fetchMyProjects = async pagination => {
  const queryParams = new URLSearchParams(pagination);
  const url = `${API_URL}/my-projects?${queryParams}`;
  return fetcher(url);
};

export const fetcher = async (url, opts) => {
  const currentUser = netlifyIdentity.currentUser();
  let token;
  if (currentUser) {
    token = await currentUser.jwt();
  }
  const res = await fetch(url, {
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
    ...opts,
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
};
