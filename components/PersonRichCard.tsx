"use client"
import { PersonState, RelationshipType } from "@/types"
import { AddLink, Close, Dangerous, Delete } from "@mui/icons-material"
import { HTMLMotionProps, motion } from "framer-motion"
import React from "react"
import boxes from "../styles/boxes.module.css"
import { PersonCardProps } from "./PersonCard"

interface PersonRichCardProps extends HTMLMotionProps<"div"> {
    name: string
    onRemove: () => void
    onStartRelationshipSelection: (type: RelationshipType) => void
    onCancelRelationshipSelection: () => void
    onCompleteRelationship: () => void
    state: PersonState
}

// Map the PersonState enum to the corresponding Framer Motion variants
const Animations = {
    Idle: { rotate: 0 },
    PairTarget: {
        rotate: [-1, 1, 0, 1, -1],
        transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    },
    AvoidTarget: {
        rotate: [-1, 1, 0, 1, -1],
        transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" },
    },
    AvoidSelectable: { rotate: 0, scale: 1.02 },
    PairSelectable: { rotate: 0, scale: 1.02 },
}

const Colors = {
    [PersonState.Idle]: "",
    [PersonState.PairTarget]: boxes.faintblue,
    [PersonState.AvoidTarget]: boxes.faintred,
    [PersonState.PairSelectable]: boxes.darkblue,
    [PersonState.AvoidSelectable]: boxes.darkred,
}

class PersonRichCard extends React.Component<PersonRichCardProps> {
    constructor(props: PersonRichCardProps) {
        super(props)
    }

    render() {
        const { state } = this.props
        const color = Colors[state]

        return (
            <div className="flex items-center gap-2 h-fit">
                <button onClick={this.props.onRemove}>
                    <Delete />
                </button>
                <motion.button
                    className={`flex items-center justify-between r w-64 px-4 py-2 text-xl ${boxes.cartoony} ${this.props.className} ${color}`}
                    animate={PersonState[state]}
                    variants={Animations}
                    onClick={
                        this.props.state === PersonState.Idle
                            ? () => this.props.onStartRelationshipSelection(RelationshipType.Pair)
                            : this.props.state === PersonState.PairSelectable ||
                              this.props.state === PersonState.AvoidSelectable
                            ? this.props.onCompleteRelationship
                            : undefined
                    }
                    {...(this.props as PersonCardProps)}
                >
                    <p className="overflow-hidden overflow-ellipsis w-40 h-10 items-center flex">{this.props.name}</p>
                </motion.button>
                <div className="flex flex-col h-fit justify-center items-center gap-2">
                    {(this.props.state === PersonState.PairTarget || this.props.state === PersonState.AvoidTarget) && (
                        <button onClick={this.props.onCancelRelationshipSelection}>
                            <Close />
                        </button>
                    )}
                    {this.props.state === PersonState.Idle && (
                        <button onClick={() => this.props.onStartRelationshipSelection(RelationshipType.Pair)}>
                            <AddLink />
                        </button>
                    )}
                    {this.props.state === PersonState.Idle && (
                        <button onClick={() => this.props.onStartRelationshipSelection(RelationshipType.Avoid)}>
                            <Dangerous />
                        </button>
                    )}
                </div>
            </div>
        )
    }
}

export default PersonRichCard
