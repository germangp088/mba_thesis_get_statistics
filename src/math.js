const calculateArithmeticAverage = values => Math.ceil(values.reduce((a, b) => a + b, 0) / values.length);

const calculatePercentage = (value, percentage) => Math.ceil(value * percentage);

export { calculateArithmeticAverage, calculatePercentage };