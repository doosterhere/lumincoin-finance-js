import ChartConfig from "../../config/chartConfig.js";
import {SidebarConfig} from "../../config/sidebarConfig.js";

export class Main {
    chartConfig = ChartConfig.config;
    sidebar = new SidebarConfig();
}