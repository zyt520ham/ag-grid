// SPL
import { TooltipManager } from "./widgets/tooltipManager";
import {Module} from "./interfaces/iModule";

export const TooltipModule: Module = {
    moduleName: 'tooltipModule',
    beans: [TooltipManager]
};

