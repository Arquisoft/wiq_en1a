import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiEndpoint = 'http://localhost:8000';

const Rankings = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/rankings`);
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    return (
        <div className='main'>
            <div class="bg-white shadow-md rounded-md p-4 mx-auto max-w-sm mt-16">
                <h1 class="text-xl font-semibold mb-4">Rankings</h1>
                <ul>
                    {users.map(user => (
                        <li class="flex items-center justify-between py-2 border-b border-gray-300">
                            <div class="flex items-center">
                                <span class="text-lg font-semibold mr-4">{user.ranking}</span>
                                <span class="text-gray-800 font-semibold">{user.user}</span>
                            </div>
                            <span class="text-green-500 font-semibold">{user.points} points</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Rankings