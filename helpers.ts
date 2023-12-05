export const sum = (values: Array<number>): number => {
    return values.reduce((sum, value) => sum + value, 0)  
}
