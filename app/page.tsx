import { motion } from "framer-motion"
import { useState } from "react"
import Button from "../components/Button"
import CloseButton from "../components/CloseButton"
import Person from "../components/Person"
import boxes from "../styles/boxes.module.css"
import "../styles/global.css"

const IndexPage = () => {
    const [people, setPeople] = useState<string[]>([])
    const [pair_target, setPairing] = useState<number>()
    const [avoid_target, setAvoiding] = useState<number>()
    const [avoidances, setAvoidances] = useState<[number, number][]>([])
    const [pairings, setPairings] = useState<[number, number][]>([])
    const [alerts, setAlerts] = useState<string[]>([])

    const pushAlert = (message) => {
        setAlerts([...alerts, message])
    }

    const removeAlert = (index) => {
        setAlerts(alerts.filter((_, i) => i !== index))
    }

    const onAddPerson = (event) => {
        event.preventDefault()
        const input = document.getElementById("input")
        if (!input) return
        // @ts-ignore
        const name = input.value.trim()
        // @ts-ignore
        if (people.includes(name)) {
            pushAlert("Person already added!")
        } else if (name === "") {
            pushAlert("Name cannot be empty!")
        } else {
            // @ts-ignore
            setPeople([...people, name])
            // @ts-ignore
            input.value = ""
        }
    }

    const removePairs = (name) => {
        setPairings(pairings.filter((pair) => pair[0] !== name && pair[1] !== name))
    }

    const removePairByIndex = (index) => {
        setPairings(pairings.filter((_, i) => i !== index))
    }

    const removeAvoids = (name) => {
        setAvoidances(avoidances.filter((pair) => pair[0] !== name && pair[1] !== name))
    }

    const removeAvoidByIndex = (index) => {
        setAvoidances(avoidances.filter((_, i) => i !== index))
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
        if (name === pairing || name === avoiding) {
            return "target"
        } else if (pairing !== "" || avoiding !== "") {
            return "selectable"
        } else {
            return "idle"
        }

        // There's a fourth state, "show", but it's not used here.
    }

    const checkIsIn = (list, name1, name2) => {
        for (let i = 0; i < list.length; i++) {
            const [n1, n2] = list[i]
            if ((n1 === name1 && n2 === name2) || (n1 === name2 && n2 === name1)) {
                return true
            }
        }
        return false
    }

    const checkInPairingsOrAvoidances = (name1, name2) => {
        return checkIsIn(pairings, name1, name2) || checkIsIn(avoidances, name1, name2)
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
        <body className="bg-gray-100 w-screen h-screen p-4 flex flex-col items-center">
            <motion.div className="flex flex-col gap-2 w-fit">
                {alerts.map((alert, j) => (
                    <motion.div className="bg-red-200 p-2 rounded-lg w-full min-w-[320px] flex" key={j}>
                        <p>{alert}</p>
                        <CloseButton onClick={() => removeAlert(j)} />
                    </motion.div>
                ))}
            </motion.div>
            <motion.title>Teamificator</motion.title>
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
                                dropdown={{
                                    "Pair with": startPairing(person),
                                    "Avoid": startAvoiding(person),
                                }}
                                onRemove={onRemovePerson(person)}
                                onSelect={selectOtherPerson(person)}
                                cancelSelect={cancelSelect}
                                state={getPersonState(person, pair_target, avoid_target)}
                            />
                        ))}
                    </motion.div>
                </div>
                <br />
                {pairings.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold">Pairings</h2>
                        <motion.div>
                            {pairings.map((pair, j) => (
                                <motion.div className="flex r gap-10 items-center">
                                    <Person name={pair[0]} state="show" />
                                    <Person name={pair[1]} state="show" />

                                    <CloseButton onClick={() => removePairByIndex(j)} />
                                </motion.div>
                            ))}
                        </motion.div>
                        <br />
                    </>
                )}

                {avoidances.length > 0 && (
                    <>
                        <h2 className="text-2xl font-bold">Avoidances</h2>
                        <motion.div>
                            {avoidances.map((pair, j) => (
                                <motion.div className="flex r gap-10 items-center" key={j}>
                                    <Person name={pair[0]} state="show" />
                                    <Person name={pair[1]} state="show" />
                                    <CloseButton onClick={() => removeAvoidByIndex(j)} />
                                </motion.div>
                            ))}
                        </motion.div>
                        <br />
                    </>
                )}

                <motion.button
                    onClick={() => alert("Not implemented!")}
                    className={`ml-2 text-xl font-bold px-4 py-2 mt-2 ${boxes.cartoony}`}
                >
                    <p>Generate Teams</p>
                </motion.button>
            </main>
        </body>
    )
}

export default IndexPage
