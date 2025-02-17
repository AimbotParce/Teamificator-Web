"use client"
import PersonRichCard from "@/components/PersonRichCard"
import { PersonState, Relationship, RelationshipType } from "@/types"
import { Add, ChangeCircle, Close, Delete, PriorityHigh } from "@mui/icons-material"
import { AnimatePresence, motion } from "framer-motion"
import { FormEvent, useEffect, useState } from "react"
import PersonSmallCard from "../components/PersonSmallCard"
import boxes from "../styles/boxes.module.css"
import "../styles/global.css"

function isGraphSound(nodes: string[], edges: Relationship[], num_colors: number, hard: boolean = true): boolean {
    if (!nodes.length) return true
    if (!edges.length) return true

    const pair_adjacencies: Record<number, number[]> = {}
    const avoid_adjacencies: Record<number, number[]> = {}
    nodes.forEach((_, i) => {
        pair_adjacencies[i] = []
        avoid_adjacencies[i] = []
    })
    edges.forEach(([p1, rel_type, p2]) => {
        if (rel_type === RelationshipType.Pair) {
            pair_adjacencies[p1].push(p2)
            pair_adjacencies[p2].push(p1)
        } else {
            avoid_adjacencies[p1].push(p2)
            avoid_adjacencies[p2].push(p1)
        }
    })
    const components: number[][] = []
    const node_component_map: Record<number, number> = {}
    const visited: boolean[] = new Array(nodes.length).fill(false)
    nodes.forEach((_, i) => {
        if (visited[i]) return
        const component: number[] = []
        const stack: number[] = [i]
        while (stack.length > 0) {
            const current = stack.pop()!
            if (visited[current]) continue
            visited[current] = true
            component.push(current)
            node_component_map[current] = components.length
            pair_adjacencies[current].forEach((adj) => {
                if (!visited[adj]) stack.push(adj)
            })
        }
        components.push(component)
    })
    console.log("Components:", components)
    console.log("Node-to-component map:", node_component_map)

    let has_self_loops = false
    const component_avoid_adjacencies: Record<number, number[]> = {}
    components.forEach((component, i) => {
        component_avoid_adjacencies[i] = []
        component.forEach((node) => {
            avoid_adjacencies[node].forEach((adj) => {
                if (component.includes(adj)) has_self_loops = true
                if (!component_avoid_adjacencies[i].includes(node_component_map[adj]))
                    component_avoid_adjacencies[i].push(node_component_map[adj])
            })
        })
    })
    console.log("Component Avoid Adjacencies:", component_avoid_adjacencies)
    console.log("Has Self Loops:", has_self_loops)
    if (has_self_loops) return false // No need to continue, self-loops are not allowed

    function continueColors(current_colors: number[], current_component: number, depth: number = 1): boolean {
        // Check if all the nodes have a color and all the adjacent nodes have different colors

        console.log("    ".repeat(depth) + "Continuing with component", current_component, "- Attempting:")

        for (let color = 0; color < num_colors; color++) {
            const new_colors = [...current_colors]
            new_colors[current_component] = color
            console.log("    ".repeat(depth + 1) + "Configuration:", new_colors)
            const some_unset = new_colors.some((c) => c === undefined)
            const conflict = components.some((c, j) =>
                component_avoid_adjacencies[j].some((oth) => new_colors[oth] === new_colors[j])
            )
            const distinct_colors = new Set(new_colors.filter((c) => c !== undefined)).size
            console.log("    ".repeat(depth + 1) + "Some Unset:", some_unset)
            console.log("    ".repeat(depth + 1) + "Conflict:", conflict)
            console.log("    ".repeat(depth + 1) + "Distinct Colors:", distinct_colors)
            if (hard) {
                if (!some_unset && !conflict && distinct_colors === num_colors) return true
            } else {
                if (!some_unset && !conflict) return true
            }
            for (let other_comp = 0; other_comp < components.length; other_comp++) {
                if (new_colors[other_comp] !== undefined) continue
                const ok = continueColors(new_colors, other_comp, depth + 2)
                if (ok) return true
            }
        }
        return false
    }

    return continueColors(new Array(components.length).fill(undefined), 0)
}

