export class Card {
    private line: string[];

    constructor(
        line: string[],
        private currentMove: number, 
        private repetition_number: number, 
        private easy_factor: number, 
        private interval: number,
        private newCard: boolean
    ) {
        this.line = [...line];
    }

    getCurrentMove(): number { return this.currentMove; }

    // getUpdatedCard(): number[] {

    // }


}
