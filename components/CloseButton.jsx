import React from "react"
import { motion } from "framer-motion"
import boxes from "../styles/boxes.module.css"
import Image from "next/image"

const CloseButton = ({ onClick }) => {
    return (
        <motion.button
            className={`flex items-center justify-center !rounded-full w-12 h-12 ${boxes.cartoony}`}
            whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            onClick={onClick}
        >
            <Image src="/icon/xmark.svg" width={25} height={25} alt="X" />
        </motion.button>
    )
}

export default CloseButton
