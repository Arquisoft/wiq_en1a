import React, { useState, useEffect } from "react";
import axios from "axios";

const Question = (props) => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [score, setScore] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prevCounter) => prevCounter + 0.4);
        }, 40);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (counter >= 100) {
            setLoading(true);
            fetchQuestion();
        }
    }, [counter]);



    const fetchQuestion = async () => {
        try {

            const res = await axios.get(`${apiEndpoint}/${props.type}/${props.category}/question`);
            setQuestion(res.data);
            setLoading(false);
            setCounter(0);

        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const answerQuestion = async (answer) => {
        try {
            setLoading(true);
            const result = await axios.post(`${apiEndpoint}/${props.type}/answer`, { answer });
            const res = await axios.get(`${apiEndpoint}/${props.type}/${props.category}/question`);
            if ( result.data.correct === "true" ) {
                setScore(score +1);
            }
            setQuestion(res.data);
            setLoading(false);
            setCounter(0);

            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchQuestion();
        
    }, []);

    return (
        <div className="bg-slate-50 shadow-lg rounded-md p-4 mx-auto max-w-2xl mt-16">
            <div className="absolute bottom-0 left-0 p-2 bg-gray-200 rounded-md">
                Score: {score}
            </div>
            {loading ? (
                <h1 className="font-bold text-2xl text-gray-800 pl-8"><div class="flex justify-center items-center h-screen">
                    <div class="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
                </div></h1>
            ) : (
                <>

                    <h1 className="font-bold text-3xl text-gray-800 pl-8">{question.question}</h1>
                    <div class="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-20 mx-10">
                        <div class="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                            style={{ width: counter + "%" }}></div>
                    </div>
                    <div className="grid grid-cols-2 mt-10 item">
                        {question.images.map(image => (
                            <button className="transition-transform transform-gpu hover:scale-105 rounded-xl mx-8 my-8 max-h-52 max-w-80">
                                <img src={image} alt='Loading image...' className="rounded-lg object-contain shadow-md"
                                    onClick={() => answerQuestion(image)}></img>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
};

export default Question;