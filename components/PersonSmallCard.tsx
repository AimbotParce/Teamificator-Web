"use client"
import { HTMLMotionProps, motion } from "framer-motion"
import React from "react"
import boxes from "../styles/boxes.module.css"

interface PersonCardProps extends HTMLMotionProps<"p"> {
    name: string
}

class PersonSmallCard extends React.Component<PersonCardProps> {
    constructor(props: PersonCardProps) {
        super(props)
    }
    render() {
        return (
            <motion.p className={`px-2 rounded-full text-xl ${boxes.cartoony} ${this.props.className}`} {...this.props}>
                {this.props.name}
            </motion.p>
        )
    }
}

export default PersonSmallCard
export type { PersonCardProps }
