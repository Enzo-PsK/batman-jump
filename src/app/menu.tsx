"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import style from "./style/menu.module.scss";

interface Menu {
    handlePlayButton: () => void;
}

export default function Menu({ handlePlayButton }: { handlePlayButton: () => void }) {
    const [userClick, setUserClick] = useState(false);

    const handleClick = () => {
        setUserClick(true);
        handlePlayButton();
    };

    return (
        <div className={`${userClick ? style.menuHide : ""} ${style.menu}`}>
            <div className={style.menuTitle}>Batman Jump</div>
            <div onClick={handleClick} className={style.menuItem}>
                Play Game
            </div>
        </div>
    );
}
