import { Component } from "./component";
import { RefSelector } from "./componentAnnotations";
import { Autowired, PostConstruct } from "../context/context";
import { GridOptionsWrapper } from "../gridOptionsWrapper";
import { AgCheckbox } from "./agCheckbox";
import { _ } from "../utils";

type GroupItem = Component | HTMLElement;

interface GroupParams {
    title: string;
    enabled: boolean;
    suppressEnabledCheckbox?: boolean;
    suppressOpenCloseIcons?: boolean;
    cssClass?: string;
    items?: GroupItem[];
    alignItems?: 'start' | 'end' | 'center' | 'stretch'; // center by default
}

export class AgGroupComponent extends Component {

    private items: GroupItem[];
    private title: string;
    private enabled: boolean;
    private expanded: boolean;
    private suppressEnabledCheckbox: boolean = true;
    private suppressOpenCloseIcons: boolean = false;
    private alignItems: GroupParams['alignItems'];

    @Autowired('gridOptionsWrapper') private gridOptionsWrapper: GridOptionsWrapper;

    @RefSelector('groupTitle') private groupTitle: HTMLElement;
    @RefSelector('eGroupOpenedIcon') private eGroupOpenedIcon: HTMLElement;
    @RefSelector('eGroupClosedIcon') private eGroupClosedIcon: HTMLElement;

    @RefSelector('eToolbar') private eToolbar: HTMLElement;
    @RefSelector('cbGroupEnabled') private cbGroupEnabled: AgCheckbox;
    @RefSelector("lbGroupTitle") private lbGroupTitle: HTMLElement;
    @RefSelector("eContainer") private groupContainer: HTMLElement;

    constructor(params?: GroupParams) {
        super(AgGroupComponent.getTemplate(params));

        if (!params) {
            params = {} as GroupParams;
        }

        const { title, enabled, items, suppressEnabledCheckbox, suppressOpenCloseIcons } = params;

        this.title = title;
        this.enabled = enabled != null ? enabled : true;
        this.items = items || [];

        this.alignItems = params.alignItems || 'center';

        if (suppressEnabledCheckbox != null) {
            this.suppressEnabledCheckbox = suppressEnabledCheckbox;
        }

        if (suppressOpenCloseIcons != null) {
            this.suppressOpenCloseIcons = suppressOpenCloseIcons;
        }
    }

    private static getTemplate(params?: GroupParams) {
        const groupClass = params && params.cssClass;
        if (!groupClass) {
            throw new Error('Missing groupClass param');
        }
        return `<div class="ag-group ${groupClass}">
            <div class="ag-group-title-bar ${groupClass}-title-bar" ref="groupTitle">
                <span class="ag-group-title-bar-icon ${groupClass}-title-bar-icon" ref="eGroupOpenedIcon"></span>
                <span class="ag-group-title-bar-icon ${groupClass}-title-bar-icon" ref="eGroupClosedIcon"></span>
                <span ref="lbGroupTitle" class="ag-group-title ${groupClass}-title"></span>
            </div>
            <div ref="eToolbar" class="ag-group-toolbar ${groupClass}-toolbar">
                <ag-checkbox ref="cbGroupEnabled"></ag-checkbox>
            </div>
            <div ref="eContainer" class="ag-group-container ${groupClass}-container"></div>
        </div>`;
    }

    public static getParamsFromElement(el: HTMLElement): GroupParams {
        const groupClass = el.getAttribute("data-group-class");
        if (!groupClass) {
            throw new Error('<ag-group-component> elements must define the data-group-class attribute');
        }
        return { cssClass: groupClass };
    }

    @PostConstruct
    private postConstruct() {
        if (this.items.length) {
            const initialItems = this.items;
            this.items = [];

            this.addItems(initialItems);
        }

        const localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
        this.cbGroupEnabled.setLabel(localeTextFunc('enabled', 'Enabled'));

        if (this.title) {
            this.setTitle(this.title);
        }

        if (this.enabled) {
            this.setEnabled(this.enabled);
        }

        this.setAlignItems(this.alignItems);

        this.hideEnabledCheckbox(this.suppressEnabledCheckbox);
        this.hideOpenCloseIcons(this.suppressOpenCloseIcons);

        this.setupExpandContract();
    }

