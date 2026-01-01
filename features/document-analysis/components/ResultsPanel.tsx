/**
 * Results Panel Component
 * Displays analysis results with JSON tree, violations, and NLQ chat
 */

import React, { useState } from 'react';
import { UniversalDocumentResult, ValidationIssue } from '../types';
import { processQuery, QueryResponse, ConversationMessage, generateSuggestedQuestions } from '../orchestrator/query-engine';

export interface ResultsPanelProps {
  result: UniversalDocumentResult;
  onComponentSelect?: (componentId: string) => void;
}

/**
 * Results Panel with tabbed interface
 */
export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  result,
  onComponentSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'issues' | 'chat'>('overview');
  const [chatHistory, setChatHistory] = useState<ConversationMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  
  const tabs = [
    { id: 'overview', label: '📊 Overview', count: null },
    { 
      id: 'components', 
      label: '🔧 Components', 
      count: result.visual?.components.length || 0 
    },
    { 
      id: 'issues', 
      label: '⚠️ Issues', 
      count: result.validation_issues?.length || 0 
    },
    { id: 'chat', label: '💬 Ask Questions', count: null },
  ];
  
  const handleQuerySubmit = async () => {
    if (!currentQuery.trim() || isQuerying) return;
    
    // Add user message to history
    const userMessage: ConversationMessage = {
      role: 'user',
      content: currentQuery,
      timestamp: Date.now(),
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setIsQuerying(true);
    setCurrentQuery('');
    
    try {
      // Process query
      const response = await processQuery({
        query: currentQuery,
        documentResult: result,
        conversationHistory: chatHistory,
      });
      
      // Add assistant response
      const assistantMessage: ConversationMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Query failed:', error);
      
      const errorMessage: ConversationMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question.',
        timestamp: Date.now(),
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsQuerying(false);
    }
  };
  
  const suggestedQuestions = generateSuggestedQuestions(result);
  
  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e0e0e0',
        padding: '8px',
        gap: '8px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: activeTab === tab.id ? '#2196F3' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#666',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
            {tab.count !== null && (
              <span style={{ 
                marginLeft: '8px',
                backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f0f0f0',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '12px',
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {activeTab === 'overview' && <OverviewTab result={result} />}
        {activeTab === 'components' && <ComponentsTab result={result} onSelect={onComponentSelect} />}
        {activeTab === 'issues' && <IssuesTab issues={result.validation_issues || []} />}
        {activeTab === 'chat' && (
          <ChatTab
            chatHistory={chatHistory}
            currentQuery={currentQuery}
            setCurrentQuery={setCurrentQuery}
            onSubmit={handleQuerySubmit}
            isQuerying={isQuerying}
            suggestedQuestions={suggestedQuestions}
            onSuggestionClick={setCurrentQuery}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Overview Tab
 */
const OverviewTab: React.FC<{ result: UniversalDocumentResult }> = ({ result }) => {
  return (
    <div style={{ fontSize: '14px' }}>
      <h3 style={{ margin: '0 0 16px 0' }}>Document Information</h3>
      
      <InfoRow label="File Name" value={result.file_name} />
      <InfoRow label="Document Type" value={result.document_type} />
      <InfoRow label="Confidence" value={`${(result.classification.confidence * 100).toFixed(1)}%`} />
      <InfoRow label="Processing Time" value={`${result.processing_time_ms}ms`} />
      
      {result.visual && (
        <>
          <h3 style={{ margin: '24px 0 16px 0' }}>Visual Analysis</h3>
          <InfoRow label="Components Detected" value={result.visual.components.length} />
          <InfoRow label="Connections" value={result.visual.connections.length} />
        </>
      )}
      
      {result.tabular && (
        <>
          <h3 style={{ margin: '24px 0 16px 0' }}>Equipment Schedule</h3>
          <InfoRow label="Equipment Items" value={result.tabular.equipment.length} />
        </>
      )}
      
      {result.validation_issues && result.validation_issues.length > 0 && (
        <>
          <h3 style={{ margin: '24px 0 16px 0' }}>Validation Status</h3>
          <InfoRow 
            label="Issues Found" 
            value={result.validation_issues.length}
            valueColor="#F44336"
          />
        </>
      )}
    </div>
  );
};

/**
 * Components Tab
 */
const ComponentsTab: React.FC<{ 
  result: UniversalDocumentResult;
  onSelect?: (componentId: string) => void;
}> = ({ result, onSelect }) => {
  if (!result.visual) {
    return <p style={{ color: '#999' }}>No components detected</p>;
  }
  
  // Group by type
  const byType: Record<string, any[]> = {};
  result.visual.components.forEach(comp => {
    if (!byType[comp.type]) byType[comp.type] = [];
    byType[comp.type].push(comp);
  });
  
  return (
    <div style={{ fontSize: '14px' }}>
      {Object.entries(byType).map(([type, components]) => (
        <div key={type} style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', textTransform: 'capitalize' }}>
            {type} ({components.length})
          </h3>
          {components.map(comp => (
            <div
              key={comp.id}
              onClick={() => onSelect?.(comp.id)}
              style={{
                padding: '8px 12px',
                marginBottom: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                cursor: onSelect ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            >
              <div style={{ fontWeight: '600' }}>{comp.label || comp.id}</div>
              {comp.meta?.tag && (
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Tag: {comp.meta.tag}
                </div>
              )}
              <div style={{ fontSize: '12px', color: '#999' }}>
                Confidence: {(comp.confidence * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Issues Tab
 */
const IssuesTab: React.FC<{ issues: ValidationIssue[] }> = ({ issues }) => {
  if (issues.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#4CAF50' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h3 style={{ margin: '0 0 8px 0' }}>No Issues Found</h3>
        <p style={{ margin: 0, color: '#999' }}>All validations passed</p>
      </div>
    );
  }
  
  const bySeverity = {
    CRITICAL: issues.filter(i => i.severity === 'CRITICAL'),
    WARNING: issues.filter(i => i.severity === 'WARNING'),
    INFO: issues.filter(i => i.severity === 'INFO'),
  };
  
  return (
    <div style={{ fontSize: '14px' }}>
      {Object.entries(bySeverity).map(([severity, items]) => {
        if (items.length === 0) return null;
        
        const color = {
          CRITICAL: '#F44336',
          WARNING: '#FF9800',
          INFO: '#2196F3',
        }[severity];
        
        return (
          <div key={severity} style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color }}>
              {severity} ({items.length})
            </h3>
            {items.map(issue => (
              <div
                key={issue.id}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f5f5f5',
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '4px',
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {issue.issue}
                </div>
                {issue.recommendation && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Chat Tab (NLQ Interface)
 */
const ChatTab: React.FC<{
  chatHistory: ConversationMessage[];
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  onSubmit: () => void;
  isQuerying: boolean;
  suggestedQuestions: string[];
  onSuggestionClick: (question: string) => void;
}> = ({
  chatHistory,
  currentQuery,
  setCurrentQuery,
  onSubmit,
  isQuerying,
  suggestedQuestions,
  onSuggestionClick,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat history */}
      <div style={{ flex: 1, overflow: 'auto', marginBottom: '16px' }}>
        {chatHistory.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#999' }}>
            <h3>Ask questions about this document</h3>
            <p style={{ fontSize: '14px' }}>
              Try asking about components, connections, or issues
            </p>
            
            {suggestedQuestions.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <p style={{ fontWeight: '600', marginBottom: '12px' }}>
                  Suggested questions:
                </p>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestionClick(q)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      marginBottom: '8px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '16px',
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#2196F3' : '#f5f5f5',
                color: msg.role === 'user' ? '#fff' : '#333',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isQuerying && (
          <div style={{ padding: '12px', color: '#999', fontStyle: 'italic' }}>
            Thinking...
          </div>
        )}
      </div>
      
      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={currentQuery}
          onChange={e => setCurrentQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSubmit()}
          placeholder="Ask a question..."
          disabled={isQuerying}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        <button
          onClick={onSubmit}
          disabled={isQuerying || !currentQuery.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isQuerying || !currentQuery.trim() ? 'not-allowed' : 'pointer',
            opacity: isQuerying || !currentQuery.trim() ? 0.5 : 1,
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

/**
 * Info Row helper
 */
const InfoRow: React.FC<{ label: string; value: any; valueColor?: string }> = ({ 
  label, 
  value, 
  valueColor = '#333' 
}) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  }}>
    <span style={{ color: '#666' }}>{label}</span>
    <span style={{ fontWeight: '600', color: valueColor }}>{value}</span>
  </div>
);

export default ResultsPanel;
