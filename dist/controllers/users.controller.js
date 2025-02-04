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
exports.UserController = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateTokens_1 = require("../helpers/generateTokens");
const verifyToken_1 = __importDefault(require("../helpers/verifyToken"));
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, confirmPassword, name } = req.body;
                const existingUser = yield User_1.UserModel.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ error: 'User already exists' });
                }
                if (password !== confirmPassword) {
                    return res.status(400).json({ error: 'Passwords do not match' });
                }
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const user = yield User_1.UserModel.create({ email, password: hashedPassword, name });
                const token = (0, generateTokens_1.generateToken)({ email, id: user._id });
                res.json({
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    token
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.UserModel.findOne({ email });
                if (!user) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }
                const token = (0, generateTokens_1.generateToken)({ email, id: user._id });
                res.json({
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    token
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
    static verifyToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const user = yield (0, verifyToken_1.default)(token);
                if (!user) {
                    return res.status(401).json({ error: 'Unauthorized' });
                }
                res.json({
                    _id: user._id,
                    email: user.email,
                    name: user.name
                });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Something went wrong' });
            }
        });
    }
}
exports.UserController = UserController;
