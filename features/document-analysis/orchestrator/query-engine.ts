/**
 * Query Engine - Natural Language Queries
 * Enables users to ask questions about analyzed documents
 */

import { getAIClient } from '../../../lib/ai/client';
import { UniversalDocumentResult } from '@/features/document-analysis/types';

export interface QueryRequest {
  query: string;
  documentResult: UniversalDocumentResult;
  conversationHistory?: ConversationMessage[];
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface QueryResponse {
  answer: string;
  confidence: number;
  sources: string[];
  suggestedFollowUps?: string[];
}

/**
 * Query engine system instruction
 */
const QUERY_SYSTEM_INSTRUCTION = `
### IDENTITY
You are an **HVAC Engineering Assistant** specialized in interpreting technical documents.

### MISSION
Answer user questions about analyzed HVAC documents with precision and clarity.

### KNOWLEDGE BASE
You have access to:
- Component detection results (VAVs, AHUs, dampers, ducts, etc.)
- Equipment schedules and specifications
- Connection topology and airflow paths
- Compliance validation results
- Safety issues and recommendations

### RESPONSE GUIDELINES
1. **Accuracy**: Base answers ONLY on the provided document data
2. **Specificity**: Cite specific components, tags, or locations
3. **Clarity**: Use clear engineering terminology
4. **Honesty**: If information is not in the document, say so explicitly
5. **Context**: Consider the full system context when answering

### RESPONSE FORMAT
- Direct answer to the question
- Supporting evidence from the document
- Relevant component IDs or tags
- Confidence level (High/Medium/Low)
- Suggest related questions if helpful

### EXAMPLES
Q: "How many VAV boxes are in the system?"
A: "There are 12 VAV boxes detected in the blueprint (VAV-101 through VAV-112). Confidence: High"

Q: "What's the airflow to Zone 201?"
A: "VAV-201 serves Zone 201 with a design airflow of 1,200 CFM according to the equipment schedule. Confidence: High"

Q: "Are there any safety issues?"
A: "Yes, 2 critical safety issues identified: (1) Missing fire damper at shaft penetration, location B-Grid, (2) VAV-105 lacks required smoke detector. Confidence: High"
`;

/**
 * Generate query prompt with document context
 */
function generateQueryPrompt(
  query: string,
  documentResult: UniversalDocumentResult,
  conversationHistory?: ConversationMessage[]
): string {
  const context = buildDocumentContext(documentResult);
  
  let prompt = `**DOCUMENT CONTEXT**:\n${context}\n\n`;
  
  // Add conversation history if present
  if (conversationHistory && conversationHistory.length > 0) {
    prompt += '**CONVERSATION HISTORY**:\n';
    conversationHistory.slice(-5).forEach(msg => {
      prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
    prompt += '\n';
  }
  
  prompt += `**USER QUESTION**: ${query}\n\n`;
  prompt += `**INSTRUCTIONS**: Answer the question based on the document context above. Be specific and cite evidence. If the information is not available, say so clearly.\n\n`;
  prompt += `**OUTPUT FORMAT**:\n`;
  prompt += `{\n`;
  prompt += `  "answer": "Clear, direct answer with supporting details",\n`;
  prompt += `  "confidence": 0.95,\n`;
  prompt += `  "sources": ["Component IDs, tags, or locations cited"],\n`;
  prompt += `  "suggestedFollowUps": ["Related question 1", "Related question 2"]\n`;
  prompt += `}`;
  
  return prompt;
}

/**
 * Build document context string from analysis results
 */
function buildDocumentContext(result: UniversalDocumentResult): string {
  const parts: string[] = [];
  
  parts.push(`Document Type: ${result.document_type}`);
  parts.push(`File Name: ${result.file_name}`);
  
  // Visual analysis context
  if (result.visual) {
    parts.push(`\n**DETECTED COMPONENTS** (${result.visual.components.length} total):`);
    
    // Group by type
    const byType: Record<string, any[]> = {};
    result.visual.components.forEach(comp => {
      if (!byType[comp.type]) byType[comp.type] = [];
      byType[comp.type].push(comp);
    });
    
    for (const [type, components] of Object.entries(byType)) {
      parts.push(`  ${type}: ${components.length} units`);
      // Include up to 5 examples with labels
      const examples = components
        .filter(c => c.label)
        .slice(0, 5)
        .map(c => c.label)
        .join(', ');
      if (examples) {
        parts.push(`    Examples: ${examples}`);
      }
    }
    
    parts.push(`\n**CONNECTIONS**: ${result.visual.connections.length} total`);
  }
  
  // Textual analysis context
  if (result.textual) {
    parts.push(`\n**TEXT CONTENT**: ${result.textual.text_blocks.length} text blocks`);
    if (result.textual.tables.length > 0) {
      parts.push(`**TABLES**: ${result.textual.tables.length} tables detected`);
    }
  }
  
  // Tabular analysis context
  if (result.tabular) {
    parts.push(`\n**EQUIPMENT SCHEDULE**: ${result.tabular.equipment.length} items`);
    result.tabular.equipment.slice(0, 10).forEach(item => {
      const details = [
        item.tag,
        item.type,
        item.cfm ? `${item.cfm} CFM` : null,
      ].filter(Boolean).join(', ');
      parts.push(`  - ${details}`);
    });
    if (result.tabular.equipment.length > 10) {
      parts.push(`  ... and ${result.tabular.equipment.length - 10} more`);
    }
  }
  
  // Validation issues
  if (result.validation_issues && result.validation_issues.length > 0) {
    parts.push(`\n**VALIDATION ISSUES**: ${result.validation_issues.length} total`);
    const critical = result.validation_issues.filter(i => i.severity === 'CRITICAL');
    if (critical.length > 0) {
      parts.push(`  CRITICAL: ${critical.length}`);
      critical.slice(0, 3).forEach(issue => {
        parts.push(`    - ${issue.issue}`);
      });
    }
  }
  
  return parts.join('\n');
}

/**
 * Process natural language query
 */
export async function processQuery(request: QueryRequest): Promise<QueryResponse> {
  try {
    const client = getAIClient();
    
    // Generate prompt with context
    const prompt = generateQueryPrompt(
      request.query,
      request.documentResult,
      request.conversationHistory
    );
    
    // Call AI
    const responseText = await client.generateText({
      prompt,
      options: {
        systemInstruction: QUERY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.3, // Low temperature for factual responses
      },
    });
    
    // Parse response
    const parsed = parseQueryResponse(responseText);
    
    return parsed;
  } catch (error) {
    console.error('Query processing error:', error);
    
    return {
      answer: 'I encountered an error processing your question. Please try rephrasing or asking a different question.',
      confidence: 0,
      sources: [],
      suggestedFollowUps: [],
    };
  }
}

/**
 * Parse query response
 */
function parseQueryResponse(responseText: string): QueryResponse {
  try {
    // Remove markdown code blocks if present
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(cleanText);
    
    return {
      answer: parsed.answer || 'No answer provided',
      confidence: parsed.confidence || 0.5,
      sources: Array.isArray(parsed.sources) ? parsed.sources : [],
      suggestedFollowUps: Array.isArray(parsed.suggestedFollowUps) 
        ? parsed.suggestedFollowUps 
        : undefined,
    };
  } catch (error) {
    console.error('Failed to parse query response:', error);
    
    // Return raw text as answer
    return {
      answer: responseText,
      confidence: 0.5,
      sources: [],
    };
  }
}

/**
 * Generate suggested questions based on document content
 */
export function generateSuggestedQuestions(result: UniversalDocumentResult): string[] {
  const questions: string[] = [];
  
  if (result.visual) {
    questions.push('How many components were detected in this blueprint?');
    questions.push('What types of equipment are shown?');
    if (result.visual.connections.length > 0) {
      questions.push('How are the components connected?');
    }
  }
  
  if (result.tabular) {
    questions.push('What is the total CFM for the system?');
    questions.push('List all VAV boxes with their airflow rates');
  }
  
  if (result.validation_issues && result.validation_issues.length > 0) {
    questions.push('What validation issues were found?');
    questions.push('Are there any critical safety concerns?');
  }
  
  return questions.slice(0, 5); // Return up to 5 suggestions
}

/**
 * Quick answer - simplified query without full context
 */
export async function quickAnswer(
  query: string,
  documentResult: UniversalDocumentResult
): Promise<string> {
  const response = await processQuery({ query, documentResult });
  return response.answer;
}
