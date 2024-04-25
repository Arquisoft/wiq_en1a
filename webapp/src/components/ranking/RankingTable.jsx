import React, { useState, useEffect } from "react";
import axios from "axios";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

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
    <div data-testid='ranking-table' className="flex flex-col ">
      <div className="overflow-x-auto sm:mx-6 lg:mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-md">
            <table className="min-w-full">
              <thead className="border-b bg-[#322653]">
                <tr>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left"></th>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">User</th>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Points</th>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Questions</th>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Correct</th>
                  <th scope="col" className="text-sm font-medium text-white px-6 py-4 text-left">Wrong</th>
                </tr>
              </thead>
              <tbody>
                {
                  users.map(user => (
                    user.position === 1 ? <tr className="border-b  bg-amber-500">
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white">{user.position}</td>
                      <td className="text-lg text-white  font-bold px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.points}</td>
                      <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.questions}</td>
                      <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.correct}</td>
                      <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.wrong}</td>
                    </tr> :
                      user.position === 2 ? <tr className="border-b  bg-[#b0bec5]">
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white">{user.position}</td>
                        <td className="text-lg text-white font-bold  px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.points}</td>
                        <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.questions}</td>
                        <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.correct}</td>
                        <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.wrong}</td>
                      </tr> :
                        user.position === 3 ? <tr className="border-b  bg-amber-800">
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white">{user.position}</td>
                          <td className="text-lg text-white font-bold px-6 py-4 whitespace-nowrap">{user.name}</td>
                          <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.points}</td>
                          <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.questions}</td>
                          <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.correct}</td>
                          <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.wrong}</td>
                        </tr> :
                          user.position % 2 === 0 ?
                            <tr className="border-b  bg-indigo-600">
                              <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-white">{user.position}</td>
                              <td className="text-m text-white  px-6 py-4 whitespace-nowrap">{user.name}</td>
                              <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.points}</td>
                              <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.questions}</td>
                              <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.correct}</td>
                              <td className="text-sm text-white  px-6 py-4 whitespace-nowrap">{user.wrong}</td>
                            </tr>
                            :
                            <tr className="border-b bg-indigo-100">
                              <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-indigo-700 ">{user.position}</td>
                              <td className="text-m text-indigo-700  font-light px-6 py-4 whitespace-nowrap">{user.name}</td>
                              <td className="text-sm text-indigo-700  font-light px-6 py-4 whitespace-nowrap">{user.points}</td>
                              <td className="text-sm text-indigo-700  font-light px-6 py-4 whitespace-nowrap">{user.questions}</td>
                              <td className="text-sm text-indigo-700  font-light px-6 py-4 whitespace-nowrap">{user.correct}</td>
                              <td className="text-sm text-indigo-700  font-light px-6 py-4 whitespace-nowrap">{user.wrong}</td>
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