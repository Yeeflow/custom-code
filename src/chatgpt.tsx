/**
 * Start dialog with ChatGPT (gpt 3.5 turbo) with preset prompts
 */


import * as React from "react";
import { MODULE_COMMON, MODULE_REQUEST } from "./constants";

// const FIELD_OPTION = "selectedOption";
const HISTORY_LIMIT = 10;
const MODEL_NAME = "gpt-3.5-turbo";


const PROMPT_DICT = {
    "Free talk": "",
    "English": "I want you to act as an English translator, spelling corrector and improver. I will speak to you in any language and you will detect the language, translate it in the corrected and improved version of my text, in English. I want you to replace my simplified A0-level words and sentences with more beautiful and elegant, upper level English words and sentences. Keep the meaning same, but make them more literary. I want you to only reply the correction, the improvements and nothing else, do not write explanations.",
    "React": "I want you to act as a software developer. I will provide some specific information about a web app requirements, and it will be your job to come up with an architecture and code for developing secure app with React.",
    "Regex": "I want you to act as a regex generator. Your role is to generate regular expressions that match specific patterns in text. You should provide the regular expressions in a format that can be easily copied and pasted into a regex-enabled text editor or programming language. Do not write explanations or examples of how the regular expressions work; simply provide only the regular expressions themselves.",
    "Python": "I want you to act as a software developer. I will provide some specific information about the requirements, and it will be your job to come up with code and explanation with Python.",
}

interface ChatGPTProps {
    context: CodeInContext;
    apiKey: string;
}

interface ChatGPTStates {
    response?: string;
    prompt?: string;
    loading?: boolean;
}

const history = {};

function fetch_history(prompt) {
    return history[prompt] || [];
};

class ChatGPT extends React.Component<ChatGPTProps, ChatGPTStates> {

    loading;
    user_message;
    constructor(props, context) {
        super(props, context);
        this.state = { prompt: Object.keys(PROMPT_DICT)[0], loading: false }
        console.log("ChatGPT loading...");
    }

    setLoading(v) {
        this.loading = v;
        this.setState({ loading: v });
    }

    chat() {
        if (this.loading)
            return;

        this.setLoading(true);

        const { context, apiKey } = this.props;
        const request = context.modules[MODULE_REQUEST];
        const common = context.modules[MODULE_COMMON]
        const { AkUtil } = common;
        const { prompt } = this.state;
        let messages = fetch_history(prompt).slice(-HISTORY_LIMIT);

        let system_messages = [];

        const p = PROMPT_DICT[prompt];
        if (p) {
            system_messages.push({
                "role": "system",
                "content": p
            });
        }

        for (let message of messages) {
            system_messages.push({
                "role": "user",
                "content": message[0]
            }, {
                "role": "assistant",
                "content": message[1]
            });
        }

        let messages_to_api = system_messages.concat([{
            "role": "user",
            "content": this.user_message
        }]);

        const addr = 'https://api.openai.com/v1/chat/completions';
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        };
        const data = {
            model: MODEL_NAME,
            messages: messages_to_api
        };


        request
            .post(addr)
            .set(headers)
            .send(data)
            .then(res => {
                let response_text;
                console.log(res.body && res.body.choices);
                if (res.body) {
                    let response = res.body;
                    response_text = AkUtil.get(response, "choices.0.message.content");

                    if (response_text) {
                        response_text = response_text.trim();

                        history[prompt] = messages.concat([
                            [this.user_message, response_text]
                        ]);
                    } else {
                        // If the model returns empty response
                        response_text = "Sorry, I didn't understand. Could you please rephrase?";
                    }
                } else {
                    response_text = "Server not responding, try again later.";
                }
                this.setLoading(false);
                this.setState({ response: response_text });
            })
            .catch(err => {
                console.error(err); // Handle error here
                this.setLoading(false);
            });
    }

    

    render() {
        const { context, apiKey } = this.props;

        if (!apiKey) {
            return <div style={STYLE_DESC}>Please configure API key in param.  You can obtain secret key from <a href="https://platform.openai.com/account/api-keys">OpenAI</a></div>
        }

        const common = context.modules[MODULE_COMMON]
        const { AkUtil, AkRadioGroup, AkRadio, AkTextArea, AkButton, AkSpin, AkIcon, AkMessage } = common;
        let keys = Object.keys(PROMPT_DICT);
        const { response, prompt, loading } = this.state;

        const onCopy = ()=> {
            AkUtil.copyToClipboard(response).then(rs => {
                if (rs) {
                    AkMessage.success("Response copied to clipboard.");
                }
            }); 
        }

        return <div>
            <div style={STYLE_DESC}>Start dialog with ChatGPT with preset prompts, and only 10 rounds of dialogues are saved currently.</div>
            <AkSpin spinning={loading}>
                <div><AkRadioGroup value={prompt} onChange={e => this.setState({ prompt: e.target.value })}>
                    {keys.map(k => <AkRadio key={k}
                        value={k}>{k}</AkRadio>)}
                </AkRadioGroup></div>
                <div style={STYLE_FIELD}>Message</div>
                <AkTextArea onChange={e => this.user_message = e.target.value}></AkTextArea>
                <AkButton type="primary" style={{ marginTop: 10 }} className="ak-base-btn main-btn-bg" onClick={() => this.chat()}>Submit</AkButton>
                <div style={STYLE_FIELD}>Response <AkIcon onClick={onCopy} type='fa-regular fa-copy' /></div>
                <pre>{response}</pre>
            </AkSpin>
        </div>
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <ChatGPT context={context} apiKey={context.params["openai_apikey"]} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }

    description() {
        return "ChatGPT 预设Prompts";
    }

    inputParameters() {
        return [{
            id: "openai_apikey",
            type: "string",
            desc: "API key obtained from https://platform.openai.com/account/api-keys"
        }] as InputParameter[];
    }
}

const STYLE_DESC = {
    backgroundColor: "#ddd",
    padding: 5,
    fontSize: 18,
    marginBottom: 10
}

const STYLE_FIELD = {
    backgroundColor: "#a3d27e",
    padding: 5,
    fontSize: 16,
    margin: "10px 0",
    color: "#fff"
}