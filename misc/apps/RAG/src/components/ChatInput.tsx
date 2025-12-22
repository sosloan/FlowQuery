import React, { Component, KeyboardEvent } from 'react';
import { Textarea, Button } from '@fluentui/react-components';
import { SendFilled } from '@fluentui/react-icons';
import './ChatInput.css';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    placeholder?: string;
}

interface ChatInputState {
    inputValue: string;
}

export class ChatInput extends Component<ChatInputProps, ChatInputState> {
    static defaultProps = {
        placeholder: 'Ask me anything...'
    };

    constructor(props: ChatInputProps) {
        super(props);
        this.state = {
            inputValue: ''
        };
    }

    handleSend = (): void => {
        const trimmedValue = this.state.inputValue.trim();
        if (trimmedValue && !this.props.isLoading) {
            this.props.onSendMessage(trimmedValue);
            this.setState({ inputValue: '' });
        }
    };

    handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    };

    handleChange = (
        _e: React.ChangeEvent<HTMLTextAreaElement>,
        data: { value: string }
    ): void => {
        this.setState({ inputValue: data.value });
    };

    render() {
        const { isLoading, placeholder } = this.props;
        const { inputValue } = this.state;

        return (
            <div className="chat-input-container">
                <Textarea
                    className="chat-input-textarea"
                    value={inputValue}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder={placeholder}
                    resize="none"
                    disabled={isLoading}
                />
                <Button
                    className="chat-input-send-button"
                    appearance="primary"
                    icon={<SendFilled />}
                    onClick={this.handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    title="Send message (Enter)"
                />
            </div>
        );
    }
}
