"use client"
import PersonRichCard from "@/components/PersonRichCard"
import { PersonState, Relationship, RelationshipType } from "@/types"
import { Add, Close, Delete, PriorityHigh } from "@mui/icons-material"
import { motion } from "framer-motion"
import { FormEvent, useState } from "react"
import PersonSmallCard from "../components/PersonSmallCard"
import boxes from "../styles/boxes.module.css"
import "../styles/global.css"

const IndexPage = () => {
    const [people, setPeople] = useState<string[]>([])
    const [creating_relationship, setCreatingRelationship] = useState<[number, RelationshipType]>()
    const [relationships, setRelationships] = useState<Relationship[]>([])
    const [alerts, setAlerts] = useState<string[]>([])

    const pushAlert = (message: string) => {
        setAlerts([...alerts, message])
    }

    const removeAlert = (index: number) => {
        setAlerts(alerts.filter((_, i) => i !== index))
    }

    const addPerson = (name: string) => {
        if (people.includes(name)) {
            pushAlert("Person already added!")
        } else if (name === "") {
            pushAlert("Name cannot be empty!")
        } else {
            setPeople([...people, name])
        }
    }

    const removePerson = (index: number) => {
        if (creating_relationship !== undefined && creating_relationship[0] === index) {
            setCreatingRelationship(undefined)
        }
        setRelationships(relationships.filter((r) => r[0] !== index && r[2] !== index))
        setPeople(people.filter((_, i) => i !== index))
    }

    const finalizeRelationship = (index: number) => {
        if (creating_relationship === undefined) return
        const [p1, rel_type] = creating_relationship
        if (p1 === index) return
        if (relationships.some(([p, t, _]) => p === p1 && t === rel_type && _ === index)) {
            setCreatingRelationship(undefined)
            return
        }
        setRelationships([...relationships, [p1, rel_type, index]])
        setCreatingRelationship(undefined)
    }

    const removeRelationship = (index: number) => {
        setRelationships(relationships.filter((r, i) => i !== index))
    }

    const onAddPersonSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const input = document.getElementById("input")
        if (!input) return
        if (input instanceof HTMLInputElement) {
            addPerson(input.value.trim())
            input.value = ""
        }
    }

    const getPersonState = (index: number): PersonState => {
        if (creating_relationship === undefined) return PersonState.Idle
        if (creating_relationship[0] === index) {
            return creating_relationship[1] === RelationshipType.Pair ? PersonState.PairTarget : PersonState.AvoidTarget
        }
        if (creating_relationship[1] === RelationshipType.Pair) {
            return PersonState.PairSelectable
        } else {
            return PersonState.AvoidSelectable
        }
    }

    const conflictingRelationships = relationships.filter((relationship) => {
        return relationships.filter((r) => r[0] === relationship[0] && r[2] === relationship[2]).length > 1
    })

    const isConflictingRelationship = (relationship: Relationship) => {
        return conflictingRelationships.some((r) => r[0] === relationship[0] && r[2] === relationship[2])
    }

    return (
        <motion.main className="flex flex-col items-center gap-2 w-full h-full overflow-hidden">
            <motion.div className="flex flex-col gap-2 w-full items-center h-1/5 justify-end overflow-hidden relative">
                <div className="absolute top-0 h-1/5 w-full bg-gradient-to-b from-gray-100 to-transparent" />
                {alerts.map((alert, j) => (
                    <motion.div
                        className="bg-red-200 p-2 rounded-lg w-fit min-w-[320px] flex justify-between"
                        key={j}
                        transition={{ duration: 0.2 }}
                    >
                        <p>{alert}</p>
                        <button onClick={() => removeAlert(j)}>
                            <Close />
                        </button>
                    </motion.div>
                ))}
            </motion.div>
            <h1 className="text-3xl font-bold">Teamificator</h1>
            <form onSubmit={onAddPersonSubmit} className="flex items-center gap-2">
                <input
                    id="input"
                    className={`w-64 px-4 h-12 text-xl focus:outline-none ${boxes.cartoony}`}
                    type="text"
                    placeholder="Add a person"
                />
                <button type="submit" className={`ml-2 text-xl font-bold h-12 w-12 ${boxes.cartoony}`}>
                    <Add />
                </button>
            </form>
            <div className="h-full w-1/2 grid grid-cols-2 gap-4 overflow-hidden">
                <div className={`flex flex-col gap-2 p-2 overflow-y-auto w-full h-full ${boxes.cartoony}`}>
                    <h1 className="text-3xl font-bold ml-10">People</h1>
                    {people.map((person, j) => (
                        <PersonRichCard
                            key={person}
                            name={person}
                            onCancelRelationshipSelection={() => setCreatingRelationship(undefined)}
                            onCompleteRelationship={() => finalizeRelationship(j)}
                            onRemove={() => removePerson(j)}
                            onStartRelationshipSelection={(type) => {
                                setCreatingRelationship([j, type])
                            }}
                            state={getPersonState(j)}
                        />
                    ))}
                </div>
                <div
                    className={`flex flex-col gap-2 w-full h-full overflow-y-auto p-2 overflow-hidden ${boxes.cartoony}`}
                >
                    <h1 className="text-3xl font-bold ml-10">Relationships</h1>
                    {relationships.map(([p1, rel_type, p2], j) => (
                        <motion.div className="flex gap-2 items-center" key={`${p1}-${rel_type}-${p2}`}>
                            <button onClick={() => removeRelationship(j)}>
                                <Delete />
                            </button>
                            <PersonSmallCard name={people[p1]} />
                            <p>{rel_type === RelationshipType.Pair ? "pairs with" : "avoids"}</p>
                            <PersonSmallCard name={people[p2]} />
                            {isConflictingRelationship([p1, rel_type, p2]) && <PriorityHigh className="text-red-500" />}
                        </motion.div>
                    ))}
                </div>
            </div>
            <button
                onClick={() => {
                    if (conflictingRelationships.length > 0) {
                        pushAlert("There's some conflicting relationships!")
                        return
                    } else {
                        alert("Not implemented!")
                    }
                }}
                className={`ml-2 text-xl font-bold px-4 py-2 ${boxes.cartoony}`}
            >
                <p>Generate Teams</p>
            </button>
            <div className="h-1/5" />
        </motion.main>
    )
}

export default IndexPage
