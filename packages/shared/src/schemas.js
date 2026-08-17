"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverSchema = void 0;
const zod_1 = require("zod");
exports.DriverSchema = zod_1.z.object({
    id: zod_1.z.string(),
    code: zod_1.z.string(),
    number: zod_1.z.number().nullable(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    teamId: zod_1.z.string().nullable(),
    countryCode: zod_1.z.string().nullable()
});
