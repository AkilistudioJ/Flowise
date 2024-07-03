import { INodeParams, INodeCredential } from '../src/Interface'

class TavilyApi implements INodeCredential {
    label: string
    name: string
    version: number
    description: string
    inputs: INodeParams[]

    constructor() {
        this.label = 'Tavily API'
        this.name = 'tavilyApi'
        this.version = 1.0
        this.description =
            'Sign in to <a target="_blank" href="https://www.Tavilyapi.io/">TavilyApi</a> to obtain a free API key from the dashboard.'
        this.inputs = [
            {
                label: 'TavilyApi API Key',
                name: 'tavilyApiKey',
                type: 'password'
            }
        ]
    }
}

module.exports = { credClass: TavilyApi }
