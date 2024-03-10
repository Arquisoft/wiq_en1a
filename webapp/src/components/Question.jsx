import React, { useState, useEffect } from "react";
import axios from "axios";

const Question = () => {
    const apiEndpoint = 'http://localhost:8000';
    const [question, setQuestion] = useState([])
    const [loading, setLoading] = useState(true);

    const fetchQuestion = async () => {
        try {
            const res = await axios.get(`${apiEndpoint}/flags/question`);
            setQuestion(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const answerQuestion = async (answer) => {
        try {
            setLoading(true);
            const result = await axios.post(`${apiEndpoint}/flags/answer`, answer);

            const res = await axios.get(`${apiEndpoint}/flags/question`);
            setQuestion(res.data);
            setLoading(false);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchQuestion();
      }, []);

    return (
        <div className="bg-slate-50 shadow-lg rounded-md p-4 mx-auto max-w-2xl mt-16">
            { loading ? (
                <h1 className="font-bold text-2xl text-gray-800 pl-8">Loading...</h1>
                ) : (
                    <>
                    <h1 className="font-bold text-3xl text-gray-800 pl-8">{question.question}</h1>
                    <div className="grid grid-cols-2 mt-10 item">
                    {question.flags.map( flag => (
                        <div className="rounded-xl mx-8 my-8">
                            <button className="transition-transform transform-gpu hover:scale-105">
                                <img src={flag} alt='Loading flag...' className="rounded-lg max-h-50 object-contain shadow-md"
                                    onClick={() => answerQuestion(flag)}></img>
                            </button>
                        </div>
                    ))}
                    </div>
                    </>
                )}
        </div>
    )
};

export default Question;