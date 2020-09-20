import { PubSub } from "../shared/PubSub";
import ENUM_TABLES from "../shared/enumTables";

export class FilterEnums extends PubSub {

    private enums: Map<string, number[]> = new Map();

    constructor() {
        super();
        for (const table of ENUM_TABLES) {
            this.enums.set(table, []);
        }
    }

    add(e: string, id: number): void {
        this.enums.get(e)?.push(id);
        this.publish();
    }

    remove(e: string, id: number): void {
        const table = this.enums.get(e);
        const i = table?.indexOf(id);
        if (i) {
            table?.splice(i, 1);
        }
        this.publish();
    }

    get(e: string): number[] | undefined {
        return this.enums.get(e);
    }

    get entries(): IterableIterator<[string, number[]]> {
        return this.enums.entries()
    }

}
