export function getScoreColor(score) {
    if (score > 80) return '#ef4444'; // crimson red
    if (score > 60) return '#f97316'; // orange
    if (score > 40) return '#f59e0b'; // amber
    if (score > 20) return '#84cc16'; // yellow-green
    return '#22c55e'; // fresh green
}
