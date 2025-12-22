import React, { Component } from 'react';
import { Body1, Spinner, Button, Tooltip } from '@fluentui/react-components';
import { PersonFilled, BotFilled, Play16Regular } from '@fluentui/react-icons';
import { FlowQueryRunner } from './FlowQueryRunner';
import { AdaptiveCardRenderer, isAdaptiveCard } from './AdaptiveCardRenderer';
import './ChatMessage.css';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    /**
     * Optional Adaptive Card payload to render instead of or alongside text content
     */
    adaptiveCard?: Record<string, unknown>;
}

interface ChatMessageProps {
    message: Message;
}

/**
 * Extract FlowQuery code blocks from markdown content.
 * Looks for ```flowquery ... ``` code blocks.
 */
function extractFlowQueryBlocks(content: string): string[] {
    const regex = /```flowquery\n([\s\S]*?)```/gi;
    const matches: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
        if (match[1]?.trim()) {
            matches.push(match[1].trim());
        }
    }
    
    return matches;
}

/**
 * Extract JSON blocks from content and check if any are Adaptive Cards
 */
function extractAdaptiveCards(content: string): Record<string, unknown>[] {
    const cards: Record<string, unknown>[] = [];
    
    // Look for ```json blocks that might contain Adaptive Cards
    const jsonRegex = /```json\n([\s\S]*?)```/gi;
    let match;
    
    while ((match = jsonRegex.exec(content)) !== null) {
        try {
            const parsed = JSON.parse(match[1]);
            if (isAdaptiveCard(parsed)) {
                cards.push(parsed);
            }
        } catch {
            // Not valid JSON, skip
        }
    }
    
    return cards;
}

interface MessageContentProps {
    content: string;
    isStreaming?: boolean;
    adaptiveCard?: Record<string, unknown>;
}

interface MessageContentState {
    runnerQuery: string | null;
}

/**
 * Renders message content with FlowQuery code blocks enhanced with run buttons,
 * and optionally renders Adaptive Cards.
 */
class MessageContent extends Component<MessageContentProps, MessageContentState> {
    constructor(props: MessageContentProps) {
        super(props);
        this.state = {
            runnerQuery: null
        };
    }

    private setRunnerQuery = (query: string | null) => {
        this.setState({ runnerQuery: query });
    };

    private getFlowQueryBlocks(): string[] {
        return extractFlowQueryBlocks(this.props.content);
    }

    private getEmbeddedAdaptiveCards(): Record<string, unknown>[] {
        return extractAdaptiveCards(this.props.content);
    }

    private getAllAdaptiveCards(): Record<string, unknown>[] {
        const cards: Record<string, unknown>[] = [];
        if (this.props.adaptiveCard) {
            cards.push(this.props.adaptiveCard);
        }
        cards.push(...this.getEmbeddedAdaptiveCards());
        return cards;
    }

    render() {
        const { content, isStreaming } = this.props;
        const { runnerQuery } = this.state;
        
        const flowQueryBlocks = this.getFlowQueryBlocks();
        const allAdaptiveCards = this.getAllAdaptiveCards();

        // If there are no FlowQuery blocks, render plain content (possibly with Adaptive Cards)
        if (flowQueryBlocks.length === 0) {
            return (
                <>
                    {content}
                    {allAdaptiveCards.map((card, index) => (
                        <AdaptiveCardRenderer key={`card-${index}`} card={card} />
                    ))}
                    {isStreaming && <Spinner size="tiny" className="streaming-indicator" />}
                </>
            );
        }

        // Split content by FlowQuery code blocks and render with buttons
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        const regex = /```flowquery\n([\s\S]*?)```/gi;
        let match;
        let partIndex = 0;

        while ((match = regex.exec(content)) !== null) {
            // Add text before the code block
            if (match.index > lastIndex) {
                parts.push(
                    <span key={`text-${partIndex}`}>
                        {content.slice(lastIndex, match.index)}
                    </span>
                );
            }

            const query = match[1]?.trim() || '';

            // Add the code block with a run button and </> link
            parts.push(
                <div key={`code-${partIndex}`} className="flowquery-code-block">
                    <div className="flowquery-code-header">
                        <span className="flowquery-code-label">flowquery</span>
                        <div className="flowquery-code-actions">
                            <Tooltip content="Run in FlowQuery Runner" relationship="label">
                                <Button
                                    appearance="subtle"
                                    size="small"
                                    icon={<Play16Regular />}
                                    className="flowquery-run-button"
                                    onClick={() => this.setRunnerQuery(query)}
                                >
                                    Run
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <pre className="flowquery-code-content">
                        <code>{query}</code>
                    </pre>
                </div>
            );

            lastIndex = match.index + match[0].length;
            partIndex++;
        }

        // Add remaining text after the last code block
        if (lastIndex < content.length) {
            parts.push(
                <span key={`text-${partIndex}`}>
                    {content.slice(lastIndex)}
                </span>
            );
        }

        return (
            <>
                {parts}
                {allAdaptiveCards.map((card, index) => (
                    <AdaptiveCardRenderer key={`card-${index}`} card={card} />
                ))}
                {isStreaming && <Spinner size="tiny" className="streaming-indicator" />}
                {runnerQuery !== null && (
                    <FlowQueryRunner
                        initialQuery={runnerQuery}
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) this.setRunnerQuery(null);
                        }}
                    />
                )}
            </>
        );
    }
}

export class ChatMessage extends Component<ChatMessageProps> {
    render() {
        const { message } = this.props;
        const isUser = message.role === 'user';

        return (
            <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
                <div className="chat-message-avatar">
                    {isUser ? <PersonFilled /> : <BotFilled />}
                </div>
                <div className="chat-message-content">
                    <div className="chat-message-header">
                        <Body1 className="chat-message-role">
                            {isUser ? 'You' : 'Assistant'}
                        </Body1>
                        <span className="chat-message-time">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div className="chat-message-text">
                        <MessageContent 
                            content={message.content} 
                            isStreaming={message.isStreaming}
                            adaptiveCard={message.adaptiveCard}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
