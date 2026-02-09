"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.walletLoginSchema = exports.loginSchema = exports.registerSchema = void 0;
exports.validate = validate;
const joi_1 = __importDefault(require("joi"));
/**
 * User registration validation schema
 */
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项',
    }),
    password: joi_1.default.string()
        .min(8)
        .max(100)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
        'string.min': '密码至少需要 8 个字符',
        'string.max': '密码最多 100 个字符',
        'string.pattern.base': '密码必须包含大小写字母和数字',
        'any.required': '密码是必填项',
    }),
    username: joi_1.default.string()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
        'string.min': '用户名至少需要 3 个字符',
        'string.max': '用户名最多 30 个字符',
        'string.pattern.base': '用户名只能包含字母、数字和下划线',
        'any.required': '用户名是必填项',
    }),
});
/**
 * User login validation schema
 */
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.email': '请输入有效的邮箱地址',
        'any.required': '邮箱是必填项',
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'any.required': '密码是必填项',
    }),
});
/**
 * Wallet login validation schema
 */
exports.walletLoginSchema = joi_1.default.object({
    walletAddress: joi_1.default.string()
        .pattern(/^0x[a-fA-F0-9]{40}$/)
        .required()
        .messages({
        'string.pattern.base': '请输入有效的以太坊钱包地址',
        'any.required': '钱包地址是必填项',
    }),
    signature: joi_1.default.string()
        .required()
        .messages({
        'any.required': '签名是必填项',
    }),
    message: joi_1.default.string()
        .required()
        .messages({
        'any.required': '消息是必填项',
    }),
});
/**
 * Update profile validation schema
 */
exports.updateProfileSchema = joi_1.default.object({
    username: joi_1.default.string()
        .min(3)
        .max(30)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .optional()
        .allow('')
        .messages({
        'string.min': '用户名至少需要 3 个字符',
        'string.max': '用户名最多 30 个字符',
        'string.pattern.base': '用户名只能包含字母、数字和下划线',
    }),
    avatarUrl: joi_1.default.string()
        .uri()
        .optional()
        .allow('', null)
        .messages({
        'string.uri': '请输入有效的 URL',
    }),
    bio: joi_1.default.string()
        .max(500)
        .optional()
        .allow('', null)
        .messages({
        'string.max': '个人简介最多 500 个字符',
    }),
});
/**
 * Validation middleware factory
 */
function validate(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '数据验证失败',
                    details: errors,
                },
            });
        }
        // Replace req.body with validated and sanitized value
        req.body = value;
        next();
    };
}
//# sourceMappingURL=validation.js.map