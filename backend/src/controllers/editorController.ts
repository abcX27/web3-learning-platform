import { Request, Response } from 'express';
import { EditorService } from '../services/editorService';
import Joi from 'joi';

export class EditorController {
  /**
   * Compile Solidity code
   */
  static async compile(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        code: Joi.string().required().max(50000),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
          },
        });
      }

      const result = EditorService.compileSolidity(value.code);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to compile code',
        },
      });
    }
  }

  /**
   * Execute JavaScript code
   */
  static async execute(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        code: Joi.string().required().max(50000),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: {
            message: error.details[0].message,
          },
        });
      }

      const result = EditorService.executeJavaScript(value.code);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to execute code',
        },
      });
    }
  }
}
