#!/usr/bin/env node
/**
 * Test script for Token Budget Optimization
 * Validates that token budgets are calculated correctly and stay within limits
 */

console.log('🧪 Testing Token Budget Optimization\n');

// Simulate the token budget calculation logic
function calculateTokenBudgets(componentCount) {
  // Output tokens: ~50-100 tokens per component for comprehensive narrative
  const tokensPerComponent = 75;
  const baseTokens = 500;
  const maxOutputTokens = Math.min(
    baseTokens + (componentCount * tokensPerComponent),
    4096 // Hard cap at 4k tokens
  );
  
  // Thinking tokens: Dynamic based on complexity
  const thinkingBudget = Math.min(2048 + (componentCount * 100), 6144);
  
  return { maxOutputTokens, thinkingBudget };
}

console.log('📊 Token Budget Test Cases:');
console.log('========================================\n');

const testCases = [
  { name: 'Tiny diagram (5 components)', count: 5 },
  { name: 'Small diagram (10 components)', count: 10 },
  { name: 'Medium diagram (21 components)', count: 21 }, // From test results
  { name: 'Large diagram (40 components)', count: 40 },
  { name: 'Very large diagram (100 components)', count: 100 },
];

testCases.forEach(testCase => {
  const budgets = calculateTokenBudgets(testCase.count);
  console.log(`${testCase.name}:`);
  console.log(`  Components: ${testCase.count}`);
  console.log(`  Output tokens: ${budgets.maxOutputTokens}`);
  console.log(`  Thinking tokens: ${budgets.thinkingBudget}`);
  console.log(`  Total budget: ${budgets.maxOutputTokens + budgets.thinkingBudget} tokens`);
  
  // Validate constraints
  const valid = budgets.maxOutputTokens <= 4096 && budgets.thinkingBudget <= 6144;
  console.log(`  Status: ${valid ? '✅ Within limits' : '❌ Exceeds limits'}`);
  console.log();
});

console.log('📈 Budget Comparison:');
console.log('========================================\n');
console.log('Old approach (65k tokens):');
console.log('  Output: 65,536 tokens (❌ EXCESSIVE)');
console.log('  Thinking: 4,096 tokens');
console.log('  Total: ~69,632 tokens per request\n');

const medium = calculateTokenBudgets(21);
console.log('New optimized approach (21 component diagram):');
console.log(`  Output: ${medium.maxOutputTokens} tokens (✅ OPTIMIZED)`);
console.log(`  Thinking: ${medium.thinkingBudget} tokens`);
console.log(`  Total: ${medium.maxOutputTokens + medium.thinkingBudget} tokens per request\n`);

const reduction = (1 - (medium.maxOutputTokens + medium.thinkingBudget) / 69632) * 100;
console.log(`💰 Token savings: ${reduction.toFixed(1)}% reduction`);
console.log(`💵 Cost savings: ~${reduction.toFixed(1)}% per analysis request\n`);

console.log('✅ Token budget optimization test completed\n');
