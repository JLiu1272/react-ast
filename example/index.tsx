import React from 'react';
import {
  ClassDeclaration,
  ClassMethod,
  ClassProperty,
  FunctionDeclaration,
  ImportDeclaration,
  JsxElement,
  Param,
  ReturnStatement,
  VariableDeclaration,
  render
} from '../src';

const code = render(
  <>
    <JsxElement name="Hello" attributes={{ a: true, b: 'b', c: 55 }} />
    <ImportDeclaration
      defaultExport="hello"
      exports={['one', 'two']}
      source="world"
    />
    <ClassDeclaration name="Hello" superClassName="Array">
      <ClassMethod name="hello" params={['a']} returnStatement="a" />
      <ClassProperty name="hello">world</ClassProperty>
    </ClassDeclaration>
    <FunctionDeclaration
      name="add"
      params={[<Param key="a">a</Param>, <Param key="b">b</Param>]}
      returnStatement={<ReturnStatement>result</ReturnStatement>}
    >
      <VariableDeclaration kind="const" name="result">
        <ClassDeclaration name="SomeClass" />
      </VariableDeclaration>
    </FunctionDeclaration>
  </>,
  {
    parserOptions: {
      plugins: ['jsx', 'classProperties']
    }
  }
);

console.log(code);
