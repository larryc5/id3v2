/// <reference types="node" />
export declare class ID3v2 {
    private readonly flags?;
    private readonly frames;
    static read(path: string): Promise<ID3v2>;
    constructor(buffer: Buffer);
    private getFrameData;
    get ufid(): {
        ownerIdentifier: string;
        identifier: Buffer;
    };
    get genre(): string;
    get track(): string;
    get album(): string;
    get title(): string;
    get year(): string;
    get artist(): string;
    get popularimeter(): {
        email: string;
        rating: number;
        counter?: number;
    };
    get length(): string;
    get set(): string;
    get text(): {
        description: string;
        value: string;
    } | {
        description: string;
        value: string;
    }[];
}
