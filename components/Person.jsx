// @ts-nocheck
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react"
import boxes from "../styles/boxes.module.css"

const StopSelection = (props) => {
    const { onClick } = props
    return (
        <Button
            className="inline-flex justify-center px-2 py-2 bg-white border-black rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={onClick}
        >
            <Image src="/icon/xmark.svg" width={25} height={25} alt="X" />
        </Button>
    )
}

const DD = (props) => {
    const { dropdown, onRemove } = props
    console.log(dropdown)

    const itemCss =
        "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer focus:outline-none"

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button className="inline-flex justify-center px-2 py-2 bg-white border-black rounded-full hover:bg-gray-100 focus:outline-none">
                    <Image src="/icon/dropdown.svg" width={25} height={25} alt="Dropdown icon" />
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Static Actions"
                className="w-56 mt-2 origin-top-right bg-white overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
                {Object.keys(dropdown).map((key) => (
                    <DropdownItem key={key} className={itemCss} onClick={dropdown[key]}>
                        {key}
                    </DropdownItem>
                ))}
                <DropdownItem key="remove" className={`${itemCss} text-red-400`} onClick={onRemove}>
                    Remove
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

const states = {
    idle: { rotate: 0 },
    target: {
        rotate: [-1, 1, 0, 1, -1],
        transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    },
    selectable: { rotate: 0, scale: 1.02 },
    show: { rotate: 0 },
}

const colors = {
    "target": boxes.secondary,
    "selectable": boxes.primary,
}

const Person = (props) => {
    const { name, onRemove, dropdown, onSelect, cancelSelect, state } = props

    const options = {
        idle: <DD dropdown={dropdown} onRemove={onRemove} />,
        target: <StopSelection onClick={cancelSelect} />,
        selectable: <></>,
        show: <></>,
    }

    const cls = `flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony} ${colors[state]}`
    const content = (
        <div className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">
            <p>{name}</p>
        </div>
    )

    if (state === "selectable") {
        return (
            <motion.button className={cls} variants={states} initial="idle" animate={state} onClick={onSelect}>
                {content}
                {options[state]}
            </motion.button>
        )
    } else {
        return (
            <motion.div className={cls} variants={states} initial="idle" animate={state}>
                {content}
                {options[state]}
            </motion.div>
        )
    }
}

export default Person
