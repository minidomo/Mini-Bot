class RepeatState {
    current: boolean;
    queue: boolean;

    constructor() {
        this.current = this.queue = false;
    }

    off() {
        this.current = this.queue = false;
    }

    on(state: string) {
        if (state === 'current') {
            this.current = !this.current;
            this.queue = false;
        } else {
            this.queue = !this.queue;
            this.current = false;
        }
    }

    isOn() {
        return this.current || this.queue;
    }
}

export = RepeatState;