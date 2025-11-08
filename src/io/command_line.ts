import Runner from '../compute/runner';
import * as readline from 'readline';

/**
 * Interactive command-line interface for FlowQuery.
 * 
 * Provides a REPL (Read-Eval-Print Loop) for executing FlowQuery statements
 * and displaying results.
 * 
 * @example
 * ```typescript
 * const cli = new CommandLine();
 * cli.loop(); // Starts interactive mode
 * ```
 */
class CommandLine {
    private rl: readline.Interface;

    /**
     * Creates a new CommandLine interface.
     */
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Starts the interactive command loop.
     * 
     * Prompts the user for FlowQuery statements, executes them, and displays results.
     * Type "exit" to quit the loop.
     */
    public loop() {
        console.log('Welcome to FlowQuery! Type "exit" to quit.');
        this.rl.setPrompt('> ');
        this.rl.prompt();

        this.rl.on('line', (input: string) => {
            if (input === 'exit') {
                this.rl.close();
                return;
            }
            if(input.trim() === '') {
                this.rl.prompt();
                return;
            }
            try {
                const runner = new Runner(input);
                const promise = runner.run();
                promise.then(
                    () => {
                        console.log(runner.results);
                    }
                );
                promise.catch(
                    (e) => console.error(e)
                );
                promise.finally(
                    () => this.rl.prompt()
                );
            } catch (e) {
                console.error(e);
                this.rl.prompt();
            }
        }).on('close', () => {
            console.log('Exiting FlowQuery.');
            process.exit(0);
        });
    }
}

export default CommandLine;