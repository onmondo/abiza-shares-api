import { IsBoolean, Length } from "class-validator";
import { ShareHolderEntry } from "./ShareHolderEntry";

export class UpdateShareHolderEntry extends ShareHolderEntry {
    @Length(20, 24)
    id!: string
    @IsBoolean()
    isActive!: boolean
}