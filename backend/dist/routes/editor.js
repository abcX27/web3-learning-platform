"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const editorController_1 = require("../controllers/editorController");
const router = (0, express_1.Router)();
// Compile Solidity code
router.post('/compile', editorController_1.EditorController.compile);
// Execute JavaScript code
router.post('/execute', editorController_1.EditorController.execute);
exports.default = router;
//# sourceMappingURL=editor.js.map