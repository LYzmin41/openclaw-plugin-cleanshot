export interface OpenCleanShotUrlResult {
    ok: true;
    launched: true;
    url: string;
}
export declare function validateCleanShotUrl(url: unknown): string;
export declare function openCleanShotUrl(url: unknown): Promise<OpenCleanShotUrlResult>;
