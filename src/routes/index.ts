import { NextFunction, Request, Response, Router } from "express"
import { container } from "tsyringe"
import { CostService } from "../service/costService"

const costRoutes = Router()
const service = container.resolve(CostService)

costRoutes.post("/:year/:month", async (req: Request, res: Response, next: NextFunction) => {
    const { statusCode, message } = await service.AddCapitalExpenditure(req)
    res
        .status(statusCode)
        .json({
            message
        })
})

export default costRoutes