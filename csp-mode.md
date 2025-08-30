# Alpine.js Content Security Policy (CSP) Mode Specification

## Executive Summary

This document specifies the design and implementation of Alpine.js's Content Security Policy (CSP) compliant mode, which allows Alpine.js to function in environments where `unsafe-eval` is prohibited. The CSP mode provides a subset of Alpine's functionality through a custom expression parser that avoids runtime code evaluation while maintaining the developer experience that makes Alpine attractive.

## 1. Background and Motivation

### 1.1 The Problem

Alpine.js's core appeal lies in its ability to write JavaScript expressions directly in HTML attributes:
```html
<div x-on:click="console.log('clicked')">
<div x-show="count > 5">
<div x-data="{ open: false, count: 0 }">
```

These expressions are currently evaluated at runtime using `new Function()` or similar constructs, which violates Content Security Policy directives that prohibit `unsafe-eval`. This limitation prevents Alpine.js adoption in:

- Enterprise environments with strict security requirements
- Financial institutions with regulatory compliance needs
- Government applications
- Any production environment where CSP compliance is mandatory

### 1.2 Current Limitations

The existing CSP implementation is overly restrictive, only supporting:
- Direct function name references
- Simple variable access
- No inline expressions or object literals

This severely limits Alpine's utility and developer experience.

## 2. Design Goals

### 2.1 Primary Goals
1. **CSP Compliance**: Function without `eval()`, `new Function()`, or any dynamic code evaluation
2. **Developer Experience**: Preserve as much of Alpine's inline expression syntax as reasonable
3. **Clear Boundaries**: Explicit, well-documented limitations with helpful error messages
4. **Performance**: Minimal overhead compared to standard Alpine mode
5. **Security**: No introduction of new security vulnerabilities

### 2.2 Non-Goals
1. **Full JavaScript Parity**: Not attempting to replicate all JavaScript expression capabilities
2. **Complex Control Flow**: No support for complex conditional logic or loops within expressions

## 3. Supported Expression Types

### 3.1 Core Expression Categories

#### 3.1.1 Literals
```javascript
// Supported
true, false                  // Booleans
42, -3.14                    // Numbers
'string', "string"           // Strings (both quote types)
null, undefined              // Null/undefined
```

#### 3.1.2 Object Literals
```javascript
// Supported in x-data and similar contexts
{ open: false, count: 0 }
{ 'string-key': value }
{ nested: { prop: true } }

// NOT Supported
{ [dynamicKey]: value }      // Computed property names
{ ...spread }                // Spread syntax
{ method() {} }              // Method shorthand
```

#### 3.1.3 Array Literals
```javascript
// Supported
[1, 2, 3]
['a', 'b', 'c']
[item1, item2]               // Variable references

// NOT Supported
[...spread]                  // Spread syntax
```

#### 3.1.4 Variable and Property Access
```javascript
// Supported
variableName                 // Simple variable
object.property              // Dot notation
object['property']           // Bracket notation with string literal
object[variable]             // Bracket notation with variable
nested.deep.property         // Deep nesting

// NOT Supported
object[expression + 'key']   // Complex expressions in brackets
```

#### 3.1.5 Function Calls
```javascript
// Supported
functionName()
functionName(arg1, arg2)
object.method()
object.method(arg1, arg2)
nested.object.method()

// NOT Supported
(expression)()               // Computed function calls
new Constructor()            // Constructor calls (debatable - see section 4)
```

#### 3.1.6 Basic Operators
```javascript
// Arithmetic (Supported)
a + b, a - b, a * b, a / b, a % b

// Comparison (Supported)
a === b, a !== b, a == b, a != b
a > b, a >= b, a < b, a <= b

// Logical (Supported)
a && b, a || b, !a

// Assignment
variable = value
object.property = value

// Shorthand increment/decrement (Supported)
a++, ++a, a--, --a          // Increment/decrement

// NOT Supported
a += b, a -= b               // Compound assignment
a ?? b                       // Nullish coalescing
a?.b                         // Optional chaining
```

