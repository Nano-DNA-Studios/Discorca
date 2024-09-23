class Deserializer {
    static deserialize<T>(cls: new () => T, data: any): T {
        const instance = new cls(); // Create a new instance of the class
        if (data) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key) && Object.prototype.hasOwnProperty.call(instance, key)) {
                    if (Deserializer.isPlainObject(data[key])) {
                        // Deep copy for objects
                        (instance as any)[key] = JSON.parse(JSON.stringify(data[key]));
                    } else {
                        // Direct assignment for primitives and other types
                        (instance as any)[key] = data[key];
                    }
                }
            }
        }
        return instance;
    }

    private static isPlainObject(obj: any): boolean {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
