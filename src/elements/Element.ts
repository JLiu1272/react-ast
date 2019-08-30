import PropTypes from 'prop-types';
import _ from 'lodash';
import { BaseNode } from '@babel/types';
import { Path, Node, Instance, Props } from '../types';
import { flattenPath } from '../util';

export interface ElementConstructor {
  new (props?: Props): Element;
  propTypes: object;
  defaultProps: Props;
}

export interface Meta {
  bodyPath: Path;
}

export default class Element implements Instance {
  static defaultProps: Props = {};

  static propTypes: object = {};

  node: Node;

  props: Props;

  children: Element[] = [];

  meta: Meta = {
    bodyPath: 'body.body'
  };

  get bodyPath(): string {
    return flattenPath(this.meta.bodyPath);
  }

  constructor(
    baseNode: BaseNode | BaseNode[],
    props: Props = {},
    meta?: Partial<Meta>
  ) {
    if (Array.isArray(baseNode)) throw new Error('cannot be array');
    if (meta) {
      this.meta = {
        ...this.meta,
        ...meta
      };
    }
    this.node = baseNode;
    this.props = this.getProps(props);
  }

  appendChild(child: Element) {
    const body = _.get(this.node, this.bodyPath);
    if (!body || !Array.isArray(body)) return;
    this.children.push(child);
    body.push(child.node);
  }

  removeChild(child: Element) {
    const body = _.get(this.node, this.bodyPath);
    if (!body || !Array.isArray(body)) return;
    this.children.splice(this.children.indexOf(child), 1);
    body.splice(body.indexOf(child.node), 1);
  }

  commitMount() {
    this.update();
  }

  commitUpdate(newProps: Props) {
    this.props = {
      ...this.props,
      ...newProps
    };
    this.update();
  }

  update() {}

  getProps(props: Props): Props {
    props = { ...props };
    const { defaultProps, propTypes } = this.constructor as ElementConstructor;
    Object.keys(defaultProps).forEach(key => {
      const defaultProp = defaultProps[key];
      if (typeof props[key] === 'undefined' || props[key] === null) {
        props[key] = defaultProp;
      }
    });
    PropTypes.checkPropTypes(propTypes, props, 'prop', this.constructor.name);
    return props;
  }
}
