import * as alertify from 'alertifyjs'

import pool from '../../ObjectPool'
import { filters } from '../svg'
import { ShortestRouteObject } from '../algorithm'
import { tr, formatTime as ft } from '../../i18n'
import { Platform, Edge, Span } from '../../network'

import * as animation from './animation'
import * as scale from './scale'

export {
  animation,
  scale,
}

const ANIMATION_GREYING_SELECTOR = [
    'paths-inner',
    'paths-outer',
    'transfers-inner',
    'transfers-outer',
    'station-circles',
].map(s => `#${s} *`).join(', ')

export async function visualizeRoute(obj: ShortestRouteObject<Platform>, shouldAnimate = true) {
    const { platforms = [], edges, time } = obj
    const walkTo = ft(time.walkTo)
    if (edges === undefined) {
        return alertify.success(tr`${walkTo} on foot!`)
    }

    await animation.terminateAnimations()
    for (const { style } of document.querySelectorAll(ANIMATION_GREYING_SELECTOR) as any as HTMLElement[]) {
        //style['-webkit-filter'] = 'grayscale(1)';
        style.filter = null
        style.opacity = '0.25'
    }
    if (!shouldAnimate) {
        rehighlightEdges(edges)
        rehighlightPlatforms(platforms)
        return
    }

    const finished = await animation.animateRoute(platforms, edges)
    // finished is undefined if not animated, false if animation is still running or true if otherwise
    if (finished) {
        alertify.message(tr`TIME:<br>${walkTo} on foot<br>${ft(time.metro)} by metro<br>${ft(time.walkFrom)} on foot<br>TOTAL: ${ft(time.total)}`, 10)
    }
}

export function rehighlightEdges(edges: Edge<Platform>[]) {
    for (const edge of edges) {
        const outer = pool.outerEdgeBindings.get(edge)
        if (outer === undefined) {
            continue
        }
        outer.style.opacity = null
        const inner = pool.innerEdgeBindings.get(edge)
        if (inner !== undefined) {
            inner.style.opacity = null
        }
        if (edge instanceof Span) {
            filters.applyDrop(outer)
        }
    }
}

export function rehighlightPlatforms(platforms: Platform[]) {
    for (const platform of platforms) {
        const circle = pool.platformBindings.get(platform)
        if (circle) {
            circle.style.opacity = null
        }
    }
}
