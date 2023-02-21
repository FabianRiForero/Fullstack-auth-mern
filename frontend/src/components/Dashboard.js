import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    refreshToken();
    getUsers();
  }, [token]);

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:5000/token');
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
    } catch (error) {
      if (error.response) {
        history.push('/');
      }
    }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async config => {
    const currentDate = new Date();
    console.log({ currentDate });
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:5000/token');
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      console.log(config.headers.Authorization);
    }
    return config;
  }, error => Promise.reject(error));

const getUsers = async () => {
  const Authorization = `Bearer ${token}`;
  console.log({Authorization});
  const response = await axios.get('http://localhost:5000/users', {
    headers: {
      Authorization
    }
  });
  setUsers(response.data);
}

return (
  <div className='container mt-5'>
    <h1>Welcome Back: {name}</h1>
    <table className='table is-striped is-fullwidth'>
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}

export default Dashboard