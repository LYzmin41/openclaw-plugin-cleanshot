export interface GetDisplaysOptions {
    includeVisibleFrame?: boolean;
    includePixelBounds?: boolean;
}
export interface RawDisplay {
    name?: unknown;
    isMain?: unknown;
    x?: unknown;
    y?: unknown;
    width?: unknown;
    height?: unknown;
    visibleX?: unknown;
    visibleY?: unknown;
    visibleWidth?: unknown;
    visibleHeight?: unknown;
    scale?: unknown;
}
export interface DisplayInfo {
    id: number;
    name?: string;
    isMain?: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    visibleX?: number;
    visibleY?: number;
    visibleWidth?: number;
    visibleHeight?: number;
    scale?: number;
    pixelX?: number;
    pixelY?: number;
    pixelWidth?: number;
    pixelHeight?: number;
}
export interface GetDisplaysResult {
    coordinateSystem: "macos-logical-points";
    note: string;
    displays: DisplayInfo[];
}
export declare function parseDisplaysJson(raw: string, options?: GetDisplaysOptions): GetDisplaysResult;
export declare function normalizeDisplays(rawDisplays: RawDisplay[], options?: GetDisplaysOptions): GetDisplaysResult;
export declare function getDisplays(options?: GetDisplaysOptions): Promise<GetDisplaysResult>;
