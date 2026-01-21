export class Input extends Phaser.GameObjects.Text {
    dom: HTMLInputElement;
    value = "";
    placeholder: string;
    placeholderColor = "#696969";
    textColor: string;
    validator?: (str: string) => string;
    typingSound?: string;
    typingVolume = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, dom: HTMLInputElement, placeholder?: string, style?: Phaser.Types.GameObjects.Text.TextStyle) {
        super(scene, x, y, placeholder ?? "", style ?? {});

        this.dom = dom;
        this.placeholder = placeholder ?? "";
        this.textColor = this.style.color.toString();
        this.setRealColor(this.placeholderColor);

        this.dom.addEventListener("input", () => {
            let str = this.validator ? this.validator(this.dom.value) : this.dom.value;
            this.dom.value = str;
            if (this.value !== str) {
                this.value = str;
                this.setText(this.value || this.placeholder);
                this.setRealColor(this.value !== "" ? this.textColor : this.placeholderColor);
                if (this.typingSound)
                    this.scene.sound.play(this.typingSound, { volume: this.typingVolume });
                this.emit("input");
            }
        })

        this.setInteractive({ useHandCursor: true });
        this.on("pointerdown", () => { this.focusInput(); });
        this.scene.input.on("pointerdown", (_: any, objs: any[]) => {
            if (!objs.includes(this))
                this.blurInput();
        });
    }

    setPlaceholderColor(color: string) {
        this.placeholderColor = color;
        return this;
    }

    getPlaceholderColor() {
        return this.placeholderColor;
    }

    getValue() {
        return this.value;
    }

    setValidator(fn: (str: string) => string) {
        this.validator = fn;
        return this;
    }

    setTypingSound(sound: string, volume?: number) {
        this.typingSound = sound;
        this.typingVolume = volume ?? 1;
        return this;
    }

    focusInput() {
        this.dom.style.pointerEvents = "auto";
        this.dom.focus();
    }

    blurInput() {
        this.dom.blur();
        this.dom.style.pointerEvents = "none";
    }

    setColor(color: string | CanvasGradient | CanvasPattern) {
        super.setColor(color);
        this.textColor = this.style.color.toString();
        if (this.value === "")
            this.setRealColor(this.placeholderColor);
        return this;
    }

    private setRealColor(color: string) {
        super.setColor(color);
    }
}