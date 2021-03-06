import pool from '../../ObjectPool'
import { byId } from '../dom'
import { tryGetFromMap } from '../collections'

import { Transfer } from '../../network'
import { newAttributeValues, restoreAttributes } from '../dom'

const initialCircles = new Set<SVGCircleElement>()
const initialStadiums = new Set<SVGRectElement>()
const initialTransfers = new Set<SVGPathElement | SVGLineElement>()

export function scaleElement(el: SVGElement, scaleFactor: number, asAttribute = false) {
    if (!asAttribute) {
        el.style.transform = `scale(${scaleFactor})`
        return
    }
    if (el instanceof SVGCircleElement) {
        scaleCircleAsAttribute(el, scaleFactor)
    } else if (el instanceof SVGRectElement) {
        scaleStadiumAsAttribute(el, scaleFactor)
    }
}

export function scaleCircleAsAttribute(circle: SVGCircleElement, scaleFactor: number) {
    initialCircles.add(circle)
    // const t = scaleFactor - 1,
    //     tx = -circle.getAttribute('cx') * t,
    //     ty = -circle.getAttribute('cy') * t;
    // circle.setAttribute('transform', `matrix(${scaleFactor}, 0, 0, ${scaleFactor}, ${tx}, ${ty})`);
    newAttributeValues(circle, ({ r }) => ({
        r: (+r * scaleFactor).toString(),
    }))
}

export function scaleStadiumAsAttribute(stadium: SVGRectElement, scaleFactor: number) {
    initialStadiums.add(stadium)
    newAttributeValues(stadium, ({ x, y, width, height, rx, ry }) => {
        const diff = +height * (scaleFactor - 1)
        const offset = diff / 2
        return {
            x: (+x - offset).toString(),
            y: (+y - offset).toString(),
            width: (+width + diff).toString(),
            height: (+height * scaleFactor).toString(),
            rx: (+rx * scaleFactor).toString(),
            ry: (+ry * scaleFactor).toString(),
        }
    })
}

export function scaleTransfer(transfer: Transfer, scaleFactor: number) {
    const transferOuterStrokeWidth = parseFloat(byId('transfers-outer').style.strokeWidth || '')
    const transferInnerStrokeWidth = parseFloat(byId('transfers-inner').style.strokeWidth || '')
    const outer = tryGetFromMap(pool.outerEdgeBindings, transfer)
    const inner = tryGetFromMap(pool.innerEdgeBindings, transfer)
    initialTransfers.add(outer)
    initialTransfers.add(inner)
    outer.style.strokeWidth = transferOuterStrokeWidth * scaleFactor + 'px'
    inner.style.strokeWidth = transferInnerStrokeWidth * scaleFactor + 'px'
}

export function unscaleAll() {
    for (const circle of initialCircles) {
        restoreAttributes(circle, 'r')
    }
    for (const stadium of initialStadiums) {
        restoreAttributes(stadium, 'x', 'y', 'width', 'height', 'rx', 'ry')
    }
    for (const transfer of initialTransfers) {
        transfer.style.strokeWidth = null
    }
    // initialCircles.forEach(circle => circle.removeAttribute('transform'));
    initialTransfers.clear()
    initialCircles.clear()
    initialStadiums.clear()
    initialStadiums.clear()
}
