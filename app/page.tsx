"use client"
import PersonRichCard from "@/components/PersonRichCard"
import { PersonState, Relationship, RelationshipType } from "@/types"
import { Add, Close } from "@mui/icons-material"
import { motion } from "framer-motion"
import { FormEvent, useState } from "react"
import PersonCard from "../components/PersonCard"
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

    return (
        <body className="bg-gray-100 w-screen h-screen p-4 items-center">
            <motion.main className="flex flex-col items-center gap-2 w-full h-full">
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
                <div className="h-full w-1/2 grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold ml-10">People</h1>
                        {people.map((person, j) => (
                            <PersonRichCard
                                key={person}
                                name={person}
                                onCancelRelationshipSelection={() => setCreatingRelationship(undefined)}
                                onCompleteRelationship={() => pushAlert("Not implemented!")}
                                onRemove={() => removePerson(j)}
                                onStartRelationshipSelection={(type) => {
                                    setCreatingRelationship([j, type])
                                }}
                                state={getPersonState(j)}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold ml-10">Relationships</h1>
                        {relationships.map(([p1, rel_type, p2], j) => (
                            <motion.div className="flex r gap-10 items-center" key={`${p1}-${rel_type}-${p2}`}>
                                <PersonCard name={people[p1]} />
                                <p>{rel_type === RelationshipType.Pair ? "pairs with" : "avoids"}</p>
                                <PersonCard name={people[p2]} />

                                <button onClick={() => removeRelationship(j)}>
                                    <Close />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => alert("Not implemented!")}
                    className={`ml-2 text-xl font-bold px-4 py-2 mt-2 ${boxes.cartoony}`}
                >
                    <p>Generate Teams</p>
                </button>
            </motion.main>
        </body>
    )
}

export default IndexPage
