import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const Question = (props) => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [renderedImages, setRenderedImages] = useState(0);
    const [counter, setCounter] = useState(0);
    const [score, setScore] = useState(0);
    const auth = useAuthUser();
    const questionsPerGame = 10;
    const imagesPerQuestion = 4;

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if(renderedImages==imagesPerQuestion){
                setCounter((prevCounter) => prevCounter + 0.4);
            } 
        }, 40);

        return () => clearInterval(interval);
    }, [renderedImages]);

    useEffect(() => {
        if (counter >= 100 && !loading) {
            answerQuestion("",questions[currentQuestion]);
        }
    }, [counter]);


    const fetchQuestions = async () => {
        try {
            setRenderedImages(0)
            let auxQuestions = []
            for(let i=0;i<questionsPerGame;i++){
                let question = ((await axios.get(`${apiEndpoint}/${props.type}/${props.category}/question`)).data)
                auxQuestions.push(question)
            }
            setQuestions(auxQuestions)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const answerQuestion = async (answer, question) => {
        try {
            setLoading(true);
            setRenderedImages(0)
            if(currentQuestion>=questionsPerGame-1){
                fetchQuestions()
                setCurrentQuestion(0)
                setCounter(0);
                return
            }

            const result = await axios.post(`${apiEndpoint}/${props.type}/answer`, 
                { answer: answer, question:question, username: auth.username, category: props.category },
                { headers: {'Content-Type': 'application/json'}});

            if ( result.data.correct === "true" ) {
                setScore(score +1);
            }
            setCurrentQuestion((question)=>question+1)
            setCounter(0);
            setLoading(false)
        } catch (error) {
            console.log(error);
        }
    }

    

    return (
        <div className="bg-slate-50 shadow-lg rounded-md p-4 mx-auto max-w-2xl mt-16">
            <div className="absolute bottom-0 left-0 p-2 bg-gray-200 rounded-md">
                Score: {score}
            </div>
            {loading ? (
                <>
                    <h1 className="font-bold text-2xl text-gray-800 pl-8"><div class="flex justify-center items-center h-screen">
                        <div class="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
                    </div></h1>
                </>
            ) : (
                <>
                    <h1 className="font-bold text-3xl text-gray-800 pl-8">{questions[currentQuestion].question}</h1>
                    <div class="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-20 mx-10">
                        <div class="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                            style={{ width: counter + "%" }}></div>
                    </div>
                    <div className="grid grid-cols-2 mt-10 item">
                        {questions[currentQuestion].images.map(image => (
                            <button className="transition-transform transform-gpu hover:scale-105 rounded-xl mx-8 my-8 max-h-52 max-w-80">
                                <img src={image} alt='Loading image...' className="rounded-lg object-contain shadow-md"
                                    onClick={() => answerQuestion(image,questions[currentQuestion].question)}
                                    onLoad={()=> setRenderedImages(renderedImages=> renderedImages+1)}></img>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
};

export default Question;