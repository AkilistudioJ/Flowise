import { VectorStore } from '@langchain/core/vectorstores'
import {
    ICommonObject,
    INode,
    INodeData,
    INodeOutputsValue,
    INodeParams,
    SelfQueryingRetriever,
    SelfQueryingRetrieverInput,
    VectorStoreRetriever,
    VectorStoreRetrieverInput
} from '../../../src/Interface'
import { BaseLanguageModel } from '@langchain/core/language_models/base'
import { FunctionalTranslator } from '@langchain/core/structured_query'
import { AttributeInfo } from 'langchain/schema/query_constructor'

class SelfQueryingRetriever_Retrievers implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    baseClasses: string[]
    inputs: INodeParams[]
    outputs: INodeOutputsValue[]

    constructor() {
        this.label = 'Self Querying Retriever'
        this.name = 'SelfQueryingRetriever'
        this.version = 1.0
        this.type = 'SelfQueryingRetriever'
        this.icon = 'vectorretriever.svg'
        this.category = 'Retrievers'
        this.description = 'Retriever that has the ability to query itself. It can use filter on metadata'
        this.baseClasses = [this.type, 'BaseRetriever']
        this.inputs = [
            {
                label: 'Vector Store',
                name: 'vectorStore',
                type: 'VectorStore'
            },
            {
                label: 'Retriever Name',
                name: 'name',
                type: 'string',
                placeholder: 'netflix movies'
            },
            {
                label: 'Retriever Description',
                name: 'description',
                type: 'string',
                rows: 3,
                description: 'Description of when to use the vector store retriever',
                placeholder: 'Good for answering questions about netflix movies'
            },
            {
                label: 'Language Model',
                name: 'model',
                type: 'BaseLanguageModel'
            },
            {
                label: 'Document Contents',
                name: 'documentContents',
                type: 'string',
                description: 'Describe the contents of documents'
            },
            {
                label: 'attribute Infos',
                name: 'attributeInfos',
                type: 'json',
                acceptVariable: true,
                list: true
            }
        ]
        this.outputs = [
            {
                label: 'Self Querying Retriever',
                name: 'retriever',
                baseClasses: this.baseClasses
            },
            {
                label: 'Document',
                name: 'document',
                description: 'Array of document objects containing metadata and pageContent',
                baseClasses: ['Document', 'json']
            },
            {
                label: 'Text',
                name: 'text',
                description: 'Concatenated string from pageContent of documents',
                baseClasses: ['string', 'json']
            }
        ]
    }

    async init(nodeData: INodeData): Promise<any> {
        const name = nodeData.inputs?.name as string
        const description = nodeData.inputs?.description as string
        const vectorStore = nodeData.inputs?.vectorStore as VectorStore
        const model = nodeData.inputs?.model as BaseLanguageModel
        const documentContents = nodeData.inputs?.documentContents as string
        const attributeInfosStr = nodeData.inputs?.attributeInfos

        let attributeInfos: AttributeInfo[] = []
        let data: { data?: AttributeInfo[] } = {}

        if (attributeInfosStr) {
            try {
                data = JSON.parse(attributeInfosStr)
            } catch (exception) {
                throw new Error("Invalid JSON in the SelfQueryingRetriever's attributeInfos: " + exception)
            }
        }

        if (data.data) {
            data.data.forEach((attribute: any) => {
                attributeInfos.push(new AttributeInfo(attribute.name, attribute.type, attribute.description))
            })
        }

        const obj = {
            name,
            description,
            vectorStore,
            model,
            documentContents,
            attributeInfos,
            structuredQueryTranslator: new FunctionalTranslator()
        } as SelfQueryingRetrieverInput

        const retriever = new SelfQueryingRetriever(obj)
        return retriever
    }
}

module.exports = { nodeClass: SelfQueryingRetriever_Retrievers }
