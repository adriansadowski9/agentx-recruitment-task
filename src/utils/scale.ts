export const scale = (
    inputY: number, 
    yRange: Array<number>, 
    xRange: Array<number>
  ): number => {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
  
    const percent = (inputY - yMin) / (yMax - yMin);
    const outputX = percent * (xMax - xMin) + xMin;
  
    if (outputX < xMin) {
      return xMin;
    } else if (outputX > xMax) {
      return xMax;
    }
  
    return outputX;
};