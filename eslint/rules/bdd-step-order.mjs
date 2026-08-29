const ORDER = { Given: 0, When: 1, Then: 2 };

function stepName(node) {
  if (
    node.type !== 'ExpressionStatement' ||
    node.expression.type !== 'CallExpression' ||
    node.expression.callee.type !== 'Identifier'
  ) {
    return null;
  }
  const name = node.expression.callee.name;
  return Object.hasOwn(ORDER, name) ? name : null;
}

function isStepStatement(node) {
  return stepName(node) !== null;
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'Require playwright-bdd Given / When / Then step definitions to appear in that order',
    },
    fixable: 'code',
    schema: [],
    messages: {
      outOfOrder:
        'BDD step definitions must be ordered Given, then When, then Then (found {{found}} after {{prev}}).',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      Program(program) {
        const steps = program.body.filter(isStepStatement);
        if (steps.length < 2) {
          return;
        }

        let prevName = null;
        let prevRank = -1;
        let firstOutOfOrder = null;
        let firstOutOfOrderPrev = null;

        for (const stmt of steps) {
          const name = stepName(stmt);
          const rank = ORDER[name];
          if (rank < prevRank) {
            firstOutOfOrder = stmt;
            firstOutOfOrderPrev = prevName;
            break;
          }
          prevRank = rank;
          prevName = name;
        }

        if (!firstOutOfOrder) {
          return;
        }

        const firstIdx = program.body.indexOf(steps[0]);
        const lastIdx = program.body.indexOf(steps[steps.length - 1]);
        const between = program.body.slice(firstIdx, lastIdx + 1);
        const canFix = between.every(isStepStatement);

        context.report({
          node: firstOutOfOrder,
          messageId: 'outOfOrder',
          data: { found: stepName(firstOutOfOrder), prev: firstOutOfOrderPrev },
          fix: canFix
            ? fixer => {
                const given = steps.filter(s => stepName(s) === 'Given');
                const when = steps.filter(s => stepName(s) === 'When');
                const then = steps.filter(s => stepName(s) === 'Then');
                const reordered = [...given, ...when, ...then]
                  .map(stmt => sourceCode.getText(stmt))
                  .join('\n\n');
                return fixer.replaceTextRange(
                  [steps[0].range[0], steps[steps.length - 1].range[1]],
                  reordered,
                );
              }
            : null,
        });
      },
    };
  },
};
