import Token from "./token";

/**
 * Represents a node in a Trie data structure.
 * 
 * Each node can have children nodes (one per character) and may contain a token
 * if the path to this node represents a complete word.
 */
class Node {
    private _children: Map<string, Node> = new Map();
    private _token: Token | undefined = undefined;

    public map(char: string): Node {
        return this._children.get(char) || this._children.set(char, new Node()).get(char)!;
    }

    public retrieve(char: string): Node | undefined {
        return this._children.get(char);
    }

    public set token(token: Token) {
        this._token = token;
    }

    public get token(): Token | undefined {
        return this._token;
    }

    public is_end_of_word(): boolean {
        return this._token !== undefined;
    }

    public no_children(): boolean {
        return this._children.size === 0;
    }
}

/**
 * Trie (prefix tree) data structure for efficient keyword and operator lookup.
 * 
 * Used during tokenization to quickly match input strings against known keywords
 * and operators. Supports case-insensitive matching and tracks the longest match found.
 * 
 * @example
 * ```typescript
 * const trie = new Trie();
 * trie.insert(Token.WITH);
 * const found = trie.find("WITH");
 * ```
 */
class Trie {
    private _root: Node = new Node();
    private _max_length: number = 0;
    private _last_found: string | null = null;

    /**
     * Inserts a token into the trie.
     * 
     * @param token - The token to insert
     * @throws {Error} If the token value is null or empty
     */
    public insert(token: Token): void {
        if(token.value === null || token.value.length === 0) {
            throw new Error("Token value cannot be null or empty");
        }
        let currentNode = this._root;
        for (const char of token.value) {
            currentNode = currentNode.map(char.toLowerCase());
        }
        if (token.value.length > this._max_length) {
            this._max_length = token.value.length;
        }
        currentNode.token = token;
    }

    /**
     * Finds a token by searching for the longest matching prefix in the trie.
     * 
     * @param value - The string value to search for
     * @returns The token if found, undefined otherwise
     */
    public find(value: string): Token | undefined {
        if(value.length === 0) {
            return undefined;
        }
        let index = 0;
        let current: Node | undefined = undefined;
        let found: Token | undefined = undefined;
        this._last_found = null;
        while((current = (current || this._root).retrieve(value[index].toLowerCase())) !== undefined) {
            if(current.is_end_of_word()) {
                found = current.token;
                this._last_found = value.substring(0, index + 1);
            }
            index++;
            if(index === value.length || index > this._max_length) {
                break;
            }
        }
        if(current?.is_end_of_word()) {
            found = current.token;
            this._last_found = value.substring(0, index);
        }
        return found;
    }

    /**
     * Gets the last matched string from the most recent find operation.
     * 
     * @returns The last found string, or null if no match was found
     */
    public get last_found(): string | null {
        return this._last_found;
    }
}

export default Trie;