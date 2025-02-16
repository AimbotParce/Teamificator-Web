"use client"
import { HTMLMotionProps, motion } from "framer-motion"
import React from "react"
import boxes from "../styles/boxes.module.css"

interface PersonCardProps extends HTMLMotionProps<"div"> {
    name: string
}

class PersonCard extends React.Component<PersonCardProps> {
    constructor(props: PersonCardProps) {
        super(props)
    }
    render() {
        return (
            <motion.div
                className={`flex items-center justify-between r w-64 px-4 py-2 mt-2 text-xl ${boxes.cartoony} ${this.props.className}`}
                {...this.props}
            >
                <p className="overflow-hidden overflow-ellipsis w-full h-10 items-center flex">{this.props.name}</p>
            </motion.div>
        )
    }
}

export default PersonCard
export type { PersonCardProps }
