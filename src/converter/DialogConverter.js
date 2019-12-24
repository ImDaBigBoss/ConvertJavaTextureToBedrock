import {AbstractConverter} from "./AbstractConverter";

/**
 * Class DialogConverter
 */
class DialogConverter extends AbstractConverter {
    /**
     * @inheritDoc
     */
    async convert() {
        const [from, dialogs] = this.data;

        if (!await this.output.exists(from)) {
            return [];
        }

        const image_from = await this.readImage(from);

        const factor = (image_from.getWidth() / 256);

        for (const [x, y, width, height, _base_nineslice_size, tos] of dialogs) {
            const base_nineslice_size = _base_nineslice_size.map(size => size * factor);

            const image = image_from.clone().crop((x * factor), (y * factor), (width * factor), (height * factor));

            for (const [to, to_nineslice_size] of tos) {
                const to_image = await this.createImage((to_nineslice_size[0] + to_nineslice_size[2] + (3 * factor)), (to_nineslice_size[1] + to_nineslice_size[3] + (3 * factor)));

                to_image.composite(await image.clone().crop(0, 0, base_nineslice_size[0], base_nineslice_size[1]).borderImage(factor, factor, factor, factor, to_nineslice_size[0], to_nineslice_size[1]), 0, 0);
                to_image.composite(await image.clone().crop(base_nineslice_size[0], 0, (image.getWidth() - base_nineslice_size[0] - base_nineslice_size[2]), base_nineslice_size[1]).borderImage(factor, factor, factor, factor, (to_image.getWidth() - to_nineslice_size[0] - to_nineslice_size[2]), to_nineslice_size[1]), to_nineslice_size[0], 0);
                to_image.composite(await image.clone().crop((image.getWidth() - base_nineslice_size[2]), 0, base_nineslice_size[2], base_nineslice_size[1]).borderImage(factor, factor, factor, factor, to_nineslice_size[2], to_nineslice_size[1]), (to_image.getWidth() - to_nineslice_size[2]), 0);

                to_image.composite(await image.clone().crop(0, base_nineslice_size[1], base_nineslice_size[0], (image.getHeight() - base_nineslice_size[1] - base_nineslice_size[3])).borderImage(factor, factor, factor, factor, to_nineslice_size[0], (to_image.getHeight() - to_nineslice_size[1] - to_nineslice_size[3])), 0, to_nineslice_size[1]);
                to_image.composite(await image.clone().crop((image.getWidth() - base_nineslice_size[2]), base_nineslice_size[1], base_nineslice_size[2], (image.getHeight() - base_nineslice_size[1] - base_nineslice_size[3])).borderImage(factor, factor, factor, factor, to_nineslice_size[2], (to_image.getHeight() - to_nineslice_size[1] - to_nineslice_size[3])), (to_image.getWidth() - to_nineslice_size[2]), to_nineslice_size[1]);

                to_image.composite(await image.clone().crop(0, (image.getHeight() - base_nineslice_size[3]), base_nineslice_size[0], base_nineslice_size[2]).borderImage(factor, factor, factor, factor, to_nineslice_size[0], to_nineslice_size[3]), 0, (to_image.getHeight() - to_nineslice_size[3]));
                to_image.composite(await image.clone().crop(base_nineslice_size[0], (image.getHeight() - base_nineslice_size[3]), (image.getWidth() - base_nineslice_size[0] - base_nineslice_size[2]), base_nineslice_size[2]).borderImage(factor, factor, factor, factor, (to_image.getWidth() - to_nineslice_size[0] - to_nineslice_size[2]), to_nineslice_size[3]), to_nineslice_size[0], (to_image.getHeight() - to_nineslice_size[3]));
                to_image.composite(await image.clone().crop((image.getWidth() - base_nineslice_size[2]), (image.getHeight() - base_nineslice_size[3]), base_nineslice_size[2], base_nineslice_size[2]).borderImage(factor, factor, factor, factor, to_nineslice_size[2], to_nineslice_size[3]), (to_image.getWidth() - to_nineslice_size[2]), (to_image.getHeight() - to_nineslice_size[3]));

                const metadata = {
                    nineslice_size: to_nineslice_size,
                    base_size: [to_image.getWidth(), to_image.getHeight()]
                };

                const to_png = to + ".png";
                this.log.log(`Convert dialog ${to_png}`);
                await this.writeImage(to_png, to_image);

                await this.writeJson(to + ".json", metadata);
            }
        }

        return [];
    }

    /**
     * @inheritDoc
     */
    static get DEFAULT_CONVERTER_DATA() {
        return [
            ["textures/gui/container/generic_54.png", [
                [0, 0, 176, 222, [7, 17, 7, 7], [
                    ["textures/ui/achievements_dialog", [6, 20, 6, 6]],
                    ["textures/ui/dialog_background_hollow_1", [8, 23, 8, 76]],
                    ["textures/ui/dialog_background_hollow_2", [8, 23, 8, 42]],
                    ["textures/ui/dialog_background_hollow_3", [8, 23, 8, 8]],
                    ["textures/ui/dialog_background_hollow_4", [8, 8, 8, 8]],
                    ["textures/ui/dialog_background_hollow_5", [8, 17, 8, 42]],
                    ["textures/ui/dialog_background_hollow_6", [8, 23, 8, 104]],
                    ["textures/ui/dialog_background_hollow_7", [8, 66, 8, 8]],
                    ["textures/ui/dialog_background_hollow_8", [8, 8, 33, 33]],
                    ["textures/ui/dialog_background_opaque", [4, 4, 4, 4]],
                    ["textures/ui/dialog_background_opaque_overlap_bottom", [4, 4, 4, 4]],
                    ["textures/ui/thin_dialog", [6, 6, 6, 6]]
                ]]
            ]]
        ];
    }
}

export {DialogConverter};
