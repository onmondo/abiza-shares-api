import { IsBoolean, IsNumber, Length } from "class-validator";

export class ShareHolderEntry {
    @Length(3, 512)
    name!: string
    @IsNumber()
    percentage!: number
    @IsBoolean()
    isOwner!: boolean
}