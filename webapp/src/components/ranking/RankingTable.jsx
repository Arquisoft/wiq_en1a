import React, { useState, useEffect } from "react";
import axios from "axios";

const apiEndpoint =  process.env.REACT_APP_API_ENDPOINT ||'http://localhost:8000';

const RankingsTable = ({ filter }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${apiEndpoint}/rankings/${filter}`);
            setUsers(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        fetchData();
      }, [filter]);

    return (
        <div data-testid='ranking-table' className="flex flex-col">
          <div className="overflow-x-auto sm:mx-6 lg:mx-8">
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">User</th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Points</th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Questions</th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Correct</th>
                      <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    { 
                      users.map(user => (
                        <tr className="border-b">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.position}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.points}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.questions}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.correct}</td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{user.wrong}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    )
}

export default RankingsTable;