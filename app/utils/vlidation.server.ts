

export class ValidationFormDataError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.name = "ValidationFormDataError";
        this.status = 400;
    }
}
  
function createValidationError(message: string, status: number = 400): ValidationFormDataError {
    const error = new ValidationFormDataError(message);
    error.name = "ValidationFormDataError";
    error.status = status;
    return error;
}

export function validateFormData<T extends Record<string, unknown>>(
    formData: FormData,
    schema: { [K in keyof T]: { required: boolean; type: 'string' | 'number'; } }
): T {
    const data = {} as T;

    for (const [key, { required, type }] of Object.entries(schema)) {
        const value = formData.get(key);

        if (required && value === null) {
            throw createValidationError(`${key} is required.`);
        }

        if (value !== null) {
            if (type === 'number') {
                const numberValue = Number(value);
                if (isNaN(numberValue)) {
                    throw createValidationError(`${key} must be a valid number.`);
                }
                data[key as keyof T] = numberValue as T[keyof T];
            } else if (type === 'string') {
                data[key as keyof T] = value as T[keyof T];
            } else {
                throw createValidationError(`Invalid type '${type}' for field '${key}'.`);
            }
        } else {
            if (type === 'number') {
                data[key as keyof T] = NaN as T[keyof T];
            } else {
                data[key as keyof T] = '' as T[keyof T];
            }
        }
    }

    return data;
}