#### 3.1.7 Conditional Expressions
```javascript
// Supported
condition ? trueValue : falseValue

// NOT Supported
if/else statements           // Use ternary or x-if directive
```

### 3.2 Context-Specific Support

#### 3.2.1 x-data
```javascript
// Supported
x-data="{ open: false, count: 0, items: [] }"
x-data="dataFunction"        // Reference to global function

// NOT Supported
x-data="{ method() { return 1 } }"  // Inline methods
```

#### 3.2.2 x-on (Event Handlers)
```javascript
// Supported
x-on:click="handleClick"
x-on:click="handleClick()"
x-on:click="handleClick($event)"
x-on:click="open = !open"
x-on:click="count++"

// NOT Supported
x-on:click="() => console.log('clicked')"  // Arrow functions
x-on:click="function() { }"                // Function expressions
```

#### 3.2.3 x-show/x-if
```javascript
// Supported
x-show="isVisible"
x-show="count > 5"
x-show="status === 'active'"
x-show="!hidden && count > 0"

// All boolean expressions from 3.1.6
```

#### 3.2.4 x-text/x-html
```javascript
// Supported
x-text="message"
x-text="'Static text'"
x-text="count + ' items'"
x-text="condition ? 'yes' : 'no'"
```

#### 3.2.5 x-model
```javascript
// Supported
x-model="formField"
x-model="object.property"
```

## 4. Parser Implementation Strategy

### 4.1 Architecture

```
Input Expression → Tokenizer → Parser → AST → Evaluator → Result
                                         ↓
                                    Validator
                                         ↓
                                    Error Reporter
```

### 4.2 Parser Phases

1. **Tokenization**: Break expression into tokens
2. **Parsing**: Build Abstract Syntax Tree (AST)
3. **Validation**: Check against allowed expression rules
4. **Evaluation**: Safely evaluate AST with given scope

### 4.3 AST Node Types

```javascript
// Example AST structure
{
  type: 'BinaryExpression',
  operator: '>',
  left: { type: 'Identifier', name: 'count' },
  right: { type: 'Literal', value: 5 }
}
```

Supported node types:
- Literal
- Identifier
- MemberExpression
- CallExpression
- BinaryExpression
- UnaryExpression
- ConditionalExpression
- ArrayExpression
- ObjectExpression
- AssignmentExpression (limited contexts)

## 5. Error Handling

### 5.1 Error Categories

#### 5.1.1 Parsing Errors
```javascript
// Error: Unexpected token
x-show="count >>"

// Error: Unterminated string
x-text="'unclosed string

// Error: Invalid syntax
x-on:click="function() {}"
```

#### 5.1.2 Unsupported Feature Errors
```javascript
// Error: Arrow functions not supported in CSP mode
x-on:click="() => handleClick()"

// Error: Spread operator not supported in CSP mode
x-data="{ ...defaults }"

// Error: Optional chaining not supported in CSP mode
x-text="user?.name"
```

### 5.2 Error Message Format

```
Alpine CSP Error: [Feature] not supported in CSP mode
Expression: [original expression]
Location: [element description]
Suggestion: [alternative approach]

Example:
Alpine CSP Error: Arrow functions not supported in CSP mode
Expression: () => handleClick()
Location: x-on:click on <button>
Suggestion: Use a named function reference: x-on:click="handleClick"
```

## 6. Migration Guide

### 6.1 Common Patterns and Alternatives

#### Pattern: Inline Methods
```html
<!-- Standard Alpine -->
<button x-on:click="() => { count++; save() }">

<!-- CSP Mode -->
<button x-on:click="incrementAndSave">
<script>
  window.incrementAndSave = function() {
    this.count++;
    this.save();
  }
</script>
```

