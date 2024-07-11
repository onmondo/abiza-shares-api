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

shareRoutes.post("/holders/:id/advance", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.AddCashAdvance(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

shareRoutes.get("/holders/:id/advance", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.GetShareHoldersCashAdvances(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.get("/holders/advance/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.GetShareHoldersCashAdvanceById(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.delete("/holders/advance/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.DeleteShareHoldersCashAdvanceById(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.post("/holders/advance/:id/payments", async (req: Request, res: Response, next: NextFunction) => {
    console.log(req)
    const { statusCode, message } = await service.PayCashAdvance(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

shareRoutes.get("/holders/advance/:id/payments", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message, data } = await service.GetPaymentFromCashAdvances(req)
    res
        .status(statusCode)
        .json({
            message,
            data
        })
})

shareRoutes.delete("/holders/advance/:id/payments", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.CancelPaymentFromCashAdvance(req)
    res
        .status(statusCode)
        .json({
            message,
        })
})

export default shareRoutes