import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from "@nextui-org/react"
import boxes from "../styles/boxes.module.css"

const states = {
    idle: {
        borderColor: "black",
        boxShadow: "4px 4px 0 0 black",
        rotate: 0,
    },
    pairing_target: {
        borderColor: "green",
        boxShadow: "4px 4px 0 0 green",
        rotate: [-1, 1, 0, 1, -1],
        transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
        },
    },
    avoiding_target: {
        borderColor: "red",
        boxShadow: "4px 4px 0 0 red",
        rotate: [-1, 1, 0, 1, -1],
        transition: {
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
        },
    },
    selectable: {
        borderColor: "blue",
        boxShadow: "4px 4px 0 0 blue",
        scale: 1.02,
    },
    show: {
        borderColor: "black",
        boxShadow: "4px 4px 0 0 black",
        rotate: 0,
    },
}

const Person = (props) => {
    const { name, onRemove, onPair, onAvoid, state, onSelect, cancelSelect } =
        props

    const StopSelection = (props) => {
        const { onClick } = props
        return (
            <Button
                className="inline-flex justify-center px-2 py-2 bg-white border-black rounded-full hover:bg-gray-100"
                onClick={onClick}
            >
                <Image src="/icon/xmark.svg" width={25} height={25} alt="X" />
            </Button>
        )
    }

    const DD = () => {
        const itemCss =
            "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"

        return (
            <Dropdown>
                <DropdownTrigger>
                    <Button className="inline-flex justify-center px-2 py-2 bg-white border-black rounded-full hover:bg-gray-100">
                        <Image
                            src="/icon/dropdown.svg"
                            width={25}
                            height={25}
                            alt="Dropdown icon"
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Static Actions"
                    className="w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                >
                    <DropdownItem
                        key="pair"
                        className={itemCss}
                        onClick={onPair}
                    >
                        Pair with
                    </DropdownItem>
                    <DropdownItem
                        key="avoid"
                        className={itemCss}
                        onClick={onAvoid}
                    >
                        Avoid
                    </DropdownItem>
                    <DropdownItem
                        key="remove"
                        className={`${itemCss} text-red-400`}
                        onClick={onRemove}
                    >
                        Remove
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        )
    }

    if (state === "idle") {
        return (
            <motion.div
                className={`flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony}`}
                // @ts-ignore
                variants={states}
                initial="idle"
                animate={state}
            >
                <div className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">
                    <p>{name}</p>
                </div>
                <DD />
            </motion.div>
        )
    } else if (state === "selectable") {
        return (
            <motion.button
                className={`flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony}`}
                // @ts-ignore
                variants={states}
                initial="idle"
                animate={state}
                onClick={onSelect}
            >
                <div className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">
                    <p>{name}</p>
                </div>
            </motion.button>
        )
    } else if (state === "pairing_target" || state === "avoiding_target") {
        return (
            <motion.div
                className={`flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony}`}
                // @ts-ignore
                variants={states}
                initial="idle"
                animate={state}
            >
                <div className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">
                    <p>{name}</p>
                </div>
                <StopSelection onClick={cancelSelect} />
            </motion.div>
        )
    } else if (state === "show") {
        return (
            <motion.div
                className={`flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony}`}
                // @ts-ignore
                variants={states}
                initial="idle"
                animate={state}
            >
                <div className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">
                    <p>{name}</p>
                </div>
            </motion.div>
        )
    }
}

export default Person
