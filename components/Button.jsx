import React from "react"
import { motion } from "framer-motion"

const Button = (props) => {
    const { children } = props
    return (
        <motion.button
            className=" ml-2 text-xl font-bold px-4 py-2 mt-2 border border-gray-400 rounded-md"
            whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            layout
        >
            {children}
        </motion.button>
    )
}

export default Button
