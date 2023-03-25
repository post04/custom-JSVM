const handlers = {
  ExpressionStatement: require("./expressionStatement"),
  CallExpression: require('./callExpression'),
  VariableDeclarator: require('./variableDeclarator'),
  VariableDeclaration: require("./variableDeclaration"),
};

const handleNode = (path, node, i) => {
  const handler = handlers[node.type];
  if (!handler) throw new Error(`Unsupported AST node: ${node.type}`);
  console.log(`Calling ${node.type} handler`, typeof handler)
  return handler(path, node, i, handleNode);
}

module.exports = handleNode