
/**
 * Merge two dictionaries
 * @param target Insert `source` properties/values into this
 * @param source Properties to update
 * @returns New dictionary (copy of `target`)
 */
export function deepMerge<T extends Record<string,any>>(target: T, source: T): T
{
    const output = {...target};

    for(const key in source)
    {
        if(source[key] === undefined)
            delete output[key];
        else if(source[key].constructor === Object)
            output[key] = deepMerge(output[key], source[key]);
        else
            output[key] = source[key];
    }

    return output;
}
