import {
    Plugin,
    showMessage,
    // Dialog,
    getFrontend,
    getBackend,
    IModel,
    // Protyle,
    // ICard,
    // ICardData
} from "siyuan";
import "@/style.css";

import Upload from "@/upload.svelte";
// import SettingExample from "@/setting-example.svelte";

// import { SettingUtils } from "./libs/setting-utils";
import { svelteDialog } from "./libs/dialog";

const STORAGE_NAME = "menu-config";

export default class KoreaderNoteToSiYuan extends Plugin {

    customTab: () => IModel;
    private isMobile: boolean;
    // private blockIconEventBindThis = this.blockIconEvent.bind(this);
    // private settingUtils: SettingUtils;

    async onload() {
        this.data[STORAGE_NAME] = { readonlyText: "Readonly" };

        console.log("loading Koreader Note To SiYuan", this.i18n);

        const frontEnd = getFrontend();
        this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";
        // 图标的制作参见帮助文档
        this.addIcons(`<symbol id="iconBook" viewBox="0 0 32 32">
  <path d="m28.69,0H7.39c-1.83,0-3.31,1.49-3.31,3.33v.75H1.99c-1.1,0-1.99.9-1.99,2v2c0,1.1.89,2,1.99,2h2.09s0,1.94,0,1.94H1.99C.89,12.03,0,12.93,0,14.03v2C0,17.14.89,18.03,1.99,18.03h2.09s0,2,0,2H1.99C.89,20.03,0,20.93,0,22.03v2C0,25.14.89,26.04,1.99,26.04h2.09v2.63c0,1.84,1.48,3.33,3.31,3.33h21.3c1.83,0,3.31-1.49,3.31-3.33V3.33c0-1.84-1.48-3.33-3.31-3.33ZM5.89,23.41c0,.41-.47.74-1.05.74h-1.98c-.58,0-1.05-.33-1.05-.74v-.74c0-.41.47-.74,1.05-.74h1.98c.58,0,1.05.33,1.05.74v.74Zm0-8c0,.41-.47.74-1.05.74h-1.98c-.58,0-1.05-.33-1.05-.74v-.74c0-.41.47-.74,1.05-.74h1.21s.77,0,.77,0c.58,0,1.05.33,1.05.74v.74Zm0-7.95c0,.41-.47.74-1.05.74h-1.98c-.58,0-1.05-.33-1.05-.74v-.74c0-.41.47-.74,1.05-.74h1.21s.77,0,.77,0c.58,0,1.05.33,1.05.74v.74Zm24.05,22.52H8.07V1.98h21.88v28Z"/>
  <path d="m25.32,5.98h-12.62c-.37,0-.66.3-.66.67v.71c0,.37.3.67.66.67h12.62c.37,0,.66-.3.66-.67v-.71c0-.37-.3-.67-.66-.67Z"/>
  <path d="m25.32,12.03h-12.62c-.37,0-.66.3-.66.67v.71c0,.37.3.67.66.67h12.62c.37,0,.66-.3.66-.67v-.71c0-.37-.3-.67-.66-.67Z"/>
  <path d="m25.32,17.99h-12.62c-.37,0-.66.3-.66.67v.71c0,.37.3.67.66.67h12.62c.37,0,.66-.3.66-.67v-.71c0-.37-.3-.67-.66-.67Z"/>
  <path d="m25.32,23.99h-12.62c-.37,0-.66.3-.66.67v.71c0,.37.3.67.66.67h12.62c.37,0,.66-.3.66-.67v-.71c0-.37-.3-.67-.66-.67Z"/>
</symbol>`);

        const topBarElement = this.addTopBar({
            icon: "iconBook",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                if (this.isMobile) {
                    // this.addMenu();
                } else {
                    let rect = topBarElement.getBoundingClientRect();
                    // 如果被隐藏，则使用更多按钮
                    if (rect.width === 0) {
                        rect = document.querySelector("#barMore").getBoundingClientRect();
                    }
                    if (rect.width === 0) {
                        rect = document.querySelector("#barPlugins").getBoundingClientRect();
                    }
                    // this.addMenu(rect);
                    this.showDialog();
                }
            }
        });

