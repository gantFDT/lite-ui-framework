interface Config {
    fontSize?: number, //字体大小
    fontColor?: string,
    padding?: number,
    alpha?: number,
    rotate?: number
}

export function textBecomeImg(text: string, config?: Config) {

    text = text ? text : " "
    config = config ? config : {};
    const { fontSize = 14, fontColor = "#666", alpha = 0.5, rotate = 30, padding = 80 } = config;
    var canvas = document.createElement('canvas');
    const fwidth = fontSize * text.length;
    const space = fwidth + padding*2;
    canvas.height = space;
    canvas.width = space;
    var context: any = canvas.getContext('2d');
    const center = space / 2;
    context.translate(center, center);
    context.rotate(rotate * Math.PI / 180);
    context.globalAlpha = alpha;
    context.fillStyle = fontColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = fontSize + "px Arial";
    context.fillText(text, 0, 0);
    var dataUrl = canvas.toDataURL('image/png');//注意这里背景透明的话，需要使用png
    return dataUrl;
}