import { NextFunction, Request, Response, Router } from "express"
import { container } from "tsyringe"
import { SharesService } from "../service/sharesService"

const shareRoutes = Router()
const service = container.resolve(SharesService)

shareRoutes.post("/holders", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.AddShareHolder(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

shareRoutes.get("/holders", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.GetShareHolders(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.get("/holders/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.GetShareHolderById(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.put("/holders/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.UpdateShareHolder(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

shareRoutes.delete("/holders/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.DeleteShareHolder(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

export default shareRoutes