declare module 'phaser' {
    namespace GameObjects {
        interface GameObjectFactory {
            button(
                x: number,
                y: number,
                normalTexture: string,
                activeTexture?: string
            ): Button
            input(
                x: number,
                y: number,
                placeholder?: string,
                style?: Phaser.Types.GameObjects.Text.TextStyle
            ): Input
        }
    }
}