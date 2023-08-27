"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./style/page.module.scss";
import Menu from "./menu";

export default function Home() {
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [obstacleRun, setObstacleRun] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const heroRef = useRef(null);
    const obstacleRef = useRef(null);
    const cloudsRef = useRef(null);
    const scoreRef: { current: NodeJS.Timeout | null } = useRef(null);
    const checkCollisionRef: { current: NodeJS.Timeout | null } = useRef(null);

    //All auxiliary functions
    const jumpHandler = () => {
        if (gameOver) {
            resetGame();
            return;
        }
        if (isJumping || !isPlaying) return;
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
        const heroRectLeft = heroRect.left + 45;
        const heroRectRight = heroRect.right - 40;

        console.log(heroRect, obstacleRect);
        console.log(heroRectRight < obstacleRect.left);
        console.log(heroRectLeft > obstacleRect.right);

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
                console.log("Entrou no return");
                clearInterval(checkCollisionRef.current as NodeJS.Timeout);
                return;
            }
            if (checkCollision()) {
                // Code for hitbox debug
                // const hero = heroRef.current as HTMLElement;
                // const obstacle = obstacleRef.current as HTMLElement;
                // if (!hero || !obstacle) return false;
                // hero.style.border = "2px solid red";
                // obstacle.style.border = "2px solid red";
                handleGameOver();
                clearInterval(checkCollisionRef.current as NodeJS.Timeout);
                console.log("Game Over!");
            }
        }, 10);
        //Core score function
        scoreRef.current = setInterval(() => {
            if (!isPlaying) {
                console.log("Score FInal: ", score);
                console.log("FIM DO SCORE");
                clearInterval(scoreRef.current as NodeJS.Timeout);
                return;
            }
            setScore((score) => score + 13);
            console.log("Score: ", score);
        }, 700);
        return () => {
            clearInterval(checkCollisionRef.current as NodeJS.Timeout);
            clearInterval(scoreRef.current as NodeJS.Timeout);
        };
    }, [isPlaying]);

    return (
        <main className={style.main}>
            {/* <div className={style.title}>Batman Jump</div> */}
            <div className={style.gameBoard}>
                <Menu handlePlayButton={handlePlayButton} />
                <div className={`${style.gameOver} ${gameOver ? style.gameOverShow : ""}`}>
                    Game Over
                    <div onClick={resetGame} className={`${style.gameOverRetry}`}>
                        Retry?
                    </div>
                </div>
                <div className={style.score}>Score: {score}</div>
                <Image
                    ref={cloudsRef}
                    width={550}
                    height={253}
                    className={`${!isPlaying || gameOver ? style.cloudsEnd : ""} ${style.clouds}`}
                    src="/clouds.png"
                    alt="Clouds"
                />
                <Image
                    ref={heroRef}
                    width={150}
                    height={150}
                    className={`${gameOver ? style.heroEnd : ""} ${style.hero} ${isJumping ? style.jump : ""}`}
                    src={`/batman.gif`}
                    alt="Hero"
                />
                <Image
                    ref={obstacleRef}
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
