// SPL
import {Module} from "ag-grid-community";
import {SetFilter} from "./setFilter/setFilter";

export const SetFilterModule: Module = {
    moduleName: 'setFilterModule',
    enterpriseDefaultComponents: [
        {
            componentName: 'agSetColumnFilter',
            theClass: SetFilter
        }
    ]
};

