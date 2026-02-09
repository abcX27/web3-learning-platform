"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorController = void 0;
const editorService_1 = require("../services/editorService");
const joi_1 = __importDefault(require("joi"));
class EditorController {
    /**
     * Compile Solidity code
     */
    static async compile(req, res) {
        try {
            const schema = joi_1.default.object({
                code: joi_1.default.string().required().max(50000),
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
            const result = editorService_1.EditorService.compileSolidity(value.code);
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
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
    static async execute(req, res) {
        try {
            const schema = joi_1.default.object({
                code: joi_1.default.string().required().max(50000),
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
            const result = editorService_1.EditorService.executeJavaScript(value.code);
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: error.message || 'Failed to execute code',
                },
            });
        }
    }
}
exports.EditorController = EditorController;
//# sourceMappingURL=editorController.js.map