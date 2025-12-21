import Token from "./token";
import Trie from "./trie";

/**
 * Maps string values to tokens using a Trie for efficient lookup.
 * 
 * Takes an enum of keywords, operators, or symbols and builds a trie
 * for fast token matching during tokenization.
 * 
 * @example
 * ```typescript
 * const mapper = new TokenMapper(Keyword);
 * const token = mapper.map("WITH");
 * ```
 */
class TokenMapper {
    private _trie: Trie = new Trie();
    
    /**
     * Creates a TokenMapper from an enum of token values.
     * 
     * @param _enum - An enum object containing token values
     */
    constructor(private _enum: { [key: string]: any }) {
        for(const [key, value] of Object.entries(_enum)) {
            const token: Token | undefined = Token.method(key);
            if(token !== undefined && token.value !== null) {
                this._trie.insert(token);
            }
        }
    }
    
    /**
     * Maps a string value to its corresponding token.
     * 
     * @param value - The string value to map
     * @returns The matched token, or undefined if no match found
     */
    public map(value: string): Token | undefined {
        return this._trie.find(value);
    }
    
    /**
     * Gets the last matched string from the most recent map operation.
     * 
     * @returns The last found string, or null if no match
     */
    public get last_found(): string | null {
        return this._trie.last_found;
    }
}

export default TokenMapper;