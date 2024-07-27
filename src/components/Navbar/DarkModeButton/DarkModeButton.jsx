"use client";

import useDarkMode from "@/hooks/useDarkMode";
import { Button } from "flowbite-react";
import { MdOutlineDarkMode } from "react-icons/md";
import { GoSun } from "react-icons/go";

const DarkModeButton = () => {
	const [theme, toggleTheme] = useDarkMode();
	return (
		<>
			{theme === "light" ? (
				<Button className="bg-none" onClick={toggleTheme}>
					<MdOutlineDarkMode size={35} />
				</Button>
			) : (
				<Button className="bg-none" onClick={toggleTheme}>
					<GoSun size={35} />
				</Button>
			)}
		</>
	);
};

export default DarkModeButton;