        // this.settingUtils.addItem({
        //     key: "Check",
        //     value: true,
        //     type: "checkbox",
        //     title: "以新文档方式导入",
        //     description: "新建文档并导入的标注笔记",
        //     action: {
        //         callback: () => {
        //             // Return data and save it in real time
        //             let value = !this.settingUtils.get("Check");
        //             this.settingUtils.set("Check", value);
        //             console.log(value);
        //         }
        //     }
        // });
 
        // try {
        //     this.settingUtils.load();
        // } catch (error) {
        //     console.error("Error loading settings storage, probably empty config json:", error);
        // }


        // this.protyleSlash = [{
        //     filter: ["insert emoji 😊", "插入表情 😊", "crbqwx"],
        //     html: `<div class="b3-list-item__first"><span class="b3-list-item__text">${this.i18n.insertEmoji}</span><span class="b3-list-item__meta">😊</span></div>`,
        //     id: "insertEmoji",
        //     callback(protyle: Protyle) {
        //         protyle.insert("😊");
        //     }
        // }];

        // this.protyleOptions = {
        //     toolbar: ["block-ref",
        //         "a",
        //         "|",
        //         "text",
        //         "strong",
        //         "em",
        //         "u",
        //         "s",
        //         "mark",
        //         "sup",
        //         "sub",
        //         "clear",
        //         "|",
        //         "code",
        //         "kbd",
        //         "tag",
        //         "inline-math",
        //         "inline-memo",
        //         "|",
        //         {
        //             name: "insert-smail-emoji",
        //             icon: "iconEmoji",
        //             hotkey: "⇧⌘I",
        //             tipPosition: "n",
        //             tip: this.i18n.insertEmoji,
        //             click(protyle: Protyle) {
        //                 protyle.insert("😊");
        //             }
        //         }],
        // };

    }

    onLayoutReady() {
        // this.loadData(STORAGE_NAME);
        // this.settingUtils.load();
        console.log(`frontend: ${getFrontend()}; backend: ${getBackend()}`);

        console.log(
            "Official settings value calling example:\n"
            // +
            // this.settingUtils.get("InputArea") + "\n" +
            // this.settingUtils.get("Slider") + "\n" +
            // this.settingUtils.get("Select") + "\n"
        );

        let tabDiv = document.createElement("div");
        new Upload({
            target: tabDiv,
            props: {
                app: this.app,
            }
        });

    }

    async onunload() {
        showMessage("Goodbye SiYuan Plugin");
        console.log("onunload");
    }

    uninstall() {
        console.log("uninstall");
    }

    // async updateCards(options: ICardData) {
    //     options.cards.sort((a: ICard, b: ICard) => {
    //         if (a.blockID < b.blockID) {
    //             return -1;
    //         }
    //         if (a.blockID > b.blockID) {
    //             return 1;
    //         }
    //         return 0;
    //     });
    //     return options;
    // }

    /**
     * A custom setting pannel provided by svelte
     */
    // openDIYSetting(): void {
    //     let dialog = new Dialog({
    //         title: "SettingPannel",
    //         content: `<div id="SettingPanel" style="height: 100%;"></div>`,
    //         width: "800px",
    //         destroyCallback: (options) => {
    //             console.log("destroyCallback", options);
    //             //You'd better destroy the component when the dialog is closed
    //             pannel.$destroy();
    //         }
    //     });
    //     let pannel = new SettingExample({
    //         target: dialog.element.querySelector("#SettingPanel"),
    //     });
    // }

    // private eventBusPaste(event: any) {
    //     // 如果需异步处理请调用 preventDefault， 否则会进行默认处理
    //     event.preventDefault();
    //     // 如果使用了 preventDefault，必须调用 resolve，否则程序会卡死
    //     event.detail.resolve({
    //         textPlain: event.detail.textPlain.trim(),
    //     });
    // }

    // private eventBusLog({ detail }: any) {
    //     console.log(detail);
    // }

    private showDialog() {
        svelteDialog({
            title: this.i18n.title,
            width: this.isMobile ? "92vw" : "720px",
            constructor: (container: HTMLElement) => {
                return new Upload({
                    target: container,
                    props: {
                        i18n: this.i18n,
                    }
                });
            }
        });
    }

}
