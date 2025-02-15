import { BOOLEAN, COLOR_STRING, NUMBER, ValidateAndChangeDetection } from '../util/validation';
import { ChangeDetectable, RedrawType } from './changeDetectable';

export class DropShadow extends ChangeDetectable {
    @ValidateAndChangeDetection({
        validatePredicate: BOOLEAN,
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
    enabled = true;

    @ValidateAndChangeDetection({
        validatePredicate: COLOR_STRING,
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
    color = 'rgba(0, 0, 0, 0.5)';

    @ValidateAndChangeDetection({
        validatePredicate: NUMBER(),
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
    xOffset = 0;

    @ValidateAndChangeDetection({
        validatePredicate: NUMBER(),
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
    yOffset = 0;

    @ValidateAndChangeDetection({
        validatePredicate: NUMBER(0),
        sceneChangeDetectionOpts: { redraw: RedrawType.MAJOR },
    })
    blur = 5;
}
