enum RelationshipType {
    Pair,
    Avoid,
}

type Relationship = [number, RelationshipType, number]

export { RelationshipType }
export type { Relationship }