const IndexPage = () => {
    const [people, setPeople] = useState<string[]>([])
    const [creating_relationship, setCreatingRelationship] = useState<[number, RelationshipType]>()
    const [relationships, setRelationships] = useState<Relationship[]>([])
    const [alerts, setAlerts] = useState<{ message: string; id: number }[]>([])
    const [alert_id, setAlertId] = useState<number>(0)
    const [num_teams, setNumTeams] = useState<number>(2)
    const [hard, setHard] = useState<boolean>(true)

    const pushAlert = (message: string) => {
        setAlerts([{ message, id: alert_id }, ...alerts])
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== alert_id))
        }, 5000)
        setAlertId(alert_id + 1)
    }

    useEffect(() => {}, [alerts])

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
        const [other, rel_type] = creating_relationship
        if (other === index) return
        if (
            relationships.some(
                ([p1, t, p2]) => (t === rel_type && p1 === other && p2 === index) || (p1 === index && p2 === other)
            )
        ) {
            setCreatingRelationship(undefined)
            return
        }
        setRelationships([...relationships, [other, rel_type, index]])
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

    const is_graph_sound = isGraphSound(people, relationships, num_teams, hard)

    return (
        <motion.main className="flex flex-col items-center gap-2 w-full h-full overflow-hidden">
            <motion.div className="flex flex-col gap-2 absolute top-0 right-1/4 pt-4">
                <AnimatePresence mode="sync">
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            className="bg-red-200 p-2 rounded-lg w-fit min-w-[320px] flex justify-between"
                            variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                            transition={{ duration: 0.2 }}
                        >
                            <p>{alert.message}</p>
                            <button onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}>
                                <Close />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            <h1 className="text-3xl font-bold">Teamificator</h1>
            <form onSubmit={onAddPersonSubmit} className="flex items-center gap-2 pb-1">
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
            <div className="h-full w-1/2 grid grid-cols-2 gap-4 overflow-hidden pb-1 pr-1">
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
                    <h1 className="text-3xl font-bold ml-10 flex items-center">
                        Relationships
                        {!is_graph_sound && <PriorityHigh className="text-red-500" sx={{ fontSize: 30 }} />}
                    </h1>
                    {relationships.map(([p1, rel_type, p2], j) => (
                        <motion.div className="flex gap-2 items-center" key={`${p1}-${rel_type}-${p2}`}>
                            <button onClick={() => removeRelationship(j)}>
                                <Delete />
                            </button>
                            <PersonSmallCard name={people[p1]} />
                            <p>{rel_type === RelationshipType.Pair ? "pairs with" : "avoids"}</p>
                            <PersonSmallCard name={people[p2]} />
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
                <p>Generate</p>
                <button className={`px-2 focus:outline-none ${boxes.cartoony}`} onClick={() => setHard(!hard)}>
                    {hard ? "exactly" : "at most"}
                    <ChangeCircle />
                </button>
                <input
                    className={`px-2 h-12 w-16 focus:outline-none ${boxes.cartoony}`}
                    type="number"
                    value={num_teams}
                    onChange={(e) => setNumTeams(parseInt(e.target.value))}
                />
                <p>teams.</p>
                <button
                    onClick={() => {
                        if (!is_graph_sound) {
                            pushAlert("There's some conflicting relationships!")
                            return
                        } else {
                            alert("Not implemented!")
                        }
                    }}
                    className={`text-xl font-bold px-4 py-2 ${boxes.cartoony}`}
                >
                    <p>Generate Teams</p>
                </button>
            </div>
        </motion.main>
    )
}

export default IndexPage
