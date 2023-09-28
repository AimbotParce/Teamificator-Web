import "../styles/global.css"
import React from "react"
import Head from "next/head"
import { motion } from "framer-motion"
import Person from "../components/Person"
import Button from "../components/Button"
import boxes from "../styles/boxes.module.css"

const IndexPage = () => {
    const [people, setPeople] = React.useState([])
    const [pair_target, setPairing] = React.useState("")
    const [avoid_target, setAvoiding] = React.useState("")
    const [avoidances, setAvoidances] = React.useState([])
    const [pairings, setPairings] = React.useState([])

    const onAddPerson = (event) => {
        event.preventDefault()
        const input = document.getElementById("input")
        if (!input) return
        // @ts-ignore
        const name = input.value.trim()
        // @ts-ignore
        if (people.includes(name)) {
            alert("Person already added!")
        } else if (name === "") {
            alert("Name cannot be empty!")
        } else {
            // @ts-ignore
            setPeople([...people, name])
            // @ts-ignore
            input.value = ""
        }
    }

    const removePairs = (name) => {
        setPairings(
            pairings.filter((pair) => pair[0] !== name && pair[1] !== name)
        )
    }

    const removeAvoids = (name) => {
        setAvoidances(
            avoidances.filter((pair) => pair[0] !== name && pair[1] !== name)
        )
    }

    const removePerson = (name) => {
        removePairs(name)
        removeAvoids(name)
        setPeople(people.filter((person) => person !== name))
    }

    const onRemovePerson = (name) => {
        return () => {
            if (pair_target === name) {
                setPairing("")
            } else if (avoid_target === name) {
                setAvoiding("")
            }
            removePerson(name)
        }
    }

    const startPairing = (name) => {
        return () => {
            if (pair_target !== "") {
                alert("Already pairing with someone!")
            } else if (avoid_target !== "") {
                alert("Already avoiding someone!")
            } else {
                setPairing(name)
            }
        }
    }

    const startAvoiding = (name) => {
        return () => {
            if (pair_target !== "") {
                alert("Already pairing with someone!")
            } else if (avoid_target !== "") {
                alert("Already avoiding someone!")
            } else {
                setAvoiding(name)
            }
        }
    }

    const getPersonState = (name, pairing, avoiding) => {
        if (name === pairing) {
            return "pairing_target"
        } else if (name === avoiding) {
            return "avoiding_target"
        } else if (pairing !== "" || avoiding !== "") {
            return "selectable"
        } else {
            return "idle"
        }
    }

    const checkIsIn = (list, name1, name2) => {
        for (let i = 0; i < list.length; i++) {
            const [n1, n2] = list[i]
            if (
                (n1 === name1 && n2 === name2) ||
                (n1 === name2 && n2 === name1)
            ) {
                return true
            }
        }
        return false
    }

    const checkInPairingsOrAvoidances = (name1, name2) => {
        return (
            checkIsIn(pairings, name1, name2) ||
            checkIsIn(avoidances, name1, name2)
        )
    }

    const selectOtherPerson = (name) => {
        return () => {
            if (pair_target === "" && avoid_target === "") {
                alert("No one is pairing or avoiding!")
            } else if (pair_target !== "") {
                if (checkInPairingsOrAvoidances(name, pair_target)) {
                    alert("Already paired or avoided!")
                } else {
                    // @ts-ignore
                    setPairings([...pairings, [name, pair_target]])
                    setPairing("")
                }
            } else if (avoid_target !== "") {
                if (checkInPairingsOrAvoidances(name, avoid_target)) {
                    alert("Already paired or avoided!")
                } else {
                    // @ts-ignore
                    setAvoidances([...avoidances, [name, avoid_target]])
                    setAvoiding("")
                }
            }
        }
    }

    const cancelSelect = () => {
        if (pair_target !== "") {
            setPairing("")
        } else if (avoid_target !== "") {
            setAvoiding("")
        }
    }

    return (
        <>
            <Head>
                <title>Teamificator</title>
            </Head>
            <main className="flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold">Teamificator</h1>
                <div className="flex flex-col items-left justify-center">
                    <form onSubmit={onAddPerson}>
                        <input
                            id="input"
                            className={`w-64 px-4 py-2 mt-2 text-xl focus:outline-none ${boxes.cartoony}`}
                            type="text"
                            placeholder="Add a person"
                        />
                        <Button type="submit">
                            <p>+</p>
                        </Button>
                    </form>
                    <motion.div>
                        {people.map((person) => (
                            <Person
                                name={person}
                                onRemove={onRemovePerson(person)}
                                onPair={startPairing(person)}
                                onAvoid={startAvoiding(person)}
                                state={getPersonState(
                                    person,
                                    pair_target,
                                    avoid_target
                                )}
                                onSelect={selectOtherPerson(person)}
                                cancelSelect={cancelSelect}
                            />
                        ))}
                    </motion.div>
                </div>
                <br />
                <h2 className="text-2xl font-bold">Pairings</h2>
                <motion.div>
                    {pairings.map((pair) => (
                        <motion.div className="flex r gap-10">
                            <Person name={pair[0]} state="show" />
                            <Person name={pair[1]} state="show" />
                        </motion.div>
                    ))}
                </motion.div>
                <br />
                <h2 className="text-2xl font-bold">Avoidances</h2>
                <motion.div>
                    {avoidances.map((pair) => (
                        <motion.div className="flex r gap-10">
                            <Person name={pair[0]} state="show" />
                            <Person name={pair[1]} state="show" />
                        </motion.div>
                    ))}
                </motion.div>
            </main>
        </>
    )
}

export default IndexPage
