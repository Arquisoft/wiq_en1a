import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import ImgGameReport from "./ImgGameReport";

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

    //Game Report
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState([]);



    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (renderedImages === imagesPerQuestion) {
                setCounter((prevCounter) => prevCounter + 0.4);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [renderedImages]);

    useEffect(() => {
        async function answ() {
            await answerQuestion("TimeOut1234;", questions[currentQuestion].question);
        }

        if (counter >= 100 && !loading) {
            answ();
        }
    }, [counter]);


    const fetchQuestions = async () => {
        try {
            setRenderedImages(0)
            let promises = []
            let questions = []
            for (let i = 0; i < questionsPerGame; i++) {
                let question = axios.get(`${apiEndpoint}/${props.type}/${props.category}/question`)
                promises.push(question)
            }
            let responses = await Promise.all(promises)
            for (let i = 0; i < questionsPerGame; i++) {
                let question = responses.pop().data
                questions.push(question)
            }
            setQuestions(questions)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const answerQuestion = async (answer, question) => {
        if(counter==0){
            return
        }
        try {
            setLoading(true);
            setRenderedImages(0)
            

            const result = await axios.post(`${apiEndpoint}/${props.type}/answer`,
                { answer: answer, question: question, username: auth.username, category: props.category },
                { headers: { 'Content-Type': 'application/json' } });
            
            if (result.data.correct === "true") {
                setScore(score + 1);
                setAnswers(answers.concat( {question:question,correct:result.data.correct,associate:answer}));
            }else{
                setAnswers(answers.concat( {question:question,correct:result.data.correct,associate:result.data.correctImg}));
            }
            
            if (currentQuestion >= questionsPerGame - 1) {
                //Infinte Game
                // fetchQuestions()
                // setCurrentQuestion(0)
                // setCounter(0);
                setFinished(true);
                setLoading(false);
                return
            }
            setCurrentQuestion((question) => question + 1)
            setCounter(0);
            setLoading(false)
        } catch (error) {
            //console.log(error);
        }
    }

    const restartGame = async () => {
        setLoading(true);
        setScore(0);
        setAnswers([]);
        setCurrentQuestion(0);
        setCounter(0);
        setFinished(false);
        await fetchQuestions();
        setLoading(false);
    }


    return (
        finished ? <div className="bg-white"><ImgGameReport score={score} answers={answers} restartGame={restartGame}  /></div> :
        <div className="bg-slate-50 shadow-lg rounded-md p-4 mx-auto max-w-2xl ">
            <div className="absolute bottom-0 left-0 p-2 bg-gray-200 rounded-md">
                Score: {score}
            </div>
            {loading ? (
                <>
                    <h1 className="font-bold text-2xl text-gray-800 pl-8"><div class="flex justify-center items-center h-fit">
                        <div class="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
                    </div></h1>
                </>
            ) :  (
                <div>
                    <h1 className="font-bold text-3xl text-gray-800 pl-8">{questions[currentQuestion].question}</h1>
                    <div class="relative h-5 rounded-full overflow-hidden bg-gray-300 mt-20 mx-10">
                        <div class="absolute top-0 bottom-0 left-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                            style={{ width: counter + "%" }}
                            data-testid="time-bar"></div>
                    </div>
                    <div className="grid grid-cols-2 mt-10 item">
                        {questions[currentQuestion].images.map(image => (
                            <button className="transition-transform transform-gpu hover:scale-105 rounded-xl mx-8 my-8 max-h-52 max-w-80">
                                <img src={image} alt='Loading ...' className="rounded-lg object-contain shadow-md"
                                    onClick={async () => await answerQuestion(image, questions[currentQuestion].question)}
                                    onLoad={() => setRenderedImages(renderedImages => renderedImages + 1)}></img>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
};

export default Question;