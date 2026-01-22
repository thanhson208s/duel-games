export class Button extends Phaser.GameObjects.Image {
  normalTexture: string;
  activeTexture: string;
  isPressed = false;
  isFocused = false;
  callback?: Function;

  constructor(scene: Phaser.Scene, x: number, y: number, normalTexture: string, activeTexture?: string) {
    super(scene, x, y, normalTexture);

    this.normalTexture = normalTexture;
    this.activeTexture = activeTexture || normalTexture;

    this.setInteractive({ useHandCursor: true });
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
      this.isPressed = true;
      this.isFocused = true;
      this.setTexture(this.activeTexture);
    });
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => {
      if (this.isPressed && this.isFocused) {
        this.isFocused = false;
        this.setTexture(this.normalTexture);
      }
    });
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => {
      if (this.isPressed && !this.isFocused) {
        this.isFocused = true;
        this.setTexture(this.activeTexture);
      }
    });
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
      if (this.isPressed && this.isFocused) {
        this.isPressed = false;
        this.isFocused = false;
        this.setTexture(this.normalTexture);
        if (this.callback)
          this.callback();
      }
    });
  }

  setTextures(normalTexture: string, activeTexture?: string) {
    this.normalTexture = normalTexture;
    this.activeTexture = activeTexture || normalTexture;
    this.setTexture((this.isPressed && this.isFocused) ? this.activeTexture : this.normalTexture);
  }

  setCallback(callback: Function) {
    this.callback = callback;
    return this;
  }
}