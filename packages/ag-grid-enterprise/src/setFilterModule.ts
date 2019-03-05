// SPL
import {Module} from "ag-grid-community";
import {SetFilter} from "./setFilter/setFilter";
import {Grid} from "ag-grid-community";

export const SetFilterModule: Module = {
    moduleName: 'setFilterModule',
    enterpriseDefaultComponents: [
        {
            componentName: 'agSetColumnFilter',
            theClass: SetFilter
        }
    ]
};

Grid.addModule([SetFilterModule]);
