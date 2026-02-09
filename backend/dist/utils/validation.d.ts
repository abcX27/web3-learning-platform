import Joi from 'joi';
/**
 * User registration validation schema
 */
export declare const registerSchema: Joi.ObjectSchema<any>;
/**
 * User login validation schema
 */
export declare const loginSchema: Joi.ObjectSchema<any>;
/**
 * Wallet login validation schema
 */
export declare const walletLoginSchema: Joi.ObjectSchema<any>;
/**
 * Update profile validation schema
 */
export declare const updateProfileSchema: Joi.ObjectSchema<any>;
/**
 * Validation middleware factory
 */
export declare function validate(schema: Joi.ObjectSchema): (req: any, res: any, next: any) => any;
//# sourceMappingURL=validation.d.ts.map