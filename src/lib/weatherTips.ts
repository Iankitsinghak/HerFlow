
export type TemperatureBand = 'HOT' | 'WARM' | 'COOL';

export function getWeatherTip(tempBand: TemperatureBand, isOnPeriod: boolean): string {
    switch(tempBand) {
        case 'HOT':
            return isOnPeriod
                ? "It’s quite hot today — stay hydrated with plenty of water and keep an extra pad handy, as humidity can sometimes feel uncomfortable. 🩸💧"
                : "Hot days can feel extra tiring, especially during your luteal phase. Keep water nearby and listen to your body. 🌞";
        case 'WARM':
            return "The weather is pleasant. Light, breathable cotton clothes can help you feel comfortable all day long. 🌸";
        case 'COOL':
            return isOnPeriod
                ? "Cooler days can sometimes make cramps feel more intense. A warm drink like ginger tea or ajwain water might help you feel better. ☕"
                : "It's a bit cool out. A light shawl or sweater might be comfortable, especially in the evenings. ✨";
        default:
            return "Listen to your body today and do what feels right for you. 💖";
    }
}
