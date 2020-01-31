export default class Utils {
  static roll = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

  static deepCopyFunction = (inObject: any) => {
    let outObject: any, value: any, key: any
  
    if(typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
  
    for (key in inObject) {
      value = inObject[key]
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = (typeof value === "object" && value !== null) ? Utils.deepCopyFunction(value) : value
    }
    
    return outObject
  }
}