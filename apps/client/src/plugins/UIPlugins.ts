import { Button } from "../components/Button.ts";
import { Input } from "../components/Input.ts";

export class UIPlugin extends Phaser.Plugins.ScenePlugin {
    boot() {
        Phaser.GameObjects.GameObjectFactory.register(
            'button',
            function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, normalTexture: string, activeTexture?: string) {
                return this.scene.add.existing(new Button(this.scene, x, y, normalTexture, activeTexture));
            }
        );
        Phaser.GameObjects.GameObjectFactory.register(
            'input',
            function(this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, placeholder?: string, style?: Phaser.Types.GameObjects.Text.TextStyle) {
                const dom = document.createElement("input");
                dom.type = "text";
                dom.autocomplete = "off";
                dom.style.opacity = "0";
                dom.style.position = "absolute";
                dom.style.pointerEvents = "none";
                this.dom(-10000, -10000, dom);
                
                return this.scene.add.existing(new Input(this.scene, x, y, dom, placeholder, style));
            }
        )
    }
}