#### Pattern: Complex Conditionals
```html
<!-- Standard Alpine -->
<div x-show="user && user.role === 'admin' && permissions.includes('edit')">

<!-- CSP Mode: Move to computed property -->
<div x-show="canEdit">
<script>
  Alpine.data('component', () => ({
    get canEdit() {
      return this.user &&
             this.user.role === 'admin' &&
             this.permissions.includes('edit');
    }
  }))
</script>
```

### 6.2 CSP Mode Activation

```javascript
// Option 1: Build-time configuration
import Alpine from 'alpinejs/csp'

// Option 2: Runtime configuration
Alpine.csp = true
Alpine.start()

// Option 3: Auto-detection
// Alpine automatically uses CSP mode when unsafe-eval is blocked
```

## 7. Performance Considerations

### 7.1 Parsing Cache
- Cache parsed ASTs for repeated expressions
- Key by expression string
- Invalidate on scope changes

### 7.2 Optimization Strategies
1. Pre-parse common expressions at initialization
2. Optimize AST evaluation for hot paths
3. Consider compiling AST to optimized evaluator functions

## 8. Security Considerations

### 8.1 Scope Isolation
- Expressions can only access provided scope
- No access to global scope without explicit provision
- No ability to modify prototypes or constructors

### 8.2 Input Validation
- Sanitize all dynamic values before evaluation
- Prevent prototype pollution
- Guard against infinite loops in property access

## 9. Testing Strategy

### 9.1 Test Categories
1. **Parser Tests**: Verify AST generation for all supported expressions
2. **Evaluator Tests**: Ensure correct evaluation results
3. **Error Tests**: Validate error messages and handling
4. **Security Tests**: Attempt exploitation of parser/evaluator
5. **Performance Tests**: Benchmark against standard Alpine mode
6. **Integration Tests**: Real-world Alpine component scenarios

### 9.2 Test Coverage Goals
- 100% coverage of supported expression types
- All error conditions tested
- Security edge cases covered
- Performance regression prevention

## 10. Documentation Requirements

### 10.1 User Documentation
1. **CSP Mode Guide**: Complete guide for using CSP mode
2. **Migration Guide**: Step-by-step migration from standard mode
3. **Expression Reference**: Complete list of supported expressions
4. **Error Reference**: All error messages with solutions
5. **Examples**: Common patterns and solutions

### 10.2 Developer Documentation
1. **Parser Architecture**: Technical details for contributors
2. **AST Specification**: Complete AST node type definitions
3. **Extension Guide**: How to add new expression support
4. **Security Model**: Detailed security analysis

## 11. Future Considerations

### 11.1 Potential Enhancements
1. **Optional Chaining**: Could be implemented safely
2. **Nullish Coalescing**: Could be implemented safely
3. **Template Literals**: Useful for string formatting
4. **Destructuring**: Limited support for simple cases
5. **Async/Await**: For promise handling (complex)

### 11.2 Community Feedback Integration
- Regular review of unsupported expression requests
- Performance optimization based on real-world usage
- Security updates based on discovered vulnerabilities

## 12. Decision Points

### 12.1 Open Questions Requiring Decision

1. **Constructor Calls**: Should `new Date()` be supported?
   - Pro: Useful for common operations
   - Con: Adds complexity, potential security concerns
   - Recommendation: Start without, add if demanded

2. **Increment/Decrement**: Should `count++` be supported?
   - Pro: Common pattern in event handlers
   - Con: Is an assignment operation
   - Recommendation: Support in event handler context only

3. **Template Literals**: Should backtick strings be supported?
   - Pro: Useful for string formatting
   - Con: Adds parser complexity
   - Recommendation: Phase 2 enhancement

4. **Method Definitions**: Should object method shorthand be supported?
   - Pro: Cleaner syntax for x-data
   - Con: Significant complexity increase
   - Recommendation: Not supported, use Alpine.data()

5. **Error Strictness**: How strict should parsing be?
   - Option A: Fail on any unsupported syntax
   - Option B: Warn but attempt to continue
   - Recommendation: Strict mode by default, optional relaxed mode

