import { NextFunction, Request, Response } from 'express'
import { ZodSchema, ZodError } from 'zod'

export default (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // eslint-disable-next-line no-console
        console.error('❌ Zod Error:', error.issues)
        res.status(400).json({
          message: 'Zod Error',
          errors: error.issues,
        })
      } else {
        res.status(500).json({
          message: 'Internal server error',
        })
      }
    }
  }
}