"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./style/menu.module.scss";

interface Menu {
    handlePlayButton: () => void;
}

export default function Menu({ handlePlayButton }: { handlePlayButton: () => void }) {
    const [userClick, setUserClick] = useState(false);
    const [currentView, setCurrentView] = useState("main");

    const handlePlayGameClick = () => {
        setUserClick(true);
        handlePlayButton();
    };
    const handleAboutClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentView("about");
    };
    const handleBackClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentView("main");
    };
    const handleLinkedInClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        window.open("https://www.linkedin.com/in/enzo-borges-112843155/", "_blank", "noreferrer");
    };
    const handleGitHubClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        window.open("https://github.com/Enzo-PsK", "_blank", "noreferrer");
    };

    const mainView = (
        <>
            <div className={style.menuTitle}>Batman Jump</div>
            <div className={style.menuItems}>
                <div onClick={handlePlayGameClick} className={style.menuItem}>
                    <span>&#8680;</span>Play Game
                </div>
                <div onClick={handleAboutClick} className={style.menuItem}>
                    <span>&#8680;</span>About
                </div>
            </div>
        </>
    );

    const aboutView = (
        <>
            <div className={style.menuTitle}>Made by Enzo Borges</div>
            <div className={style.menuItems}>
                <div onClick={handleLinkedInClick} className={style.menuItem}>
                    <span>&#8680;</span>
                    <Image loading="eager" src="/linkedin.png" alt="LinkedIn Logo" width="30" height="30" />
                    LinkedIn
                </div>
                <div onClick={handleGitHubClick} className={style.menuItem}>
                    <span>&#8680;</span>
                    <Image loading="eager" src="/github-dark.png" alt="GitHub Logo" width="30" height="30" />
                    GitHub
                </div>
                <div onClick={handleBackClick} className={`${style.menuItem} ${style.return}`}>
                    <span>&#9166;</span>Return
                </div>
            </div>
        </>
    );

    return (
        <div className={`${userClick ? style.menuHide : ""} ${style.menu}`}>
            {currentView === "main" ? mainView : aboutView}
        </div>
    );
}
