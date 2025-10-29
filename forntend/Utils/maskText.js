export function maskText(text, visiableStart=3, visiableEnd=3){
    const start= text.slice(0,visiableStart);
    const end=text.slice(-visiableEnd);
    const hidden= "*".repeat(text.length-(visiableStart+visiableEnd));
    return `${start}${hidden}${end}`
}