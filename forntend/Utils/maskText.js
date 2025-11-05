export function maskText(text, visiableStart=3, visiableEnd=3){
    const start= text.slice(0,visiableStart);
    const end=text.slice(-visiableEnd);
     const hiddenCount = text.length - (visiableStart + visiableEnd);
    const hidden = hiddenCount > 0 ? "*".repeat(hiddenCount) : "";
    return `${start}${hidden}${end}`
}