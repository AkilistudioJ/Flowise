import { TavilySearchResults } from '@langchain/community/tools/tavily_search'
import { ICommonObject, INode, INodeData, INodeParams } from '../../../src/Interface'
import { getBaseClasses, getCredentialData, getCredentialParam } from '../../../src/utils'

class TavilyAPI_Tools implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'TavilyAPI'
        this.name = 'TavilyAPI'
        this.version = 1.0
        this.type = 'TavilyAPI'
        this.icon = 'tavily.svg'
        this.category = 'Tools'
        this.description = 'A robust search API tailored specifically for LLM Agents'
        this.inputs = []
        this.credential = {
            label: 'Connect Credential',
            name: 'credential',
            type: 'credential',
            credentialNames: ['tavilyApi']
        }
        this.baseClasses = [this.type, ...getBaseClasses(TavilySearchResults)]
    }

    async init(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const credentialData = await getCredentialData(nodeData.credential ?? '', options)
        const searchApiKey = getCredentialParam('tavilyApiKey', credentialData, nodeData)
        console.log(searchApiKey)
        return new TavilySearchResults({ apiKey: searchApiKey })
    }
}

module.exports = { nodeClass: TavilyAPI_Tools }
