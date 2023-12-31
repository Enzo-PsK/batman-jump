"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./style/page.module.scss";
import Menu from "./menu";

export default function Home() {
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [userInput, setUserInput] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [obstacleRun, setObstacleRun] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [scoreMessage, setScoreMessage] = useState("");
    const heroRef = useRef(null);
    const obstacleRef = useRef(null);
    const cloudsRef = useRef(null);
    const windowSizeRef = useRef([0, 0]);
    const scoreRef: { current: NodeJS.Timeout | null } = useRef(null);
    const checkCollisionRef: { current: NodeJS.Timeout | null } = useRef(null);

    //All auxiliary functions
    const jumpHandler = () => {
        if (gameOver) {
            resetGame();
            return;
        }
        if (!isPlaying) {
            handlePlayButton();
            return;
        }
        if (isJumping) return;
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 1000);
    };
    const inputHandler = () => {
        if (!setUserInput) return;
        setUserInput(true);
        setTimeout(() => setUserInput(false), 500);
    };
    const checkCollision = () => {
        const hero = heroRef.current as unknown as HTMLElement;
        const obstacle = obstacleRef.current as unknown as HTMLElement;

        if (!hero || !obstacle) return false;

        const heroRect = hero.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        //Manually adjust the hitbox to make it more accurate
        let heroRectLeft = heroRect.left + 45;
        let heroRectRight = heroRect.right - 40;

        if (windowSizeRef.current[0] < 768) {
            heroRectRight = heroRect.right + 15;
            heroRectRight = heroRect.right - 10;
        }

        return !(
            heroRect.top > obstacleRect.bottom ||
            heroRectRight < obstacleRect.left ||
            heroRect.bottom < obstacleRect.top ||
            heroRectLeft > obstacleRect.right
        );
    };
    const handlePlayButton = () => {
        setIsPlaying(true);
        setTimeout(() => {
            setObstacleRun(true);
        }, 3000);
        console.log("Game Started!");
    };
    const resetGame = () => {
        setObstacleRun(false);
        setGameOver(false);
        setScore(0);
        handlePlayButton();
    };
    const handleGameOver = () => {
        setGameOver(true);
        setIsPlaying(false);
    };

    //UseEffects
    useEffect(() => {
        window.addEventListener("keydown", inputHandler);
        window.addEventListener("click", inputHandler);
        windowSizeRef.current = [window.innerWidth, window.innerHeight];
        setBestScore(() => {
            const bestScore = Number(localStorage.getItem("bestScore"));
            if (!bestScore) localStorage.setItem("bestScore", "0");
            return bestScore || 0;
        });
    }, []);
    useEffect(() => {
        if (!userInput) return;
        jumpHandler();
    }, [userInput]);
    useEffect(() => {
        //Core check collision function
        checkCollisionRef.current = setInterval(() => {
            console.log("checkCollision");
            if (!isPlaying) {
                clearInterval(checkCollisionRef.current as NodeJS.Timeout);
                return;
            }
            if (checkCollision()) {
                //Code for hitbox debug
                // const hero = heroRef.current as HTMLElement;
                // const obstacle = obstacleRef.current as HTMLElement;
                // if (!hero || !obstacle) return false;
                // hero.style.border = "2px solid red";
                // obstacle.style.border = "2px solid red";
                handleGameOver();
                clearInterval(checkCollisionRef.current as NodeJS.Timeout);
            }
        }, 10);
        //Core score function
        scoreRef.current = setInterval(() => {
            if (!isPlaying) {
                if (score > bestScore) {
                    setBestScore(score);
                    localStorage.setItem("bestScore", score.toString());
                }
                clearInterval(scoreRef.current as NodeJS.Timeout);
                return;
            }
            setScore((score) => score + 13);
            console.log("Score Atual: ", score);
        }, 700);
        return () => {
            clearInterval(checkCollisionRef.current as NodeJS.Timeout);
            clearInterval(scoreRef.current as NodeJS.Timeout);
        };
    }, [isPlaying]);
    useEffect(() => {
        if (score < 500) setScoreMessage("(You can do better!)");
        if (score >= 500) setScoreMessage("(Keep going!)");
        if (score >= 1000) setScoreMessage("(Nice job!)");
        if (score >= 10000) setScoreMessage("(Amazing!)");
        if (score >= 100000) setScoreMessage("(Unbelievable!)");
        if (score >= 9999999) setScoreMessage("(Are you a cheater??? Wow!)");
    }, [bestScore]);

    return (
        <main className={style.main}>
            {/* <div className={style.title}>Batman Jump</div> */}
            <div className={style.gameBoard}>
                {!isPlaying && !gameOver && <Menu handlePlayButton={handlePlayButton} />}
                <div className={`${style.gameOver} ${gameOver ? style.gameOverShow : ""}`}>
                    Game Over
                    <div className={`${style.personalBest}`}>Your best score is: {bestScore}</div>
                    <div className={`${style.scoreMessage}`}>{scoreMessage}</div>
                    <div onClick={resetGame} className={`${style.gameOverRetry}`}>
                        Retry?
                    </div>
                </div>
                <div className={style.score}>Score: {score}</div>
                <Image
                    ref={cloudsRef}
                    loading="eager"
                    width={550}
                    height={253}
                    className={`${!isPlaying || gameOver ? style.cloudsEnd : ""} ${style.clouds}`}
                    src="/clouds.png"
                    alt="Clouds"
                />
                <Image
                    loading="eager"
                    ref={heroRef}
                    width={150}
                    height={150}
                    className={`${gameOver ? style.heroEnd : ""} ${style.hero} ${isJumping ? style.jump : ""}`}
                    src={`/batman.gif`}
                    alt="Hero"
                />
                <Image
                    ref={obstacleRef}
                    loading="eager"
                    width={80}
                    height={102}
                    className={`${obstacleRun ? style.obstacleAnimate : ""} ${
                        !isPlaying || gameOver ? style.obstacleEnd : ""
                    } ${style.obstacle}`}
                    src="/pipe.png"
                    alt="Obstacle"
                />
            </div>
        </main>
    );
}
