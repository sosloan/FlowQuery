/**
 * Utility class for object-related operations.
 */
class ObjectUtils {
    /**
     * Checks if an object is an instance of any of the provided classes.
     * 
     * @param obj - The object to check
     * @param classes - Array of class constructors to test against
     * @returns True if the object is an instance of any class, false otherwise
     */
    static isInstanceOfAny(obj: any, classes: any[]): boolean {
        return classes.some(cls => obj instanceof cls);
    }
}

export default ObjectUtils;