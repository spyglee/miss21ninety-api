"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
exports.default = validateTokenAndGetUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const verifyToken = (token) => {
    try {
        if (!token) {
            return '';
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return 'error: ' + error;
    }
};
exports.verifyToken = verifyToken;
function validateTokenAndGetUser(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token) {
            throw new Error('Invalid token');
        }
        const verifiedToken = (0, exports.verifyToken)(token);
        if (typeof verifiedToken === 'string') {
            throw new Error('Invalid token');
        }
        const user = yield User_1.UserModel.findById(verifiedToken.id.toString());
        if (!user) {
            throw new Error('User not found');
        }
        if (user.isActive === false) {
            throw new Error('User is not active');
        }
        return user;
    });
}
