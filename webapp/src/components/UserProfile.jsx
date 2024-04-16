import React, { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import userAvatar from "./ranking/profile_img.webp";

const UserProfile = () => {
    const auth = useAuthUser();
    const [category, setCategory] = useState('global');
    const [questions, setQuestions] = useState(0);
    const [right, setRight] = useState(0);
    const [wrong, setWrong] = useState(0);

    const apiEndpoint =  process.env.REACT_APP_API_ENDPOINT ||'http://localhost:8000';


    const handleCategoryChange = useCallback(async (newCategory) => {
        try {
            const result = await axios.get(`${apiEndpoint}/ranking/user`, {
                params: {
                  username: auth.username,
                  category: newCategory
                }
              });

            setQuestions(result.data.questions);
            setRight(result.data.correct);
            setWrong(result.data.wrong);
            setCategory(newCategory);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    }, [apiEndpoint, auth.username]);

    useEffect(() => {
        handleCategoryChange(category);
    }, [handleCategoryChange, category]);


    return (
        <div className="user-profile">
                <div className="user-details">
                <div className="user-info">
                    <img src={userAvatar} alt="User Avatar" className="user-avatar" style={{ width: "300px", height: "300px" }} />
                    <h2 className="md:p-4 py-3 px-0 font-bold text-gray-600 hover:text-gray-900">Username: {auth.username}</h2>

                    <p>Email: {auth.email}</p>
                    <p>Joined: {new Date(auth.createdAt).toLocaleDateString()}</p>


                    {/* Buttons to change category */}
                <div className="category-buttons" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button style={{ marginRight: '8px', color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('global')}>Global</button>
                    <button style={{ marginRight: '8px', color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('flags')}>Flags</button>
                    <button style={{ marginRight: '8px', color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('cities')}>Cities</button>
                    <button style={{ marginRight: '8px', color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('monuments')}>Monuments</button>
                    <button style={{ marginRight: '8px', color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('tourist_attractions')}>Tourist Attractions</button>
                    <button style={{ color: 'white', backgroundColor: 'purple', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer' }} onClick={() => handleCategoryChange('foods')}>Foods</button>
                </div>

                <div className="ranking" style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '10px', color: 'purple' }}>{category} Ranking</h3>
                    <div style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>
                        <p style={{ marginBottom: '5px' }}>Total Answered Questions: {questions}</p>
                        <p style={{ marginBottom: '5px', color: 'green' }}>Right Answers: {right}</p>
                        <p style={{ marginBottom: '5px', color: 'red' }}>Wrong Answers: {wrong}</p>
                    </div>  
                </div>

                </div>
            </div> 
        </div >
    );
};

export default UserProfile;
