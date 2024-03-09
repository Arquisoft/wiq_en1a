import React, { useEffect } from 'react';
import { useContext } from 'react';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
    const { user, setUser, checkUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {

        const checkLog  = async () => {
            const res = await checkUser();
            console.log(res);
            if(res === false)
                navigate('/');
        }
        checkLog();

    }, []);

    return (
        <div>
            <h1 class='font-bold font-xl'>Game Page</h1>
            <body>{user.username}</body>
        </div>
    )
}