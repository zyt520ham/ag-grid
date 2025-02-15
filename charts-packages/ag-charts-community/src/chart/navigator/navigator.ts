import { RangeSelector } from '../shapes/rangeSelector';
import { BBox } from '../../scene/bbox';
import { NavigatorMask } from './navigatorMask';
import { NavigatorHandle } from './navigatorHandle';
import { ChartUpdateType } from '../chart';
import { BOOLEAN, NUMBER, Validate } from '../../util/validation';
import { InteractionManager } from '../interaction/interactionManager';
import { CursorManager } from '../interaction/cursorManager';
import { Scene } from '../../scene/scene';
import { Series } from '../series/series';

interface Offset {
    offsetX: number;
    offsetY: number;
}

export class Navigator {
    private readonly rs = new RangeSelector();

    readonly mask = new NavigatorMask(this.rs.mask);
    readonly minHandle = new NavigatorHandle(this.rs.minHandle);
    readonly maxHandle = new NavigatorHandle(this.rs.maxHandle);

    private minHandleDragging = false;
    private maxHandleDragging = false;
    private panHandleOffset = NaN;

    @Validate(BOOLEAN)
    private _enabled = false;
    set enabled(value: boolean) {
        this._enabled = value;

        this.updateGroupVisibility();
    }
    get enabled() {
        return this._enabled;
    }

    set x(value: number) {
        this.rs.x = value;
    }
    get x(): number {
        return this.rs.x;
    }

    set y(value: number) {
        this.rs.y = value;
    }
    get y(): number {
        return this.rs.y;
    }

    set width(value: number) {
        this.rs.width = value;
    }
    get width(): number {
        return this.rs.width;
    }

    set height(value: number) {
        this.rs.height = value;
    }
    get height(): number {
        return this.rs.height;
    }

    @Validate(NUMBER(0))
    private _margin = 10;
    set margin(value: number) {
        this._margin = value;
    }
    get margin(): number {
        return this._margin;
    }

    set min(value: number) {
        this.rs.min = value;
    }
    get min(): number {
        return this.rs.min;
    }

    set max(value: number) {
        this.rs.max = value;
    }
    get max(): number {
        return this.rs.max;
    }

    private _visible: boolean = true;
    set visible(value: boolean) {
        this._visible = value;
        this.updateGroupVisibility();
    }
    get visible() {
        return this._visible;
    }

    private updateGroupVisibility() {
        this.rs.visible = this.enabled && this.visible;
    }

    constructor(
        private readonly chart: {
            scene: Scene;
            update(
                type: ChartUpdateType,
                opts?: { forceNodeDataRefresh?: boolean; seriesToUpdate?: Iterable<Series> }
            ): void;
        },
        interactionManager: InteractionManager,
        private readonly cursorManager: CursorManager
    ) {
        this.chart.scene.root!.append(this.rs);
        this.rs.onRangeChange = () => chart.update(ChartUpdateType.PERFORM_LAYOUT, { forceNodeDataRefresh: true });

        interactionManager.addListener('drag-start', (event) => this.onDragStart(event));
        interactionManager.addListener('drag', (event) => this.onDrag(event));
        interactionManager.addListener('hover', (event) => this.onDrag(event));
        interactionManager.addListener('drag-end', () => this.onDragStop());
    }

    private onDragStart(offset: Offset) {
        if (!this.enabled) {
            return;
        }

        const { offsetX, offsetY } = offset;
        const { rs } = this;
        const { minHandle, maxHandle, x, width, min } = rs;
        const visibleRange = rs.computeVisibleRangeBBox();

        if (!(this.minHandleDragging || this.maxHandleDragging)) {
            if (minHandle.containsPoint(offsetX, offsetY)) {
                this.minHandleDragging = true;
            } else if (maxHandle.containsPoint(offsetX, offsetY)) {
                this.maxHandleDragging = true;
            } else if (visibleRange.containsPoint(offsetX, offsetY)) {
                this.panHandleOffset = (offsetX - x) / width - min;
            }
        }
    }

    private onDrag(offset: Offset) {
        if (!this.enabled) {
            return;
        }

        const { rs, panHandleOffset } = this;
        const { x, y, width, height, minHandle, maxHandle } = rs;
        const { offsetX, offsetY } = offset;
        const minX = x + width * rs.min;
        const maxX = x + width * rs.max;
        const visibleRange = new BBox(minX, y, maxX - minX, height);

        function getRatio() {
            return Math.min(Math.max((offsetX - x) / width, 0), 1);
        }

        if (minHandle.containsPoint(offsetX, offsetY) || maxHandle.containsPoint(offsetX, offsetY)) {
            this.cursorManager.updateCursor('navigator', 'ew-resize');
        } else if (visibleRange.containsPoint(offsetX, offsetY)) {
            this.cursorManager.updateCursor('navigator', 'grab');
        } else {
            this.cursorManager.updateCursor('navigator');
        }

        if (this.minHandleDragging) {
            rs.min = getRatio();
        } else if (this.maxHandleDragging) {
            rs.max = getRatio();
        } else if (!isNaN(panHandleOffset)) {
            const span = rs.max - rs.min;
            const min = Math.min(getRatio() - panHandleOffset, 1 - span);
            if (min <= rs.min) {
                // pan left
                rs.min = min;
                rs.max = rs.min + span;
            } else {
                // pan right
                rs.max = min + span;
                rs.min = rs.max - span;
            }
        }
    }

    private onDragStop() {
        this.stopHandleDragging();
    }

    private stopHandleDragging() {
        this.minHandleDragging = this.maxHandleDragging = false;
        this.panHandleOffset = NaN;
    }
}
