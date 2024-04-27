import React, { useEffect } from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from "react-router-dom";
const ImgGameReport = (props) => {
    const answers = props.answers;
    const navigate = useNavigate();
    const loadRankings = () => {
        navigate("/rankings");
    }
    return (
        <div >
            <div class=" bg-gradient-to-br  from-purple-900 via-indigo-900 to-blue-900">
                <div class=" justify-center mx-auto max-w-3xl px-6 py-12">
                    <div class="justify-center text-center">
                        <h1 class="text-4xl font-bold text-white mb-4">Game Over!</h1>
                        <p class="text-xl text-white mb-8">
                        You answered {props.score} {props.score === 1 ? "question" : "questions"} correctly
                        </p>
                        
                        <div class="sm:flex  lg:justify-center">
                            <div class="rounded-md shadow">
                                <a href=""
                                    onClick={props.restartGame}
                                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
                                    Restart Game
                                </a>
                            </div>



                            <div class="mt-3 sm:mt-0 sm:ml-3">
                                <a href=""
                                    onClick={loadRankings}
                                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
                                    See Rankings
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">


                {answers.map((answer) => {
                    return (
                        <div class="flex flex-col rounded-2xl bg-[#ffffff] shadow-xl" key={answer.associate}>
                            <figure class="flex justify-center items-center rounded-2xl">
                                <img src={answer.associate} alt="Card Preview" class="rounded-t-2xl"></img>
                            </figure>
                            <div class="flex flex-col p-8">
                                <div class="text-2xl font-bold  text-center text-[#374151] pb-6">{answer.question}</div>
                                <div class=" text-base  text-center text-[#374151]">
                                    You answered the question {answer.correct === "true" ? "correctly" : "wrongly"}
                                    {answer.correct === "true" ? <CheckIcon fontSize="large" style={{ color: 'green' }} /> : <ClearIcon fontSize="large" style={{ color: 'red' }} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ImgGameReport;