"use strict";
class Deserializer {
    static deserialize(cls, data) {
        const instance = new cls(); // Create a new instance of the class
        if (data) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key) && Object.prototype.hasOwnProperty.call(instance, key)) {
                    if (Deserializer.isPlainObject(data[key])) {
                        // Deep copy for objects
                        instance[key] = JSON.parse(JSON.stringify(data[key]));
                    }
                    else {
                        // Direct assignment for primitives and other types
                        instance[key] = data[key];
                    }
                }
            }
        }
        return instance;
    }
    static isPlainObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}