## 13. Implementation Roadmap

### Phase 1: Core Functionality (MVP)
- Basic literals and operators
- Property access and function calls
- Object/array literals for x-data
- Comprehensive error messages
- Basic test suite

### Phase 2: Enhanced Support
- Conditional expressions (ternary)
- More operators (based on usage data)
- Performance optimizations
- Extended test coverage

### Phase 3: Advanced Features
- Template literals (if needed)
- Optional chaining/nullish coalescing
- Advanced optimization techniques
- Developer tools integration

## 14. Success Metrics

1. **Adoption**: Number of projects using CSP mode
2. **Coverage**: Percentage of Alpine features supported
3. **Performance**: Overhead vs. standard mode (<10% target)
4. **Developer Satisfaction**: Error quality, documentation clarity
5. **Security**: Zero CSP violations, no security vulnerabilities

## Appendix A: Complete Expression Support Matrix

| Expression Type | Standard Mode | CSP Mode | Notes |
|----------------|---------------|-----------|--------|
| Literals | ✅ | ✅ | All primitive types |
| Object Literals | ✅ | ✅ | No computed properties |
| Array Literals | ✅ | ✅ | No spread |
| Property Access | ✅ | ✅ | Dot and bracket |
| Function Calls | ✅ | ✅ | No computed calls |
| Arithmetic Ops | ✅ | ✅ | +, -, *, /, % |
| Comparison Ops | ✅ | ✅ | All standard |
| Logical Ops | ✅ | ✅ | &&, ||, ! |
| Ternary | ✅ | ✅ | ?: |
| Arrow Functions | ✅ | ❌ | Use named functions |
| Function Expressions | ✅ | ❌ | Use Alpine.data() |
| Template Literals | ✅ | 🔄 | Future consideration |
| Destructuring | ✅ | ❌ | Too complex |
| Spread/Rest | ✅ | ❌ | Too complex |
| Optional Chaining | ✅ | 🔄 | Future consideration |
| Nullish Coalescing | ✅ | 🔄 | Future consideration |
| Async/Await | ✅ | ❌ | Too complex |
| Classes | ✅ | ❌ | Not needed |
| Generators | ✅ | ❌ | Not needed |
| RegExp Literals | ✅ | ❌ | Security concern |

Legend: ✅ Supported | ❌ Not Supported | 🔄 Under Consideration

## Appendix B: Example Error Messages

```javascript
// Unsupported syntax
Alpine CSP Error: Arrow functions are not supported in CSP mode
Expression: () => count++
Location: x-on:click attribute on button element
Suggestion: Define a named function and reference it by name

// Parse error
Alpine CSP Error: Unexpected token '>'
Expression: count >>
Location: x-show attribute on div element
Position: Column 7

// Security violation
Alpine CSP Error: Dynamic code evaluation is not allowed in CSP mode
Expression: eval('alert(1)')
Location: x-on:click attribute on button element
Note: CSP mode explicitly prevents dynamic code execution

// Helpful migration tip
Alpine CSP Warning: Complex expression detected
Expression: items.filter(i => i.active).length > 0
Location: x-show attribute on div element
Suggestion: Consider moving this logic to a computed property:
  Alpine.data('component', () => ({
    get hasActiveItems() {
      return this.items.filter(i => i.active).length > 0
    }
  }))
  Then use: x-show="hasActiveItems"
```

## Appendix C: Security Threat Model

### Attack Vectors Considered
1. **Prototype Pollution**: Prevented by controlled property access
2. **XSS via Expression**: No HTML generation in expressions
3. **ReDoS**: No regex support
4. **Infinite Loops**: Evaluation timeout and depth limits
5. **Scope Escape**: Strict scope isolation
6. **Global Modification**: No global access without explicit provision

### Security Boundaries
- Expressions cannot modify global objects
- No access to Function, eval, or other constructors
- No dynamic property access on prototype chain
- Sanitization of all user input before evaluation