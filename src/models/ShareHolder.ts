import { ObjectId } from "mongodb"

export interface ShareHolder  {
    name: string
    percentage: number
    isActive: boolean
    isOwner: boolean
    cashAdvances?: ObjectId[]
}
