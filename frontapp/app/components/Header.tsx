'use client'
import React,{FC, useState} from "react";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    route: string;
    setRoute: (route: string) => void;
    activeItem: number;
}

const Header: FC<Props> = (props) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);

    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }
    return (
        <div className="w-fill relative">
           < div className={'$active ? "dark:bg-gray-800 bg-white" : "bg-gray-100 dark:bg-gray-900"} w-full h-16 flex items-center justify-between px-4'}></div>

            <h1>Header</h1>
        </div>
    )
}
export default Header;