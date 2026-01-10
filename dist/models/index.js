"use strict";
/**
 * Exports de todos los modelos según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./User"), exports);
__exportStar(require("./ConsentState"), exports);
__exportStar(require("./AbstractEvent"), exports);
__exportStar(require("./Pattern"), exports);
__exportStar(require("./LatentCoPresence"), exports);
__exportStar(require("./SyncWindow"), exports);
__exportStar(require("./Recognition"), exports);
__exportStar(require("./Revelation"), exports);
__exportStar(require("./Block"), exports);
__exportStar(require("./Report"), exports);
//# sourceMappingURL=index.js.map