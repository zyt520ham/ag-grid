// SPL
import { TooltipManager } from "./widgets/tooltipManager";
import {Module} from "./interfaces/iModule";
import {Grid} from "./grid";

export const TooltipModule: Module = {
    moduleName: 'tooltipModule',
    beans: [TooltipManager]
};

Grid.addModule([TooltipModule]);
