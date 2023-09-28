import React from "react"
import { motion } from "framer-motion"
import boxes from "../styles/boxes.module.css"

const Button = (props) => {
    const { children } = props
    return (
        <motion.button
            className={`ml-2 text-xl font-bold px-4 py-2 mt-2 ${boxes.cartoony}`}
            whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            layout
        >
            {children}
        </motion.button>
    )
}

export default Button