    private setupExpandContract(): void {
        this.eGroupClosedIcon.appendChild(_.createIcon('columnSelectClosed', this.gridOptionsWrapper, null));
        this.eGroupOpenedIcon.appendChild(_.createIcon('columnSelectOpen', this.gridOptionsWrapper, null));

        this.setOpenClosedIcons();

        this.addDestroyableEventListener(this.groupTitle, 'click', () => this.toggleGroupExpand());
    }

    private setOpenClosedIcons(): void {
        const showIcon = !this.suppressOpenCloseIcons;
        _.setDisplayed(this.eGroupClosedIcon, showIcon && !this.expanded);
        _.setDisplayed(this.eGroupOpenedIcon, showIcon && this.expanded);
    }

    public isExpanded(): boolean {
        return this.expanded;
    }

    public setAlignItems(alignment: GroupParams['alignItems']): this {
        const eGui = this.getGui();

        if (this.alignItems !== alignment) {
            _.removeCssClass(eGui, `ag-group-item-alignment-${this.alignItems}`);
        }

        this.alignItems = alignment;
        const newCls = `ag-group-item-alignment-${this.alignItems}`;

        if (alignment !== 'center' && !_.containsClass(eGui, newCls)) {
            _.addCssClass(eGui, newCls);
        }

        return this;
    }

    public toggleGroupExpand(expanded?: boolean): this {
        const eGui = this.getGui();

        if (this.suppressOpenCloseIcons) {
            this.expanded = true;
            _.removeCssClass(eGui, 'ag-collapsed');
            return this;
        }

        expanded = expanded != null ? expanded : !this.expanded;

        if (this.expanded === expanded) {
            return this;
        }

        this.expanded = expanded;
        this.setOpenClosedIcons();
        _.addOrRemoveCssClass(eGui, 'ag-collapsed', !expanded);

        if (this.expanded) {
            const event = {
                type: 'expanded',
            };
            this.dispatchEvent(event);
        } else {
            const event = {
                type: 'collapsed',
            };
            this.dispatchEvent(event);
        }

        return this;
    }

    public addItems(items: GroupItem[]) {
        items.forEach(item => this.addItem(item));
    }

    public addItem(item: GroupItem) {
        const container = this.groupContainer;
        const el = item instanceof Component ? item.getGui() : item;
        _.addCssClass(el, 'ag-group-item');

        container.appendChild(el);
        this.items.push(el);
    }

    public hideItem(hide: boolean, index: number) {
        const itemToHide = this.items[index] as HTMLElement;
        _.addOrRemoveCssClass(itemToHide, 'ag-hidden', hide);
    }

    public setTitle(title: string): this {
        this.lbGroupTitle.innerText = title;
        return this;
    }

    public setEnabled(enabled: boolean, skipToggle?: boolean): this {
        this.enabled = enabled;
        _.addOrRemoveCssClass(this.getGui(), 'ag-disabled', !enabled);

        this.toggleGroupExpand(enabled);

        if (!skipToggle) {
            this.cbGroupEnabled.setValue(enabled);
        }

        return this;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public onEnableChange(callbackFn: (enabled: boolean) => void): this {
        this.cbGroupEnabled.onValueChange((newSelection: boolean) => {
            this.setEnabled(newSelection, true);
            callbackFn(newSelection);
        });

        return this;
    }

    public hideEnabledCheckbox(hide: boolean): this {
        _.addOrRemoveCssClass(this.eToolbar, 'ag-hidden', hide);
        return this;
    }

    public hideOpenCloseIcons(hide: boolean): this {
        this.suppressOpenCloseIcons = hide;

        if (hide) {
            this.toggleGroupExpand(true);
        }
        return this;
    }
}