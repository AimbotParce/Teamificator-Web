// Generic "Target" and "Idle" states for a person card, which have an "origin",
// that can be a "Pair" or "Avoid" relationship type, respectively.

enum PersonState {
    PairTarget,
    AvoidTarget,
    PairSelectable,
    AvoidSelectable,
    Idle,
}

export { PersonState }
